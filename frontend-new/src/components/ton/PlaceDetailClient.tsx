"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import ShareToolbar from "./ShareToolbar";
import { BrandedImageFallback } from "./BrandedImageFallback";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface DirectoryImage {
  url: string;
  webp_url?: string;
  caption: string;
  source: string;
  license: string;
  alt_text: string;
}

interface DirectoryPlace {
  _id: string;
  slug: string;
  name: string;
  type: string;
  region: string;
  short_description: string;
  rich_description: string;
  seo_meta_description: string;
  coordinates: { lat: number; lng: number };
  images: DirectoryImage[];
  key_facts: Array<{ label: string; value: string }>;
  best_time_to_visit: string;
  activities: string[];
  official_url: string;
  booking_url?: string;
}

interface PlaceDetailClientProps {
  place: DirectoryPlace;
  relatedPlaces: DirectoryPlace[];
}

const TYPE_LABELS: Record<string, string> = {
  park: "Park",
  landmark: "Landmark",
  town: "Town",
  wildlife: "Wildlife",
  geological: "Geological",
  cultural: "Cultural",
};

export default function PlaceDetailClient({ place, relatedPlaces }: PlaceDetailClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const heroImage = place.images[0];

  const markdownComponents = {
    h1: ({ node, ...props }: any) => <h1 className="font-serif text-2xl font-bold text-ton-black mt-8 mb-4" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mt-8 mb-4 leading-tight" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="font-serif text-lg font-bold text-ton-black mt-6 mb-3" {...props} />,
    p: ({ node, ...props }: any) => <p className="font-serif text-base sm:text-lg text-ton-black/70 leading-[1.8] mb-5" {...props} />,
    strong: ({ node, ...props }: any) => <strong className="font-bold text-ton-black" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-5 space-y-1" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 mb-5 space-y-1" {...props} />,
    li: ({ node, ...props }: any) => <li className="font-serif text-base text-ton-black/70 leading-[1.8]" {...props} />,
  };

  const renderDescription = (desc: string) => {
    return <ReactMarkdown components={markdownComponents}>{desc}</ReactMarkdown>;
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex((prev) => prev !== null ? (prev + 1) % place.images.length : null);
  const prevImage = () => setLightboxIndex((prev) => prev !== null ? (prev - 1 + place.images.length) % place.images.length : null);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/know-namibia" className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40 hover:text-ton-red transition-colors">
          Know Namibia
        </Link>
        <span className="font-mono text-[10px] text-ton-black/20 mx-2">/</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ton-black/60">{place.name}</span>
      </div>

      {/* Hero image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-ton-navy mb-6">
        {heroImage?.webp_url ? (
          <img
            src={heroImage.webp_url}
            alt={heroImage.alt_text || place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <BrandedImageFallback contextText={place.name} />
        )}
        {heroImage && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="font-mono text-[9px] text-white/80 uppercase tracking-widest">
              {heroImage.caption}
            </p>
            <p className="font-mono text-[8px] text-white/50 mt-1">
              Source: {heroImage.source} | License: {heroImage.license}
            </p>
          </div>
        )}
      </div>

      {/* Name and badges */}
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-ton-red text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold">
          {TYPE_LABELS[place.type] || place.type}
        </span>
        <span className="font-mono text-[9px] tracking-widest uppercase text-ton-black/40 border border-ton-black/15 px-1.5 py-0.5">
          {place.region}
        </span>
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-[1.05] tracking-tight mb-4">
        {place.name}
      </h1>

      <p className="font-serif italic text-ton-black/50 text-lg mb-6 max-w-3xl">
        {place.short_description}
      </p>

      {/* ShareToolbar */}
      <div className="sticky top-[60px] z-30 py-3 bg-ton-cream/95 backdrop-blur-sm border-b border-ton-black/10 mb-6">
        <ShareToolbar
          title={place.name}
          url={`/know-namibia/${place.slug}`}
          articleContent={place.rich_description}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: rich description */}
        <div className="lg:col-span-8">
          <div className="prose prose-lg max-w-none">
            {renderDescription(place.rich_description)}
          </div>

          {/* Gallery section */}
          {place.images.length > 1 && (
            <div className="mt-12">
              <h2 className="font-serif text-2xl font-bold text-ton-black mb-6 border-l-4 border-ton-red pl-4">
                Image Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {place.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => openLightbox(i)}
                    className="relative aspect-square overflow-hidden bg-ton-navy group cursor-pointer"
                  >
                    {img.webp_url ? (
                      <img
                        src={img.webp_url}
                        alt={img.alt_text || place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <BrandedImageFallback contextText={place.name} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={place.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ton-navy text-white px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-ton-navy/80 transition-colors"
            >
              Visit Official Site
            </a>
            {place.booking_url && (
              <a
                href={place.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-ton-red text-white px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-ton-red/80 transition-colors"
              >
                Book Accommodation
              </a>
            )}
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Key Facts */}
          {place.key_facts.length > 0 && (
            <div className="border-l-4 border-ton-red bg-ton-navy/[0.03] p-5">
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-ton-red mb-3">
                Key Facts
              </h3>
              <dl className="space-y-2">
                {place.key_facts.map((fact, i) => (
                  <div key={i} className="flex justify-between gap-3 border-b border-ton-black/5 pb-2">
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40">{fact.label}</dt>
                    <dd className="font-sans text-sm text-ton-black/70 text-right font-medium">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Best Time to Visit */}
          <div className="border border-ton-black/10 p-5">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-ton-red mb-3">
              Best Time to Visit
            </h3>
            <p className="font-serif text-sm text-ton-black/70 leading-relaxed">
              {place.best_time_to_visit}
            </p>
          </div>

          {/* Activities */}
          <div className="border border-ton-black/10 p-5">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-ton-red mb-3">
              Activities
            </h3>
            <ul className="space-y-1.5">
              {place.activities.map((activity, i) => (
                <li key={i} className="font-sans text-sm text-ton-black/60 flex items-start gap-2">
                  <span className="text-ton-red mt-0.5">-</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coordinates */}
          <div className="border border-ton-black/10 p-5">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-ton-red mb-3">
              Coordinates
            </h3>
            <p className="font-mono text-sm text-ton-black/60">
              {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}
            </p>
            <Link
              href="/know-namibia/map"
              className="font-mono text-[9px] uppercase tracking-widest text-ton-red hover:text-ton-black transition-colors mt-2 inline-block"
            >
              View on Map
            </Link>
          </div>
        </div>
      </div>

      {/* Related Places */}
      {relatedPlaces.length > 0 && (
        <div className="mt-16">
          <h2 className="font-serif text-2xl font-bold text-ton-black mb-6 border-l-4 border-ton-red pl-4">
            Related Places
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPlaces.map((rp) => {
              const rpImage = rp.images[0];
              return (
                <Link
                  key={rp._id}
                  href={`/know-namibia/${rp.slug}`}
                  className="group block bg-ton-cream/50 border-t-4 border-transparent hover:border-ton-red transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-ton-navy">
                    {rpImage?.webp_url ? (
                      <img
                        src={rpImage.webp_url}
                        alt={rpImage.alt_text || rp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <BrandedImageFallback contextText={rp.name} />
                    )}
                  </div>
                  <div className="p-4">
                    <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-ton-red">
                      {TYPE_LABELS[rp.type] || rp.type}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-ton-black mt-1 group-hover:text-ton-red transition-colors">
                      {rp.name}
                    </h3>
                    <p className="font-sans text-xs text-ton-black/40 mt-1">{rp.region}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox modal */}
      {lightboxIndex !== null && place.images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Previous image"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Next image"
          >
            <ChevronRight size={36} />
          </button>
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={place.images[lightboxIndex].webp_url || place.images[lightboxIndex].url}
              alt={place.images[lightboxIndex].alt_text || place.name}
              className="max-w-full max-h-[75vh] object-contain"
            />
            <div className="mt-4 text-center max-w-2xl">
              <p className="font-sans text-sm text-white/80">
                {place.images[lightboxIndex].caption}
              </p>
              <p className="font-mono text-[9px] text-white/40 mt-1 uppercase tracking-widest">
                Source: {place.images[lightboxIndex].source} | License: {place.images[lightboxIndex].license}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
