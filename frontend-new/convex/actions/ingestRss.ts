// ============================================================
// Times of Namibia — RSS Ingestion Action (TANGISON)
//
// Task 3 spec implementation:
//   - 14 sources: 6 Namibian + 6 African + 2 Global
//   - sourceRegion: "namibia" | "africa" | "world"
//   - Per-region item caps: namibia=5, africa=3, world=2
//   - Skip articles older than 48 hours
//   - Deduplicate by URL/guid before processing
//   - AI rewrite via OpenRouter (llama-3.3-70b) with editorial voice
//   - Returns JSON: { headline, body, summary, category }
//   - Image: publisher image if available, else Pollinations
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { generateArticleImage } from "./imageGenerator";
import { generateWithFallback } from "./aiProvider";

// ── RSS FEED SOURCES (Task 3 spec) ───────────────────────────

interface RssSource {
  name: string;
  url: string;
  sourceRegion: "namibia" | "africa" | "world";
  defaultCategory: string;
}

const RSS_SOURCES: RssSource[] = [
  // ══ NAMIBIA (6 sources) — ingest every 15 mins ═════════════
  { name: "The Namibian", url: "https://www.namibian.com.na/rss", sourceRegion: "namibia", defaultCategory: "national" },
  { name: "New Era Live", url: "https://neweralive.na/feed", sourceRegion: "namibia", defaultCategory: "national" },
  { name: "Namibian Sun", url: "https://www.namibiansun.com/feed/", sourceRegion: "namibia", defaultCategory: "national" },
  { name: "Confidente", url: "https://confidente.com.na/feed/", sourceRegion: "namibia", defaultCategory: "national" },
  { name: "Windhoek Observer", url: "https://www.observer.com.na/feed", sourceRegion: "namibia", defaultCategory: "national" },
  { name: "AllAfrica Namibia", url: "https://allafrica.com/namibia/index.xml", sourceRegion: "namibia", defaultCategory: "national" },

  // ══ AFRICA (6 sources) — ingest every 30 mins ══════════════
  { name: "AllAfrica Africa", url: "https://allafrica.com/africa/index.xml", sourceRegion: "africa", defaultCategory: "africa" },
  { name: "Mail & Guardian (SA)", url: "https://mg.co.za/feed/", sourceRegion: "africa", defaultCategory: "africa" },
  { name: "Daily Maverick", url: "https://www.dailymaverick.co.za/feed/", sourceRegion: "africa", defaultCategory: "africa" },
  { name: "The East African", url: "https://www.theeastafrican.co.ke/tea/rss", sourceRegion: "africa", defaultCategory: "africa" },
  { name: "BBC Africa", url: "https://feeds.bbci.co.uk/news/world/africa/rss.xml", sourceRegion: "africa", defaultCategory: "africa" },

  // ══ WORLD (2 sources) — ingest every 60 mins ═══════════════
  { name: "Reuters World", url: "https://feeds.reuters.com/reuters/worldNews", sourceRegion: "world", defaultCategory: "world" },
  { name: "Reuters Business", url: "https://feeds.reuters.com/reuters/businessNews", sourceRegion: "world", defaultCategory: "business" },
];

// ── TEXT CLEANING ────────────────────────────────────────────

function cleanText(raw: string): string {
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/\s+/g, " ")
    .trim();
}

function htmlToParagraphs(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/div>/gi, "\n\n")
    .replace(/<div[^>]*>/gi, "")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<h[1-6][^>]*>/gi, "")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n\n")
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

// ── CONTENT SANITY CHECK ─────────────────────────────────────

