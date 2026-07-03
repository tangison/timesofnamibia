// ============================================================
// Times of Namibia - Upload Place Images (Issue: Fill missing images)
//
// Convex action that fetches each WebP image from a public URL,
// stores it in Convex file storage, and updates the directory_places
// record with the storage URL + alt text.
//
// Called with a JSON array of { slug, imageUrl, displayName, commonsUrl }
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";

interface PlaceImageInput {
  slug: string;
  imageUrl: string;      // public URL to fetch the image from
  displayName: string;
  commonsUrl: string;    // Wikimedia Commons file page for license
}

export const uploadPlaceImages = internalAction({
  args: {
    places: v.array(v.object({
      slug: v.string(),
      imageUrl: v.string(),
      displayName: v.string(),
      commonsUrl: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) {
      return { error: "CONVEX_ADMIN_TOKEN not configured" };
    }

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const place of args.places) {
      try {
        console.log(`[upload-images] Fetching ${place.slug} from ${place.imageUrl}...`);

        // Fetch the image
        const res = await fetch(place.imageUrl, {
          signal: AbortSignal.timeout(30_000),
          headers: { "User-Agent": "TimesOfNamibiaBot/1.0 (https://timesofnamibia47.vercel.app)" },
        });
        if (!res.ok) {
          throw new Error(`Fetch failed: HTTP ${res.status}`);
        }
        const blob = await res.blob();
        if (blob.size < 1000) {
          throw new Error("Image too small");
        }

        // Store in Convex file storage
        const storageId = await ctx.storage.store(blob);
        const storageUrl = await ctx.runQuery(api.queries.getStorageUrl, { storageId });

        if (!storageUrl) {
          throw new Error("Could not get storage URL");
        }

        // Update the directory place with the image
        await ctx.runMutation(api.mutationsAdmin.updateDirectoryPlaceImages, {
          adminToken,
          slug: place.slug,
          images: [{
            url: place.imageUrl,
            webp_url: storageUrl,
            caption: place.displayName,
            source: "Wikimedia Commons",
            license: place.commonsUrl,
            alt_text: `${place.displayName} - Namibia`,
          }],
        });

        console.log(`[upload-images] OK ${place.slug} -> ${storageUrl}`);
        success++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[upload-images] ERROR ${place.slug}: ${msg}`);
        errors.push(`${place.slug}: ${msg}`);
        failed++;
      }
    }

    console.log(`[upload-images] Done: ${success} success, ${failed} failed`);
    return { success, failed, errors: errors.slice(0, 10) };
  },
});

// Manual trigger
export const triggerUploadPlaceImages = action({
  args: {
    adminToken: v.string(),
    places: v.array(v.object({
      slug: v.string(),
      imageUrl: v.string(),
      displayName: v.string(),
      commonsUrl: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.uploadPlaceImages.uploadPlaceImages, {
      places: args.places,
    });
  },
});
