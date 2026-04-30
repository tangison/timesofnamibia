// ============================================================
// Times of Namibia — Data Agent API Route
// Triggers the Python data-scraper-agent and returns status
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { readFile } from "fs/promises";
import { join } from "path";
import { db } from "@/lib/db";

const execAsync = promisify(exec);

const DATA_AGENT_PATH = join(process.cwd(), "data-agent");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const mode = body.mode || "status";

    if (mode === "status") {
      return NextResponse.json(await getAgentStatus());
    }

    if (mode === "trigger") {
      const pythonCmd = process.env.PYTHON_CMD || "python3";
      // Fire-and-forget: run Python data agent in the background
      execAsync(
        `cd ${DATA_AGENT_PATH} && ${pythonCmd} -m scraper.main`,
        { timeout: 300000 }
      ).catch((err: unknown) => {
        console.error("[Data Agent] Execution error:", err instanceof Error ? err.message : String(err));
      });

      return NextResponse.json({
        success: true,
        message: "Data agent triggered in background",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid mode. Use: status | trigger" },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Data agent error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json(await getAgentStatus());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Status check failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

async function getAgentStatus() {
  let lastRun = null;
  try {
    const logPath = join(DATA_AGENT_PATH, "data", "last_run.json");
    const logData = await readFile(logPath, "utf-8");
    lastRun = JSON.parse(logData);
  } catch {
    // No run log yet
  }

  const [articleCount, jobCount, tenderCount, feedCount, marketCount] = await Promise.all([
    db.article.count({ where: { published: true, deletedAt: null } }),
    db.job.count({ where: { active: true, deletedAt: null } }),
    db.tender.count({ where: { active: true, deletedAt: null } }),
    db.rssFeed.count({ where: { active: true } }),
    db.marketDatum.count({ where: { active: true } }),
  ]);

  return {
    success: true,
    lastRun,
    database: {
      articles: articleCount,
      jobs: jobCount,
      tenders: tenderCount,
      rssFeeds: feedCount,
      marketData: marketCount,
    },
    sources: [
      "RSS Feeds (10 feeds)",
      "Parliament of Namibia",
      "Government Portals",
      "Legal Desk (Supreme Court + Legislation)",
      "Tenders Live (4 procurement portals)",
      "Job Scraper (3 job boards + LinkedIn)",
      "Market Data (Forex + Crypto + Commodities + JSE)",
      "Sports (NFA + BBC Sport Africa)",
      "Culture & Education (UNAM + Arts Council + Today in History)",
      "Environment (MEFT + Conservation feeds)",
    ],
  };
}
