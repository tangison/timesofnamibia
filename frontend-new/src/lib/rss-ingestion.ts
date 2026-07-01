// ============================================================
// Times of Namibia - RSS Ingestion Engine
// Fetches RSS/Atom feeds, parses items, creates Articles.
//
// TANGISON Iteration 4 Fix #12 (partial): Article creation now
// dispatches to Convex (api.mutationsAdmin.ingestArticle) when
// NEXT_PUBLIC_CONVEX_URL is set + CONVEX_ADMIN_TOKEN is configured.
// Falls back to Prisma db.article.create() otherwise.
//
// TODO (post-Convex-provisioning): migrate RssFeed + RssItem CRUD
// to Convex as well, then retire Prisma entirely.
// ============================================================

import Parser from "rss-parser";
import { db } from "./db";
import { convexClient } from "@/lib/convex";
import { api } from "@convex/_generated/api";

const CONVEX_ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "TimesOfNamibiaBot/1.0 (+https://ton.na)",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
  customFields: {
    item: [
      ["content:encoded", "contentEncoded"],
      ["dc:creator", "creator"],
      ["media:content", "mediaContent"],
    ],
  },
});

interface IngestionResult {
  feedId: string;
  feedName: string;
  fetched: number;
  newItems: number;
  articlesCreated: number;
  errors: string[];
}

// ── SLUG GENERATOR ────────────────────────────────────────────

function generateSlug(title: string, dateHint?: Date): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "");

  const dateStr = dateHint
    ? `-${dateHint.toISOString().slice(0, 10).replace(/-/g, "")}`
    : `-${Date.now()}`;

  return base + dateStr;
}

// ── EXCERPT GENERATOR ─────────────────────────────────────────

function generateExcerpt(html: string, maxLength: number = 200): string {
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

// ── ESTIMATE READING TIME ─────────────────────────────────────

function estimateReadingTime(text: string): number {
  const words = text.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.round(words / 230));
}

// ── HTML TO PLAIN TEXT (for Article.content) ──────────────────

function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── INGEST A SINGLE FEED ─────────────────────────────────────

