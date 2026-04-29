import { NextResponse } from "next/server";
import { getMarketData } from "@/lib/data";

export async function GET() {
  try {
    const data = await getMarketData();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch market data";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
