// ============================================================
// Times of Namibia - Directory Places Seed (Phase 4, Iteration 14)
//
// Seeds 48+ Namibian places from Wikimedia APIs:
//   - Wikipedia REST API: summary, thumbnail, coordinates
//   - Wikimedia Commons: 5 images per place with license
//   - Wikidata SPARQL: elevation, area, established date
//
// All images converted to WebP before storing in Convex.
// Rate limit: 1 request/second. 3 places in parallel max.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { convertToWebp, generateDirectoryAltText } from "./imageProcessor";

// ── PLACE LIST (48 places) ───────────────────────────────────

interface PlaceSeed {
  title: string;       // exact Wikipedia article title
  type: "park" | "landmark" | "town" | "wildlife" | "geological" | "cultural";
  region: string;
}

const PLACES: PlaceSeed[] = [
  // Parks (10)
  { title: "Etosha National Park", type: "park", region: "Kunene" },
  { title: "Namib-Naukluft National Park", type: "park", region: "Hardap" },
  { title: "Skeleton Coast National Park", type: "park", region: "Kunene" },
  { title: "Fish River Canyon", type: "park", region: "Karas" },
  { title: "Waterberg Plateau Park", type: "park", region: "Otjozondjupa" },
  { title: "Dorob National Park", type: "park", region: "Erongo" },
  { title: "Bwabwata National Park", type: "park", region: "Kavango East" },
  { title: "Mudumu National Park", type: "park", region: "Zambezi" },
  { title: "Nkasa Rupara National Park", type: "park", region: "Zambezi" },
  { title: "Ai-Ais", type: "park", region: "Karas" },
  // Landmarks (10)
  { title: "Sossusvlei", type: "landmark", region: "Hardap" },
  { title: "Deadvlei", type: "landmark", region: "Hardap" },
  { title: "Dune 45", type: "landmark", region: "Hardap" },
  { title: "Spitzkoppe", type: "landmark", region: "Erongo" },
  { title: "Brandberg Mountain", type: "landmark", region: "Erongo" },
  { title: "Twyfelfontein", type: "landmark", region: "Kunene" },
  { title: "Epupa Falls", type: "landmark", region: "Kunene" },
  { title: "Cape Cross", type: "landmark", region: "Erongo" },
  { title: "Sandwich Harbour", type: "landmark", region: "Hardap" },
  { title: "Kolmanskop", type: "landmark", region: "Karas" },
  // Towns (10)
  { title: "Windhoek", type: "town", region: "Khomas" },
  { title: "Swakopmund", type: "town", region: "Erongo" },
  { title: "Walvis Bay", type: "town", region: "Erongo" },
  { title: "Luderitz", type: "town", region: "Karas" },
  { title: "Keetmanshoop", type: "town", region: "Karas" },
  { title: "Oshakati", type: "town", region: "Oshana" },
  { title: "Rundu", type: "town", region: "Kavango East" },
  { title: "Gobabis", type: "town", region: "Omaheke" },
  { title: "Otjiwarongo", type: "town", region: "Otjozondjupa" },
  { title: "Tsumeb", type: "town", region: "Oshikoto" },
  // Wildlife (8)
  { title: "Desert elephant", type: "wildlife", region: "Kunene" },
  { title: "Desert lion", type: "wildlife", region: "Kunene" },
  { title: "Black rhinoceros", type: "wildlife", region: "Kunene" },
  { title: "Leopard", type: "wildlife", region: "Kunene" },
  { title: "African buffalo", type: "wildlife", region: "Zambezi" },
  { title: "Cheetah", type: "wildlife", region: "Otjozondjupa" },
  { title: "Gemsbok", type: "wildlife", region: "Hardap" },
  { title: "Hartmann's mountain zebra", type: "wildlife", region: "Kunene" },
  // Geological (6)
  { title: "Burnt Mountain (Namibia)", type: "geological", region: "Kunene" },
  { title: "Organ Pipes (Namibia)", type: "geological", region: "Kunene" },
  { title: "Petrified Forest (Namibia)", type: "geological", region: "Kunene" },
  { title: "Welwitschia", type: "geological", region: "Erongo" },
  { title: "Moon Landscape (Namibia)", type: "geological", region: "Erongo" },
  { title: "Sesriem Canyon", type: "geological", region: "Hardap" },
  // Cultural (4)
  { title: "Himba people", type: "cultural", region: "Kunene" },
  { title: "Damara people", type: "cultural", region: "Kunene" },
  { title: "San people", type: "cultural", region: "Otjozondjupa" },
  { title: "Alte Feste", type: "cultural", region: "Khomas" },
];

// ── HELPERS ──────────────────────────────────────────────────

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(namibia\)/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── WIKIPEDIA REST API ───────────────────────────────────────

interface WikiSummary {
  extract: string;
  thumbnail?: { url: string; width: number; height: number };
  coordinates?: { lat: number; lon: number };
  contentUrl: string;
}

