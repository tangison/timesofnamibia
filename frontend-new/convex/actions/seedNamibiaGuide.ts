// ============================================================
// Times of Namibia - Namibia Guide Seed Pipeline (Part 1)
//
// Fetches data from Wikipedia + Wikivoyage + Wikimedia Commons,
// synthesizes original guide entries via AI, stores as drafts.
//
// License: CC-BY-SA 4.0 (inherited from Wikipedia/Wikivoyage)
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { generateWithFallback } from "./aiProvider";

// ── SEED TOPICS ──────────────────────────────────────────────

const SEED_TOPICS = [
  { title: "Sossusvlei", region: "Hardap", category: "landscape" },
  { title: "Etosha National Park", region: "Oshikoto", category: "wildlife" },
  { title: "Swakopmund", region: "Erongo", category: "coastal" },
  { title: "Twyfelfontein", region: "Kunene", category: "culture" },
  { title: "Fish River Canyon", region: "Karas", category: "landscape" },
  { title: "Windhoek", region: "Khomas", category: "culture" },
  { title: "Skeleton Coast", region: "Kunene", category: "coastal" },
  { title: "Namib Desert", region: "Hardap", category: "landscape" },
  { title: "Caprivi Strip", region: "Zambezi", category: "wildlife" },
  { title: "Spitzkoppe", region: "Erongo", category: "landscape" },
  { title: "Kolmanskop", region: "Karas", category: "history" },
  { title: "Brandberg", region: "Kunene", category: "landscape" },
  { title: "Walvis Bay", region: "Erongo", category: "coastal" },
  { title: "Damaraland", region: "Kunene", category: "culture" },
  { title: "Kaokoland", region: "Kunene", category: "culture" },
];

// ── HELPERS ──────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function fetchWikipediaExtract(title: string): Promise<{ text: string; url: string }> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "TimesOfNamibiaBot/1.0 (contact@timesofnamibia.com)" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { text: "", url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}` };
    const data = await res.json();
    return {
      text: data.extract || "",
      url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    };
  } catch {
    return { text: "", url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}` };
  }
}

async function fetchWikivoyageExtract(title: string): Promise<{ text: string; url: string }> {
  try {
    const url = `https://en.wikivoyage.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(title)}&format=json`;
    const res = await fetch(url, {
      headers: { "User-Agent": "TimesOfNamibiaBot/1.0 (contact@timesofnamibia.com)" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { text: "", url: `https://en.wikivoyage.org/wiki/${encodeURIComponent(title)}` };
    const data = await res.json();
    const pages = data.query?.pages || {};
    const firstPage = Object.values(pages)[0] as any;
    return {
      text: firstPage?.extract || "",
      url: `https://en.wikivoyage.org/wiki/${encodeURIComponent(title)}`,
    };
  } catch {
    return { text: "", url: `https://en.wikivoyage.org/wiki/${encodeURIComponent(title)}` };
  }
}

async function fetchCommonsImages(title: string, limit = 3): Promise<Array<{
  url: string; credit: string; sourceUrl: string; license: string;
}>> {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(title)}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=800&format=json`;
    const res = await fetch(url, {
      headers: { "User-Agent": "TimesOfNamibiaBot/1.0 (contact@timesofnamibia.com)" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = data.query?.pages || {};
    return Object.values(pages).map((p: any) => {
      const info = p.imageinfo?.[0];
      if (!info) return null;
      const meta = info.extmetadata || {};
      return {
        url: info.thumburl || info.url,
        credit: meta.Artist?.value?.replace(/<[^>]*>/g, "").trim() || "Unknown",
        sourceUrl: info.descriptionurl || "",
        license: meta.LicenseShortName?.value?.replace(/<[^>]*>/g, "").trim() || "Unknown",
      };
    }).filter((img): img is { url: string; credit: string; sourceUrl: string; license: string } => img !== null).slice(0, limit);
  } catch {
    return [];
  }
}

// ── MAIN SEED ACTION ─────────────────────────────────────────

export const seedNamibiaGuide = internalAction({
  args: {},
  handler: async (ctx) => {
    const results = { seeded: 0, skipped: 0, errors: [] as string[] };

    for (const topic of SEED_TOPICS) {
      const slug = slugify(topic.title);

      // Check if already exists
      const existing = await ctx.runQuery(api.queries.getGuideBySlug, { slug });
      if (existing) {
        results.skipped++;
        continue;
      }

      try {
        console.log(`[Guide] Seeding ${topic.title}...`);

        // Fetch from Wikipedia + Wikivoyage
        const [wikipedia, wikivoyage, images] = await Promise.all([
          fetchWikipediaExtract(topic.title),
          fetchWikivoyageExtract(topic.title),
          fetchCommonsImages(topic.title),
        ]);

        const sourceMaterial = [wikipedia.text, wikivoyage.text].filter(Boolean).join("\n\n");
        if (sourceMaterial.length < 50) {
          results.errors.push(`${topic.title}: insufficient source material`);
          continue;
        }

        // AI synthesis - original content, not a copy
        const body = await generateWithFallback(
          [
            {
              role: "system",
              content: "You are a travel guide editor for Times of Namibia. Write original, well-organized content. DO NOT copy or closely paraphrase the source material - write entirely in your own words. Do not invent facts.",
            },
            {
              role: "user",
              content: `Write a 4-paragraph guide entry about "${topic.title}", Namibia (region: ${topic.region}, category: ${topic.category}). Cover what it is, why it matters, and practical context. Base it on the factual content below but write in your own words.\n\nSource material:\n${sourceMaterial.slice(0, 2000)}`,
            },
          ],
          { maxTokens: 500, timeout: 20_000 }
        );

        if (!body || body.length < 100) {
          results.errors.push(`${topic.title}: AI synthesis failed`);
          continue;
        }

        await ctx.runMutation(api.mutationsAdmin.ingestGuideEntry, {
          adminToken: process.env.CONVEX_ADMIN_TOKEN || "",
          slug,
          title: topic.title,
          region: topic.region,
          category: topic.category,
          body,
          sources: [
            { name: "Wikipedia", url: wikipedia.url, license: "CC-BY-SA 4.0" },
            { name: "Wikivoyage", url: wikivoyage.url, license: "CC-BY-SA 4.0" },
          ],
          images,
        });

        results.seeded++;
        console.log(`[Guide] Seeded: ${topic.title}`);
      } catch (err) {
        results.errors.push(`${topic.title}: ${err instanceof Error ? err.message : err}`);
      }
    }

    console.log("[Guide] Seed complete:", results);
    return results;
  },
});

export const triggerGuideSeed = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized");
    }
    return await ctx.runAction(internal.actions.seedNamibiaGuide.seedNamibiaGuide, {});
  },
});
