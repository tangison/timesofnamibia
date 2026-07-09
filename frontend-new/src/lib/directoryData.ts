// ============================================================
// Times of Namibia - Directory Data Layer
//
// PRIMARY data source: src/data/places.ts (static, 89+ curated places)
// FALLBACK: Convex (when available and has richer data)
//
// The static file is the source of truth — no runtime dependency
// on Convex for the directory. Pages render at build time (SSG).
// ============================================================

import { convexClient } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import { places as STATIC_PLACES } from "@/data/places";
import type { Place } from "@/data/places";

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

// ── Convert static Place → DirectoryPlace shape ──────────────
function staticToDirectory(p: Place): DirectoryPlace {
  return {
    _id: `static-${p.slug}`,
    slug: p.slug,
    name: p.name,
    type: p.category,
    region: p.region,
    short_description: p.summary,
    rich_description: p.description,
    seo_meta_description: p.summary.slice(0, 160),
    coordinates: p.coordinates || { lat: -22, lng: 17 },
    images: p.image
      ? [{
          url: p.image.url,
          caption: p.image.alt,
          source: p.image.credit,
          license: p.image.license,
          alt_text: p.image.alt,
        }]
      : [],
    key_facts: p.keyFacts,
    best_time_to_visit: "Year-round (May–September for cooler weather)",
    activities: [],
    official_url: p.sources[0]?.url || "",
    related_places: [],
    gallery_featured: !!p.image,
  };
}

// Get the static places in DirectoryPlace shape
const STATIC_DIRECTORY_PLACES: DirectoryPlace[] = STATIC_PLACES.map(staticToDirectory);

export async function getDirectoryPlaces(options?: {
  limit?: number;
  type?: string;
}): Promise<DirectoryPlace[]> {
  const limit = options?.limit ?? 100;
  const type = options?.type;

  // PRIMARY: static data (always available, no external dependency)
  let result = STATIC_DIRECTORY_PLACES;
  if (type) {
    result = result.filter((p) => p.type === type);
  }

  // If static has data, return it immediately
  if (result.length > 0) {
    return result.slice(0, limit);
  }

  // FALLBACK: try Convex if static returned nothing for this filter
  if (convexClient) {
    try {
      const convexResult = await convexClient.query(api.queries.listDirectoryPlaces, {
        limit,
        type,
      });
      if (convexResult && convexResult.length > 0) {
        return convexResult as DirectoryPlace[];
      }
    } catch (err) {
      console.warn(
        "[directory] Convex query failed (static already returned empty):",
        err instanceof Error ? err.message : err
      );
    }
  }

  return [];
}

export async function getDirectoryPlaceBySlug(slug: string): Promise<DirectoryPlace | null> {
  // PRIMARY: static data
  const staticPlace = STATIC_DIRECTORY_PLACES.find((p) => p.slug === slug);
  if (staticPlace) return staticPlace;

  // FALLBACK: try Convex
  if (convexClient) {
    try {
      const result = await convexClient.query(api.queries.getDirectoryPlace, { slug });
      if (result) return result as DirectoryPlace;
    } catch (err) {
      console.warn(
        "[directory] Convex getDirectoryPlace failed:",
        err instanceof Error ? err.message : err
      );
    }
  }

  return null;
}
