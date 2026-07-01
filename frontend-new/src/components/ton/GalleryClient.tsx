"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { BrandedImageFallback } from "./BrandedImageFallback";

interface GalleryImage {
  url: string;
  webp_url?: string;
  caption: string;
  source: string;
  license: string;
  alt_text: string;
  placeName: string;
  placeSlug: string;
  placeType: string;
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

export default function GalleryClient({ places }: { places: any[] }) {
  const [activeType, setActiveType] = useState("all");
  const [lightboxImg, setLightboxImg] = useState<GalleryImage | null>(null);

  const allImages: GalleryImage[] = useMemo(() => {
    const imgs: GalleryImage[] = [];
    for (const place of places) {
      for (const img of place.images || []) {
        imgs.push({
          ...img,
          placeName: place.name,
          placeSlug: place.slug,
          placeType: place.type,
        });
      }
    }
    return imgs;
  }, [places]);

  const filteredImages = activeType === "all"
    ? allImages
    : allImages.filter((img) => img.placeType === activeType);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <h1 className="font-serif text-4xl font-bold text-ton-black mb-3">Namibia Gallery</h1>
      <p className="font-sans text-ton-black/50 mb-8">{filteredImages.length} images from across Namibia</p>

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

      {/* Masonry grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {filteredImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightboxImg(img)}
            className="block w-full break-inside-avoid mb-3 group relative overflow-hidden bg-ton-navy"
          >
            {img.webp_url ? (
              <img
                src={img.webp_url}
                alt={img.alt_text || img.placeName}
                className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity"
                loading="lazy"
              />
            ) : (
              <BrandedImageFallback contextText={img.placeName} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <div className="text-left">
                <p className="font-mono text-[8px] text-white/80 uppercase tracking-widest">{img.placeName}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ton-black/30">No images found</p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setLightboxImg(null)}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImg.webp_url || lightboxImg.url}
              alt={lightboxImg.alt_text || lightboxImg.placeName}
              className="max-w-full max-h-[70vh] object-contain"
            />
            <div className="mt-4 text-center max-w-2xl">
              <p className="font-sans text-sm text-white/80">{lightboxImg.caption}</p>
              <p className="font-mono text-[9px] text-white/40 mt-1 uppercase tracking-widest">
                Source: {lightboxImg.source} | License: {lightboxImg.license}
              </p>
              <Link
                href={`/know-namibia/${lightboxImg.placeSlug}`}
                className="font-mono text-[10px] uppercase tracking-widest text-ton-red hover:text-white mt-2 inline-block"
              >
                View {lightboxImg.placeName}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
