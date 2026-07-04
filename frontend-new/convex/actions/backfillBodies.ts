// ============================================================
// Times of Namibia — Backfill AI Bodies (Convex Action)
//
// Generates AI bodies + subheadings for articles that predate
// the body-generation feature. Runs on Convex's servers where
// network access to OpenRouter/Groq works.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { generateWithFallback } from "./aiProvider";

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "...";
}

export const backfillArticleBodies = internalAction({
  args: {},
  handler: async (ctx) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) {
      return { error: "CONVEX_ADMIN_TOKEN not configured" };
    }

    // Get all articles (up to 200)
    const articles = await ctx.runQuery(api.queries.listArticles, { limit: 200 });
    console.log(`[Backfill] Found ${articles.length} articles`);

    let backfilled = 0;
    let skipped = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const article of articles) {
      // Skip articles that already have multi-paragraph content + subheading
      const hasMultiPara = (article.content || "").includes("\n\n");
      const hasSubheading = !!article.subheadline;

      if (hasMultiPara && hasSubheading) {
        skipped++;
        continue;
      }

      try {
        // Generate body + subheading via AI
        const aiText = await generateWithFallback(
          [
            {
              role: "system",
              content: `You are a news editor for Times of Namibia. Given an article title and excerpt, generate:
1. A short subheading (5-10 words, no quotes)
2. A 3-paragraph article body (2-4 sentences each, separated by \n\n)
Write in professional news style. Do not invent facts. Do not include the title in the body.
Respond as JSON: {"subheading": "...", "body": "paragraph1\\n\\nparagraph2\\n\\nparagraph3"}`,
            },
            {
              role: "user",
              content: `Title: ${article.headline}\n\nExcerpt: ${truncate(article.excerpt || article.content || "", 500)}`,
            },
          ],
          { maxTokens: 500, timeout: 20_000 }
        );

        if (!aiText || aiText.length < 50) {
          failed++;
          errors.push(`${article.headline.slice(0, 40)}: AI returned empty`);
          continue;
        }

        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          failed++;
          errors.push(`${article.headline.slice(0, 40)}: No JSON in response`);
          continue;
        }

        // Sanitize control characters that break JSON.parse
        const sanitizedJson = jsonMatch[0]
          .replace(/[\x00-\x1f\x7f]/g, (char) => {
            // Replace control chars with their escaped equivalents
            if (char === "\n") return "\\n";
            if (char === "\r") return "\\r";
            if (char === "\t") return "\\t";
            return "";
          });

        let parsed: any;
        try {
          parsed = JSON.parse(sanitizedJson);
        } catch {
          // If JSON still fails, try extracting body/subheading manually
          const bodyMatch = aiText.match(/"body"\s*:\s*"([\s\S]*?)"\s*[,}]/);
          const subMatch = aiText.match(/"subheading"\s*:\s*"([^"]*)"/);
          if (!bodyMatch) {
            failed++;
            errors.push(`${article.headline.slice(0, 40)}: JSON parse failed`);
            continue;
          }
          parsed = {
            body: bodyMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"'),
            subheading: subMatch ? subMatch[1] : undefined,
          };
        }

        if (!parsed.body || parsed.body.length < 100) {
          failed++;
          errors.push(`${article.headline.slice(0, 40)}: Body too short`);
          continue;
        }

        // Update the article with AI-generated content
        await ctx.runMutation(api.mutationsAdmin.updateArticleContent, {
          adminToken,
          articleId: article._id as any,
          content: parsed.body,
          subheadline: parsed.subheading || undefined,
        });

        console.log(`[Backfill] Updated: ${article.headline.slice(0, 50)} (${parsed.body.length} chars)`);
        backfilled++;

        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        failed++;
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${article.headline.slice(0, 40)}: ${msg}`);
      }
    }

    console.log(`[Backfill] Complete: ${backfilled} backfilled, ${skipped} skipped, ${failed} failed`);
    return { backfilled, skipped, failed, errors: errors.slice(0, 10) };
  },
});

export const triggerBackfill = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized");
    }
    return await ctx.runAction(internal.actions.backfillBodies.backfillArticleBodies, {});
  },
});
