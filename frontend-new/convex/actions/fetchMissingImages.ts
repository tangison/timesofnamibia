"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { convertToWebp, generateDirectoryAltText } from "./imageProcessor";

const HEADERS = {
  "User-Agent": "TimesOfNamibiaBot/1.0 (https://timesofnamibia47.vercel.app; admin@timesofnamibia.com)",
  "Accept": "application/json",
};

interface ImageCandidate {
  url: string;
  source: string;
  attribution: string;
  originalUrl: string;
}

// ── SOURCE 1: Wikimedia Commons Search ───────────────────────
async function tryWikimediaCommons(name: string): Promise<ImageCandidate | null> {
  try {
    const params = new URLSearchParams({
      action: "query", generator: "search",
      gsrsearch: `${name} Namibia`, gsrnamespace: "6", gsrlimit: "10",
      prop: "imageinfo", iiprop: "url|extmetadata", format: "json",
    });
    const url = `https://commons.wikimedia.org/w/api.php?${params}`;
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages || {};
    for (const page of Object.values<any>(pages)) {
      const info = page.imageinfo?.[0];
      if (!info?.url) continue;
      if (info.url.endsWith(".svg") || info.url.endsWith(".SVG")) continue;
      if (info.width && info.width < 200) continue;
      const meta = info.extmetadata || {};
      const artist = (meta.Artist?.value || "").replace(/<[^>]*>/g, "").trim().slice(0, 80) || "Unknown";
      const license = (meta.LicenseShortName?.value || "").replace(/<[^>]*>/g, "").trim() || "CC-BY-SA";
      return {
        url: info.url,
        source: "Wikimedia Commons",
        attribution: `Photo by ${artist}, ${license}`,
        originalUrl: info.descriptionurl || info.url,
      };
    }
    return null;
  } catch { return null; }
}

// ── SOURCE 2: Wikipedia REST Summary ─────────────────────────
async function tryWikipediaSummary(name: string): Promise<ImageCandidate | null> {
  try {
    const encoded = encodeURIComponent(name.replace(/ /g, "_"));
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = await res.json();
    const img = data.originalimage || data.thumbnail;
    if (!img?.source) return null;
    return {
      url: img.source,
      source: "Wikipedia",
      attribution: "Via Wikipedia",
      originalUrl: data.content_urls?.desktop?.page || url,
    };
  } catch { return null; }
}

// ── SOURCE 3: Wikidata P18 ───────────────────────────────────
async function tryWikidataP18(name: string): Promise<ImageCandidate | null> {
  try {
    const searchParams = new URLSearchParams({
      action: "wbsearchentities", search: name, language: "en",
      format: "json", limit: "1",
    });
    const searchUrl = `https://www.wikidata.org/w/api.php?${searchParams}`;
    const searchRes = await fetch(searchUrl, { headers: HEADERS, signal: AbortSignal.timeout(10000) });
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const entityId = searchData.search?.[0]?.id;
    if (!entityId) return null;

    const claimParams = new URLSearchParams({
      action: "wbgetclaims", entity: entityId, property: "P18", format: "json",
    });
    const claimUrl = `https://www.wikidata.org/w/api.php?${claimParams}`;
    const claimRes = await fetch(claimUrl, { headers: HEADERS, signal: AbortSignal.timeout(10000) });
    if (!claimRes.ok) return null;
    const claimData = await claimRes.json();
    const fileName = claimData.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
    if (!fileName) return null;

    const fileUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1200`;
    return {
      url: fileUrl,
      source: "Wikidata",
      attribution: "Via Wikidata/Wikimedia Commons",
      originalUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}`,
    };
  } catch { return null; }
}

// ── SOURCE 4: Openverse ──────────────────────────────────────
async function tryOpenverse(name: string): Promise<ImageCandidate | null> {
  try {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(name + " Namibia")}&page_size=5`;
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = await res.json();
    const validLicenses = ["cc0", "pdm", "by", "by-sa", "cc-by", "cc-by-sa"];
    for (const result of data.results || []) {
      if (!validLicenses.includes(result.license?.toLowerCase())) continue;
      if (!result.url) continue;
      return {
        url: result.url,
        source: "Openverse",
        attribution: `License: ${result.license_version || result.license || "CC"}`,
        originalUrl: result.foreign_landing_url || result.url,
      };
    }
    return null;
  } catch { return null; }
}

// ── SOURCE 5: Tavily Image Search ────────────────────────────
async function tryTavilyImages(name: string): Promise<ImageCandidate | null> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${name} Namibia`,
        include_images: true,
        search_depth: "advanced",
        max_results: 5,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    // CRITICAL: Use the 'images' array, NOT 'results'
    const images = data.images || [];
    for (const imgUrl of images) {
      if (typeof imgUrl === "string" && imgUrl.startsWith("http")) {
        return {
          url: imgUrl,
          source: "Tavily Image Search",
          attribution: "Found via Tavily",
          originalUrl: imgUrl,
        };
      }
    }
    return null;
  } catch { return null; }
}