function contentSanityCheck(article: {
  title: string;
  content: string;
  authorLine?: string;
}): { passed: boolean; issues: string[] } {
  const issues: string[] = [];
  const allText = `${article.title} ${article.content} ${article.authorLine || ""}`;

  if (/<!\[CDATA\[/.test(allText)) issues.push("CDATA marker found");
  if (/&#\d+;/.test(allText) || /&#x[0-9a-fA-F]+;/.test(allText)) issues.push("Unescaped entity");
  if (/<[a-zA-Z][^>]*>/.test(article.content)) issues.push("Raw HTML in content");
  if (article.content.length < 50) issues.push("Content too short");

  return { passed: issues.length === 0, issues };
}

// ── RSS PARSER ───────────────────────────────────────────────

interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  guid?: string;
  contentSnippet: string;
  content?: string;
  creator?: string;
  imageUrl?: string;
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
      const match = itemXml.match(new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']*)["']`, "i"));
      return match ? match[1].trim() : "";
    };

    const title = cleanText(getTag("title"));
    const link = cleanText(getTag("link") || getTag("guid"));
    const pubDate = getTag("pubDate");
    const guid = cleanText(getTag("guid") || link);
    const description = cleanText(getTag("description"));
    const contentEncoded = htmlToParagraphs(getTag("content:encoded"));
    const creator = cleanText(getTag("dc:creator") || getTag("author"));

    let imageUrl: string | undefined;
    const enclosureUrl = getAttr("enclosure", "url");
    if (enclosureUrl && enclosureUrl.startsWith("http")) {
      imageUrl = enclosureUrl;
    } else {
      const mediaUrl = getAttr("media:content", "url");
      if (mediaUrl && mediaUrl.startsWith("http")) imageUrl = mediaUrl;
    }
    if (!imageUrl && description) {
      const imgMatch = description.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
      if (imgMatch) imageUrl = imgMatch[1];
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

// ── AI REWRITE (Task 1 spec) ─────────────────────────────────
// Returns JSON: { headline, body, summary, category }

interface AiRewriteResult {
  headline: string;
  body: string;
  summary: string;
  category: string;
}

async function rewriteArticle(
  title: string,
  content: string,
  sourceRegion: string
): Promise<AiRewriteResult | null> {
  try {
    const aiText = await generateWithFallback(
      [
        {
          role: "system",
          content: `You are the editorial AI for Times of Namibia, an African news outlet. Rewrite articles to be factual, clear, and locally relevant to Namibian and Southern African readers. Tone: professional but accessible. No fluff. No AI-sounding phrases. Active voice only. Max 400 words.`,
        },
        {
          role: "user",
          content: `Rewrite this article for a Namibian audience. Keep all facts. Localize where relevant. Generate: (1) rewritten body, (2) punchy headline under 10 words, (3) one-sentence summary for social media, (4) category tag from [Politics, Business, Sport, Africa, World, Tech, Health, Environment].

Article title: ${title}
Article body: ${truncate(content, 2000)}

Return as JSON: { "headline": "", "body": "", "summary": "", "category": "" }`,
        },
      ],
      { maxTokens: 800, timeout: 30_000 }
    );

    if (!aiText) return null;

    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    // Sanitize control characters before JSON.parse
    const sanitized = jsonMatch[0]
      .replace(/[\x00-\x1f\x7f]/g, (ch) => {
        const code = ch.charCodeAt(0);
        return code === 10 || code === 13 ? ch : " ";
      })
      .replace(/\\(?!["\\/bfnrtu])/g, "\\\\");

    const parsed = JSON.parse(sanitized);

    // Normalize category to lowercase section name
    const categoryMap: Record<string, string> = {
      politics: "politics",
      business: "economy",
      sport: "sport",
      africa: "africa",
      world: "world",
      tech: "technology",
      technology: "technology",
      health: "health",
      environment: "environment",
    };
    const normalizedCategory = categoryMap[(parsed.category || "").toLowerCase()] || sourceRegion === "namibia" ? "national" : sourceRegion;

    return {
      headline: String(parsed.headline || title).slice(0, 200),
      body: String(parsed.body || content).slice(0, 5000),
      summary: String(parsed.summary || truncate(content, 200)).slice(0, 300),
      category: normalizedCategory,
    };
  } catch (err) {
    console.warn("[AI] Rewrite failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

// ── MAIN INGESTION ACTION ────────────────────────────────────

export const ingestRssFeeds = internalAction({
  args: {
    sourceRegion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) {
      console.error("[RSS] CONVEX_ADMIN_TOKEN not configured");
      return { error: "CONVEX_ADMIN_TOKEN not configured" };
    }

    // Filter sources by region if specified (Task 3 per-region cron)
    const sourcesToProcess = args.sourceRegion
      ? RSS_SOURCES.filter((s) => s.sourceRegion === args.sourceRegion)
      : RSS_SOURCES;

    console.log(`[RSS] Ingesting ${sourcesToProcess.length} sources${args.sourceRegion ? ` (region: ${args.sourceRegion})` : ""}`);

    const results = {
      feedsChecked: 0,
      feedsValid: 0,
      feedsFailed: 0,
      articlesFound: 0,
      articlesInserted: 0,
      articlesDeduped: 0,
      articlesSkippedOld: 0,
      quarantined: 0,
      imagesGenerated: 0,
      imagesFailed: 0,
      errors: [] as string[],
    };

    const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
    const now = Date.now();

    for (const source of sourcesToProcess) {
      results.feedsChecked++;
      try {
        console.log(`[RSS] Fetching ${source.name} (${source.sourceRegion})...`);

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
          console.warn(`[RSS] ${source.name} returned HTTP ${response.status}`);
          continue;
        }

        const xml = await response.text();
        if (!xml.includes("<item") && !xml.includes("<entry")) {
          results.feedsFailed++;
          results.errors.push(`${source.name}: invalid XML`);
          continue;
        }

        results.feedsValid++;
        const items = parseRssXml(xml);
        console.log(`[RSS] ${source.name}: ${items.length} items found`);

        // Per-region item caps
        const MAX_ITEMS = source.sourceRegion === "namibia" ? 5 : source.sourceRegion === "africa" ? 3 : 2;
        const itemsToProcess = items.slice(0, MAX_ITEMS);

        for (const item of itemsToProcess) {
          results.articlesFound++;

          try {
            const pubDate = item.pubDate ? new Date(item.pubDate).getTime() : now;

            // Skip articles older than 48 hours (Task 3 spec)
            if (now - pubDate > FORTY_EIGHT_HOURS_MS) {
              results.articlesSkippedOld++;
              continue;
            }

            const slug = generateSlug(item.title);
            const originalUrl = item.link;

            // Dedup check BEFORE image generation
            const exists = await ctx.runQuery(api.queries.checkArticleExists, {
              slug,
              rssGuid: item.guid,
            });
            if (exists) {
              results.articlesDeduped++;
              continue;
            }

            const content = item.content || item.contentSnippet || item.title;

            // AI rewrite (Task 1 spec)
            let headline = item.title;
            let body = content;
            let summary = item.contentSnippet;
            let category = source.defaultCategory;

            const aiResult = await rewriteArticle(item.title, content, source.sourceRegion);
            if (aiResult) {
              headline = aiResult.headline;
              body = aiResult.body;
              summary = aiResult.summary;
              category = aiResult.category;
            }

            // Image handling (Task 2 spec)
            let imageStorageId: string | undefined;
            let publisherImageUrl: string | undefined;

            if (item.imageUrl) {
              try {
                const imgRes = await fetch(item.imageUrl, {
                  signal: AbortSignal.timeout(15_000),
                  headers: { "User-Agent": "TimesOfNamibiaBot/1.0 (+https://timesofnamibia.com)" },
                });
                if (imgRes.ok) {
                  const imgBlob = await imgRes.blob();
                  if (imgBlob.size > 1000) {
                    imageStorageId = await ctx.storage.store(imgBlob);
                    results.imagesGenerated++;
                    publisherImageUrl = item.imageUrl;
                    console.log(`[RSS] Publisher image stored for "${item.title.slice(0, 60)}..."`);
                  }
                }
              } catch (pubImgErr) {
                console.warn(`[RSS] Publisher image fetch failed: ${pubImgErr instanceof Error ? pubImgErr.message : pubImgErr}`);
              }
            }

            // Fall back to AI-generated image
            if (!imageStorageId) {
              try {
                const imageBlob = await generateArticleImage({
                  title: headline,
                  category,
                  summary,
                });
                if (imageBlob) {
                  imageStorageId = await ctx.storage.store(imageBlob);
                  results.imagesGenerated++;
                  console.log(`[RSS] AI image generated for "${item.title.slice(0, 60)}..."`);
                } else {
                  results.imagesFailed++;
                }
              } catch (imgErr) {
                console.warn(`[RSS] Image generation failed: ${imgErr instanceof Error ? imgErr.message : imgErr}`);
                results.imagesFailed++;
              }
            }

            // Content sanity check
            const sanityCheck = contentSanityCheck({
              title: headline,
              content: body,
              authorLine: item.creator || source.name,
            });
            if (!sanityCheck.passed) {
              results.quarantined++;
              console.warn(`[RSS] QUARANTINED "${headline.slice(0, 60)}..." — ${sanityCheck.issues.join(", ")}`);
              continue;
            }

            // Insert article with both legacy + new fields
            const result = await ctx.runMutation(api.mutationsAdmin.ingestArticle, {
              adminToken,
              slug,
              headline,
              subheadline: summary,
              content: body,
              excerpt: summary,
              source: source.name,
              section: category,
              categorySlug: category,
              authorLine: item.creator || source.name,
              publishedAt: pubDate,
              rssGuid: item.guid,
              readingTime: estimateReadingTime(body),
              ...(imageStorageId ? { imageStorageId } : {}),
              // Task 4 new fields:
              sourceRegion: source.sourceRegion,
              originalUrl,
            });

            if (result.deduped) {
              results.articlesDeduped++;
            } else {
              results.articlesInserted++;
              console.log(`[RSS] Inserted: "${headline.slice(0, 60)}..." from ${source.name} (${source.sourceRegion})`);
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

    try {
      await ctx.runMutation(api.mutationsAdmin.updateIngestionHealth, {
        adminToken,
        articlesInserted: results.articlesInserted,
        errors: results.errors.slice(0, 10),
      });
    } catch (healthErr) {
      console.warn("[RSS] Failed to record health:", healthErr);
    }

    return results;
  },
});

// ── MANUAL TRIGGER ───────────────────────────────────────────

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
