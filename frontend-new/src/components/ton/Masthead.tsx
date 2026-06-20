"use client";

import { motion } from "framer-motion";
import { Search, Menu } from "lucide-react";
import { useState } from "react";
import OffCanvasMenu from "./OffCanvasMenu";

const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
  mass: 1,
};

/**
 * Times of Namibia — Premium Masthead
 *
 * Design: UnifrakturMaguntia wordmark (the classic newspaper blackletter),
 * minimal navigation, dark-theme friendly. The wordmark IS the logo —
 * no separate icon needed. The wordmark font itself is the brand mark.
 */
export default function Masthead() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="sticky top-0 z-50 bg-ton-cream/95 backdrop-blur-md border-b border-ton-black/10 px-4 md:px-8 py-4 flex justify-between items-center"
      >
        {/* Wordmark — UnifrakturMaguntia blackletter */}
        <a href="/" className="flex flex-col group">
          <div
            className="text-3xl md:text-5xl tracking-tight leading-none text-ton-black group-hover:text-ton-red transition-colors duration-500"
            style={{ fontFamily: "var(--font-unifraktur), 'UnifrakturMaguntia', serif" }}
          >
            Times of Namibia
          </div>
          <div className="text-[0.55rem] md:text-xs font-bold tracking-[0.2em] uppercase mt-1 text-ton-black/40">
            Unbiased News. Global Reach.
          </div>
        </a>

        {/* Navigation — hidden on mobile, premium tracking */}
        <nav className="hidden lg:flex items-center gap-8 font-bold text-sm tracking-widest text-ton-black/70 uppercase">
          <a href="/section/national" className="hover:text-ton-red transition-colors duration-300">News</a>
          <a href="/section/economy" className="hover:text-ton-red transition-colors duration-300">Business</a>
          <a href="/section/opinion" className="hover:text-ton-red transition-colors duration-300">Opinion</a>
          <a href="/section/sport" className="hover:text-ton-red transition-colors duration-300">Sport</a>
          <a href="/section/technology" className="hover:text-ton-red transition-colors duration-300">Tech</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6 text-ton-black/70">
          <button
            className="hover:text-ton-red transition-colors duration-300"
            aria-label="Search"
            onClick={() => window.dispatchEvent(new CustomEvent("ton-search-open"))}
          >
            <Search size={22} />
          </button>
          <button
            className="hover:text-ton-red transition-colors duration-300"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.header>

      {/* Premium Off-Canvas Menu */}
      <OffCanvasMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
