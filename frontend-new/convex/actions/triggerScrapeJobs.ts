// ============================================================
// Times of Namibia - Trigger Vercel API Route (Phase 2)
//
// Convex action that triggers the /api/scrape-jobs route on
// Vercel. Called by Convex cron every 12 hours.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";

const VERCEL_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://timesofnamibia47.vercel.app";

export const triggerScrapeJobsRoute = internalAction({
  args: {},
  handler: async () => {
    const triggerToken = process.env.INGEST_SECRET;
    if (!triggerToken) {
      console.error("[trigger-scrape] INGEST_SECRET not configured");
      return { error: "INGEST_SECRET not configured" };
    }

    try {
      console.log("[trigger-scrape] Calling Vercel /api/scrape-jobs...");
      const res = await fetch(`${VERCEL_URL}/api/scrape-jobs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${triggerToken}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(240_000), // 4 min - Vercel max is 300s
      });

      if (!res.ok) {
        console.warn(`[trigger-scrape] Vercel route returned ${res.status}`);
        return { error: `HTTP ${res.status}` };
      }

      const data = await res.json();
      console.log("[trigger-scrape] Vercel route response:", data);
      return data;
    } catch (err) {
      console.error("[trigger-scrape] Failed:", err instanceof Error ? err.message : err);
      return { error: err instanceof Error ? err.message : String(err) };
    }
  },
});

export const triggerScrapeJobsManual = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.triggerScrapeJobs.triggerScrapeJobsRoute, {});
  },
});
