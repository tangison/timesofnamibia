// ============================================================
// Times of Namibia - Database Cleanup (Section 5)
//
// Prunes old/orphaned records to reduce storage:
//   - Market data older than 7 days
//   - Orphaned tender/job records from Tavily fallback noise
//   - Old social queue entries
//   - Old ticker items
//
// Runs as a daily cron.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";

export const cleanupDatabase = internalAction({
  args: {},
  handler: async (ctx) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) {
      return { error: "CONVEX_ADMIN_TOKEN not configured" };
    }

    console.log("[cleanup] Starting database cleanup...");
    const results: Record<string, number> = {};
    const now = Date.now();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    // 1. Prune old market data (older than 7 days)
    try {
      const oldMarkets = await ctx.runQuery(api.queries.listOldMarketData, {
        olderThanMs: SEVEN_DAYS_MS,
      });
      for (const m of oldMarkets) {
        await ctx.runMutation(api.mutationsAdmin.deleteMarketDatum, {
          adminToken,
          id: m._id,
        });
      }
      results.oldMarketData = oldMarkets.length;
      console.log(`[cleanup] Deleted ${oldMarkets.length} old market data records`);
    } catch (err) {
      console.warn("[cleanup] Market data cleanup failed:", err instanceof Error ? err.message : err);
    }

    // 2. Delete orphaned tenders (from Tavily noise - portal homepage links)
    try {
      const allTenders = await ctx.runQuery(api.queries.listAllTenders, { limit: 200 });
      const orphaned = allTenders.filter((t: any) => {
        const title = (t.title || "").toLowerCase();
        // Section 3: Reject portal homepage / aggregator noise
        if (title.includes("portal ariel")) return true;
        if (title.includes("murd")) return true;
        if (title.length < 15) return true;
        // Reject aggregator tender listing pages
        if (title.includes("live government bids")) return true;
        if (title.includes("tenders 2026") && title.includes("eprocurement")) return true;
        if (title.includes("latest") && title.includes("tenders")) return true;
        if (title.includes("construction tenders") && title.includes("bids")) return true;
        if (title.includes("procurement") && title.includes("about us")) return true;
        if (title.match(/\d+\s*tenders/i)) return true;  // "3500 Namibia Tenders"
        // Reject tenders with no real deadline (default 30 days from scrape)
        if (t.deadline && Math.abs(t.deadline - (t.createdAt || now) - 30 * 24 * 60 * 60 * 1000) < 1000) {
          if (!t.title || t.title.length < 20) return true;
        }
        return false;
      });
      for (const t of orphaned) {
        await ctx.runMutation(api.mutationsAdmin.deleteTender, {
          adminToken,
          id: t._id,
        });
      }
      results.orphanedTenders = orphaned.length;
      console.log(`[cleanup] Deleted ${orphaned.length} orphaned tender records`);
    } catch (err) {
      console.warn("[cleanup] Tender cleanup failed:", err instanceof Error ? err.message : err);
    }

    // 3. Delete orphaned jobs (aggregator page titles)
    try {
      const allJobs = await ctx.runQuery(api.queries.listAllJobs, { limit: 200 });
      const orphaned = allJobs.filter((j: any) => {
        const title = j.title || "";
        const titleLower = title.toLowerCase();
        // Section 4: Reject aggregator patterns
        if (/\d+\s*(vacanc|jobs?|positions?|openings?)/i.test(title)) return true;
        const aggregatorBrands = ["linkedin", "naukri", "indeed", "glassdoor", "careerjet", "jooble", "pnet", "facebook"];
        for (const brand of aggregatorBrands) {
          if (titleLower.includes(brand) && title.length < 70) return true;
        }
        if (/^jobs?\s+(in|namibia)/i.test(title.trim())) return true;
        if (/^namibia\s+(jobs?|vacanc)/i.test(title.trim())) return true;
        if (/^find jobs/i.test(title.trim())) return true;
        if (titleLower.includes("vacancies") && titleLower.includes("recruitment")) return true;
        if (titleLower.includes("opportunities") && titleLower.includes("windhoek")) return true;
        if (titleLower.includes("namijob.com")) return true;
        return false;
      });
      for (const j of orphaned) {
        await ctx.runMutation(api.mutationsAdmin.deleteJob, {
          adminToken,
          id: j._id,
        });
      }
      results.orphanedJobs = orphaned.length;
      console.log(`[cleanup] Deleted ${orphaned.length} orphaned job records`);
    } catch (err) {
      console.warn("[cleanup] Job cleanup failed:", err instanceof Error ? err.message : err);
    }

    // 4. Delete old social queue entries (older than 30 days, posted or failed)
    try {
      const oldSocial = await ctx.runQuery(api.queries.listOldSocialQueue, {
        olderThanMs: THIRTY_DAYS_MS,
      });
      for (const s of oldSocial) {
        await ctx.runMutation(api.mutationsAdmin.deleteSocialQueueEntry, {
          adminToken,
          id: s._id,
        });
      }
      results.oldSocialQueue = oldSocial.length;
      console.log(`[cleanup] Deleted ${oldSocial.length} old social queue entries`);
    } catch (err) {
      console.warn("[cleanup] Social queue cleanup failed:", err instanceof Error ? err.message : err);
    }

    // 5. Delete old ticker items (older than 7 days)
    try {
      const oldTickers = await ctx.runQuery(api.queries.listOldTickerItems, {
        olderThanMs: SEVEN_DAYS_MS,
      });
      for (const t of oldTickers) {
        await ctx.runMutation(api.mutationsAdmin.deleteTickerItem, {
          adminToken,
          id: t._id,
        });
      }
      results.oldTickers = oldTickers.length;
      console.log(`[cleanup] Deleted ${oldTickers.length} old ticker items`);
    } catch (err) {
      console.warn("[cleanup] Ticker cleanup failed:", err instanceof Error ? err.message : err);
    }

    const totalDeleted = Object.values(results).reduce((a, b) => a + b, 0);
    console.log(`[cleanup] Complete. Total deleted: ${totalDeleted}`);
    return { deleted: results, totalDeleted };
  },
});

// Manual trigger
export const triggerCleanup = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.cleanupDatabase.cleanupDatabase, {});
  },
});
