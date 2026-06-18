// ============================================================
// Times of Namibia — Catch-All Proxy to FastAPI Backend (TANGISON)
// SECURITY: GET → public read allow-list. POST/PUT/DELETE → admin only.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/$/, "");
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET ?? "";

const PUBLIC_GET_PATHS = ["v1/articles", "v1/stats", "v1/market"];

function isPublicGetPath(pathSegments: string[]): boolean {
  const joined = pathSegments.join("/");
  return PUBLIC_GET_PATHS.some((p) => joined === p || joined.startsWith(p + "/"));
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}

async function proxyRequest(request: NextRequest, params: { path: string[] }) {
  if (!BACKEND_URL) {
    return NextResponse.json({ success: false, error: "BACKEND_URL not configured" }, { status: 503 });
  }
  const pathSegments = params.path ?? [];
  const search = request.nextUrl.search ?? "";
  const targetUrl = `${BACKEND_URL}/api/${pathSegments.join("/")}${search}`;
  const method = request.method;

  if (method === "GET") {
    if (!isPublicGetPath(pathSegments)) {
      return NextResponse.json(
        { success: false, error: "Forbidden: path not on public GET allow-list" },
        { status: 403 }
      );
    }
  } else {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(method !== "GET" ? { "X-Internal-Secret": INTERNAL_API_SECRET } : {}),
  };

  let body: string | undefined;
  if (method !== "GET") {
    try { body = JSON.stringify(await request.json()); } catch { body = undefined; }
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method, headers, body,
      signal: AbortSignal.timeout(30_000),
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proxy error";
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
