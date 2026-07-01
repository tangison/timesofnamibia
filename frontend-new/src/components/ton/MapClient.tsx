"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validPlaces = places.filter(
    (p) => p.coordinates && p.coordinates.lat && p.coordinates.lng && !isNaN(p.coordinates.lat) && !isNaN(p.coordinates.lng)
  );

  // Don't render map on server - Leaflet requires window
  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="font-serif text-4xl font-bold text-ton-black mb-3">Interactive Map of Namibia</h1>
        <div className="w-full aspect-[4/3] bg-ton-navy/5 animate-pulse" />
      </div>
    );
  }

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
        {/* Map - real Leaflet + OpenStreetMap tiles */}
        <div className="lg:col-span-8">
          <div className="w-full h-[500px] border border-ton-black/10 overflow-hidden">
            <MapContainer
              center={[-22.0, 17.0]}
              zoom={6}
              style={{ width: "100%", height: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {validPlaces.map((place) => (
                <CircleMarker
                  key={place._id}
                  center={[place.coordinates.lat, place.coordinates.lng]}
                  radius={8}
                  pathOptions={{
                    color: TYPE_COLORS[place.type] || "#000",
                    fillColor: TYPE_COLORS[place.type] || "#000",
                    fillOpacity: 0.7,
                  }}
                  eventHandlers={{
                    click: () => setSelectedPlace(place),
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: "150px" }}>
                      <strong>{place.name}</strong>
                      <br />
                      <span style={{ fontSize: "11px", color: "#666" }}>{place.region}</span>
                      <br />
                      <a
                        href={`/know-namibia/${place.slug}`}
                        style={{ fontSize: "11px", color: "#dc2626" }}
                      >
                        View Full Page
                      </a>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
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
