// ============================================================
// Times of Namibia - Tenders Scraper (Section 3)
//
// Scrapes real tender listings from Namibian government portals:
//   - eprocurement.gov.na (Public Procurement Portal)
//   - opm.gov.na/procurement (Office of the Prime Minister)
//   - mfpe.gov.na/procurement (Ministry of Finance)
//   - op.gov.na/procurement (Office of the President)
//
// Uses fetch + cheerio-style regex parsing (no Playwright needed
// for server-rendered gov portals). Falls back to Tavily search
// if direct scraping fails.
//
// No AI rewriting - just structured extraction.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";

interface ScrapedTender {
  title: string;
  entity: string;
  deadline: number;
  url: string;
  estimatedValue?: string;
  category?: string;
}

// ── HTML PARSER (lightweight, no cheerio dependency) ─────────

function extractText(html: string, selector: string): string {
  // Simple regex-based extraction for common patterns
  const regex = new RegExp(`<[^>]*class="[^"]*${selector}[^"]*"[^>]*>([\\s\\S]*?)</`, "i");
  const match = html.match(regex);
  return match ? match[1].replace(/<[^>]*>/g, "").trim() : "";
}

function extractAllMatches(html: string, pattern: RegExp): string[] {
  const matches: string[] = [];
  let match;
  while ((match = pattern.exec(html)) !== null) {
    matches.push(match[1].trim());
  }
  return matches;
}

function parseDate(dateStr: string): number {
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.getTime();
  // Try common Namibian date formats
  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    january: 0, february: 1, march: 2, april: 3, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  };
  const m = dateStr.toLowerCase().match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (m && months[m[2]]) {
    return new Date(parseInt(m[3]), months[m[2]], parseInt(m[1])).getTime();
  }
  return Date.now() + 30 * 24 * 60 * 60 * 1000; // default 30 days
}

// ── INDIVIDUAL SOURCE SCRAPERS ───────────────────────────────

const SOURCES = [
  {
    name: "Namibia eProcurement Portal",
    url: "https://www.eprocurement.gov.na/tenders",
    entity: "Ministry of Finance - eProcurement",
  },
  {
    name: "Office of the Prime Minister - Procurement",
    url: "https://www.opm.gov.na/procurement",
    entity: "Office of the Prime Minister",
  },
  {
    name: "Ministry of Finance - Procurement",
    url: "https://www.mofpe.gov.na/procurement",
    entity: "Ministry of Finance",
  },
  {
    name: "Office of the President - Procurement",
    url: "https://www.op.gov.na/procurement",
    entity: "Office of the President",
  },
];

async function scrapeSource(source: typeof SOURCES[0]): Promise<ScrapedTender[]> {
  const tenders: ScrapedTender[] = [];

  try {
    console.log(`[tenders] Fetching ${source.name}...`);
    const res = await fetch(source.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15_000),
      redirect: "follow",
    });

    if (!res.ok) {
      console.warn(`[tenders] ${source.name} returned HTTP ${res.status}`);
      return [];
    }

    const html = await res.text();

    // Extract tender listings - try multiple patterns
    // Pattern 1: Table rows with tender info
    const tableRows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
    for (const row of tableRows.slice(0, 20)) {
      const cells = row.match(/<t[d][^>]*>([\s\S]*?)<\/t[d]>/gi) || [];
      if (cells.length >= 2) {
        const title = (cells[0] || "").replace(/<[^>]*>/g, "").trim();
        const deadlineText = cells[cells.length - 1].replace(/<[^>]*>/g, "").trim();
        const linkMatch = row.match(/href="([^"]*)"/i);

        if (title.length > 10 && !title.toLowerCase().includes("title") && !title.toLowerCase().includes("header")) {
          tenders.push({
            title: title.slice(0, 200),
            entity: source.entity,
            deadline: parseDate(deadlineText),
            url: linkMatch ? new URL(linkMatch[1], source.url).href : source.url,
            category: "government",
          });
        }
      }
    }

    // Pattern 2: Div/card-based listings
    if (tenders.length === 0) {
      const cardMatches = html.match(/<div[^>]*class="[^"]*(?:tender|bid|procurement|notice)[^"]*"[^>]*>[\s\S]*?<\/div>/gi) || [];
      for (const card of cardMatches.slice(0, 15)) {
        const title = card.replace(/<[^>]*>/g, "").trim().slice(0, 200);
        const linkMatch = card.match(/href="([^"]*)"/i);
        const dateMatch = card.match(/(\d{1,2}\s+\w+\s+\d{4})/i);

        if (title.length > 10) {
          tenders.push({
            title,
            entity: source.entity,
            deadline: dateMatch ? parseDate(dateMatch[1]) : Date.now() + 30 * 24 * 60 * 60 * 1000,
            url: linkMatch ? new URL(linkMatch[1], source.url).href : source.url,
            category: "government",
          });
        }
      }
    }

    // Pattern 3: Link-based (list of tender links)
    if (tenders.length === 0) {
      const linkPattern = /<a[^>]*href="([^"]*(?:tender|bid|procurement|notice)[^"]*)"[^>]*>([^<]+)<\/a>/gi;
      const links = extractAllMatches(html, linkPattern);
      for (const linkText of links.slice(0, 10)) {
        if (linkText.length > 10) {
          tenders.push({
            title: linkText.slice(0, 200),
            entity: source.entity,
            deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
            url: source.url,
            category: "government",
          });
        }
      }
    }

    console.log(`[tenders] ${source.name}: extracted ${tenders.length} tenders`);
  } catch (err) {
    console.warn(`[tenders] ${source.name} failed: ${err instanceof Error ? err.message : err}`);
  }

  return tenders;
}

