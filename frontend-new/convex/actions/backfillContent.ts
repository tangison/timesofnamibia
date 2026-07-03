// ============================================================
// Times of Namibia - Article Backfill (Issue: Fix unrewritten articles)
//
// Re-processes articles that are missing key_takeaways,
// seo_meta_description, or H2 subheadings. Runs the AI rewrite
// on each one and updates the record.
//
// Processes 3 at a time to avoid rate limits.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { generateWithFallback } from "./aiProvider";
import { convertToWebp, generateArticleAltText } from "./imageProcessor";
import { generateArticleImage } from "./imageGenerator";

const BANNED_PHRASES = [
  "delve", "tapestry", "moreover", "crucial", "landscape", "realm",
  "it is worth noting", "importantly", "furthermore", "in conclusion",
  "this article explores",
  // Additional banned phrases per user feedback:
  "in today's world", "this underscores", "plays a crucial role",
  "stands as a testament", "in the ever-evolving landscape of",
];

function stripBannedPhrases(text: string): string {
  let cleaned = text;
  for (const phrase of BANNED_PHRASES) {
    const regex = new RegExp(`\\b${phrase}\\b`, "gi");
    cleaned = cleaned.replace(regex, "");
  }
  return cleaned.replace(/[ ]{2,}/g, " ").replace(/ [.,]/g, "$1").trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "...";
}

const SECTION_KEYWORDS: Record<string, string[]> = {
  politics: ["politic", "parliament", "election", "minister", "cabinet", "government", "president", "swapo", "congress", "campaign", "vote", "party", "ruling", "opposition"],
  economy: ["economy", "economic", "finance", "bank", "inflation", "fiscal", "budget", "trade", "investment", "gdp", "treasury", "currency", "nasdaq", "stock", "market"],
  mining: ["mine", "mining", "uranium", "diamond", "lithium", "gold", "copper", "rossing", "husab", "extractive", "ore", "mineral"],
  energy: ["energy", "power", "electric", "solar", "hydrogen", "wind", "gas", "oil", "renewable", "eskom", "nampower", "offshore"],
  sport: ["sport", "football", "rugby", "cricket", "athletics", "netball", "brave warriors", "npl", "premier league", "soccer", "world cup", "wimbledon", "tennis", "olympic", "robot", "robocup"],
  environment: ["environment", "climate", "wildlife", "conservation", "drought", "desert", "water", "park", "endangered", "poaching"],
  technology: ["technology", "tech", "digital", "broadband", "internet", "ai", "artificial intelligence", "startup", "innovation", "cyber", "software", "robot", "robocup"],
  health: ["health", "hospital", "medical", "disease", "covid", "malaria", "clinic", "doctor", "patient", "vaccine", "outbreak"],
  world: ["world", "global", "international", "united nations", "europe", "america", "asia", "russia", "china", "ukraine", "israel", "gaza", "european", "korea", "japan"],
  africa: ["africa", "sadc", "african union", "continental", "regional", "zimbabwe", "south africa", "botswana", "angola", "zambia"],
  opinion: ["opinion", "editorial", "column", "commentary", "letter to the editor", "analysis"],
};

function classifySection(title: string, content: string): string {
  const blob = `${title} ${content}`.toLowerCase();
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some((kw) => blob.includes(kw))) return section;
  }
  return "national";
}

interface AiRewriteResult {
  headline: string;
  seo_meta_description: string;
  key_takeaways: string[];
  body: string;
  category: string;
}

