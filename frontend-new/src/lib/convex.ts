// ============================================================
// Times of Namibia - Convex client (TANGISON)
//
// Exports a typed Convex client for use in server components,
// route handlers, and client components.
//
// Usage:
//   import { convexClient } from "@/lib/convex";
//   import { api } from "@convex/_generated/api";
//
//   // In server components:
//   const articles = await convexClient.query(api.queries.listArticles, { limit: 10 });
//
//   // In client components (reactive):
//   const articles = useQuery(api.queries.listArticles, { limit: 10 });
//
// Environment variables required:
//   NEXT_PUBLIC_CONVEX_URL - the Convex deployment URL (e.g. https://happy-anon-123.convex.cloud)
// ============================================================

import { ConvexHttpClient } from "convex/browser";
import type { api } from "@convex/_generated/api";

// Singleton - re-use the HTTP client across hot-reloads in dev
const globalForConvex = globalThis as unknown as {
  convexClient: ConvexHttpClient | undefined;
};

function createClient(): ConvexHttpClient | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    // Convex not configured yet - return null so callers can fall back gracefully
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[convex] NEXT_PUBLIC_CONVEX_URL not set. Convex queries will return empty results. " +
          "Run `npx convex dev` to provision a deployment."
      );
    }
    return null;
  }
  return new ConvexHttpClient(url);
}

export const convexClient = globalForConvex.convexClient ?? createClient();

if (process.env.NODE_ENV !== "production" && convexClient) {
  globalForConvex.convexClient = convexClient;
}

// Re-export the api for convenience
export { api };
