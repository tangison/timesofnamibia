// ============================================================
// Times of Namibia — RSS Ingestion Action (TANGISON)
//
// Runs as a Convex scheduled action (cron) every 15 minutes.
// Fetches 15 Namibian news RSS feeds, parses them, deduplicates
// by guid, optionally summarises/classifies via OpenRouter, and
// inserts new articles into the Convex `article` table.
//
// Error handling: each feed is fetched independently with a 10s
// timeout. Failures are logged but don't crash the whole run.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { generateArticleImage } from "./imageGenerator";

// ── RSS FEED SOURCES ─────────────────────────────────────────
// 15 Namibian news outlets. Each URL is validated at runtime —
// 404/403/invalid-XML feeds are silently skipped + logged.

interface RssSource {
  name: string;
  url: string;
  category: string; // default section if the article doesn't match a keyword
}

const RSS_SOURCES: RssSource[] = [
  // VERIFIED FEEDS — each URL was manually checked for correct category + language:
  // Namibian Sun feed 137 = "LOCAL NEWS" (English) ✅
  { name: "Namibian Sun", url: "https://www.namibiansun.com/rssFeed/137", category: "national" },
  // Republikein feed 171 = "Ekonomie" (Economy, Afrikaans) ✅
  { name: "Republikein (Economy)", url: "https://www.republikein.com.na/rssFeed/171", category: "economy" },
  // Republikein feed 185 = "Plaaslik" (Local news, Afrikaans) ✅
  { name: "Republikein (Local)", url: "https://www.republikein.com.na/rssFeed/185", category: "national" },
  // Republikein feed 177 = "Regering" (Government, Afrikaans) ✅
  { name: "Republikein (Government)", url: "https://www.republikein.com.na/rssFeed/177", category: "politics" },
  // The Namibian investigations unit (English) ✅ — confirmed live with proper User-Agent
  { name: "The Namibian (Investigations)", url: "https://investigations.namibian.com.na/feed/", category: "national" },
  // Additional verified feeds:
  { name: "New Era", url: "https://neweralive.na/feed", category: "national" },
  { name: "Windhoek Observer", url: "https://www.observer24.com.na/feed/", category: "national" },
  { name: "Informanté", url: "https://informante.web.na/?feed=rss2", category: "national" },
  { name: "Namibia Daily News", url: "https://namibiadailynews.info/feed/", category: "national" },
];

// ── SECTION CLASSIFICATION KEYWORDS ──────────────────────────
// Used to auto-classify articles into sections based on title + content.

const SECTION_KEYWORDS: Record<string, string[]> = {
  politics: ["politic", "parliament", "election", "minister", "cabinet", "government", "president", "swapo", "congress", "campaign"],
  economy: ["economy", "economic", "finance", "bank", "inflation", "fiscal", "budget", "trade", "investment", "GDP", "treasury"],
  mining: ["mine", "mining", "uranium", "diamond", "lithium", "gold", "copper", "rossing", "husab", "extractive"],
  energy: ["energy", "power", "electric", "solar", "hydrogen", "wind", "gas", "oil", "renewable", "eskom", "nampower"],
  africa: ["africa", "sadc", "AU ", "african union", "continental", "regional"],
  world: ["world", "global", "international", "united nations", "UN ", "EU ", "US ", "China", "Russia"],
  sport: ["sport", "football", "rugby", "cricket", "athletics", "netball", "brave warriors", "npl", "premier league"],
  environment: ["environment", "climate", "wildlife", "conservation", "drought", "desert", "water", "park"],
  technology: ["technology", "tech", "digital", "broadband", "internet", "AI", "artificial intelligence", "startup", "innovation"],
  health: ["health", "hospital", "medical", "disease", "covid", "malaria", "clinic", "doctor", "patient"],
  education: ["education", "school", "university", "unam", "nust", "student", "teacher", "exam", "curriculum"],
  infrastructure: ["infrastructure", "road", "port", "airport", "railway", "bridge", "construction", "highway"],
  tenders: ["tender", "bid", "procurement", "rfq", "contract award"],
  jobs: ["job", "vacancy", "hiring", "position", "employment", "career"],
  opinion: ["opinion", "editorial", "column", "commentary", "letter to the editor", "analysis"],
  legal: ["court", "judge", "supreme court", "high court", "law", "legal", "justice", "ruling", "verdict"],
  culture: ["culture", "art", "music", "festival", "heritage", "tradition", "exhibition", "gallery"],
};

// ── HELPERS ──────────────────────────────────────────────────

function classifySection(title: string, content: string): string {
  const blob = `${title} ${content}`.toLowerCase();
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some((kw) => blob.includes(kw))) return section;
  }
  return "national";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "...";
}

// ── RSS PARSER (lightweight, no external dep needed) ─────────

interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  guid?: string;
  contentSnippet: string;
  content?: string;
  creator?: string;
  imageUrl?: string; // from <enclosure> or <media:content> — real publisher image
}

function parseRssXml(xml: string): RssItem[] {
  const items: RssItem[] = [];

  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  const itemMatches = xml.match(itemRegex) || [];

  for (const itemXml of itemMatches) {
    const getTag = (tag: string): string => {
      const match = itemXml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
      return match ? match[1].trim() : "";
    };

    const getAttr = (tag: string, attr: string): string => {
      // Match self-closing or opening tag with attributes
      const match = itemXml.match(new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']*)["']`, "i"));
      return match ? match[1].trim() : "";
    };

    const title = stripHtml(getTag("title"));
    const link = getTag("link") || getTag("guid");
    const pubDate = getTag("pubDate");
    const guid = getTag("guid") || link;
    const description = stripHtml(getTag("description"));
    const contentEncoded = stripHtml(getTag("content:encoded"));
    const creator = getTag("dc:creator") || getTag("author");

    // Extract publisher image from <enclosure url="..."> or <media:content url="...">
    // These are real, story-specific photos from the publisher's own CDN.
    let imageUrl: string | undefined;
    const enclosureUrl = getAttr("enclosure", "url");
    if (enclosureUrl && enclosureUrl.startsWith("http")) {
      imageUrl = enclosureUrl;
    } else {
      const mediaUrl = getAttr("media:content", "url");
      if (mediaUrl && mediaUrl.startsWith("http")) {
        imageUrl = mediaUrl;
      }
    }

    // For WordPress feeds (like investigations.namibian.com.na), images
    // may be embedded in the description as <img src="...">
    if (!imageUrl && description) {
      const imgMatch = description.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
      if (imgMatch) {
        imageUrl = imgMatch[1];
      }
    }

    if (!title || !link) continue;

    items.push({
      title,
      link,
      pubDate,
      guid,
      contentSnippet: truncate(description || contentEncoded, 300),
      content: contentEncoded || description,
      creator: creator || undefined,
      imageUrl,
    });
  }

  return items;
}

// ── OPENROUTER AI SUMMARIZATION ──────────────────────────────

async function summariseAndClassify(
  title: string,
  content: string,
  openRouterKey: string
): Promise<{ summary: string; section: string } | null> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://timesofnamibia.com",
        "X-Title": "Times of Namibia RSS Ingester",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [
          {
            role: "system",
            content: "You are a news editor for Times of Namibia. Given an article title and content, provide: (1) a 2-sentence summary, (2) classify into one of these sections: politics, economy, mining, energy, africa, world, sport, environment, technology, health, education, infrastructure, legal, culture, opinion, national. Respond in JSON format: {\"summary\": \"...\", \"section\": \"...\"}",
          },
          {
            role: "user",
            content: `Title: ${title}\n\nContent: ${truncate(content, 2000)}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary || truncate(content, 250),
      section: parsed.section || classifySection(title, content),
    };
  } catch {
    return null; // Non-critical — fall back to heuristic classification
  }
}

// ── MAIN INGESTION ACTION ────────────────────────────────────

