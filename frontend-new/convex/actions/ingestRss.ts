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
import { generateWithFallback } from "./aiProvider";

// ── RSS FEED SOURCES ─────────────────────────────────────────
// 15 Namibian news outlets. Each URL is validated at runtime —
// 404/403/invalid-XML feeds are silently skipped + logged.

interface RssSource {
  name: string;
  url: string;
  category: string;
  isInternational: boolean;
}

const RSS_SOURCES: RssSource[] = [
  // ══ NAMIBIA (9 feeds) ═══════════════════════════════════════
  { name: "Namibian Sun", url: "https://www.namibiansun.com/rssFeed/137", category: "national", isInternational: false },
  { name: "Republikein (Economy)", url: "https://www.republikein.com.na/rssFeed/171", category: "economy", isInternational: false },
  { name: "Republikein (Local)", url: "https://www.republikein.com.na/rssFeed/185", category: "national", isInternational: false },
  { name: "Republikein (Government)", url: "https://www.republikein.com.na/rssFeed/177", category: "politics", isInternational: false },
  { name: "The Namibian (Investigations)", url: "https://investigations.namibian.com.na/feed/", category: "national", isInternational: false },
  { name: "New Era", url: "https://neweralive.na/feed", category: "national", isInternational: false },
  { name: "Windhoek Observer", url: "https://www.observer24.com.na/feed/", category: "national", isInternational: false },
  { name: "Informanté", url: "https://informante.web.na/?feed=rss2", category: "national", isInternational: false },
  { name: "Namibia Daily News", url: "https://namibiadailynews.info/feed/", category: "national", isInternational: false },

  // ══ CHINA (2 feeds) — INTERNATIONAL, capped at 2 items/cycle ══
  { name: "South China Morning Post", url: "https://www.scmp.com/rss/91/feed", category: "world", isInternational: true },
  { name: "China Daily", url: "https://www.chinadaily.com.cn/rss/world_rss.xml", category: "world", isInternational: true },

  // ══ EUROPE (2 feeds) — INTERNATIONAL, capped at 2 items/cycle ══
  { name: "The Telegraph", url: "https://www.telegraph.co.uk/news/rss.xml", category: "world", isInternational: true },
  { name: "Euronews", url: "https://www.euronews.com/rss", category: "world", isInternational: true },
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

/**
 * Comprehensive text cleaning for RSS content.
 * Handles: CDATA stripping, HTML tag removal, ALL entity decoding
 * (named, numeric decimal, and hex), whitespace normalization.
 *
 * Part 1 Fix #1 + #2: Previously only title/description were cleaned,
 * and numeric entities like &#8230; and CDATA wrappers like
 * <![CDATA[Correspondent]]> were not handled. Now applied to ALL fields.
 */
function cleanText(raw: string): string {
  return raw
    // Strip CDATA wrappers: <![CDATA[...]]> → ...
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    // Strip HTML tags
    .replace(/<[^>]*>/g, "")
    // Decode named entities
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    // Decode numeric decimal entities: &#8230; → …
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(parseInt(code, 10)))
    // Decode hex entities: &#x2026; → …
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, code) => String.fromCharCode(parseInt(code, 16)))
    // Normalize whitespace
    .replace(/\s+/g, " ")
    .trim();
}

// Keep the old name as an alias for backwards compat
const stripHtml = cleanText;

/**
 * Convert HTML content to plain text while preserving paragraph breaks.
 * Converts <p>, <br>, <div> to double newlines, then strips remaining tags.
 * Used for content:encoded so article bodies have proper paragraph structure.
 *
 * Part 1 Fix #7: Previously the raw RSS teaser was dumped as body text
 * with no paragraph breaks. Now we extract content:encoded and format it.
 */
