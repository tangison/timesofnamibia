// ============================================================
// Times of Namibia - Directory Data Layer (Phase 4/6)
//
// Server-side functions to fetch directory places from Convex.
// Falls back to a curated static dataset when Convex is
// unavailable (free-plan limits, network error, env not set).
// ============================================================

import { convexClient } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import { STATIC_PLACES } from "./directoryStaticFallback";

export interface DirectoryPlace {
  _id: string;
  slug: string;
  name: string;
  type: string;
  region: string;
  short_description: string;
  rich_description: string;
  seo_meta_description: string;
  coordinates: { lat: number; lng: number };
  images: Array<{
    url: string;
    webp_url?: string;
    caption: string;
    source: string;
    license: string;
    width?: number;
    height?: number;
    alt_text: string;
  }>;
  key_facts: Array<{ label: string; value: string }>;
  best_time_to_visit: string;
  activities: string[];
  official_url: string;
  booking_url?: string;
  related_places: string[];
  gallery_featured: boolean;
  created_at?: number;
  updated_at?: number;
}

export async function getDirectoryPlaces(options?: {
  limit?: number;
  type?: string;
}): Promise<DirectoryPlace[]> {
  const limit = options?.limit ?? 100;
  const type = options?.type;

  // Try Convex first
  if (convexClient) {
    try {
      const result = await convexClient.query(api.queries.listDirectoryPlaces, {
        limit,
        type,
      });
      // If Convex returned real data, use it
      if (result && result.length > 0) {
        return result as DirectoryPlace[];
      }
      // Convex returned empty (table empty or never seeded) — fall through to static
      console.warn(
        "[directory] Convex returned 0 places — falling back to static dataset. " +
          "If this persists, the Convex deployment may be disabled or unseeded."
      );
    } catch (err) {
      console.warn(
        "[directory] Convex query failed, falling back to static dataset:",
        err instanceof Error ? err.message : err
      );
    }
  } else {
    console.warn(
      "[directory] Convex client not configured (NEXT_PUBLIC_CONVEX_URL unset). Using static fallback dataset."
    );
  }

  // Static fallback
  let result = STATIC_PLACES;
  if (type) {
    result = result.filter((p) => p.type === type);
  }
  return result.slice(0, limit);
}

export async function getDirectoryPlaceBySlug(slug: string): Promise<DirectoryPlace | null> {
  // Try Convex first
  if (convexClient) {
    try {
      const result = await convexClient.query(api.queries.getDirectoryPlace, { slug });
      if (result) {
        return result as DirectoryPlace;
      }
      // Convex returned null — fall through to static
    } catch (err) {
      console.warn(
        "[directory] Convex getDirectoryPlace failed, falling back to static dataset:",
        err instanceof Error ? err.message : err
      );
    }
  }

  // Static fallback
  return STATIC_PLACES.find((p) => p.slug === slug) || null;
}
