"use client";

import React from "react";
import { TICKER_ITEMS } from "@/lib/ton-data";

export default function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bg-ton-black text-ton-cream overflow-hidden ton-ticker-wrapper">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-ton-red px-3 py-1.5 font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2">
          <span className="ton-live-dot" />
          LIVE
        </div>
        <div className="overflow-hidden flex-1 py-1.5">
          <div className="ton-ticker-track">
            {doubled.map((item, i) => (
              <span
                key={i}
                className="font-mono text-xs tracking-wide px-6 text-ton-cream/90"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