// ── TAVILY FALLBACK ──────────────────────────────────────────

async function searchTavilyForTenders(): Promise<ScrapedTender[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: "Namibia government tenders procurement 2026 site:gov.na",
        max_results: 10,
        search_depth: "basic",
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) return [];
    const data = await res.json();

    return (data.results || []).map((r: any) => ({
      title: r.title || "Government Tender",
      entity: "Government of Namibia",
      deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
      url: r.url,
      category: "government",
    }));
  } catch (err) {
    console.warn(`[tenders] Tavily search failed: ${err instanceof Error ? err.message : err}`);
    return [];
  }
}

// ── MAIN ACTION ──────────────────────────────────────────────

export const scrapeTenders = internalAction({
  args: {},
  handler: async (ctx) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) {
      return { error: "CONVEX_ADMIN_TOKEN not configured" };
    }

    console.log("[tenders] Starting scrape from government sources...");

    // Scrape all 4 sources in parallel
    const results = await Promise.allSettled(SOURCES.map((s) => scrapeSource(s)));

    let allTenders: ScrapedTender[] = [];
    let sourcesSucceeded = 0;

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (r.status === "fulfilled" && r.value.length > 0) {
        allTenders = allTenders.concat(r.value);
        sourcesSucceeded++;
        console.log(`[tenders] ${SOURCES[i].name}: ${r.value.length} tenders`);
      } else {
        console.warn(`[tenders] ${SOURCES[i].name}: no data extracted`);
      }
    }

    // If direct scraping failed, try Tavily
    if (allTenders.length === 0) {
      console.log("[tenders] Direct scraping returned nothing, trying Tavily...");
      allTenders = await searchTavilyForTenders();
    }

    // Dedupe by title
    const seen = new Set<string>();
    const unique = allTenders.filter((t) => {
      const key = t.title.toLowerCase().slice(0, 80);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`[tenders] Total: ${unique.length} unique tenders from ${sourcesSucceeded} sources`);

    // Upsert to Convex
    let inserted = 0;
    let deduped = 0;
    for (const tender of unique) {
      try {
        const result = await ctx.runMutation(api.mutationsAdmin.ingestTender, {
          adminToken,
          docId: tender.url,
          title: tender.title,
          department: tender.entity,
          deadline: tender.deadline,
          estimatedValue: tender.estimatedValue,
          documentUrl: tender.url,
          status: "open",
        });
        if (result.deduped) deduped++;
        else inserted++;
      } catch (err) {
        console.warn(`[tenders] Upsert failed for "${tender.title.slice(0, 40)}": ${err instanceof Error ? err.message : err}`);
      }
    }

    console.log(`[tenders] Complete: ${inserted} inserted, ${deduped} deduped`);
    return {
      sourcesSucceeded,
      totalFound: unique.length,
      inserted,
      deduped,
    };
  },
});

// Manual trigger
export const triggerScrapeTenders = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.scrapeTendersReal.scrapeTenders, {});
  },
});
