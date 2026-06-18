// ============================================================
// Times of Namibia — Newsletter Subscription API (TANGISON)
// Validation: Zod schema. Rate limit: 5/hour/IP.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeNewsletter } from "@/lib/data";
import { rateLimit } from "@/lib/auth";

const SubscribeSchema = z.object({
  email: z.string().email().max(254),
  name: z.string().trim().min(1).max(100).optional(),
});

export async function POST(request: NextRequest) {
  if (rateLimit(request, { windowMs: 60 * 60_000, max: 5 })) {
    return NextResponse.json(
      { success: false, error: "Too many subscription attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = SubscribeSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstError?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    const subscriber = await subscribeNewsletter(parsed.data.email, parsed.data.name);
    return NextResponse.json({ success: true, subscriber });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Subscription failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
