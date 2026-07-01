// ============================================================
// Times of Namibia - HTTP Actions (Part 5)
//
// Secret-protected HTTP endpoint for external cron triggers.
// Uses scheduler.runAfter(0) so the endpoint returns immediately
// while ingestion runs in the background - prevents timeouts for
// external callers like cron-job.org.
// ============================================================

import { httpAction } from "./_generated/server";
import { httpRouter } from "convex/server";
import { api, internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/ingest",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = request.headers.get("Authorization");
    const expectedSecret = `Bearer ${process.env.INGEST_SECRET}`;

    if (!secret || secret !== expectedSecret) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Schedule ingestion as a background job - return immediately
    // so external callers (cron-job.org) don't time out waiting
    // for the full RSS pipeline to complete.
    try {
      await ctx.scheduler.runAfter(0, internal.actions.ingestRss.ingestRssFeeds, {});
      return new Response(
        JSON.stringify({ status: "Ingestion started" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async (ctx, _request) => {
    try {
      const health = await ctx.runQuery(api.queries.getIngestionHealth, {});
      const lastRun = health?.lastSuccessfulRun;
      const ago = lastRun ? `${Math.round((Date.now() - lastRun) / 60000)} minutes ago` : "never";

      return new Response(
        JSON.stringify({
          status: "ok",
          lastIngestion: ago,
          articlesInserted: health?.articlesInserted ?? 0,
          timestamp: new Date().toISOString(),
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch {
      return new Response(
        JSON.stringify({ status: "ok", lastIngestion: "unknown" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ── /backfill-images - fire-and-forget trigger for image backfill ──
// Schedules backfillImages as a background job so the HTTP caller
// (us, in this audit) doesn't have to wait for the full Pollinations
// pipeline to complete (which can take 30+ minutes for 98 articles).
http.route({
  path: "/backfill-images",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = request.headers.get("Authorization");
    const expectedSecret = `Bearer ${process.env.INGEST_SECRET}`;

    if (!secret || secret !== expectedSecret) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      await ctx.scheduler.runAfter(0, internal.actions.backfillImages.backfillImages, {});
      return new Response(
        JSON.stringify({ status: "Backfill started" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ── /social-queue (Task 5) - returns pending social posts ──
// External automation (n8n / Make.com) calls this GET endpoint to
// retrieve pending posts, publishes them to each platform, then
// calls POST /http/social-queue/{id}/status to mark them posted.
http.route({
  path: "/social-queue",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const secret = request.headers.get("Authorization");
    const expectedSecret = `Bearer ${process.env.INGEST_SECRET}`;

    if (!secret || secret !== expectedSecret) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get("limit") || "50", 10);
      const posts = await ctx.runQuery(api.queries.listPendingSocialPosts, { limit });

      return new Response(
        JSON.stringify({
          count: posts.length,
          posts: posts.map((p: any) => ({
            id: p._id,
            articleId: p.articleId,
            imageUrl: p.imageUrl,
            caption: p.caption,
            hashtags: p.hashtags,
            platforms: p.platforms,
            queuedAt: new Date(p.queuedAt).toISOString(),
          })),
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ── /prepare-social (Task 5) - trigger prepareSocialPost action ──
// Fire-and-forget: schedules the action that builds social packages
// for all articles where postedToSocial is false.
http.route({
  path: "/prepare-social",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = request.headers.get("Authorization");
    const expectedSecret = `Bearer ${process.env.INGEST_SECRET}`;

    if (!secret || secret !== expectedSecret) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      await ctx.scheduler.runAfter(0, internal.actions.socialQueue.prepareSocialPost, {
        limit: 20,
      });
      return new Response(
        JSON.stringify({ status: "Social preparation started" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ── /scrape-jobs-tenders (Phase 4) - trigger jobs/tenders scraper ──
// Fire-and-forget: schedules the scrapeJobsTenders action that fetches
// Namibian public portals and RSS feeds for jobs and tenders.
http.route({
  path: "/scrape-jobs-tenders",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = request.headers.get("Authorization");
    const expectedSecret = `Bearer ${process.env.INGEST_SECRET}`;

    if (!secret || secret !== expectedSecret) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      await ctx.scheduler.runAfter(0, internal.actions.scrapeJobsTenders.scrapeJobsTenders, {});
      return new Response(
        JSON.stringify({ status: "Jobs and tenders scrape started" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ── /seed-directory (Phase 4) - trigger directory seed ──
http.route({
  path: "/seed-directory",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = request.headers.get("Authorization");
    const expectedSecret = `Bearer ${process.env.INGEST_SECRET}`;
    if (!secret || secret !== expectedSecret) {
      return new Response("Unauthorized", { status: 401 });
    }
    try {
      await ctx.scheduler.runAfter(0, internal.actions.seedDirectory.seedDirectoryPlaces, {});
      return new Response(
        JSON.stringify({ status: "Directory seed started" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ── /clear-articles (Phase 1) - clear all articles ──
http.route({
  path: "/clear-articles",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = request.headers.get("Authorization");
    const expectedSecret = `Bearer ${process.env.INGEST_SECRET}`;
    if (!secret || secret !== expectedSecret) {
      return new Response("Unauthorized", { status: 401 });
    }
    try {
      const result = await ctx.runMutation(api.mutationsAdmin.clearAllArticles, {
        adminToken: process.env.CONVEX_ADMIN_TOKEN!,
      });
      return new Response(
        JSON.stringify({ status: "Articles cleared", deleted: result.deleted }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ── /full-reset (Issue 5) - wipe articles, jobs, tenders, market data ──
http.route({
  path: "/full-reset",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = request.headers.get("Authorization");
    const expectedSecret = `Bearer ${process.env.INGEST_SECRET}`;
    if (!secret || secret !== expectedSecret) {
      return new Response("Unauthorized", { status: 401 });
    }
    try {
      const result = await ctx.runMutation(api.mutationsAdmin.fullDatabaseReset, {
        adminToken: process.env.CONVEX_ADMIN_TOKEN!,
      });
      return new Response(
        JSON.stringify({ status: "Database reset complete", ...result }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ── /fetch-market-data (Issue 6) - trigger market data fetch ──
http.route({
  path: "/fetch-market-data",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = request.headers.get("Authorization");
    const expectedSecret = `Bearer ${process.env.INGEST_SECRET}`;
    if (!secret || secret !== expectedSecret) {
      return new Response("Unauthorized", { status: 401 });
    }
    try {
      await ctx.scheduler.runAfter(0, internal.actions.marketData.fetchMarketData, {});
      return new Response(
        JSON.stringify({ status: "Market data fetch started" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

export default http;