async function fetchWikipediaSummary(title: string): Promise<WikiSummary | null> {
  try {
    const encoded = encodeURIComponent(title.replace(/ /g, "_"));
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "TimesOfNamibiaBot/1.0 (+https://timesofnamibia.com)" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      extract: data.extract || "",
      thumbnail: data.thumbnail ? {
        url: data.thumbnail.url,
        width: data.thumbnail.width,
        height: data.thumbnail.height,
      } : undefined,
      coordinates: data.coordinates ? {
        lat: data.coordinates.lat,
        lon: data.coordinates.lon,
      } : undefined,
      contentUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encoded}`,
    };
  } catch (err) {
    console.warn(`[directory] Wikipedia summary failed for ${title}:`, err instanceof Error ? err.message : err);
    return null;
  }
}

// ── WIKIMEDIA COMMONS API ────────────────────────────────────

interface CommonsImage {
  url: string;
  caption: string;
  license: string;
  source: string;
  width?: number;
  height?: number;
}

async function fetchCommonsImages(placeName: string, limit = 5): Promise<CommonsImage[]> {
  try {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: placeName,
      gsrnamespace: "6",
      gsrlimit: String(limit),
      prop: "imageinfo",
      iiprop: "url|extmetadata|size",
      format: "json",
      origin: "*",
    });
    const url = `https://commons.wikimedia.org/w/api.php?${params}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "TimesOfNamibiaBot/1.0 (+https://timesofnamibia.com)" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const pages = data.query?.pages || {};
    const images: CommonsImage[] = [];

    for (const page of Object.values<any>(pages)) {
      const info = page.imageinfo?.[0];
      if (!info?.url) continue;
      const meta = info.extmetadata || {};
      images.push({
        url: info.url,
        caption: meta.ImageDescription?.value?.replace(/<[^>]*>/g, "").slice(0, 200) || placeName,
        license: meta.License?.value?.replace(/<[^>]*>/g, "").slice(0, 100) || "Unknown",
        source: "Wikimedia Commons",
        width: info.width,
        height: info.height,
      });
    }

    return images;
  } catch (err) {
    console.warn(`[directory] Commons fetch failed for ${placeName}:`, err instanceof Error ? err.message : err);
    return [];
  }
}

// ── WIKIDATA SPARQL ──────────────────────────────────────────

interface WikidataFacts {
  key_facts: { label: string; value: string }[];
}

async function fetchWikidataFacts(title: string): Promise<WikidataFacts> {
  try {
    // Simple SPARQL query to get elevation, area, established date
    const sparql = `
      SELECT ?item ?itemLabel ?elev ?area ?established WHERE {
        ?item rdfs:label "${title}"@en.
        OPTIONAL { ?item wdt:P2044 ?elev. }
        OPTIONAL { ?item wdt:P2046 ?area. }
        OPTIONAL { ?item wdt:P571 ?established. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      } LIMIT 1
    `;
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "TimesOfNamibiaBot/1.0 (+https://timesofnamibia.com)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { key_facts: [] };

    const data = await res.json();
    const bindings = data.results?.bindings || [];
    if (bindings.length === 0) return { key_facts: [] };

    const b = bindings[0];
    const facts: { label: string; value: string }[] = [];
    if (b.elev) facts.push({ label: "Elevation", value: `${Math.round(parseFloat(b.elev.value))} m` });
    if (b.area) facts.push({ label: "Area", value: `${(parseFloat(b.area.value) / 1000000).toFixed(1)} sq km` });
    if (b.established) facts.push({ label: "Established", value: b.established.value.slice(0, 10) });

    return { key_facts: facts };
  } catch (err) {
    console.warn(`[directory] Wikidata fetch failed for ${title}:`, err instanceof Error ? err.message : err);
    return { key_facts: [] };
  }
}

// ── IMAGE PROCESSING ─────────────────────────────────────────

async function processAndStoreImage(
  ctx: any,
  imageUrl: string,
  placeName: string,
  caption: string,
  license: string,
  source: string
): Promise<{ url: string; webp_url: string; caption: string; source: string; license: string; alt_text: string; width?: number; height?: number } | null> {
  try {
    const imgRes = await fetch(imageUrl, {
      signal: AbortSignal.timeout(15_000),
      headers: { "User-Agent": "TimesOfNamibiaBot/1.0 (+https://timesofnamibia.com)" },
    });
    if (!imgRes.ok) return null;
    const imgBlob = await imgRes.blob();
    if (imgBlob.size < 1000) return null;

    // Convert to WebP
    const webpBlob = await convertToWebp(imgBlob);
    if (!webpBlob) return null;

    const storageId = await ctx.storage.store(webpBlob);
    const webpUrl = await ctx.runQuery(api.queries.getStorageUrl, { storageId });

    return {
      url: imageUrl,
      webp_url: webpUrl || imageUrl,
      caption,
      source,
      license,
      alt_text: generateDirectoryAltText(caption, placeName),
    };
  } catch (err) {
    console.warn(`[directory] Image processing failed:`, err instanceof Error ? err.message : err);
    return null;
  }
}

// ── PROCESS SINGLE PLACE ─────────────────────────────────────

