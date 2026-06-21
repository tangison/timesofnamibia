// ============================================================
// Times of Namibia — Community Contribution API
// Rate limited: 3/hour/IP. Validates + forwards to Convex.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { convexClient } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import { rateLimit } from "@/lib/auth";

const ContributeSchema = z.object({
  title: z.string().trim().min(5).max(300),
  body: z.string().trim().min(50).max(10_000),
  region: z.string().trim().max(50).optional(),
  category: z.string().trim().max(50).optional(),
  submitterName: z.string().trim().min(2).max(100),
  submitterEmail: z.string().email().max(254),
  imageUrls: z.array(z.string().url()).max(5).default([]),
});

export async function POST(request: NextRequest) {
  // Rate limit: 3 submissions per hour per IP
  if (rateLimit(request, { windowMs: 60 * 60_000, max: 3 })) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = ContributeSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    if (convexClient) {
      const result = await convexClient.mutation(api.mutations.submitContribution, parsed.data);
      return NextResponse.json({ success: true, id: result.id });
    }

    return NextResponse.json(
      { error: "Convex not configured" },
      { status: 503 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
