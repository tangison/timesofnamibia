"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";
import { BrandedImageFallback } from "./BrandedImageFallback";

interface DirectoryImage {
  url: string;
  webp_url?: string;
  caption: string;
  alt_text: string;
}

interface DirectoryPlace {
  _id: string;
  slug: string;
  name: string;
  type: string;
  region: string;
  short_description: string;
  images: DirectoryImage[];
}

const TYPE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Parks", value: "park" },
  { label: "Landmarks", value: "landmark" },
  { label: "Towns", value: "town" },
  { label: "Wildlife", value: "wildlife" },
  { label: "Geological", value: "geological" },
  { label: "Cultural", value: "cultural" },
];

const TYPE_LABELS: Record<string, string> = {
  park: "Park",
  landmark: "Landmark",
  town: "Town",
  wildlife: "Wildlife",
  geological: "Geological",
  cultural: "Cultural",
};

export default function DirectoryListClient({ places }: { places: DirectoryPlace[] }) {
  const [activeType, setActiveType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlaces = useMemo(() => {
    let result = places;
    if (activeType !== "all") {
      result = result.filter((p) => p.type === activeType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      );
    }
    return result;
  }, [places, activeType, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Hero header */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ton-black tracking-tight">
          Discover Namibia
        </h1>
        <p className="font-sans text-ton-black/50 mt-3 max-w-2xl mx-auto">
          Explore {places.length} national parks, landmarks, towns, wildlife, geological wonders, and cultural heritage sites across Namibia.
        </p>
      </div>

      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ton-black/45" />
          <input
            type="text"
            placeholder="Search places, regions, or types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Namibia directory places"
            className="w-full pl-12 pr-4 py-3 border border-ton-black/15 bg-white font-sans text-sm text-ton-black placeholder:text-ton-black/45 focus:outline-none focus:border-ton-red transition-colors"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8 border-b border-ton-black/10">
        {TYPE_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveType(filter.value)}
            className={`flex-shrink-0 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              activeType === filter.value
                ? "bg-ton-black text-white"
                : "text-ton-black/50 hover:text-ton-black border border-ton-black/10 hover:border-ton-black/30"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Quick links */}
      <div className="flex gap-4 mb-8 text-center justify-center flex-wrap">
        <Link href="/know-namibia/gallery" className="font-mono text-[10px] uppercase tracking-widest text-ton-red hover:text-ton-black transition-colors">
          Gallery
        </Link>
        <Link href="/know-namibia/big-five" className="font-mono text-[10px] uppercase tracking-widest text-ton-red hover:text-ton-black transition-colors">
          Big Five
        </Link>
        <Link href="/know-namibia/map" className="font-mono text-[10px] uppercase tracking-widest text-ton-red hover:text-ton-black transition-colors">
          Interactive Map
        </Link>
      </div>

      {/* Results count */}
      <p className="font-mono text-[10px] uppercase tracking-widest text-ton-black/45 mb-6">
        {filteredPlaces.length} {filteredPlaces.length === 1 ? "place" : "places"} found
      </p>

      {/* Place grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map((place, i) => (
          <PlaceCard key={place._id} place={place} index={i} />
        ))}
      </div>

      {/* Empty state */}
      {filteredPlaces.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ton-black/45">
            No places found matching your search
          </p>
        </div>
      )}
    </div>
  );
}

// ── Place Card ──────────────────────────────────────────────────
// Lifted into its own component so each card can track its own
// image-failed state independently.
function PlaceCard({ place, index }: { place: DirectoryPlace; index: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  const heroImage = place.images[0];
  // Prefer webp_url, fall back to url (static fallback dataset uses url only)
  const imageUrl = heroImage?.webp_url || heroImage?.url;
  const hasUsableImage = imageUrl && !imageFailed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 6) * 0.08, type: "spring", stiffness: 100, damping: 15 }}
    >
      <Link
        href={`/know-namibia/${place.slug}`}
        className="group block bg-ton-cream/50 border-t-4 border-transparent hover:border-ton-red transition-all duration-300 h-full"
      >
        {/* Hero image — fixed aspect ratio reserves space even when
            image fails or is missing. Prevents text overlap. */}
        <div className="relative aspect-[16/9] overflow-hidden bg-ton-navy">
          {hasUsableImage ? (
            <img
              src={imageUrl}
              alt={heroImage!.alt_text || place.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <BrandedImageFallback contextText={place.name} />
          )}
          <span className="absolute top-2 left-2 bg-ton-red text-white font-mono text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 z-10">
            {TYPE_LABELS[place.type] || place.type}
          </span>
        </div>
        {/* Content — min-height prevents card collapse on missing content */}
        <div className="p-5 min-h-[180px] flex flex-col">
          <h3 className="font-serif font-bold text-lg text-ton-black leading-snug mb-2 group-hover:text-ton-red transition-colors">
            {place.name}
          </h3>
          <p className="font-sans text-sm text-ton-black/50 leading-relaxed mb-3 line-clamp-2 flex-1">
            {place.short_description}
          </p>
          <div className="flex items-center justify-between text-[10px] font-mono text-ton-black/45 uppercase tracking-wider pt-3 border-t border-ton-black/5">
            <span>{place.region}</span>
            <span className="text-ton-red">Explore</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
