"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";

interface AdPopupProps {
  imageUrl?: string;
  targetUrl?: string;
  altText?: string;
}

/**
 * Phase 8: AdPopup component.
 * Displays a premium modal ad on first visit per session.
 * Uses sessionStorage to only show once per browser session.
 */
export default function AdPopup({ imageUrl, targetUrl, altText }: AdPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show once per session
    const shown = sessionStorage.getItem("ton_ad_shown");
    if (!shown) {
      const timer = setTimeout(() => {
        setShow(true);
        sessionStorage.setItem("ton_ad_shown", "true");
      }, 3000); // 3 second delay
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  const adImage = imageUrl || "/brand-card.png";
  const adUrl = targetUrl || "https://tangison.com";
  const adAlt = altText || "Tangison - Unbiased News. Global Reach.";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative max-w-md w-full bg-ton-navy border border-white/10">
        <button
          onClick={() => setShow(false)}
          className="absolute -top-3 -right-3 w-8 h-8 bg-white text-ton-navy rounded-full flex items-center justify-center hover:bg-ton-red hover:text-white transition-colors shadow-lg"
          aria-label="Close advertisement"
        >
          <X size={16} />
        </button>

        <a
          href={adUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={adImage}
              alt={adAlt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6 text-center">
            <p className="font-serif text-2xl font-bold text-white mb-2">
              Tangison
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/60 mb-4">
              Unbiased News. Global Reach.
            </p>
            <span className="inline-flex items-center gap-2 bg-white text-ton-navy px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-widest group-hover:bg-ton-red group-hover:text-white transition-colors">
              Learn More
              <ExternalLink size={12} />
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
