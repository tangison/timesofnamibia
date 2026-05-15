import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [feedCount, articleCount, lastFetched] = await Promise.all([
      db.rssFeed.count({ where: { active: true } }),
      db.article.count({ where: { published: true, deletedAt: null } }),
      db.rssFeed.findFirst({
        where: { active: true, lastFetched: { not: null } },
        orderBy: { lastFetched: "desc" },
        select: { lastFetched: true, name: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      activeFeeds: feedCount,
      publishedArticles: articleCount,
      lastFetched: lastFetched?.lastFetched || null,
      lastFetchedFeed: lastFetched?.name || null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get status";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
