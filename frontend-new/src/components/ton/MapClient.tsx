"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface MapPlace {
  _id: string;
  slug: string;
  name: string;
  type: string;
  region: string;
  coordinates: { lat: number; lng: number };
  images: Array<{ webp_url?: string; alt_text: string }>;
}

const TYPE_COLORS: Record<string, string> = {
  park: "#10b981",
  landmark: "#ef4444",
  town: "#3b82f6",
  wildlife: "#f59e0b",
  geological: "#8b5cf6",
  cultural: "#ec4899",
};

const TYPE_LABELS: Record<string, string> = {
  park: "Parks",
  landmark: "Landmarks",
  town: "Towns",
  wildlife: "Wildlife",
  geological: "Geological",
  cultural: "Cultural",
};

export default function MapClient({ places }: { places: MapPlace[] }) {
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);

  // Project lat/lng to x/y on a simple SVG map of Namibia
  // Namibia bounds: lat -29 to -17, lng 11 to 25
  const project = (lat: number, lng: number) => {
    const x = ((lng - 11) / (25 - 11)) * 100;
    const y = ((-17 - lat) / (-17 - (-29))) * 100;
    return { x, y };
  };

  const placeMarkers = useMemo(() => {
    return places
      .filter((p) => p.coordinates && p.coordinates.lat && p.coordinates.lng)
      .map((p) => ({
        ...p,
        pos: project(p.coordinates.lat, p.coordinates.lng),
      }));
  }, [places]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <h1 className="font-serif text-4xl font-bold text-ton-black mb-3">Interactive Map of Namibia</h1>
      <p className="font-sans text-ton-black/50 mb-8">Click any marker to explore the place</p>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <div key={type} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: TYPE_COLORS[type] }}
            />
            <span className="font-mono text-[9px] uppercase tracking-widest text-ton-black/50">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map */}
        <div className="lg:col-span-8">
          <div className="relative w-full aspect-[4/3] bg-ton-navy/5 border border-ton-black/10 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              {/* Namibia outline (simplified) */}
              <path
                d="M 5,10 L 15,5 L 30,3 L 50,2 L 70,3 L 85,5 L 92,15 L 95,30 L 93,50 L 90,70 L 85,85 L 75,92 L 60,95 L 40,93 L 20,90 L 10,80 L 5,60 Z"
                fill="#0B1D3A"
                opacity="0.1"
                stroke="#0B1D3A"
                strokeWidth="0.3"
              />
              {/* Markers */}
              {placeMarkers.map((p) => (
                <circle
                  key={p._id}
                  cx={p.pos.x}
                  cy={p.pos.y}
                  r="1.2"
                  fill={TYPE_COLORS[p.type] || "#000"}
                  stroke="#fff"
                  strokeWidth="0.3"
                  className="cursor-pointer hover:r-2 transition-all"
                  onClick={() => setSelectedPlace(p)}
                >
                  <title>{p.name}</title>
                </circle>
              ))}
            </svg>
          </div>
        </div>

        {/* Selected place info */}
        <div className="lg:col-span-4">
          {selectedPlace ? (
            <div className="border border-ton-black/10 p-5">
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: TYPE_COLORS[selectedPlace.type] }}
              />
              <span className="font-mono text-[9px] uppercase tracking-widest text-ton-black/40">
                {TYPE_LABELS[selectedPlace.type]}
              </span>
              <h3 className="font-serif font-bold text-lg text-ton-black mt-2 mb-2">{selectedPlace.name}</h3>
              <p className="font-sans text-sm text-ton-black/50 mb-3">{selectedPlace.region}</p>
              <p className="font-mono text-[9px] text-ton-black/30 mb-4">
                {selectedPlace.coordinates.lat.toFixed(4)}, {selectedPlace.coordinates.lng.toFixed(4)}
              </p>
              <Link
                href={`/know-namibia/${selectedPlace.slug}`}
                className="inline-flex items-center gap-2 bg-ton-navy text-white px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-ton-navy/80 transition-colors"
              >
                View Full Page
              </Link>
            </div>
          ) : (
            <div className="border border-ton-black/10 p-5 text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ton-black/30">
                Click a marker to see details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
