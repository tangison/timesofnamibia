import { NextRequest, NextResponse } from "next/server";
import { getRssFeeds } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const feeds = await getRssFeeds(activeOnly);
    return NextResponse.json({ success: true, feeds });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch feeds";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
