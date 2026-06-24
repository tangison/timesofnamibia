// ============================================================
// Times of Namibia — HTTP Actions (Part 5)
//
// Secret-protected HTTP endpoint for external cron triggers.
// Uses scheduler.runAfter(0) so the endpoint returns immediately
// while ingestion runs in the background — prevents timeouts for
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

    // Schedule ingestion as a background job — return immediately
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

// ── /backfill-images — fire-and-forget trigger for image backfill ──
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

export default http;
