// ============================================================
// Times of Namibia - Fetch Missing Place Images
//
// Fetches Wikipedia lead images for all directory places
// that currently have no images. Uses the same Wikipedia
// PageImages API as fetch_place_images.py but runs as a
// Convex action so it can store images directly.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { convertToWebp, generateDirectoryAltText } from "./imageProcessor";
import gzip from "zlib";

const HEADERS = {
  "User-Agent": "TimesOfNamibiaBot/1.0 (https://timesofnamibia47.vercel.app; admin@timesofnamibia.com)",
  "Accept": "application/json",
  "Accept-Encoding": "gzip",
};

interface WikiImageResult {
  source: string;
  width: number;
  height: number;
}

async function getWikipediaLeadImage(title: string): Promise<WikiImageResult | null> {
  try {
    const encoded = encodeURIComponent(title.replace(/ /g, "_"));
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&piprop=original&redirects=1&format=json`;
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15_000) });
    if (!res.ok) return null;

    const raw = await res.text();
    let text = raw;
    if (res.headers.get("content-encoding") === "gzip") {
      const { gunzipSync } = require("zlib");
      text = gunzipSync(Buffer.from(raw, "binary")).toString("utf-8");
    }

    const data = JSON.parse(text);
    const pages = data.query?.pages || {};
    for (const page of Object.values<any>(pages)) {
      if (page.original) {
        return { source: page.original.source, width: page.original.width, height: page.original.height };
      }
    }
    return null;
  } catch (err) {
    console.warn(`[fetch-images] Wikipedia image failed for ${title}:`, err instanceof Error ? err.message : err);
    return null;
  }
}

async function fetchAndStoreImage(
  ctx: any,
  imageUrl: string,
  placeName: string,
  placeSlug: string,
  caption: string
): Promise<{ url: string; webp_url: string; caption: string; source: string; license: string; alt_text: string } | null> {
  try {
    const imgRes = await fetch(imageUrl, {
      signal: AbortSignal.timeout(30_000),
      headers: { "User-Agent": "TimesOfNamibiaBot/1.0 (https://timesofnamibia47.vercel.app)" },
    });
    if (!imgRes.ok) return null;
    const imgBlob = await imgRes.blob();
    if (imgBlob.size < 1000) return null;

    const webpBlob = await convertToWebp(imgBlob);
    const blobToStore = webpBlob || imgBlob;
    const storageId = await ctx.storage.store(blobToStore);
    const storageUrl = await ctx.runQuery(api.queries.getStorageUrl, { storageId });

    if (!storageUrl) return null;

    return {
      url: imageUrl,
      webp_url: storageUrl,
      caption: caption || placeName,
      source: "Wikimedia Commons",
      license: "CC-BY-SA",
      alt_text: generateDirectoryAltText(caption || placeName, placeName),
    };
  } catch (err) {
    console.warn(`[fetch-images] Image fetch/store failed for ${placeName}:`, err instanceof Error ? err.message : err);
    return null;
  }
}

export const fetchMissingPlaceImages = internalAction({
  args: {},
  handler: async (ctx) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) return { error: "CONVEX_ADMIN_TOKEN not configured" };

    // Get all places without images
    const allPlaces = await ctx.runQuery(api.queries.listDirectoryPlaces, { limit: 300 });
    const placesWithoutImages = allPlaces.filter((p: any) => !p.images || p.images.length === 0);

    console.log(`[fetch-images] ${placesWithoutImages.length} places need images`);

    let succeeded = 0;
    let failed = 0;
    const errors: string[] = [];

    // Process 3 at a time
    const BATCH = 3;
    for (let i = 0; i < placesWithoutImages.length; i += BATCH) {
      const batch = placesWithoutImages.slice(i, i + BATCH);

      const results = await Promise.allSettled(
        batch.map(async (place: any) => {
          // Try Wikipedia PageImages API
          const wikiImage = await getWikipediaLeadImage(place.name);

          if (!wikiImage) {
            throw new Error(`No Wikipedia image for ${place.name}`);
          }

          // Fetch and store the image
          const imageObj = await fetchAndStoreImage(
            ctx,
            wikiImage.source,
            place.name,
            place.slug,
            place.name
          );

          if (!imageObj) {
            throw new Error(`Image fetch failed for ${place.name}`);
          }

          // Update the place with the image
          await ctx.runMutation(api.mutationsAdmin.updateDirectoryPlaceImages, {
            adminToken,
            slug: place.slug,
            images: [imageObj],
          });

          return { slug: place.slug, name: place.name };
        })
      );

      for (let j = 0; j < results.length; j++) {
        const r = results[j];
        if (r.status === "fulfilled") {
          succeeded++;
          console.log(`[fetch-images] OK: ${r.value.name}`);
        } else {
          failed++;
          const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
          errors.push(`${batch[j].name}: ${msg}`);
          console.warn(`[fetch-images] FAIL: ${batch[j].name} - ${msg}`);
        }
      }

      // Rate limit: 1 second between batches
      if (i + BATCH < placesWithoutImages.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    console.log(`[fetch-images] Complete: ${succeeded} succeeded, ${failed} failed`);
    return { succeeded, failed, errors: errors.slice(0, 10), totalProcessed: placesWithoutImages.length };
  },
});

export const triggerFetchMissingImages = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.fetchMissingImages.fetchMissingPlaceImages, {});
  },
});
