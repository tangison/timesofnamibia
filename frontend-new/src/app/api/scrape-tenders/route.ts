// ============================================================
// Times of Namibia - Puppeteer Tender Scraper (Part 1)
//
// Uses @sparticuz/chromium + puppeteer-core to render JS-heavy
// government procurement portals and extract real tender listings.
// puppeteer-core doesn't need browsers.json (unlike playwright-core).
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { convexClient } from "@/lib/convex";
import { api } from "@convex/_generated/api";

export const runtime = "nodejs";
export const maxDuration = 300;

interface ScrapedTender {
  title: string;
  entity: string;
  deadline: string;
  url: string;
  referenceNumber?: string;
  estimatedValue?: string;
}

const TENDER_SOURCES = [
  { name: "Namibia eProcurement Portal", url: "https://www.eprocurement.gov.na", searchPaths: ["/tenders", "/bid-adverts", "/open-bids"], entity: "Ministry of Finance - eProcurement" },
  { name: "Office of the Prime Minister", url: "https://www.opm.gov.na", searchPaths: ["/procurement", "/tenders"], entity: "Office of the Prime Minister" },
  { name: "Ministry of Finance", url: "https://www.mofpe.gov.na", searchPaths: ["/procurement", "/tenders"], entity: "Ministry of Finance" },
  { name: "Office of the President", url: "https://www.op.gov.na", searchPaths: ["/procurement", "/tenders"], entity: "Office of the President" },
];

async function launchBrowser() {
  // TECH DEBT: @sparticuz/chromium is pinned to v121 because v149+ changed the
  // export API (class-based). Review in 1-2 months for security updates or
  // migration to the new API. See package.json for the pin.
  const chromium: any = require("@sparticuz/chromium");
  // Use eval to prevent Vercel's bundler from transforming the require
  const puppeteer: any = (0, eval)("require")("puppeteer-core");
  const executablePath = await chromium.executablePath();
  return await puppeteer.launch({
    executablePath,
    args: chromium.args,
    headless: "new",
  });
}

async function scrapeSource(browser: any, source: typeof TENDER_SOURCES[0]): Promise<ScrapedTender[]> {
  const tenders: ScrapedTender[] = [];

  for (const searchPath of source.searchPaths) {
    const url = `${source.url}${searchPath}`;
    let page;
    try {
      page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on("request", (req: any) => {
        const type = req.resourceType();
        if (["image", "font", "stylesheet", "media"].includes(type)) req.abort();
        else req.continue();
      });
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
      if (!res || !res.ok()) { await page.close(); continue; }
      await new Promise(r => setTimeout(r, 3000));

      const items = await page.evaluate((entity: string) => {
        const results: { title: string; url: string; deadline: string; ref?: string; value?: string }[] = [];
        const rows = document.querySelectorAll("table tr, .tender-item, .bid-item, .listing-item, article, .card");
        rows.forEach((row, idx) => {
          if (idx >= 15) return;
          const text = (row.textContent || "").trim();
          if (text.length < 15) return;
          const link = row.querySelector("a");
          const heading = row.querySelector("h1, h2, h3, h4, .title, strong");
          const title = heading?.textContent?.trim() || text.slice(0, 150).trim();
          if (!title || title.length < 10) return;
          const dateMatch = text.match(/(?:closing|deadline|closes?\s+on)[:\s]+(\d{1,2}\s+\w+\s+\d{4})/i);
          const dateMatch2 = text.match(/(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i);
          const refMatch = text.match(/(?:tender|bid|rfq|rfp)\s*(?:no|number|#)?[:\s]*([A-Z0-9\/\-]{4,20})/i);
          const valueMatch = text.match(/(?:NAD|N\$)\s*[\d,.]+/i);
          results.push({ title: title.slice(0, 200), url: link?.href || window.location.href, deadline: dateMatch?.[1] || dateMatch2?.[1] || "", ref: refMatch?.[1], value: valueMatch?.[0] });
        });
        return results;
      }, source.entity);

      for (const item of items) {
        if (item.title.length < 10) continue;
        const titleLower = item.title.toLowerCase();
        if (titleLower.includes("portal ariel")) continue;
        if (titleLower.includes("procurement") && titleLower.length < 25) continue;
        tenders.push({ title: item.title, entity: source.entity, deadline: item.deadline, url: item.url || url, referenceNumber: item.ref, estimatedValue: item.value });
      }

      if (tenders.length > 0) { console.log(`[scrape-tenders] ${source.name} ${searchPath}: ${tenders.length} tenders`); break; }
    } catch (err) {
      console.warn(`[scrape-tenders] ${source.name} ${searchPath} failed: ${err instanceof Error ? err.message : err}`);
    } finally {
      if (page) await page.close();
    }
  }
  return tenders;
}

async function upsertToConvex(tenders: ScrapedTender[]) {
  if (!convexClient) return { inserted: 0, deduped: 0 };
  const adminToken = process.env.CONVEX_ADMIN_TOKEN;
  if (!adminToken) return { inserted: 0, deduped: 0 };
  let inserted = 0, deduped = 0;
  for (const t of tenders) {
    try {
      const deadline = t.deadline ? new Date(t.deadline).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000;
      const result = await convexClient.mutation(api.mutationsAdmin.ingestTender, { adminToken, docId: t.url, title: t.title, department: t.entity, deadline, estimatedValue: t.estimatedValue, documentUrl: t.url, status: "open" });
      if (result.deduped) deduped++; else inserted++;
    } catch (err) { console.warn(`[scrape-tenders] Upsert failed: ${err instanceof Error ? err.message : err}`); }
  }
  return { inserted, deduped };
}

export async function POST(_request: NextRequest) {
  console.log("[scrape-tenders] Starting Puppeteer scraper...");
  let browser;
  try {
    browser = await launchBrowser();
    const allTenders: ScrapedTender[] = [];
    for (const source of TENDER_SOURCES) {
      const tenders = await scrapeSource(browser, source);
      allTenders.push(...tenders);
    }
    await browser.close(); browser = null;
    const seen = new Set<string>();
    const unique = allTenders.filter(t => { const k = t.title.toLowerCase().slice(0, 80); if (seen.has(k)) return false; seen.add(k); return true; });
    const result = await upsertToConvex(unique);
    return NextResponse.json({ success: true, source: "puppeteer", totalFound: unique.length, inserted: result.inserted, deduped: result.deduped });
  } catch (err) {
    if (browser) await browser.close();
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Unknown error", source: "puppeteer" }, { status: 500 });
  }
}

export async function GET() { return NextResponse.json({ status: "ok", message: "Send POST to trigger." }); }
