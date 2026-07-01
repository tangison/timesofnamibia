// ============================================================
// Times of Namibia - Convex Cron Jobs (TANGISON)
//
// Task 3 spec: per-region cron intervals
//   - Namibia sources: every 15 minutes
//   - Africa sources: every 30 minutes
//   - World sources: every 60 minutes
//
// The ingestRssFeeds action accepts a sourceRegion filter so we
// can run each region independently on its own schedule.
// ============================================================

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Namibia: every 15 minutes
crons.interval(
  "ingest namibia feeds",
  { minutes: 15 },
  internal.actions.ingestRss.ingestRssFeeds,
  { sourceRegion: "namibia" }
);

// Africa: every 30 minutes
crons.interval(
  "ingest africa feeds",
  { minutes: 30 },
  internal.actions.ingestRss.ingestRssFeeds,
  { sourceRegion: "africa" }
);

// World: every 60 minutes
crons.interval(
  "ingest world feeds",
  { minutes: 60 },
  internal.actions.ingestRss.ingestRssFeeds,
  { sourceRegion: "world" }
);

// Phase 4: Jobs & Tenders RSS scraper - every 60 minutes
crons.interval(
  "scrape jobs and tenders",
  { minutes: 60 },
  internal.actions.scrapeJobsTenders.scrapeJobsTenders,
  {}
);

// Phase 2 (Iteration 12): Playwright + Search API scraper - every 12 hours
crons.interval(
  "playwright scrape jobs tenders",
  { hours: 12 },
  internal.actions.triggerScrapeJobs.triggerScrapeJobsRoute,
  {}
);

export default crons;
