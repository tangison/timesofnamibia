import { NextRequest, NextResponse } from "next/server";
import { ingestFeed, ingestAllFeeds } from "@/lib/rss-ingestion";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.all === true) {
      const results = await ingestAllFeeds();
      return NextResponse.json({ success: true, results });
    }

    if (body.feedId && typeof body.feedId === "string") {
      const result = await ingestFeed(body.feedId);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json(
      { success: false, error: "Provide { feedId } or { all: true }" },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Ingestion failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
