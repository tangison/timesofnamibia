"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";

/**
 * Breaking News Ticker - scrolls horizontally, fetches latest articles
 * from the API every 60 seconds for real-time updates.
 */
export default function BreakingTicker() {
  const [headlines, setHeadlines] = useState<{ text: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeadlines() {
      try {
        const res = await fetch("/api/articles?limit=15");
        const data = await res.json();
        const items = (data.articles || []).map((a: any) => ({
          text: a.headline,
          slug: a.slug,
        }));
        setHeadlines(items);
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    }
    fetchHeadlines();
    // Refresh every 60 seconds for real-time updates
    const interval = setInterval(fetchHeadlines, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (loading || headlines.length === 0) return null;

  // Duplicate the headlines for seamless scrolling
  const display = [...headlines, ...headlines];

  return (
    <div className="bg-ton-black text-ton-cream overflow-hidden border-b border-ton-red/20">
      <div className="flex items-center">
        {/* Breaking News badge */}
        <div className="flex-shrink-0 bg-ton-red px-4 py-2 flex items-center gap-2 z-10">
          <Radio className="w-3 h-3 animate-pulse" />
          <span className="font-mono text-[9px] font-bold tracking-widest uppercase">Live</span>
        </div>

        {/* Scrolling headlines */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="flex items-center gap-8 whitespace-nowrap py-2"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: display.length * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {display.map((item, i) => (
              <a
                key={i}
                href={`/article/${item.slug}`}
                className="font-mono text-xs text-ton-cream/80 hover:text-ton-red transition-colors"
              >
                {item.text}
                <span className="text-ton-red/40 mx-4">▸</span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
