// ============================================================
// Times of Namibia - RSS Auto-Ingestion Scheduler
// Triggers ingestion on first server start and periodically
// ============================================================

import { ingestAllFeeds } from "./rss-ingestion";
import { db } from "./db";

let lastIngestionTime = 0;
const INGESTION_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
let ingestionPromise: Promise<void> | null = null;
let initialized = false;

async function getArticleCount(): Promise<number> {
  try {
    return await db.article.count({ where: { published: true, deletedAt: null } });
  } catch {
    return 0;
  }
}

async function getLastFetchedTime(): Promise<Date | null> {
  try {
    const latest = await db.rssFeed.findFirst({
      where: { active: true, lastFetched: { not: null } },
      orderBy: { lastFetched: "desc" },
      select: { lastFetched: true },
    });
    return latest?.lastFetched || null;
  } catch {
    return null;
  }
}

export async function triggerAutoIngestion(): Promise<{
  triggered: boolean;
  reason: string;
  results?: unknown[];
}> {
  const now = Date.now();

  // Prevent concurrent ingestion
  if (ingestionPromise) {
    return { triggered: false, reason: "Ingestion already in progress" };
  }

  // Check if enough time has passed since last ingestion
  if (now - lastIngestionTime < INGESTION_INTERVAL_MS && initialized) {
    return { triggered: false, reason: "Too soon since last ingestion" };
  }

  try {
    const articleCount = await getArticleCount();
    const lastFetched = await getLastFetchedTime();

    // Auto-trigger if: no articles exist, or never fetched, or interval elapsed
    const shouldIngest =
      articleCount === 0 ||
      !lastFetched ||
      (now - lastFetched.getTime() > INGESTION_INTERVAL_MS);

    if (!shouldIngest && initialized) {
      return { triggered: false, reason: "Feeds recently fetched, no need to ingest" };
    }

    // Run ingestion in background
    ingestionPromise = (async () => {
      try {
        console.log("[RSS Scheduler] Starting ingestion...");
        const results = await ingestAllFeeds();
        const totalNew = results.reduce((sum, r) => sum + r.newItems, 0);
        const totalArticles = results.reduce((sum, r) => sum + r.articlesCreated, 0);
        const errors = results.filter((r) => r.errors.length > 0);
        console.log(
          `[RSS Scheduler] Ingestion complete: ${totalNew} new items, ${totalArticles} articles created, ${errors.length} feeds with errors`
        );
        lastIngestionTime = Date.now();
        initialized = true;
      } catch (error) {
        console.error("[RSS Scheduler] Ingestion failed:", error);
      } finally {
        ingestionPromise = null;
      }
    })();

    await ingestionPromise;

    return {
      triggered: true,
      reason: articleCount === 0 ? "No articles in database" : "Ingestion interval elapsed",
    };
  } catch (error) {
    console.error("[RSS Scheduler] Error:", error);
    return { triggered: false, reason: `Error: ${error instanceof Error ? error.message : String(error)}` };
  }
}

// Get ingestion status for UI display
export function getIngestionStatus(): {
  isRunning: boolean;
  lastIngestionTime: number;
  initialized: boolean;
} {
  return {
    isRunning: !!ingestionPromise,
    lastIngestionTime,
    initialized,
  };
}
