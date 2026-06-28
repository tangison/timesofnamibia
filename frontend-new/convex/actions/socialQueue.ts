// ============================================================
// Times of Namibia — Social Media Queue (Task 5)
//
// prepareSocialPost action:
//   1. Queries articles where postedToSocial === false
//   2. Builds a social media package (imageUrl, caption, hashtags, platforms)
//   3. Saves to socialQueue table
//   4. Marks article.postedToSocial = true
//
// The /http/social-queue endpoint (in http.ts) returns pending posts
// for an external automation (n8n / Make.com) to consume and post.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://timesofnamibia47.vercel.app";

const DEFAULT_HASHTAGS = ["#Namibia", "#NamibiaNews", "#Africa", "#TimesOfNamibia"];
const DEFAULT_PLATFORMS = ["instagram", "facebook", "x"];

export const prepareSocialPost = internalAction({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) {
      return { error: "CONVEX_ADMIN_TOKEN not configured" };
    }

    const limit = Math.min(args.limit ?? 20, 50);

    // Query articles where postedToSocial is false (or undefined for legacy articles)
    const articles = await ctx.runQuery(api.queries.listArticlesForSocial, { limit });

    console.log(`[social-queue] Found ${articles.length} articles needing social prep`);

    let queued = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const article of articles) {
      try {
        const imageUrl = article.coverImage || article.imageUrl || undefined;
        const summary = article.summary || article.excerpt || article.headline;
        const articleUrl = `${SITE_URL}/article/${article.slug}`;
        const caption = `${summary}\n\nRead more: ${articleUrl}`;

        // Insert into socialQueue
        await ctx.runMutation(api.mutationsAdmin.queueSocialPost, {
          adminToken,
          articleId: article._id,
          imageUrl,
          caption,
          hashtags: DEFAULT_HASHTAGS,
          platforms: DEFAULT_PLATFORMS,
        });

        // Mark article as postedToSocial = true
        await ctx.runMutation(api.mutationsAdmin.updateArticleContent, {
          adminToken,
          articleId: article._id,
          postedToSocial: true,
          socialPostedAt: Date.now(),
        });

        queued++;
        console.log(`[social-queue] Queued: "${article.headline.slice(0, 60)}..."`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${article.slug}: ${msg}`);
        skipped++;
        console.warn(`[social-queue] Failed for "${article.headline.slice(0, 40)}": ${msg}`);
      }
    }

    console.log(`[social-queue] Done: ${queued} queued, ${skipped} skipped`);

    return {
      queued,
      skipped,
      errors: errors.slice(0, 10),
      totalProcessed: articles.length,
    };
  },
});

// Manual trigger
export const triggerPrepareSocialPost = action({
  args: { adminToken: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.socialQueue.prepareSocialPost, {
      limit: args.limit,
    });
  },
});
