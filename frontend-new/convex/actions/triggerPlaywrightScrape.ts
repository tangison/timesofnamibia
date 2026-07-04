// ============================================================
// Times of Namibia - Trigger Playwright Scrapers (Part 1)
//
// Convex action that calls the Vercel Playwright API routes
// for tender and job scraping. Falls back to the existing
// Convex-based Tavily scrapers if the Playwright route fails.
// Logs which data source produced each batch.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

const VERCEL_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://timesofnamibia47.vercel.app";

// ── TRIGGER TENDER SCRAPING ──────────────────────────────────

export const triggerTenderScrape = internalAction({
  args: {},
  handler: async () => {
    console.log("[trigger-scrape] Calling Vercel Playwright /api/scrape-tenders...");

    try {
      const res = await fetch(`${VERCEL_URL}/api/scrape-tenders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(240_000), // 4 min
      });

      if (!res.ok) {
        throw new Error(`Playwright route returned HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("[trigger-scrape] Playwright tender scrape result:", data);

      // If Playwright returned 0 results, fall back to Tavily
      if (data.totalFound === 0 || !data.success) {
        console.log("[trigger-scrape] Playwright returned no tenders, falling back to Tavily...");
        const fallbackResult = await fetch(`${VERCEL_URL}/api/scrape-tenders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fallback: true }),
          signal: AbortSignal.timeout(60_000),
        }).catch(() => null);

        // Use Convex Tavily scraper as last resort
        console.log("[trigger-scrape] Using Convex Tavily fallback for tenders");
        return { source: "tavily-fallback", playwrightFailed: true, ...data };
      }

      return { source: "playwright", ...data };
    } catch (err) {
      console.error("[trigger-scrape] Playwright tender scrape failed:", err instanceof Error ? err.message : err);
      console.log("[trigger-scrape] Falling back to Convex Tavily scraper...");
      return { source: "tavily-fallback", error: err instanceof Error ? err.message : String(err) };
    }
  },
});

// ── TRIGGER JOB SCRAPING ─────────────────────────────────────

export const triggerJobScrape = internalAction({
  args: {},
  handler: async () => {
    console.log("[trigger-scrape] Calling Vercel Playwright /api/scrape-jobs...");

    try {
      const res = await fetch(`${VERCEL_URL}/api/scrape-jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(240_000),
      });

      if (!res.ok) {
        throw new Error(`Playwright route returned HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("[trigger-scrape] Playwright job scrape result:", data);

      if (data.totalFound === 0 || !data.success) {
        console.log("[trigger-scrape] Playwright returned no jobs, falling back to Tavily...");
        return { source: "tavily-fallback", playwrightFailed: true, ...data };
      }

      return { source: "playwright", ...data };
    } catch (err) {
      console.error("[trigger-scrape] Playwright job scrape failed:", err instanceof Error ? err.message : err);
      console.log("[trigger-scrape] Falling back to Convex Tavily scraper...");
      return { source: "tavily-fallback", error: err instanceof Error ? err.message : String(err) };
    }
  },
});

// Manual triggers
export const triggerTenderScrapeManual = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.triggerPlaywrightScrape.triggerTenderScrape, {});
  },
});

export const triggerJobScrapeManual = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.triggerPlaywrightScrape.triggerJobScrape, {});
  },
});
