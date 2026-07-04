// ============================================================
// Times of Namibia - Puppeteer Job Scraper (Part 1)
//
// Uses @sparticuz/chromium + puppeteer-core to render JS-heavy
// job portals and extract real individual job listings.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { convexClient } from "@/lib/convex";
import { api } from "@convex/_generated/api";

export const runtime = "nodejs";
export const maxDuration = 300;

interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  url: string;
  closingDate?: string;
  salary?: string;
}

const JOB_SOURCES = [
  { name: "NIEIS (Namibia at Work)", url: "https://nieis.namibiaatwork.gov.na", searchPaths: ["/", "/jobs", "/vacancies"], entity: "NIEIS - Ministry of Labour" },
  { name: "Namijob", url: "https://www.namijob.com", searchPaths: ["/", "/jobs", "/search-jobs"], entity: "Namijob" },
  { name: "Jobs Namibia", url: "https://www.jobsnamibia.net", searchPaths: ["/", "/jobs"], entity: "Jobs Namibia" },
];

async function launchBrowser() {
  const chromium: any = require("@sparticuz/chromium");
  // Dynamic import for puppeteer-core - serverExternalPackages config
  // in next.config.ts prevents Vercel from bundling it
  const puppeteerMod: any = await import("puppeteer-core");
  const puppeteer = puppeteerMod.default || puppeteerMod;
  const executablePath = await chromium.executablePath();
  return await puppeteer.launch({ executablePath, args: chromium.args, headless: "new" });
}

function isAggregatorTitle(title: string): boolean {
  const t = title.toLowerCase();
  if (/\d+\s*(vacanc|jobs?|positions?|openings?)/i.test(title)) return true;
  const brands = ["linkedin", "naukri", "indeed", "glassdoor", "careerjet", "jooble", "pnet", "facebook"];
  for (const b of brands) { if (t.includes(b) && title.length < 70) return true; }
  if (/^jobs?\s+(in|namibia)/i.test(title.trim())) return true;
  if (/^namibia\s+(jobs?|vacanc)/i.test(title.trim())) return true;
  if (/^find jobs/i.test(title.trim())) return true;
  if (t.includes("vacancies") && t.includes("recruitment")) return true;
  if (t.includes("namijob.com")) return true;
  return false;
}

async function scrapeSource(browser: any, source: typeof JOB_SOURCES[0]): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = [];
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
        const results: { title: string; url: string; location: string; closingDate?: string; salary?: string; company?: string }[] = [];
        const selectors = [".job-item", ".vacancy-item", ".job-listing", ".job-card", ".position", ".listing-item", "article", ".card", "table tr"];
        for (const sel of selectors) {
          const elements = document.querySelectorAll(sel);
          if (elements.length === 0) continue;
          elements.forEach((el, idx) => {
            if (idx >= 15) return;
            const text = (el.textContent || "").trim();
            if (text.length < 15) return;
            const link = el.querySelector("a");
            const heading = el.querySelector("h1, h2, h3, h4, .title, .job-title, strong");
            const title = heading?.textContent?.trim() || text.slice(0, 120).trim();
            if (!title || title.length < 10) return;
            const locMatch = text.match(/(?:location|based\s+in|city)[:\s]+([^,\n]+)/i);
            const dateMatch = text.match(/(?:closing|deadline|apply\s+by|expires?)[:\s]+(\d{1,2}\s+\w+\s+\d{4})/i);
            const companyMatch = text.match(/(?:company|employer|organization)[:\s]+([^,\n]+)/i);
            const salaryMatch = text.match(/(?:salary|remuneration)[:\s]+(NAD\s+[\d,.]+)/i);
            results.push({ title: title.slice(0, 200), url: link?.href || window.location.href, location: locMatch?.[1]?.trim() || "Namibia", closingDate: dateMatch?.[1], salary: salaryMatch?.[1], company: companyMatch?.[1]?.trim() || entity });
          });
          if (results.length > 0) break;
        }
        return results;
      }, source.entity);

      for (const item of items) {
        if (isAggregatorTitle(item.title)) continue;
        if (item.title.length < 10) continue;
        jobs.push({ title: item.title, company: item.company || source.entity, location: item.location || "Namibia", url: item.url || url, closingDate: item.closingDate, salary: item.salary });
      }
      if (jobs.length > 0) { console.log(`[scrape-jobs] ${source.name} ${searchPath}: ${jobs.length} jobs`); break; }
    } catch (err) {
      console.warn(`[scrape-jobs] ${source.name} ${searchPath} failed: ${err instanceof Error ? err.message : err}`);
    } finally {
      if (page) await page.close();
    }
  }
  return jobs;
}

async function upsertToConvex(jobs: ScrapedJob[]) {
  if (!convexClient) return { inserted: 0, deduped: 0 };
  const adminToken = process.env.CONVEX_ADMIN_TOKEN;
  if (!adminToken) return { inserted: 0, deduped: 0 };
  let inserted = 0, deduped = 0;
  for (const j of jobs) {
    try {
      const closingDate = j.closingDate ? new Date(j.closingDate).getTime() : undefined;
      const result = await convexClient.mutation(api.mutationsAdmin.ingestJob, { adminToken, title: j.title, company: j.company, location: j.location, source: j.company, url: j.url, salary: j.salary, closingDate });
      if (result.deduped) deduped++; else inserted++;
    } catch (err) { console.warn(`[scrape-jobs] Upsert failed: ${err instanceof Error ? err.message : err}`); }
  }
  return { inserted, deduped };
}

export async function POST(_request: NextRequest) {
  console.log("[scrape-jobs] Starting Puppeteer scraper...");
  let browser;
  try {
    browser = await launchBrowser();
    const allJobs: ScrapedJob[] = [];
    for (const source of JOB_SOURCES) {
      const jobs = await scrapeSource(browser, source);
      allJobs.push(...jobs);
    }
    await browser.close(); browser = null;
    const seen = new Set<string>();
    const unique = allJobs.filter(j => { const k = j.title.toLowerCase().slice(0, 80); if (seen.has(k)) return false; seen.add(k); return true; });
    const result = await upsertToConvex(unique);
    return NextResponse.json({ success: true, source: "puppeteer", totalFound: unique.length, inserted: result.inserted, deduped: result.deduped });
  } catch (err) {
    if (browser) await browser.close();
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Unknown error", source: "puppeteer" }, { status: 500 });
  }
}

export async function GET() { return NextResponse.json({ status: "ok", message: "Send POST to trigger." }); }
