// ============================================================
// Times of Namibia - Directory Data Layer
//
// PRIMARY data source: src/data/namibia.ts (static, 186+ curated topics)
// FALLBACK: Convex (when available and has richer data)
//
// The static file is the source of truth — no runtime dependency
// on Convex for the directory. Pages render at build time (SSG).
// ============================================================

import { convexClient } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import { topics as STATIC_TOPICS, type NamibiaTopic } from "@/data/namibia";

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

// ── Convert static NamibiaTopic → DirectoryPlace shape ──────
function staticToDirectory(t: NamibiaTopic): DirectoryPlace {
  return {
    _id: `static-${t.slug}`,
    slug: t.slug,
    name: t.name,
    type: t.category,
    region: t.subcategory,
    short_description: t.summary,
    rich_description: t.description,
    seo_meta_description: t.summary.slice(0, 160),
    coordinates: t.coordinates || { lat: -22, lng: 17 },
    images: t.image
      ? [{
          url: t.image.url,
          caption: t.image.alt,
          source: t.image.credit,
          license: t.image.license,
          alt_text: t.image.alt,
        }]
      : [],
    key_facts: t.keyFacts,
    best_time_to_visit: "Year-round (May–September for cooler weather)",
    activities: [],
    official_url: t.sources[0]?.url || "",
    related_places: [],
    gallery_featured: !!t.image,
  };
}

// Get the static topics in DirectoryPlace shape
const STATIC_DIRECTORY_PLACES: DirectoryPlace[] = STATIC_TOPICS.map(staticToDirectory);

export async function getDirectoryPlaces(options?: {
  limit?: number;
  type?: string;
}): Promise<DirectoryPlace[]> {
  const limit = options?.limit ?? 200;
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

