"use client";

import { useState, useEffect } from "react";
import { getTickerItems } from "@/lib/data";

interface TickerItem {
  id: string;
  text: string;
  order: number;
  active: boolean;
}

export default function Ticker() {
  const [paused, setPaused] = useState(false);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickerItems = async () => {
      try {
        const items = await getTickerItems();
        setTickerItems(items);
      } catch (error) {
        console.error("Failed to fetch ticker items:", error);
        setTickerItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickerItems();
  }, []);

  // Don't render the ticker at all when there are no items — avoids
  // showing a "LIVE" badge with empty content.
  if (!loading && tickerItems.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-ton-black text-ton-cream overflow-hidden ton-ticker-wrapper border-b border-ton-cream/15">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-ton-red px-3 sm:px-4 py-2 font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase flex items-center gap-2 min-h-[36px]">
            <span className="ton-live-dot" />
            LOADING
          </div>
          <div className="overflow-hidden flex-1 py-2">
            <div className="font-mono text-[10px] sm:text-xs tracking-wide px-4 sm:px-6 text-ton-cream/90">
              Loading live news...
            </div>
          </div>
        </div>
      </div>
    );
  }

  const doubled = [...tickerItems.map(item => item.text + " ▸"), ...tickerItems.map(item => item.text + " ▸")];

  return (
    <div className="bg-ton-black text-ton-cream overflow-hidden ton-ticker-wrapper border-b border-ton-cream/15">
      <div className="flex items-center">
        <button
          onClick={() => setPaused(!paused)}
          className="flex-shrink-0 bg-ton-red px-3 sm:px-4 py-2 font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase flex items-center gap-2 min-h-[36px] active:opacity-80"
          aria-label={paused ? "Resume live news ticker" : "Pause live news ticker"}
        >
          <span className="ton-live-dot" />
          LIVE
        </button>
        <div
          className="overflow-hidden flex-1 py-2 cursor-pointer"
          onClick={() => setPaused(!paused)}
          
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
