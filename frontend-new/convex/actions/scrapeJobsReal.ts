// ============================================================
// Times of Namibia - Jobs Scraper (Section 4)
//
// Scrapes real job listings from Namibian job portals:
//   - nieis.namibiaatwork.gov.na (NIEIS - Ministry of Labour)
//   - namijob.com (private job board)
//   - jobsnamibia.net (private job board)
//
// No AI rewriting - just structured extraction.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";

interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  url: string;
  closingDate?: number;
  salary?: string;
  type?: string;
}

function parseDate(dateStr: string): number | undefined {
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.getTime();
  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };
  const m = dateStr.toLowerCase().match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (m && months[m[2].substring(0, 3)]) {
    return new Date(parseInt(m[3]), months[m[2].substring(0, 3)], parseInt(m[1])).getTime();
  }
  return undefined;
}

// ── SOURCE DEFINITIONS ───────────────────────────────────────

const SOURCES = [
  {
    name: "NIEIS (Namibia at Work)",
    url: "https://nieis.namibiaatwork.gov.na",
    entity: "NIEIS - Ministry of Labour",
  },
  {
    name: "Namijob",
    url: "https://www.namijob.com",
    entity: "Namijob",
  },
  {
    name: "Jobs Namibia",
    url: "https://www.jobsnamibia.net",
    entity: "Jobs Namibia",
  },
];

// ── INDIVIDUAL SOURCE SCRAPER ────────────────────────────────

async function scrapeSource(source: typeof SOURCES[0]): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = [];

  try {
    console.log(`[jobs] Fetching ${source.name}...`);

    // Try common job listing paths
    const urlsToTry = [
      source.url,
      `${source.url}/jobs`,
      `${source.url}/vacancies`,
      `${source.url}/search`,
    ];

    let html = "";
    let fetched = false;

    for (const tryUrl of urlsToTry) {
      try {
        const res = await fetch(tryUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml",
          },
          signal: AbortSignal.timeout(15_000),
          redirect: "follow",
        });

        if (res.ok) {
          html = await res.text();
          fetched = true;
          break;
        }
      } catch {
        // Try next URL
      }
    }

    if (!fetched) {
      console.warn(`[jobs] ${source.name}: could not fetch any URL`);
      return [];
    }

    // Extract job listings - try multiple patterns

    // Pattern 1: Job cards/divs
    const cardPatterns = [
      /<div[^>]*class="[^"]*(?:job|vacancy|listing|position)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      /<article[^>]*>[\s\S]*?<\/article>/gi,
      /<li[^>]*class="[^"]*(?:job|vacancy)[^"]*"[^>]*>[\s\S]*?<\/li>/gi,
    ];

    for (const pattern of cardPatterns) {
      const matches = html.match(pattern) || [];
      for (const card of matches.slice(0, 20)) {
        const text = card.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        const titleMatch = card.match(/<h[1-4][^>]*>([^<]+)<\/h[1-4]>/i);
        const linkMatch = card.match(/href="([^"]*)"/i);
        const dateMatch = text.match(/(?:closing|deadline|apply\s+by)[:\s]+(\d{1,2}\s+\w+\s+\d{4})/i);
        const locationMatch = text.match(/(?:location|based\s+in)[:\s]+([^,\n]+)/i);
        const salaryMatch = text.match(/(?:salary|remuneration)[:\s]+(NAD\s+[\d,.]+)/i);

        const title = titleMatch ? titleMatch[1].trim() : text.slice(0, 100).trim();

        if (title.length > 10 && title.length < 200) {
          jobs.push({
            title: title.slice(0, 200),
            company: source.entity,
            location: locationMatch ? locationMatch[1].trim() : "Namibia",
            url: linkMatch ? new URL(linkMatch[1], source.url).href : source.url,
            closingDate: dateMatch ? parseDate(dateMatch[1]) : undefined,
            salary: salaryMatch ? salaryMatch[1] : undefined,
          });
        }
      }

      if (jobs.length > 0) break; // use first pattern that yields results
    }

    // Pattern 2: Table-based listings
    if (jobs.length === 0) {
      const tableRows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
      for (const row of tableRows.slice(0, 20)) {
        const cells = row.match(/<t[d][^>]*>([\s\S]*?)<\/t[d]>/gi) || [];
        if (cells.length >= 2) {
          const title = cells[0].replace(/<[^>]*>/g, "").trim();
          const linkMatch = row.match(/href="([^"]*)"/i);

          if (title.length > 10 && !title.toLowerCase().includes("title")) {
            jobs.push({
              title: title.slice(0, 200),
              company: source.entity,
              location: "Namibia",
              url: linkMatch ? new URL(linkMatch[1], source.url).href : source.url,
            });
          }
        }
      }
    }

    console.log(`[jobs] ${source.name}: extracted ${jobs.length} jobs`);
  } catch (err) {
    console.warn(`[jobs] ${source.name} failed: ${err instanceof Error ? err.message : err}`);
  }

  return jobs;
}

