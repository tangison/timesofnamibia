import { NextResponse } from "next/server";
import { getTickerItems } from "@/lib/data";

export async function GET() {
  try {
    const items = await getTickerItems();
    return NextResponse.json({ success: true, items });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch ticker items";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
