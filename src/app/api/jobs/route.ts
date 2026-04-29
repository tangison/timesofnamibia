import { NextRequest, NextResponse } from "next/server";
import { getJobs } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const region = searchParams.get("region") || undefined;
    const source = searchParams.get("source") || undefined;
    const type = searchParams.get("type") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : undefined;

    const jobs = await getJobs({ region, source, type, limit });

    return NextResponse.json({ success: true, jobs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch jobs";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
