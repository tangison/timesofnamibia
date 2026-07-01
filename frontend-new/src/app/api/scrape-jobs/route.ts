// ============================================================
// Times of Namibia - /api/scrape-jobs (Phase 2, Iteration 12)
//
// Hybrid Playwright + Search API scraper for Namibian jobs and
// tenders. Runs in the Node.js runtime (not edge).
//
// Step 1: Use Tavily Search API to discover live links for
//         "Namibia government tenders" and "Namibia jobs"
// Step 2: Launch Playwright to render JS-heavy portals
// Step 3: Extract title, entity, deadline, url, type
// Step 4: Upsert into Convex jobs and tender tables
//
// Triggered by Convex cron every 12 hours via HTTP endpoint,
// or manually via POST /api/scrape-jobs
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright-core";
import { convexClient } from "@/lib/convex";
import { api } from "@convex/_generated/api";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes max

interface ScrapedItem {
  title: string;
  entity: string;
  deadline?: string;
  url: string;
  type: "job" | "tender";
  location?: string;
  estimatedValue?: string;
}

// ── TAVILY SEARCH ────────────────────────────────────────────

async function searchTavily(query: string, maxResults = 8): Promise<{ title: string; url: string; content: string }[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.warn("[scrape-jobs] TAVILY_API_KEY not set");
    return [];
  }

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: maxResults,
        include_raw_content: false,
        search_depth: "basic",
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      console.warn(`[scrape-jobs] Tavily returned ${res.status}`);
      return [];
    }

    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      title: r.title || "",
      url: r.url || "",
      content: r.content || "",
    }));
  } catch (err) {
    console.warn("[scrape-jobs] Tavily search failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

// ── PLAYWRIGHT SCRAPER ───────────────────────────────────────

async function scrapeWithPlaywright(urls: { url: string; type: "job" | "tender" }[]): Promise<ScrapedItem[]> {
  const items: ScrapedItem[] = [];

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    for (const { url, type } of urls.slice(0, 6)) {
      const page = await browser.newPage();
      try {
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20_000 });
        await page.waitForTimeout(2000); // allow JS to render

        // Extract items from the page - look for common job/tender patterns
        const pageItems = await page.evaluate((pageType: string) => {
          const results: { title: string; url: string; deadline?: string; entity?: string; location?: string; estimatedValue?: string }[] = [];

          // Try multiple selectors for job/tender listings
          const selectors = [
            "article", ".job-item", ".tender-item", ".listing",
            ".vacancy", ".procurement", ".card", "tr",
            "[class*='job']", "[class*='tender']", "[class*='vacancy']",
          ];

          for (const sel of selectors) {
            const elements = document.querySelectorAll(sel);
            if (elements.length === 0) continue;

            elements.forEach((el, idx) => {
              if (idx >= 10) return; // limit per page
              const text = el.textContent || "";
              const link = el.querySelector("a");
              const title = (el.querySelector("h1, h2, h3, h4, .title, strong") as HTMLElement)?.textContent?.trim() || text.slice(0, 120).trim();
              const href = link?.href || "";

              if (!title || title.length < 5) return;

              // Try to extract deadline from text
              const deadlineMatch = text.match(/(?:closing|deadline|apply\s+by)[:\s]+(\d{1,2}\s+\w+\s+\d{4})/i);
              const valueMatch = text.match(/(?:NAD|N\$)\s*[\d,.]+/i);
              const locationMatch = text.match(/(?:location|based\s+in)[:\s]+([^,\n]+)/i);

              results.push({
                title: title.slice(0, 200),
                url: href || window.location.href,
                deadline: deadlineMatch?.[1],
                entity: window.location.hostname.replace("www.", ""),
                location: locationMatch?.[1]?.trim(),
                estimatedValue: valueMatch?.[0],
              });
            });

            if (results.length > 0) break; // use first selector that yields results
          }

          return results;
        }, type);

        for (const item of pageItems) {
          items.push({
            title: item.title,
            entity: item.entity || new URL(url).hostname,
            deadline: item.deadline,
            url: item.url || url,
            type,
            location: item.location,
            estimatedValue: item.estimatedValue,
          });
        }

        console.log(`[scrape-jobs] Scraped ${pageItems.length} items from ${url}`);
      } catch (err) {
        console.warn(`[scrape-jobs] Failed to scrape ${url}:`, err instanceof Error ? err.message : err);
      } finally {
        await page.close();
      }
    }
  } catch (err) {
    console.error("[scrape-jobs] Playwright launch failed:", err instanceof Error ? err.message : err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return items;
}

// ── UPSERT TO CONVEX ─────────────────────────────────────────

async function upsertToConvex(items: ScrapedItem[]): Promise<{ jobs: number; tenders: number }> {
  if (!convexClient) {
    console.warn("[scrape-jobs] Convex client not configured");
    return { jobs: 0, tenders: 0 };
  }

  const adminToken = process.env.CONVEX_ADMIN_TOKEN;
  if (!adminToken) {
    console.warn("[scrape-jobs] CONVEX_ADMIN_TOKEN not set");
    return { jobs: 0, tenders: 0 };
  }

  let jobsInserted = 0;
  let tendersInserted = 0;

  for (const item of items) {
    try {
      if (item.type === "tender") {
        const deadline = item.deadline ? new Date(item.deadline).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000;
        await convexClient.mutation(api.mutationsAdmin.ingestTender, {
          adminToken,
          docId: item.url,
          title: item.title,
          department: item.entity,
          deadline,
          estimatedValue: item.estimatedValue,
          documentUrl: item.url,
          status: "open",
        });
        tendersInserted++;
      } else {
        const deadline = item.deadline ? new Date(item.deadline).getTime() : undefined;
        await convexClient.mutation(api.mutationsAdmin.ingestJob, {
          adminToken,
          title: item.title,
          company: item.entity,
          location: item.location || "Namibia",
          source: item.entity,
          url: item.url,
          closingDate: deadline,
        });
        jobsInserted++;
      }
    } catch (err) {
      console.warn(`[scrape-jobs] Upsert failed for "${item.title.slice(0, 40)}":`, err instanceof Error ? err.message : err);
    }
  }

  return { jobs: jobsInserted, tenders: tendersInserted };
}

// ── MAIN HANDLER ─────────────────────────────────────────────

export async function POST(_request: NextRequest) {
  console.log("[scrape-jobs] Starting hybrid search + Playwright scrape...");

  // Step 1: Search API discovery
  const [tenderUrls, jobUrls] = await Promise.all([
    searchTavily("Namibia government tenders site:gov.na OR site:mof.gov.na OR site:eprocurement.gov.na", 6),
    searchTavily("Namibia jobs site:vacancymail.co.na OR site:gov.na OR site:nipam.gov.na", 6),
  ]);

  console.log(`[scrape-jobs] Found ${tenderUrls.length} tender URLs, ${jobUrls.length} job URLs`);

  // Step 2: Playwright scrape
  const urlsToScrape = [
    ...tenderUrls.map((r) => ({ url: r.url, type: "tender" as const })),
    ...jobUrls.map((r) => ({ url: r.url, type: "job" as const })),
  ];

  const scrapedItems = await scrapeWithPlaywright(urlsToScrape);
  console.log(`[scrape-jobs] Scraped ${scrapedItems.length} total items`);

  // Step 3: Upsert to Convex
  const result = await upsertToConvex(scrapedItems);

  console.log(`[scrape-jobs] Complete: ${result.jobs} jobs, ${result.tenders} tenders inserted`);

  return NextResponse.json({
    success: true,
    discoveredUrls: { tenders: tenderUrls.length, jobs: jobUrls.length },
    scraped: scrapedItems.length,
    inserted: result,
  });
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Scrape endpoint. Send POST to trigger.",
  });
}
