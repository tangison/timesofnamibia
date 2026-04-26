"use client";

import { useState } from "react";
import { TICKER_ITEMS } from "@/lib/ton-data";

export default function Ticker() {
  const [paused, setPaused] = useState(false);
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bg-ton-black text-ton-cream overflow-hidden ton-ticker-wrapper">
      <div className="flex items-center">
        <button
          onClick={() => setPaused(!paused)}
          className="flex-shrink-0 bg-ton-red px-2 sm:px-3 py-1.5 font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 min-h-[36px] active:opacity-80"
          aria-label={paused ? "Resume ticker" : "Pause ticker"}
        >
          <span className="ton-live-dot" />
          LIVE
        </button>
        <div
          className="overflow-hidden flex-1 py-1.5 cursor-pointer"
          onClick={() => setPaused(!paused)}
          role="marquee"
          aria-label="News ticker - tap to pause"
        >
          <div className={`ton-ticker-track ${paused ? "ton-ticker-paused" : ""}`}>
            {doubled.map((item, i) => (
              <span
                key={i}
                className="font-mono text-[10px] sm:text-xs tracking-wide px-4 sm:px-6 text-ton-cream/90"
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
