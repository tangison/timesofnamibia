// ============================================================
// Times of Namibia — Convex Cron Jobs (TANGISON)
//
// Scheduled jobs that run on the Convex deployment automatically.
// ============================================================

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// ── RSS INGESTION — every 15 minutes ─────────────────────────
// Fetches 15 Namibian news RSS feeds, parses, deduplicates, and
// inserts new articles into the Convex `article` table.
crons.interval(
  "ingest rss feeds",
  { minutes: 15 },
  internal.actions.ingestRss.ingestRssFeeds,
  {}
);

export default crons;
