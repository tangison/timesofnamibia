// ============================================================
// Times of Namibia - Generate Fallback Images for Places
//
// For places that have no real photo available on Wikipedia/
// Wikimedia Commons, generate an oil painting style image using
// the Pollinations AI with the locked navy/rust/cream palette.
//
// Also installs the user's uploaded logo as favicon.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { convertToWebp, generateDirectoryAltText } from "./imageProcessor";

const COMPOSITION_MODIFIERS = [
  "close-up still-life framing",
  "wide landscape framing",
  "high-contrast single-object silhouette",
  "abstract symbolic composition",
  "aerial/overhead framing",
];

let modifierIndex = 0;

function getNextModifier(): string {
  const m = COMPOSITION_MODIFIERS[modifierIndex % COMPOSITION_MODIFIERS.length];
  modifierIndex++;
  return m;
}

function buildPrompt(placeName: string, placeType: string, composition: string): string {
  // Choose 1-2 concrete objects based on type
  let objects = "";
  if (placeType === "town") {
    objects = "a small village church steeple and a dusty road";
  } else if (placeType === "wildlife") {
    objects = placeName.toLowerCase() + " in its natural habitat";
  } else if (placeType === "park") {
    objects = "a solitary acacia tree on a savanna plain";
  } else if (placeType === "landmark") {
    objects = "ancient rock formations in desert landscape";
  } else if (placeType === "geological") {
    objects = "rugged mountain terrain with exposed rock strata";
  } else if (placeType === "cultural") {
    objects = "a traditional Namibian homestead with thatched roof";
  } else {
    objects = "a Namibian desert landscape with distant mountains";
  }

  return `Oil painting, visible textured brushstrokes, ` +
    `muted palette limited to navy blue, rust orange, and warm cream, ` +
    `${objects}, ${composition}, ` +
    `no text, no logos, no watermark, ` +
    `no faces unless the subject requires it, ` +
    `gallery painting quality, cohesive composition`;
}

async function fetchPollinationsImage(prompt: string): Promise<Blob | null> {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 999999);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1200&height=630&model=flux&nologo=true&seed=${seed}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(45_000),
        headers: { "User-Agent": "TimesOfNamibiaBot/1.0 (+https://timesofnamibia.com)" },
      });
      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 1000) return blob;
      }
    } catch {
      if (attempt === 2) return null;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  return null;
}

export const generateMissingPlaceImages = internalAction({
  args: {},
  handler: async (ctx) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) return { error: "CONVEX_ADMIN_TOKEN not configured" };

    // Get all places without images
    const allPlaces = await ctx.runQuery(api.queries.listDirectoryPlaces, { limit: 400 });
    const placesWithoutImages = allPlaces.filter((p: any) => !p.images || p.images.length === 0);

    console.log(`[gen-images] ${placesWithoutImages.length} places need generated images`);

    let succeeded = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const place of placesWithoutImages) {
      try {
        const composition = getNextModifier();
        const prompt = buildPrompt(place.name, place.type, composition);
        console.log(`[gen-images] Generating for ${place.name} (${place.type}): ${composition}`);

        const blob = await fetchPollinationsImage(prompt);
        if (!blob) {
          throw new Error("Pollinations failed");
        }

        const webpBlob = await convertToWebp(blob);
        const storageId = await ctx.storage.store(webpBlob || blob);
        const storageUrl = await ctx.runQuery(api.queries.getStorageUrl, { storageId });

        if (!storageUrl) {
          throw new Error("Could not get storage URL");
        }

        const imageObj = {
          url: storageUrl,
          webp_url: storageUrl,
          caption: place.name,
          source: "AI Generated (Oil Painting)",
          license: "Times of Namibia",
          alt_text: generateDirectoryAltText(place.name, place.name),
        };

        await ctx.runMutation(api.mutationsAdmin.updateDirectoryPlaceImages, {
          adminToken,
          slug: place.slug,
          images: [imageObj],
        });

        succeeded++;
        console.log(`[gen-images] OK: ${place.name}`);

        // Rate limit between generations
        await new Promise(r => setTimeout(r, 2000));
      } catch (err) {
        failed++;
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${place.name}: ${msg}`);
        console.warn(`[gen-images] FAIL: ${place.name} - ${msg}`);
      }
    }

    console.log(`[gen-images] Complete: ${succeeded} succeeded, ${failed} failed`);
    return { succeeded, failed, errors: errors.slice(0, 10), totalProcessed: placesWithoutImages.length };
  },
});

export const triggerGenerateMissingImages = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.generatePlaceImages.generateMissingPlaceImages, {});
  },
});