async function processPlace(ctx: any, place: PlaceSeed): Promise<{ success: boolean; error?: string }> {
  try {
    const slug = generateSlug(place.title);

    // Check if already exists
    const existing = await ctx.runQuery(api.queries.getDirectoryPlace, { slug });
    if (existing) return { success: true };

    // Fetch data from all three APIs
    const [summary, commonsImages, wikidataFacts] = await Promise.all([
      fetchWikipediaSummary(place.title),
      fetchCommonsImages(place.title, 5),
      fetchWikidataFacts(place.title),
    ]);

    if (!summary || !summary.extract) {
      return { success: false, error: "No Wikipedia summary found" };
    }

    // Process and store images (convert to WebP)
    const processedImages: Array<{ url: string; webp_url: string; caption: string; source: string; license: string; alt_text: string; width?: number; height?: number }> = [];
    for (const img of commonsImages.slice(0, 5)) {
      const processed = await processAndStoreImage(
        ctx, img.url, place.title, img.caption, img.license, img.source
      );
      if (processed) processedImages.push(processed);
    }

    // If no Commons images, try Wikipedia thumbnail
    if (processedImages.length === 0 && summary.thumbnail) {
      const processed = await processAndStoreImage(
        ctx, summary.thumbnail.url, place.title, place.title, "Wikipedia", "Wikipedia"
      );
      if (processed) processedImages.push(processed);
    }

    // Default best_time_to_visit based on region
    const bestTimeToVisit = place.type === "park" || place.type === "wildlife"
      ? "May to September (dry season, best game viewing)"
      : place.type === "landmark" || place.type === "geological"
      ? "April to October (cooler temperatures)"
      : "Year-round (summer: October to March is hottest)";

    // Default activities based on type
    const activitiesByType: Record<string, string[]> = {
      park: ["Game drives", "Wildlife photography", "Bird watching", "Guided walks"],
      landmark: ["Photography", "Hiking", "Scenic viewing", "Sunrise/Sunset tours"],
      town: ["City tours", "Cultural visits", "Dining", "Shopping"],
      wildlife: ["Game viewing", "Photography", "Conservation tours", "Expert tracking"],
      geological: ["Geological tours", "Photography", "Hiking", "Educational visits"],
      cultural: ["Cultural tours", "Community visits", "Traditional crafts", "Historical sites"],
    };

    await ctx.runMutation(api.mutationsAdmin.ingestDirectoryPlace, {
      adminToken: process.env.CONVEX_ADMIN_TOKEN!,
      slug,
      name: place.title,
      type: place.type,
      region: place.region,
      short_description: summary.extract.slice(0, 300),
      rich_description: summary.extract, // Phase 5 will enrich this
      seo_meta_description: summary.extract.slice(0, 160),
      coordinates: summary.coordinates || { lat: -22.0, lng: 17.0 }, // default Namibia center
      images: processedImages,
      key_facts: wikidataFacts.key_facts,
      best_time_to_visit: bestTimeToVisit,
      activities: activitiesByType[place.type] || ["Sightseeing"],
      official_url: summary.contentUrl,
      related_places: [],
      gallery_featured: processedImages.length > 0,
    });

    console.log(`[directory] Seeded: ${place.title} (${processedImages.length} images)`);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[directory] Failed to seed ${place.title}: ${msg}`);
    return { success: false, error: msg };
  }
}

// ── MAIN ACTION ──────────────────────────────────────────────

export const seedDirectoryPlaces = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log(`[directory] Starting seed of ${PLACES.length} places...`);

    let succeeded = 0;
    let failed = 0;
    const errors: string[] = [];

    // Process 3 places in parallel, rate limit 1 req/sec
    const BATCH = 3;
    for (let i = 0; i < PLACES.length; i += BATCH) {
      const batch = PLACES.slice(i, i + BATCH);
      const results = await Promise.allSettled(
        batch.map(async (place) => {
          const result = await processPlace(ctx, place);
          await sleep(1000); // rate limit
          return result;
        })
      );

      for (let j = 0; j < results.length; j++) {
        const r = results[j];
        if (r.status === "fulfilled" && r.value.success) {
          succeeded++;
        } else {
          failed++;
          const errMsg = r.status === "fulfilled" ? r.value.error : String(r.reason);
          errors.push(`${batch[j].title}: ${errMsg}`);
        }
      }

      console.log(`[directory] Progress: ${succeeded + failed}/${PLACES.length} (${succeeded} ok, ${failed} failed)`);
    }

    // Retry failed places once
    if (failed > 0 && errors.length > 0) {
      console.log(`[directory] Retrying ${failed} failed places...`);
      for (const place of PLACES) {
        const slug = generateSlug(place.title);
        const existing = await ctx.runQuery(api.queries.getDirectoryPlace, { slug });
        if (!existing) {
          const result = await processPlace(ctx, place);
          if (result.success) {
            succeeded++;
            failed--;
          }
          await sleep(1000);
        }
      }
    }

    console.log(`[directory] Complete: ${succeeded} succeeded, ${failed} failed`);
    return { succeeded, failed, errors: errors.slice(0, 10), totalProcessed: PLACES.length };
  },
});

// Manual trigger
export const triggerSeedDirectory = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.seedDirectory.seedDirectoryPlaces, {});
  },
});
