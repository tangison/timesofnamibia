"use client";

import React from "react";

export default function Masthead() {
  return (
    <header className="ton-masthead bg-ton-cream ton-border-bottom-editorial px-4 py-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* TON Badge */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="bg-ton-black text-ton-cream font-mono text-xs font-bold px-2.5 py-1 tracking-widest">
            TON
          </div>
          <div className="h-px flex-1 max-w-16 bg-ton-black/30" />
          <span className="font-mono text-xs text-ton-black/50 tracking-wider uppercase">
            Est. 2026
          </span>
          <div className="h-px flex-1 max-w-16 bg-ton-black/30" />
          <div className="bg-ton-red text-white font-mono text-xs font-bold px-2.5 py-1 tracking-widest flex items-center gap-1.5">
            <span className="ton-live-dot" style={{ width: 6, height: 6 }} />
            LIVE
          </div>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-ton-black leading-none">
          TIMES OF NAMIBIA
        </h1>

        {/* Tagline */}
        <p className="font-serif italic text-ton-black/60 text-sm sm:text-base mt-2 tracking-wide">
          Namibia. Informed. Instantly.
        </p>

        {/* Edition info */}
        <div className="flex items-center justify-center gap-3 mt-3 font-mono text-xs text-ton-black/40">
          <span>Vol. I</span>
          <span>•</span>
          <span>No. {Math.floor(Math.random() * 300) + 100}</span>
          <span>•</span>
          <span>
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