async function rewriteArticle(
  title: string,
  content: string,
  sourceRegion: string
): Promise<AiRewriteResult | null> {
  try {
    const isInternational = sourceRegion !== "namibia";
    const localizationInstruction = isInternational
      ? `This article is from an international source (${sourceRegion}). Inject Namibian context naturally into the body. For example, tie global sports events to Namibian athletes or interests, connect world economy news to Namibia's mining or trade sectors, and reference Windhoek, Swakopmund, or Namibian institutions where relevant. Do not force the connection if it makes no sense.`
      : `This article is from a Namibian source. Keep the local context intact and ensure Namibian place names are spelled correctly: Windhoek, Swakopmund, Oshakati, Rundu, Otjiwarongo, Luderitz, Walvis Bay, Kavango, Khomas.`;

    const aiText = await generateWithFallback(
      [
        {
          role: "system",
          content: `You are the editorial AI for Times of Namibia. You MUST respond with ONLY valid JSON - no markdown, no code fences, no commentary. The response must be a single JSON object with exactly these keys: "headline" (string, under 10 words, title case), "seo_meta_description" (string, max 160 chars, for Google snippet), "key_takeaways" (array of exactly 3 strings, one sentence each), "body" (string, 3-5 paragraphs with at least one "## " H2 subheading, max 400 words), "category" (one of: Politics, Business, Sport, Africa, World, Tech, Health, Environment, Mining, Energy, Opinion). The category must match what the article is actually about - a World Cup football match is Sport, not National. Never use banned phrases: ${BANNED_PHRASES.join(", ")}. No em dashes. ${localizationInstruction}`,
        },
        {
          role: "user",
          content: `Rewrite this article for a Namibian audience. Keep all facts.

Article title: ${title}
Article body: ${truncate(content, 2000)}

Respond with ONLY a JSON object:
{ "headline": "", "seo_meta_description": "", "key_takeaways": ["", "", ""], "body": "", "category": "" }`,
        },
      ],
      { maxTokens: 1000, timeout: 30_000, forceJson: true }
    );

    if (!aiText) return null;

    let jsonStr = aiText.replace(/```json\s*/gi, "").replace(/```\s*/g, "");
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const sanitized = jsonMatch[0]
      .replace(/[\x00-\x1f\x7f]/g, (ch) => {
        const code = ch.charCodeAt(0);
        return code === 10 || code === 13 ? ch : " ";
      })
      .replace(/\\(?!["\\/bfnrtu])/g, "\\\\");

    const parsed = JSON.parse(sanitized);

    const categoryMap: Record<string, string> = {
      politics: "politics", political: "politics",
      business: "economy", economy: "economy", economic: "economy", finance: "economy",
      sport: "sport", sports: "sport",
      africa: "africa",
      world: "world", international: "world", global: "world",
      tech: "technology", technology: "technology", digital: "technology",
      health: "health", medical: "health",
      environment: "environment", climate: "environment",
      mining: "mining",
      energy: "energy",
      infrastructure: "infrastructure",
      opinion: "opinion", editorial: "opinion",
      national: "national", local: "national",
    };
    const aiCategory = categoryMap[(parsed.category || "").toLowerCase().trim()];
    const classifiedCategory = aiCategory || classifySection(title, content) || (sourceRegion === "namibia" ? "national" : sourceRegion);

    const headline = stripBannedPhrases(String(parsed.headline || title).slice(0, 200));
    const seoMetaDescription = stripBannedPhrases(String(parsed.seo_meta_description || "").slice(0, 160));
    const keyTakeaways = Array.isArray(parsed.key_takeaways)
      ? parsed.key_takeaways.slice(0, 3).map((t: any) => stripBannedPhrases(String(t).slice(0, 200)))
      : [];
    while (keyTakeaways.length < 3) {
      keyTakeaways.push("See full article for details.");
    }
    const body = stripBannedPhrases(String(parsed.body || content).slice(0, 5000));

    return {
      headline,
      seo_meta_description: seoMetaDescription || truncate(content, 160),
      key_takeaways: keyTakeaways,
      body,
      category: classifiedCategory,
    };
  } catch (err) {
    console.warn("[backfill] AI rewrite failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

// ── MAIN ACTION ──────────────────────────────────────────────

export const backfillArticleContent = internalAction({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) {
      return { error: "CONVEX_ADMIN_TOKEN not configured" };
    }

    const limit = Math.min(args.limit ?? 50, 200);

    // Get articles missing key_takeaways or seo_meta_description
    const articles = await ctx.runQuery(api.queries.listArticlesNeedingRewrite, { limit });

    console.log(`[backfill] ${articles.length} articles need rewrite`);

    let succeeded = 0;
    let failed = 0;
    const errors: string[] = [];

    // Process 3 at a time
    const BATCH = 3;
    for (let i = 0; i < articles.length; i += BATCH) {
      const batch = articles.slice(i, i + BATCH);

      const results = await Promise.allSettled(
        batch.map(async (article: any) => {
          const content = article.body || article.content || article.excerpt || article.headline;
          const sourceRegion = article.sourceRegion || "namibia";

          const aiResult = await rewriteArticle(article.headline, content, sourceRegion);

          if (!aiResult) {
            throw new Error("AI rewrite returned null");
          }

          // Update the article with rewritten content
          await ctx.runMutation(api.mutationsAdmin.updateArticleContent, {
            adminToken,
            articleId: article._id,
            content: aiResult.body,
            excerpt: aiResult.seo_meta_description,
            section: aiResult.category,
            body: aiResult.body,
            summary: aiResult.seo_meta_description,
            category: aiResult.category,
            seo_meta_description: aiResult.seo_meta_description,
            key_takeaways: aiResult.key_takeaways,
            alt_text: generateArticleAltText(aiResult.headline, aiResult.category),
          });

          return { id: article._id, headline: aiResult.headline };
        })
      );

      for (let j = 0; j < results.length; j++) {
        const r = results[j];
        if (r.status === "fulfilled") {
          succeeded++;
          console.log(`[backfill] OK: ${r.value.headline?.slice(0, 50)}`);
        } else {
          failed++;
          const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
          errors.push(`${batch[j].headline?.slice(0, 40)}: ${msg}`);
          console.warn(`[backfill] FAIL: ${batch[j].headline?.slice(0, 40)} - ${msg}`);
        }
      }

      // Small delay between batches
      if (i + BATCH < articles.length) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    console.log(`[backfill] Complete: ${succeeded} succeeded, ${failed} failed`);
    return { succeeded, failed, errors: errors.slice(0, 10), totalProcessed: articles.length };
  },
});

// Manual trigger
export const triggerBackfillContent = action({
  args: { adminToken: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.backfillContent.backfillArticleContent, {
      limit: args.limit,
    });
  },
});
