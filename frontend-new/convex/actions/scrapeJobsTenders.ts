// ============================================================
// Times of Namibia - Jobs & Tenders Scraper (Phase 4)
//
// Ponytail architectural standards: modular, strict TypeScript,
// zero technical debt. Each scraper is a self-contained function.
//
// Targets Namibian public portals and RSS feeds for:
//   - Government tenders (e-Tendering portal, Treasury)
//   - Public sector jobs (VacancyMail, government RSS)
//
// Populates the existing jobs and tender tables with:
//   title, entity, deadline, url, type
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";

// ── TYPES ────────────────────────────────────────────────────

interface TenderScrape {
  title: string;
  entity: string;        // department / institution name
  deadline: number;      // Unix timestamp
  url: string;
  estimatedValue?: string;
}

interface JobScrape {
  title: string;
  company: string;       // entity / employer
  location: string;
  url: string;
  type?: string;         // Full-time | Contract | Part-time
  deadline?: number;
  salary?: string;
}

// ── RSS PARSER (lightweight) ─────────────────────────────────

function parseXmlItems(xml: string): { title: string; link: string; description: string; pubDate?: string }[] {
  const items: { title: string; link: string; description: string; pubDate?: string }[] = [];
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  const matches = xml.match(itemRegex) || [];

  for (const itemXml of matches) {
    const getTag = (tag: string): string => {
      const m = itemXml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
      return m ? m[1].trim() : "";
    };

    const title = getTag("title")
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    const link = getTag("link")
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .trim();

    const description = getTag("description")
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .trim();

    const pubDate = getTag("pubDate") || undefined;

    if (title && link) {
      items.push({ title, link, description, pubDate });
    }
  }

  return items;
}

// ── TENDER SCRAPER ───────────────────────────────────────────
// Scrapes Namibian government tender portals and RSS feeds.
// Source: Ministry of Finance e-Tendering, NPP procurement portal.