export async function ingestFeed(feedId: string): Promise<IngestionResult> {
  const result: IngestionResult = {
    feedId,
    feedName: "",
    fetched: 0,
    newItems: 0,
    articlesCreated: 0,
    errors: [],
  };

  try {
    const feed = await db.rssFeed.findUnique({ where: { id: feedId } });
    if (!feed) {
      result.errors.push(`Feed ${feedId} not found`);
      return result;
    }
    if (!feed.active) {
      result.errors.push(`Feed "${feed.name}" is inactive`);
      return result;
    }

    result.feedName = feed.name;

    // Fetch the RSS feed
    const parsed = await parser.parseURL(feed.url);
    result.fetched = parsed.items.length;

    // Update feed fetch stats
    await db.rssFeed.update({
      where: { id: feedId },
      data: {
        lastFetched: new Date(),
        fetchCount: { increment: 1 },
        errorCount: 0,
        lastError: null,
      },
    });

    // Process each item
    for (const item of parsed.items) {
      try {
        const guid = item.guid || item.link || item.title || `item-${Date.now()}-${Math.random().toString(36).slice(2)}`;

        // Check if we've already seen this item
        const existing = await db.rssItem.findUnique({
          where: { feedId_guid: { feedId, guid } },
        });

        if (existing) continue; // Skip duplicates

        // Store the RSS item
        const rssItem = await db.rssItem.create({
          data: {
            feedId,
            title: item.title || "Untitled",
            link: item.link || "",
            description: item.contentSnippet || item.content?.slice(0, 300) || null,
            content: item.contentEncoded || item.content || item.contentSnippet || "",
            author: item.creator || item["dc:creator"] || null,
            guid,
            pubDate: item.pubDate ? new Date(item.pubDate) : null,
            ingested: false,
          },
        });

        result.newItems++;

        // Auto-create Article from RSS item
        const rawContent = rssItem.content || rssItem.description || "";
        const plainContent = htmlToPlainText(rawContent);

        if (plainContent.length < 50) continue; // Skip very short items

        const slug = generateSlug(rssItem.title, rssItem.pubDate || undefined);

        // TANGISON Iteration 4 Fix #12: prefer Convex admin mutation for article
        // creation when configured. Falls back to Prisma otherwise.
        if (convexClient && CONVEX_ADMIN_TOKEN) {
          try {
            await convexClient.mutation(api.mutationsAdmin.ingestArticle, {
              adminToken: CONVEX_ADMIN_TOKEN,
              slug,
              headline: rssItem.title,
              subheadline: generateExcerpt(rawContent, 180),
              content: plainContent,
              excerpt: generateExcerpt(rawContent, 250),
              source: "rss",
              section: feed.category?.toLowerCase() || "national",
              categorySlug: feed.category?.toLowerCase() || undefined,
              authorLine: rssItem.author || feed.name,
              publishedAt: rssItem.pubDate ? rssItem.pubDate.getTime() : Date.now(),
              rssGuid: guid,
              readingTime: estimateReadingTime(plainContent),
            });
            result.articlesCreated++;
          } catch (err) {
            console.error(`[rss-ingestion] Convex ingest failed for "${rssItem.title}":`, err);
          }
          continue;
        }

        // Fallback: Prisma
        const slugExists = await db.article.findUnique({ where: { slug } });
        if (slugExists) continue;

        const article = await db.article.create({
          data: {
            slug,
            headline: rssItem.title,
            subheadline: generateExcerpt(rawContent, 180),
            content: plainContent,
            excerpt: generateExcerpt(rawContent, 250),
            source: "rss",
            section: feed.category?.toLowerCase() || "national",
            categorySlug: feed.category?.toLowerCase() || null,
            readingTime: estimateReadingTime(plainContent),
            authorLine: rssItem.author || feed.name,
            published: true,
            publishedAt: rssItem.pubDate || new Date(),
            rssFeedId: feedId,
            rssGuid: guid,
            rssFetchedAt: new Date(),
          },
        });

        // Mark RSS item as ingested
        await db.rssItem.update({
          where: { id: rssItem.id },
          data: { ingested: true, articleId: article.id },
        });

        result.articlesCreated++;
      } catch (itemError: unknown) {
        const msg = itemError instanceof Error ? itemError.message : String(itemError);
        result.errors.push(`Item "${item.title?.slice(0, 50)}": ${msg}`);
      }
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    result.errors.push(`Feed fetch error: ${msg}`);

    // Update feed error stats
    await db.rssFeed
      .update({
        where: { id: feedId },
        data: { errorCount: { increment: 1 }, lastError: msg },
      })
      .catch(() => {});
  }

  return result;
}

// ── INGEST ALL ACTIVE FEEDS ──────────────────────────────────

export async function ingestAllFeeds(): Promise<IngestionResult[]> {
  const feeds = await db.rssFeed.findMany({ where: { active: true } });
  const results: IngestionResult[] = [];

  for (const feed of feeds) {
    const result = await ingestFeed(feed.id);
    results.push(result);
    // Small delay between feeds to be respectful
    await new Promise((r) => setTimeout(r, 500));
  }

  return results;
}

// ── ADD A NEW RSS FEED ───────────────────────────────────────

export async function addRssFeed(data: {
  name: string;
  url: string;
  category?: string;
  siteUrl?: string;
  description?: string;
}) {
  // Validate the feed URL by trying to parse it
  try {
    const parsed = await parser.parseURL(data.url);

    return db.rssFeed.create({
      data: {
        name: data.name,
        url: data.url,
        category: data.category || null,
        siteUrl: data.siteUrl || parsed.link || null,
        description: data.description || parsed.description || null,
        active: true,
      },
    });
  } catch (error: unknown) {
    throw new Error(
      `Failed to validate RSS feed at ${data.url}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