// ── TAVILY FALLBACK ──────────────────────────────────────────

async function searchTavilyForJobs(): Promise<ScrapedJob[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: "Namibia jobs vacancies 2026 site:nieis.namibiaatwork.gov.na OR site:namijob.com OR site:jobsnamibia.net",
        max_results: 10,
        search_depth: "basic",
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) return [];
    const data = await res.json();

    return (data.results || []).map((r: any) => ({
      title: r.title || "Job Vacancy",
      company: "Namibia",
      location: "Namibia",
      url: r.url,
    }));
  } catch (err) {
    console.warn(`[jobs] Tavily search failed: ${err instanceof Error ? err.message : err}`);
    return [];
  }
}

// ── MAIN ACTION ──────────────────────────────────────────────

export const scrapeJobs = internalAction({
  args: {},
  handler: async (ctx) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) {
      return { error: "CONVEX_ADMIN_TOKEN not configured" };
    }

    console.log("[jobs] Starting scrape from job portals...");

    // Scrape all 3 sources in parallel
    const results = await Promise.allSettled(SOURCES.map((s) => scrapeSource(s)));

    let allJobs: ScrapedJob[] = [];
    let sourcesSucceeded = 0;

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (r.status === "fulfilled" && r.value.length > 0) {
        allJobs = allJobs.concat(r.value);
        sourcesSucceeded++;
        console.log(`[jobs] ${SOURCES[i].name}: ${r.value.length} jobs`);
      } else {
        console.warn(`[jobs] ${SOURCES[i].name}: no data extracted`);
      }
    }

    // If direct scraping failed, try Tavily
    if (allJobs.length === 0) {
      console.log("[jobs] Direct scraping returned nothing, trying Tavily...");
      allJobs = await searchTavilyForJobs();
    }

    // Dedupe by title
    const seen = new Set<string>();
    const unique = allJobs.filter((j) => {
      const key = j.title.toLowerCase().slice(0, 80);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`[jobs] Total: ${unique.length} unique jobs from ${sourcesSucceeded} sources`);

    // Upsert to Convex
    let inserted = 0;
    let deduped = 0;
    for (const job of unique) {
      try {
        const result = await ctx.runMutation(api.mutationsAdmin.ingestJob, {
          adminToken,
          title: job.title,
          company: job.company,
          location: job.location,
          source: job.company,
          url: job.url,
          salary: job.salary,
          type: job.type,
          closingDate: job.closingDate,
        });
        if (result.deduped) deduped++;
        else inserted++;
      } catch (err) {
        console.warn(`[jobs] Upsert failed for "${job.title.slice(0, 40)}": ${err instanceof Error ? err.message : err}`);
      }
    }

    console.log(`[jobs] Complete: ${inserted} inserted, ${deduped} deduped`);
    return {
      sourcesSucceeded,
      totalFound: unique.length,
      inserted,
      deduped,
    };
  },
});

// Manual trigger
export const triggerScrapeJobs = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.scrapeJobsReal.scrapeJobs, {});
  },
});
