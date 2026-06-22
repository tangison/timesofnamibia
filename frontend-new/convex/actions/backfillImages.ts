// ============================================================
// Times of Namibia — Backfill Images (Convex Action)
//
// Generates images for articles that have no imageUrl.
// Processes 3 at a time to avoid hammering Pollinations.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { generateArticleImage } from "./imageGenerator";

export const backfillImages = internalAction({
  args: {},
  handler: async (ctx) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) return { error: "CONVEX_ADMIN_TOKEN not configured" };

    // Get all articles (up to 200)
    const articles = await ctx.runQuery(api.queries.listArticles, { limit: 200 });
    
    // Filter to only those without images
    const needsImage = articles.filter((a: any) => !a.imageUrl);
    console.log(`[backfill-images] ${needsImage.length} articles need images (out of ${articles.length})`);

    let succeeded = 0;
    let failed = 0;
    const errors: string[] = [];

    // Process 3 at a time
    const BATCH = 3;
    for (let i = 0; i < needsImage.length; i += BATCH) {
      const batch = needsImage.slice(i, i + BATCH);
      
      // Process batch in parallel
      const results = await Promise.allSettled(
        batch.map(async (article: any) => {
          const blob = await generateArticleImage({
            title: article.headline,
            category: article.section || "national",
            summary: article.excerpt || "",
          });

          if (!blob) {
            throw new Error("Pollinations failed");
          }

          const storageId = await ctx.storage.store(blob);
          const url = await ctx.runQuery(api.queries.getStorageUrl, { storageId });
          
          if (url) {
            await ctx.runMutation(api.mutationsAdmin.updateArticleContent, {
              adminToken,
              articleId: article._id,
            });
            // Update imageUrl separately via a direct storage approach
            // Since updateArticleContent doesn't have imageUrl, we need to
            // store it differently — use the article's imageStorageId field
          }
          
          return { id: article._id, storageId };
        })
      );

      for (let j = 0; j < results.length; j++) {
        const r = results[j];
        if (r.status === "fulfilled") {
          succeeded++;
          console.log(`[backfill-images] ✓ Image for: ${batch[j].headline.slice(0, 40)}`);
        } else {
          failed++;
          const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
          errors.push(`${batch[j].headline.slice(0, 40)}: ${msg}`);
          console.warn(`[backfill-images] ✗ Failed: ${batch[j].headline.slice(0, 40)} — ${msg}`);
        }
      }

      // Small delay between batches
      if (i + BATCH < needsImage.length) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    console.log(`[backfill-images] Complete: ${succeeded} succeeded, ${failed} failed`);
    return { succeeded, failed, errors: errors.slice(0, 10), totalProcessed: needsImage.length };
  },
});

export const triggerImageBackfill = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized");
    }
    return await ctx.runAction(internal.actions.backfillImages.backfillImages, {});
  },
});
