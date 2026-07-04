// ============================================================
// Times of Namibia - Playwright Tender Scraper (Part 1)
//
// Uses @sparticuz/chromium + playwright-core to render JS-heavy
// government procurement portals and extract real tender listings.
//
// Blocks images/fonts/CSS to stay under Vercel Hobby memory limit.
// Called by Convex cron via HTTP.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { convexClient } from "@/lib/convex";
import { api } from "@convex/_generated/api";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 min max

interface ScrapedTender {
  title: string;
  entity: string;
  deadline: string;
  url: string;
  referenceNumber?: string;
  estimatedValue?: string;
}

// ── SOURCE CONFIG ────────────────────────────────────────────

const TENDER_SOURCES = [
  {
    name: "Namibia eProcurement Portal",
    url: "https://www.eprocurement.gov.na",
    searchPaths: ["/tenders", "/bid-adverts", "/open-bids", "/notices"],
    entity: "Ministry of Finance - eProcurement",
  },
  {
    name: "Office of the Prime Minister",
    url: "https://www.opm.gov.na",
    searchPaths: ["/procurement", "/tenders", "/bids"],
    entity: "Office of the Prime Minister",
  },
  {
    name: "Ministry of Finance",
    url: "https://www.mofpe.gov.na",
    searchPaths: ["/procurement", "/tenders", "/bids"],
    entity: "Ministry of Finance",
  },
  {
    name: "Office of the President",
    url: "https://www.op.gov.na",
    searchPaths: ["/procurement", "/tenders", "/bids"],
    entity: "Office of the President",
  },
];

// ── LAUNCH CHROMIUM ──────────────────────────────────────────

async function launchBrowser() {
  // Use require instead of dynamic import to avoid bundling issues
  const chromium: any = require("@sparticuz/chromium");
  const { chromium: playwrightChromium } = require("playwright-core");

  const executablePath = await chromium.executablePath();

  const browser = await playwrightChromium.launch({
    executablePath,
    args: chromium.args,
    headless: chromium.headless,
  });

  return browser;
}

// ── SCRAPE SINGLE SOURCE ─────────────────────────────────────

async function scrapeSource(browser: any, source: typeof TENDER_SOURCES[0]): Promise<ScrapedTender[]> {
  const tenders: ScrapedTender[] = [];

  for (const searchPath of source.searchPaths) {
    const url = `${source.url}${searchPath}`;
    const page = await browser.newPage();

    try {
      // Block images, fonts, CSS to save memory
      await page.route("**/*", (route: any) => {
        const type = route.request().resourceType();
        if (["image", "font", "stylesheet", "media"].includes(type)) {
          route.abort();
        } else {
          route.continue();
        }
      });

      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20_000 });
      if (!res || !res.ok()) continue;

      await page.waitForTimeout(3000); // Allow JS to render

      // Extract tender listings from rendered DOM
      const items = await page.evaluate((entity: string) => {
        const results: { title: string; url: string; deadline: string; ref?: string; value?: string }[] = [];

        // Try table-based listings
        const rows = document.querySelectorAll("table tr, .tender-item, .bid-item, .listing-item, .procurement-item, article, .card");
        rows.forEach((row, idx) => {
          if (idx >= 15) return;
          const text = (row.textContent || "").trim();
          if (text.length < 15) return;

          const link = row.querySelector("a");
          const heading = row.querySelector("h1, h2, h3, h4, h5, .title, .name, strong");

          const title = heading?.textContent?.trim() || text.slice(0, 150).trim();
          if (!title || title.length < 10) return;

          // Extract closing date
          const dateMatch = text.match(/(?:closing|deadline|closes?\s+on)[:\s]+(\d{1,2}\s+\w+\s+\d{4})/i);
          const dateMatch2 = text.match(/(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i);
          const deadline = dateMatch?.[1] || dateMatch2?.[1] || "";

          // Extract reference number
          const refMatch = text.match(/(?:tender|bid|rfq|rfp)\s*(?:no|number|#)?[:\s]*([A-Z0-9\/\-]{4,20})/i);

          // Extract value
          const valueMatch = text.match(/(?:NAD|N\$)\s*[\d,.]+/i);

          const href = link?.href || "";
          results.push({
            title: title.slice(0, 200),
            url: href || window.location.href,
            deadline,
            ref: refMatch?.[1],
            value: valueMatch?.[0],
          });
        });

        return results;
      }, source.entity);

      for (const item of items) {
        // Validation: require at least a title
        if (item.title.length < 10) continue;
        // Reject portal homepage / aggregator patterns
        const titleLower = item.title.toLowerCase();
        if (titleLower.includes("portal ariel")) continue;
        if (titleLower.includes("procurement") && titleLower.length < 25) continue;

        tenders.push({
          title: item.title,
          entity: source.entity,
          deadline: item.deadline || "",
          url: item.url || url,
          referenceNumber: item.ref,
          estimatedValue: item.value,
        });
      }

      if (tenders.length > 0) {
        console.log(`[scrape-tenders] ${source.name} ${searchPath}: ${tenders.length} tenders`);
        break; // Use first path that yields results
      }
    } catch (err) {
      console.warn(`[scrape-tenders] ${source.name} ${searchPath} failed: ${err instanceof Error ? err.message : err}`);
    } finally {
      await page.close();
    }
  }

  return tenders;
}

// ── UPSERT TO CONVEX ─────────────────────────────────────────

async function upsertToConvex(tenders: ScrapedTender[]): Promise<{ inserted: number; deduped: number }> {
  if (!convexClient) return { inserted: 0, deduped: 0 };

  const adminToken = process.env.CONVEX_ADMIN_TOKEN;
  if (!adminToken) return { inserted: 0, deduped: 0 };

  let inserted = 0;
  let deduped = 0;

  for (const tender of tenders) {
    try {
      const deadline = tender.deadline ? new Date(tender.deadline).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000;
      const result = await convexClient.mutation(api.mutationsAdmin.ingestTender, {
        adminToken,
        docId: tender.url,
        title: tender.title,
        department: tender.entity,
        deadline,
        estimatedValue: tender.estimatedValue,
        documentUrl: tender.url,
        status: "open",
      });
      if (result.deduped) deduped++;
      else inserted++;
    } catch (err) {
      console.warn(`[scrape-tenders] Upsert failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  return { inserted, deduped };
}

// ── MAIN HANDLER ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  console.log("[scrape-tenders] Starting Playwright scraper...");

  let browser;
  try {
    browser = await launchBrowser();
    console.log("[scrape-tenders] Browser launched");

    const allTenders: ScrapedTender[] = [];

    for (const source of TENDER_SOURCES) {
      const tenders = await scrapeSource(browser, source);
      allTenders.push(...tenders);
      console.log(`[scrape-tenders] ${source.name}: ${tenders.length} tenders total`);
    }

    await browser.close();
    browser = null;

    // Dedupe by title
    const seen = new Set<string>();
    const unique = allTenders.filter((t) => {
      const key = t.title.toLowerCase().slice(0, 80);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`[scrape-tenders] Total unique: ${unique.length}`);

    const result = await upsertToConvex(unique);

    return NextResponse.json({
      success: true,
      source: "playwright",
      totalFound: unique.length,
      inserted: result.inserted,
      deduped: result.deduped,
    });
  } catch (err) {
    console.error("[scrape-tenders] Playwright failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error", source: "playwright" },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", message: "Send POST to trigger tender scraping." });
}
