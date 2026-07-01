"use client";

import { ExternalLink } from "lucide-react";

interface SidebarAdProps {
  imageUrl?: string;
  targetUrl?: string;
  altText?: string;
}

/**
 * Phase 8: SidebarAd component.
 * Premium sidebar advertisement for homepage and article pages.
 */
export default function SidebarAd({ imageUrl, targetUrl, altText }: SidebarAdProps) {
  const adImage = imageUrl || "/brand-card.png";
  const adUrl = targetUrl || "https://tangison.com";
  const adAlt = altText || "Tangison - Applied AI. Built in Africa.";

  return (
    <a
      href={adUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block group border border-ton-black/10 hover:border-ton-red/30 transition-colors"
    >
      <div className="aspect-[4/3] overflow-hidden bg-ton-navy">
        <img
          src={adImage}
          alt={adAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 text-center">
        <p className="font-serif text-lg font-bold text-ton-black mb-1">Tangison</p>
        <p className="font-mono text-[8px] uppercase tracking-widest text-ton-black/40 mb-2">
          Applied AI. Built in Africa.
        </p>
        <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-ton-red">
          Learn More <ExternalLink size={10} />
        </span>
      </div>
    </a>
  );
}