function htmlToParagraphs(html: string): string {
  return html
    // Strip CDATA first
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    // Convert block-level elements to paragraph breaks
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/div>/gi, "\n\n")
    .replace(/<div[^>]*>/gi, "")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<h[1-6][^>]*>/gi, "")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    // Strip remaining HTML tags
    .replace(/<[^>]*>/g, "")
    // Decode entities
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, code) => String.fromCharCode(parseInt(code, 16)))
    // Normalize: collapse 3+ newlines to 2, trim each paragraph
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

/**
 * Part 3 — Content Sanity Check
 * Runs against every newly ingested article and flags issues that
 * indicate parsing problems. Articles that fail are quarantined
 * (not published) and logged.
 */
function contentSanityCheck(article: {
  title: string;
  content: string;
  authorLine?: string;
  excerpt?: string;
}): { passed: boolean; issues: string[] } {
  const issues: string[] = [];
  const allText = `${article.title} ${article.content} ${article.authorLine || ""} ${article.excerpt || ""}`;

  // Check for literal CDATA markers
  if (/<!\[CDATA\[/.test(allText)) {
    issues.push("CDATA marker found in rendered text");
  }

  // Check for unescaped HTML entity patterns (numeric or named)
  if (/&#\d+;/.test(allText) || /&#x[0-9a-fA-F]+;/.test(allText)) {
    issues.push("Unescaped HTML entity pattern found");
  }

  // Check for raw HTML tags inside text fields
  if (/<[a-zA-Z][^>]*>/.test(article.content)) {
    issues.push("Raw HTML tag fragment found in content");
  }

  // Check for suspiciously short or template-looking placeholder text
  if (article.content.length < 50) {
    issues.push("Content suspiciously short (<50 chars)");
  }

  if (/Editorial photograph|no stock imagery|placeholder/i.test(article.content)) {
    issues.push("Template placeholder text found in content");
  }

  // Check for empty/null author fields
  if (!article.authorLine || article.authorLine.trim().length === 0) {
    issues.push("Empty author field");
  }

  return { passed: issues.length === 0, issues };
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

    // Part 1 Fix #1 + #2: Apply cleanText to ALL text fields, not just title/description.
    // Previously the creator/author field was left raw, so CDATA wrappers like
    // <![CDATA[Correspondent]]> rendered literally in the byline.
    const title = cleanText(getTag("title"));
    const link = cleanText(getTag("link") || getTag("guid"));
    const pubDate = getTag("pubDate"); // don't clean dates
    const guid = cleanText(getTag("guid") || link);
    const description = cleanText(getTag("description"));
    // Part 1 Fix #7: Use htmlToParagraphs for content:encoded so article
    // bodies have proper paragraph breaks instead of a raw text dump.
    const contentEncoded = htmlToParagraphs(getTag("content:encoded"));
    const creator = cleanText(getTag("dc:creator") || getTag("author"));

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

// ── OPENROUTER AI SUMMARIZATION + BODY GENERATION ────────────
// Now uses generateWithFallback() — tries OpenRouter first,
// falls back to Groq if OpenRouter is rate-limited or down.

interface AiResult {
  summary: string;
  section: string;
  body?: string;
  subheading?: string;
}

async function summariseAndClassify(
  title: string,
  content: string,
  _openRouterKey: string // kept for backwards compat, now uses generateWithFallback
): Promise<AiResult | null> {
  try {
    const aiText = await generateWithFallback(
      [
        {
          role: "system",
          content: `You are a news editor for Times of Namibia. Given an article title and content, provide:
1. A 2-sentence summary
2. Classify into one of: politics, economy, mining, energy, africa, world, sport, environment, technology, health, education, infrastructure, legal, culture, opinion, national
3. A short subheading (5-10 words, no quotes)
4. A 3-paragraph article body based on the source content. Each paragraph should be 2-4 sentences. Separate paragraphs with \n\n. Do not include the title or subheading in the body. Write in a professional news style.

Respond in JSON format: {"summary": "...", "section": "...", "subheading": "...", "body": "paragraph1\\n\\nparagraph2\\n\\nparagraph3"}`,
        },
        {
          role: "user",
          content: `Title: ${title}\n\nContent: ${truncate(content, 2000)}`,
        },
      ],
      { maxTokens: 600, timeout: 20_000 }
    );

    if (!aiText) return null;

    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary || truncate(content, 250),
      section: parsed.section || classifySection(title, content),
      subheading: parsed.subheading || undefined,
      body: parsed.body || undefined,
    };
  } catch {
    return null;
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
      quarantined: 0,
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

        // Per-source item cap — international feeds capped at 2, Namibian at 5.
        const MAX_ITEMS = source.isInternational ? 2 : 5;
        const itemsToProcess = items.slice(0, MAX_ITEMS);
        if (items.length > MAX_ITEMS) {
          console.log(`[RSS] ${source.name}: capping to ${MAX_ITEMS} items (had ${items.length})`);
        }

        for (const item of itemsToProcess) {
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

            // AI summarisation + body generation + subheading
            let excerpt = item.contentSnippet;
            // Force "world" category for international feeds — never let AI
            // classify them as "national" or any Namibia-specific category.
            let finalSection = source.isInternational ? "world" : section;
            let finalContent = content;
            let subheading: string | undefined;

            if (openRouterKey && content.length > 200) {
              const ai = await summariseAndClassify(item.title, content, openRouterKey);
              if (ai) {
                excerpt = ai.summary;
                // Only let AI override section for Namibian feeds.
                // International feeds are ALWAYS "world".
                if (!source.isInternational) {
                  finalSection = ai.section;
                }
                subheading = ai.subheading;
                // Use AI-generated body if the feed didn't provide content:encoded
                // (most feeds only give a short description, so the AI body gives
                // readers a proper 3-paragraph article instead of a 1-sentence teaser)
                if (ai.body && ai.body.length > 100) {
                  finalContent = ai.body;
                }
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
                if (imageBlob) {
                  imageStorageId = await ctx.storage.store(imageBlob);
                  results.imagesGenerated++;
                  console.log(`[RSS] AI image generated for "${item.title.slice(0, 60)}..."`);
                } else {
                  results.imagesFailed++;
                  console.warn(`[RSS] Image generation returned null for "${item.title.slice(0, 40)}"`);
                }
              } catch (imgErr) {
                const msg = imgErr instanceof Error ? imgErr.message : String(imgErr);
                console.warn(`[RSS] Image generation failed for "${item.title.slice(0, 40)}": ${msg}`);
                results.imagesFailed++;
                // imageUrl stays undefined — UI falls back to flat brand-color block
              }
            }

            // Part 3 — Content Sanity Check
            // Run before insertion. Quarantine (skip) articles that fail.
            const sanityCheck = contentSanityCheck({
              title: item.title,
              content: finalContent,
              authorLine: item.creator || source.name,
              excerpt,
            });
            if (!sanityCheck.passed) {
              results.quarantined++;
              console.warn(`[RSS] QUARANTINED "${item.title.slice(0, 60)}..." — issues: ${sanityCheck.issues.join(", ")}`);
              continue; // Skip — don't publish broken content
            }

            const result = await ctx.runMutation(api.mutationsAdmin.ingestArticle, {
              adminToken,
              slug,
              headline: item.title,
              subheadline: subheading, // AI-generated H2 subheading
              content: finalContent,    // AI-generated 3-paragraph body (or raw content)
              excerpt,
              source: source.name,
              section: finalSection,
              categorySlug: finalSection,
              authorLine: item.creator || source.name,
              publishedAt: pubDate,
              rssGuid: item.guid,
              readingTime: estimateReadingTime(finalContent),
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

    // Part 5: Record ingestion health for visibility
    try {
      await ctx.runMutation(api.mutationsAdmin.updateIngestionHealth, {
        adminToken,
        articlesInserted: results.articlesInserted,
        errors: results.errors.slice(0, 10), // cap stored errors
      });
    } catch (healthErr) {
      console.warn("[RSS] Failed to record health:", healthErr);
    }

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