async function scrapeTenders(): Promise<{ tenders: TenderScrape[]; errors: string[] }> {
  const tenders: TenderScrape[] = [];
  const errors: string[] = [];

  // Source 1: Namibian Treasury e-Tendering RSS
  const tenderSources = [
    {
      name: "Ministry of Finance e-Tendering",
      url: "https://www.mof.gov.na/tenders/feed",
    },
    {
      name: "Namibia Procurement Portal",
      url: "https://www.eprocurement.gov.na/tenders/feed",
    },
    {
      name: "Office of the Prime Minister",
      url: "https://www.opm.gov.na/tenders/feed",
    },
  ];

  for (const source of tenderSources) {
    try {
      const res = await fetch(source.url, {
        headers: {
          "User-Agent": "TimesOfNamibiaBot/1.0 (+https://timesofnamibia.com)",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
        signal: AbortSignal.timeout(10_000),
      });

      if (!res.ok) {
        errors.push(`${source.name}: HTTP ${res.status}`);
        continue;
      }

      const xml = await res.text();
      if (!xml.includes("<item")) {
        errors.push(`${source.name}: no items in feed`);
        continue;
      }

      const items = parseXmlItems(xml);
      for (const item of items.slice(0, 10)) {
        // Parse deadline from title or description
        // Tender titles often contain "Closing: DD MMM YYYY"
        const deadlineMatch = item.title.match(/closing[:\s]+(\d{1,2}\s+\w+\s+\d{4})/i)
          || item.description.match(/closing[:\s]+(\d{1,2}\s+\w+\s+\d{4})/i)
          || item.title.match(/deadline[:\s]+(\d{1,2}\s+\w+\s+\d{4})/i);

        let deadline = Date.now() + 30 * 24 * 60 * 60 * 1000; // default 30 days
        if (deadlineMatch) {
          const parsed = new Date(deadlineMatch[1]);
          if (!isNaN(parsed.getTime())) {
            deadline = parsed.getTime();
          }
        }

        // Clean title (remove deadline suffixes)
        const cleanTitle = item.title
          .replace(/\s*[-:]\s*closing[:\s]+\d{1,2}\s+\w+\s+\d{4}.*/i, "")
          .replace(/\s*[-:]\s*deadline[:\s]+\d{1,2}\s+\w+\s+\d{4}.*/i, "")
          .trim();

        // Extract estimated value if present
        const valueMatch = item.description.match(/(?:estimated\s+)?value[:\s]+(NAD\s+[\d,.]+)/i);
        const estimatedValue = valueMatch ? valueMatch[1] : undefined;

        tenders.push({
          title: cleanTitle,
          entity: source.name,
          deadline,
          url: item.link,
          estimatedValue,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${source.name}: ${msg}`);
    }
  }

  return { tenders, errors };
}

// ── JOB SCRAPER ──────────────────────────────────────────────
// Scrapes Namibian job portals and RSS feeds.
// Sources: Namibia VacancyMail, government job board, NIPAM.

async function scrapeJobs(): Promise<{ jobs: JobScrape[]; errors: string[] }> {
  const jobs: JobScrape[] = [];
  const errors: string[] = [];

  const jobSources = [
    {
      name: "Namibia VacancyMail",
      url: "https://www.vacancymail.co.na/jobs/feed",
    },
    {
      name: "Government Job Board",
      url: "https://www.gov.na/jobs/feed",
    },
    {
      name: "NIPAM Careers",
      url: "https://www.nipam.gov.na/careers/feed",
    },
    {
      name: "UN Namibia Jobs",
      url: "https://namibia.un.org/jobs/feed",
    },
  ];

  for (const source of jobSources) {
    try {
      const res = await fetch(source.url, {
        headers: {
          "User-Agent": "TimesOfNamibiaBot/1.0 (+https://timesofnamibia.com)",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
        signal: AbortSignal.timeout(10_000),
      });

      if (!res.ok) {
        errors.push(`${source.name}: HTTP ${res.status}`);
        continue;
      }

      const xml = await res.text();
      if (!xml.includes("<item")) {
        errors.push(`${source.name}: no items in feed`);
        continue;
      }

      const items = parseXmlItems(xml);
      for (const item of items.slice(0, 10)) {
        // Extract location from description
        const locationMatch = item.description.match(/location[:\s]+([^,\n]+)/i);
        const location = locationMatch ? locationMatch[1].trim() : "Namibia";

        // Extract job type
        const typeMatch = item.description.match(/(?:type|contract)[:\s]+(full[-\s]?time|contract|part[-\s]?time|permanent|temporary)/i);
        const type = typeMatch ? typeMatch[1].trim() : undefined;

        // Extract salary if present
        const salaryMatch = item.description.match(/salary[:\s]+(NAD\s+[\d,.]+)/i);
        const salary = salaryMatch ? salaryMatch[1] : undefined;

        // Extract deadline if present
        const deadlineMatch = item.description.match(/(?:closing|deadline)[:\s]+(\d{1,2}\s+\w+\s+\d{4})/i);
        let deadline: number | undefined;
        if (deadlineMatch) {
          const parsed = new Date(deadlineMatch[1]);
          if (!isNaN(parsed.getTime())) {
            deadline = parsed.getTime();
          }
        }

        jobs.push({
          title: item.title,
          company: source.name,
          location,
          url: item.link,
          type,
          salary,
          deadline,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${source.name}: ${msg}`);
    }
  }

  return { jobs, errors };
}

// ── MAIN ACTION ──────────────────────────────────────────────

export const scrapeJobsTenders = internalAction({
  args: {},
  handler: async (ctx) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) {
      return { error: "CONVEX_ADMIN_TOKEN not configured" };
    }

    console.log("[jobs-tenders] Starting scrape...");
    const allErrors: string[] = [];
    let jobsInserted = 0;
    let tendersInserted = 0;
    let jobsDeduped = 0;
    let tendersDeduped = 0;

    // Scrape tenders
    try {
      const { tenders, errors: tenderErrors } = await scrapeTenders();
      allErrors.push(...tenderErrors);
      console.log(`[jobs-tenders] Found ${tenders.length} tenders (${tenderErrors.length} source errors)`);

      for (const tender of tenders) {
        try {
          const result = await ctx.runMutation(api.mutationsAdmin.ingestTender, {
            adminToken,
            docId: tender.url, // use URL as docId for dedup
            title: tender.title,
            department: tender.entity,
            deadline: tender.deadline,
            estimatedValue: tender.estimatedValue,
            documentUrl: tender.url,
            status: "open",
          });
          if (result.deduped) {
            tendersDeduped++;
          } else {
            tendersInserted++;
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          allErrors.push(`Tender "${tender.title.slice(0, 40)}": ${msg}`);
        }
      }
    } catch (err) {
      allErrors.push(`Tender scrape failed: ${err instanceof Error ? err.message : err}`);
    }

    // Scrape jobs
    try {
      const { jobs, errors: jobErrors } = await scrapeJobs();
      allErrors.push(...jobErrors);
      console.log(`[jobs-tenders] Found ${jobs.length} jobs (${jobErrors.length} source errors)`);

      for (const job of jobs) {
        try {
          const result = await ctx.runMutation(api.mutationsAdmin.ingestJob, {
            adminToken,
            title: job.title,
            company: job.company,
            location: job.location,
            source: job.company,
            salary: job.salary,
            type: job.type,
            url: job.url,
            closingDate: job.deadline,
          });
          if (result.deduped) {
            jobsDeduped++;
          } else {
            jobsInserted++;
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          allErrors.push(`Job "${job.title.slice(0, 40)}": ${msg}`);
        }
      }
    } catch (err) {
      allErrors.push(`Job scrape failed: ${err instanceof Error ? err.message : err}`);
    }

    console.log(`[jobs-tenders] Complete: ${jobsInserted} jobs inserted, ${tendersInserted} tenders inserted`);

    return {
      jobsInserted,
      tendersInserted,
      jobsDeduped,
      tendersDeduped,
      errors: allErrors.slice(0, 20),
    };
  },
});

// ── MANUAL TRIGGER ───────────────────────────────────────────

export const triggerScrapeJobsTenders = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.scrapeJobsTenders.scrapeJobsTenders, {});
  },
});
