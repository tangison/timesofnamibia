// ============================================================
// Times of Namibia - Directory Data Layer (Phase 4/6)
//
// Server-side functions to fetch directory places from Convex.
// ============================================================

import { convexClient } from "@/lib/convex";
import { api } from "@convex/_generated/api";

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
}

export async function getDirectoryPlaces(options?: {
  limit?: number;
  type?: string;
}): Promise<DirectoryPlace[]> {
  if (!convexClient) return [];
  try {
    return await convexClient.query(api.queries.listDirectoryPlaces, {
      limit: options?.limit ?? 100,
      type: options?.type,
    });
  } catch (err) {
    console.warn("[directory] Failed to fetch places:", err instanceof Error ? err.message : err);
    return [];
  }
}

export async function getDirectoryPlaceBySlug(slug: string): Promise<DirectoryPlace | null> {
  if (!convexClient) return null;
  try {
    return await convexClient.query(api.queries.getDirectoryPlace, { slug });
  } catch (err) {
    console.warn("[directory] Failed to fetch place:", err instanceof Error ? err.message : err);
    return null;
  }
}