// ── VALIDATE: HTTP HEAD check ────────────────────────────────
async function validateImage(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(10000),
      headers: { "User-Agent": HEADERS["User-Agent"] },
      redirect: "follow",
    });
    if (!res.ok) return false;
    const contentType = res.headers.get("content-type") || "";
    return contentType.startsWith("image/");
  } catch {
    // Some servers don't support HEAD - try GET with range
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000),
        headers: { "User-Agent": HEADERS["User-Agent"], Range: "bytes=0-1" },
        redirect: "follow",
      });
      if (!res.ok) return false;
      const contentType = res.headers.get("content-type") || "";
      return contentType.startsWith("image/");
    } catch { return false; }
  }
}

// ── DOWNLOAD AND STORE ───────────────────────────────────────
async function downloadAndStore(
  ctx: any, candidate: ImageCandidate, placeName: string, placeSlug: string
): Promise<{ url: string; webp_url: string; caption: string; source: string; license: string; alt_text: string } | null> {
  try {
    const imgRes = await fetch(candidate.url, {
      signal: AbortSignal.timeout(30000),
      headers: { "User-Agent": HEADERS["User-Agent"] },
      redirect: "follow",
    });
    if (!imgRes.ok) return null;
    const imgBlob = await imgRes.blob();
    if (imgBlob.size < 2000) return null;

    const webpBlob = await convertToWebp(imgBlob);
    const storageId = await ctx.storage.store(webpBlob || imgBlob);
    const storageUrl = await ctx.runQuery(api.queries.getStorageUrl, { storageId });
    if (!storageUrl) return null;

    return {
      url: candidate.url,
      webp_url: storageUrl,
      caption: placeName,
      source: candidate.source,
      license: candidate.attribution,
      alt_text: generateDirectoryAltText(placeName, placeName),
    };
  } catch { return null; }
}

// ── MAIN ACTION ──────────────────────────────────────────────
export const fetchMissingPlaceImages = internalAction({
  args: {},
  handler: async (ctx) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) return { error: "No admin token" };

    const allPlaces = await ctx.runQuery(api.queries.listDirectoryPlaces, { limit: 400 });
    const placesWithoutImages = allPlaces.filter((p: any) => !p.images || p.images.length === 0);

    console.log(`[fetch-images] ${placesWithoutImages.length} places need images`);

    let succeeded = 0;
    let failed = 0;
    const needsManualReview: string[] = [];

    for (const place of placesWithoutImages) {
      console.log(`[fetch-images] Processing: ${place.name}`);

      let found = false;

      // Try each source in order
      const sources = [
        () => tryWikimediaCommons(place.name),
        () => tryWikipediaSummary(place.name),
        () => tryWikidataP18(place.name),
        () => tryOpenverse(place.name),
        () => tryTavilyImages(place.name),
      ];

      for (const sourceFn of sources) {
        if (found) break;

        const candidate = await sourceFn();
        if (!candidate) continue;

        // VALIDATE: HTTP HEAD check
        const valid = await validateImage(candidate.url);
        if (!valid) {
          console.log(`[fetch-images] Validation failed for ${place.name} from ${candidate.source}`);
          continue;
        }

        // Download and store
        const imageObj = await downloadAndStore(ctx, candidate, place.name, place.slug);
        if (!imageObj) continue;

        // Update the place
        await ctx.runMutation(api.mutationsAdmin.updateDirectoryPlaceImages, {
          adminToken,
          slug: place.slug,
          images: [imageObj],
        });

        succeeded++;
        found = true;
        console.log(`[fetch-images] OK: ${place.name} from ${candidate.source}`);

        // Rate limit
        await new Promise(r => setTimeout(r, 1000));
      }

      if (!found) {
        failed++;
        needsManualReview.push(place.slug);
        console.log(`[fetch-images] FAILED: ${place.name} - no image found from any source`);
      }
    }

    console.log(`[fetch-images] Done: ${succeeded} succeeded, ${failed} failed`);
    return {
      succeeded,
      failed,
      needsManualReview: needsManualReview.slice(0, 20),
      totalProcessed: placesWithoutImages.length,
    };
  },
});

export const triggerFetchMissingImages = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized");
    }
    return await ctx.runAction(internal.actions.fetchMissingImages.fetchMissingPlaceImages, {});
  },
});
