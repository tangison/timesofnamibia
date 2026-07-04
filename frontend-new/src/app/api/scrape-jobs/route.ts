// ============================================================
// Times of Namibia - Playwright Job Scraper (Part 1)
//
// Uses @sparticuz/chromium + playwright-core to render JS-heavy
// job portals and extract real individual job listings.
//
// Blocks images/fonts/CSS to stay under Vercel Hobby memory limit.
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
  type?: string;
}

// ── SOURCE CONFIG ────────────────────────────────────────────

const JOB_SOURCES = [
  {
    name: "NIEIS (Namibia at Work)",
    url: "https://nieis.namibiaatwork.gov.na",
    searchPaths: ["/", "/jobs", "/vacancies", "/search"],
    entity: "NIEIS - Ministry of Labour",
  },
  {
    name: "Namijob",
    url: "https://www.namijob.com",
    searchPaths: ["/", "/jobs", "/search-jobs", "/vacancies"],
    entity: "Namijob",
  },
  {
    name: "Jobs Namibia",
    url: "https://www.jobsnamibia.net",
    searchPaths: ["/", "/jobs", "/search"],
    entity: "Jobs Namibia",
  },
];

// ── LAUNCH CHROMIUM ──────────────────────────────────────────

async function launchBrowser() {
  const chromium: any = await import("@sparticuz/chromium");
  const { chromium: playwrightChromium } = await import("playwright-core");

  const executablePath = await chromium.executablePath();

  const browser = await playwrightChromium.launch({
    executablePath,
    args: chromium.args,
    headless: true,
  });

  return browser;
}

// ── VALIDATION: Reject aggregator titles ─────────────────────

function isAggregatorTitle(title: string): boolean {
  const titleLower = title.toLowerCase();
  if (/\d+\s*(vacanc|jobs?|positions?|openings?)/i.test(title)) return true;
  const aggregatorBrands = ["linkedin", "naukri", "indeed", "glassdoor", "careerjet", "jooble", "pnet", "facebook"];
  for (const brand of aggregatorBrands) {
    if (titleLower.includes(brand) && title.length < 70) return true;
  }
  if (/^jobs?\s+(in|namibia)/i.test(title.trim())) return true;
  if (/^namibia\s+(jobs?|vacanc)/i.test(title.trim())) return true;
  if (/^find jobs/i.test(title.trim())) return true;
  if (titleLower.includes("vacancies") && titleLower.includes("recruitment")) return true;
  if (titleLower.includes("namijob.com")) return true;
  if (titleLower.includes("opportunities") && titleLower.includes("windhoek")) return true;
  return false;
}

// ── SCRAPE SINGLE SOURCE ─────────────────────────────────────

async function scrapeSource(browser: any, source: typeof JOB_SOURCES[0]): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = [];

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

      // Extract job listings from rendered DOM
      const items = await page.evaluate((entity: string) => {
        const results: { title: string; url: string; location: string; closingDate?: string; salary?: string; company?: string }[] = [];

        // Try multiple selectors
        const selectors = [
          ".job-item", ".vacancy-item", ".job-listing", ".job-card",
          ".position", ".listing-item", "article", ".card",
          "table tr", ".job-result", ".job-ad",
        ];

        for (const sel of selectors) {
          const elements = document.querySelectorAll(sel);
          if (elements.length === 0) continue;

          elements.forEach((el, idx) => {
            if (idx >= 15) return;
            const text = (el.textContent || "").trim();
            if (text.length < 15) return;

            const link = el.querySelector("a");
            const heading = el.querySelector("h1, h2, h3, h4, h5, .title, .job-title, .position-title, strong");

            const title = heading?.textContent?.trim() || text.slice(0, 120).trim();
            if (!title || title.length < 10) return;

            // Extract location
            const locMatch = text.match(/(?:location|based\s+in|city)[:\s]+([^,\n]+)/i);
            const location = locMatch?.[1]?.trim() || "Namibia";

            // Extract closing date
            const dateMatch = text.match(/(?:closing|deadline|apply\s+by|expires?)[:\s]+(\d{1,2}\s+\w+\s+\d{4})/i);

            // Extract company/employer
            const companyMatch = text.match(/(?:company|employer|organization)[:\s]+([^,\n]+)/i);

            // Extract salary
            const salaryMatch = text.match(/(?:salary|remuneration)[:\s]+(NAD\s+[\d,.]+)/i);

            const href = link?.href || "";
            results.push({
              title: title.slice(0, 200),
              url: href || window.location.href,
              location,
              closingDate: dateMatch?.[1],
              salary: salaryMatch?.[1],
              company: companyMatch?.[1]?.trim() || entity,
            });
          });

          if (results.length > 0) break;
        }

        return results;
      }, source.entity);

      for (const item of items) {
        // Validation: reject aggregator titles
        if (isAggregatorTitle(item.title)) continue;
        if (item.title.length < 10) continue;

        jobs.push({
          title: item.title,
          company: item.company || source.entity,
          location: item.location || "Namibia",
          url: item.url || url,
          closingDate: item.closingDate,
          salary: item.salary,
        });
      }

      if (jobs.length > 0) {
        console.log(`[scrape-jobs] ${source.name} ${searchPath}: ${jobs.length} jobs`);
        break; // Use first path that yields results
      }
    } catch (err) {
      console.warn(`[scrape-jobs] ${source.name} ${searchPath} failed: ${err instanceof Error ? err.message : err}`);
    } finally {
      await page.close();
    }
  }

  return jobs;
}

// ── UPSERT TO CONVEX ─────────────────────────────────────────

async function upsertToConvex(jobs: ScrapedJob[]): Promise<{ inserted: number; deduped: number }> {
  if (!convexClient) return { inserted: 0, deduped: 0 };

  const adminToken = process.env.CONVEX_ADMIN_TOKEN;
  if (!adminToken) return { inserted: 0, deduped: 0 };

  let inserted = 0;
  let deduped = 0;

  for (const job of jobs) {
    try {
      const closingDate = job.closingDate ? new Date(job.closingDate).getTime() : undefined;
      const result = await convexClient.mutation(api.mutationsAdmin.ingestJob, {
        adminToken,
        title: job.title,
        company: job.company,
        location: job.location,
        source: job.company,
        url: job.url,
        salary: job.salary,
        closingDate,
      });
      if (result.deduped) deduped++;
      else inserted++;
    } catch (err) {
      console.warn(`[scrape-jobs] Upsert failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  return { inserted, deduped };
}

// ── MAIN HANDLER ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  console.log("[scrape-jobs] Starting Playwright scraper...");

  let browser;
  try {
    browser = await launchBrowser();
    console.log("[scrape-jobs] Browser launched");

    const allJobs: ScrapedJob[] = [];

    for (const source of JOB_SOURCES) {
      const jobs = await scrapeSource(browser, source);
      allJobs.push(...jobs);
      console.log(`[scrape-jobs] ${source.name}: ${jobs.length} jobs total`);
    }

    await browser.close();
    browser = null;

    // Dedupe by title
    const seen = new Set<string>();
    const unique = allJobs.filter((j) => {
      const key = j.title.toLowerCase().slice(0, 80);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`[scrape-jobs] Total unique: ${unique.length}`);

    const result = await upsertToConvex(unique);

    return NextResponse.json({
      success: true,
      source: "playwright",
      totalFound: unique.length,
      inserted: result.inserted,
      deduped: result.deduped,
    });
  } catch (err) {
    console.error("[scrape-jobs] Playwright failed:", err instanceof Error ? err.message : err);
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
  return NextResponse.json({ status: "ok", message: "Send POST to trigger job scraping." });
}