export const ingestRssFeeds = internalAction({
  args: {},
  handler: async (ctx) => {
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;

    if (!adminToken) {
      console.error("[RSS] CONVEX_ADMIN_TOKEN not configured — cannot ingest");
      return { error: "CONVEX_ADMIN_TOKEN not configured" };
    }

    const results = {
      feedsChecked: 0,
      feedsValid: 0,
      feedsFailed: 0,
      articlesFound: 0,
      articlesInserted: 0,
      articlesDeduped: 0,
      imagesGenerated: 0,
      imagesFailed: 0,
      errors: [] as string[],
    };

    for (const source of RSS_SOURCES) {
      results.feedsChecked++;
      try {
        console.log(`[RSS] Fetching ${source.name}...`);

        const response = await fetch(source.url, {
          headers: {
            "User-Agent": "TimesOfNamibiaBot/1.0 (+https://timesofnamibia.com)",
            Accept: "application/rss+xml, application/xml, text/xml",
          },
          signal: AbortSignal.timeout(10_000),
        });

        if (!response.ok) {
          results.feedsFailed++;
          results.errors.push(`${source.name}: HTTP ${response.status}`);
          console.warn(`[RSS] ${source.name} returned HTTP ${response.status} — skipping`);
          continue;
        }

        const xml = await response.text();
        if (!xml.includes("<item") && !xml.includes("<entry")) {
          results.feedsFailed++;
          results.errors.push(`${source.name}: invalid XML (no items)`);
          console.warn(`[RSS] ${source.name}: invalid XML — skipping`);
          continue;
        }

        results.feedsValid++;
        const items = parseRssXml(xml);
        console.log(`[RSS] ${source.name}: ${items.length} items found`);

        for (const item of items) {
          results.articlesFound++;

          try {
            const content = item.content || item.contentSnippet || item.title;
            const section = classifySection(item.title, content);
            const slug = generateSlug(item.title);
            const pubDate = item.pubDate ? new Date(item.pubDate).getTime() : Date.now();

            // DEDUP CHECK — do this BEFORE image generation to avoid
            // wasting Pollinations calls on articles we'll discard.
            const exists = await ctx.runQuery(api.queries.checkArticleExists, {
              slug,
              rssGuid: item.guid,
            });
            if (exists) {
              results.articlesDeduped++;
              continue; // Skip — don't generate image for duplicates
            }

            // Optional: AI summarisation (only if OpenRouter key is configured
            // and the content is substantial enough to warrant it)
            let excerpt = item.contentSnippet;
            let finalSection = section;

            if (openRouterKey && content.length > 200) {
              const ai = await summariseAndClassify(item.title, content, openRouterKey);
              if (ai) {
                excerpt = ai.summary;
                finalSection = ai.section;
              }
            }

            // IMAGE HANDLING — use publisher's real image when available,
            // fall back to Pollinations.ai AI-generated image only when no
            // enclosure/media:content exists in the RSS feed.
            //
            // Priority:
            //   1. Publisher image from <enclosure> or <media:content> (real photo)
            //   2. Pollinations.ai generated illustration (AI fallback)
            //   3. No image (UI renders flat brand-color placeholder)
            let imageStorageId: string | undefined;
            let publisherImageUrl: string | undefined;

            if (item.imageUrl) {
              // Use the publisher's real image — fetch + store in Convex
              try {
                const imgRes = await fetch(item.imageUrl, {
                  signal: AbortSignal.timeout(15_000),
                  headers: { "User-Agent": "TimesOfNamibiaBot/1.0 (+https://timesofnamibia.com)" },
                });
                if (imgRes.ok) {
                  const imgBlob = await imgRes.blob();
                  if (imgBlob.size > 1000) { // Skip tiny/broken images
                    imageStorageId = await ctx.storage.store(imgBlob);
                    results.imagesGenerated++;
                    publisherImageUrl = item.imageUrl;
                    console.log(`[RSS] Publisher image stored for "${item.title.slice(0, 60)}..."`);
                  }
                }
              } catch (pubImgErr) {
                const msg = pubImgErr instanceof Error ? pubImgErr.message : String(pubImgErr);
                console.warn(`[RSS] Publisher image fetch failed: ${msg}`);
              }
            }

            // Fall back to AI-generated image ONLY if no publisher image was stored
            if (!imageStorageId) {
              try {
                const imageBlob = await generateArticleImage({
                  title: item.title,
                  category: finalSection,
                  summary: excerpt || content.slice(0, 200),
                });
                imageStorageId = await ctx.storage.store(imageBlob);
                results.imagesGenerated++;
                console.log(`[RSS] AI image generated for "${item.title.slice(0, 60)}..."`);
              } catch (imgErr) {
                const msg = imgErr instanceof Error ? imgErr.message : String(imgErr);
                console.warn(`[RSS] Image generation failed for "${item.title.slice(0, 40)}": ${msg}`);
                results.imagesFailed++;
                // imageUrl stays undefined — UI falls back to flat brand-color block
              }
            }

            const result = await ctx.runMutation(api.mutationsAdmin.ingestArticle, {
              adminToken,
              slug,
              headline: item.title,
              content: content.length > 50 ? content : item.contentSnippet,
              excerpt,
              source: source.name,
              section: finalSection,
              categorySlug: finalSection,
              authorLine: item.creator || source.name,
              publishedAt: pubDate,
              rssGuid: item.guid,
              readingTime: estimateReadingTime(content),
              ...(imageStorageId ? { imageStorageId } : {}),
            });

            if (result.deduped) {
              results.articlesDeduped++;
            } else {
              results.articlesInserted++;
              console.log(`[RSS] Inserted: "${item.title.slice(0, 60)}..." from ${source.name}`);
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            results.errors.push(`${source.name} / "${item.title.slice(0, 40)}": ${msg}`);
          }
        }
      } catch (err) {
        results.feedsFailed++;
        const msg = err instanceof Error ? err.message : String(err);
        results.errors.push(`${source.name}: ${msg}`);
        console.warn(`[RSS] ${source.name} failed: ${msg}`);
      }
    }

    console.log("[RSS] Ingestion complete:", results);
    return results;
  },
});

// ── MANUAL TRIGGER (for testing) ─────────────────────────────

export const triggerRssIngestion = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.ingestRss.ingestRssFeeds, {});
  },
});
