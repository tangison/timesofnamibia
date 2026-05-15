// ============================================================
// Times of Namibia — Next.js Catch-All Proxy to FastAPI Backend
// Route: /api/proxy/[...path]
//
// Usage: fetch('/api/proxy/jobs?region=Khomas')
//   proxies to → BACKEND_URL/api/jobs?region=Khomas
//
// Only active when BACKEND_URL is set in .env.local
// ============================================================

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/$/, "");
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET ?? "";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

async function proxyRequest(
  request: NextRequest,
  params: { path: string[] }
) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { success: false, error: "BACKEND_URL not configured" },
      { status: 503 }
    );
  }

  const pathSegments = params.path ?? [];
  const search = request.nextUrl.search ?? "";
  const targetUrl = `${BACKEND_URL}/api/${pathSegments.join("/")}${search}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Internal-Secret": INTERNAL_API_SECRET,
  };

  const isPost = request.method === "POST";
  let body: string | undefined;
  if (isPost) {
    try {
      body = JSON.stringify(await request.json());
    } catch {
      body = undefined;
    }
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      // 30s timeout
      signal: AbortSignal.timeout(30_000),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proxy error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 502 }
    );
  }
}
