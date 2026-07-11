"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import OffCanvasMenu from "./OffCanvasMenu";
import { IconSearch, IconMenu } from "./BrandIcons";

const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
  mass: 1,
};

/**
 * Times of Namibia - Premium Masthead
 *
 * Mobile: wordmark on line 1, search + menu icons on line 2 (compact, two-line layout).
 * Desktop: wordmark left, nav center, actions right (single line).
 */
export default function Masthead() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="sticky top-0 z-50 bg-ton-cream/95 backdrop-blur-md border-b border-ton-black/10"
      >
        {/* Mobile layout - two lines */}
        <div className="lg:hidden">
          {/* Line 1: Wordmark */}
          <div className="px-4 pt-3 pb-1">
            <a href="/" className="block group">
              <div
                className="text-2xl tracking-tight leading-none text-ton-black group-hover:text-ton-red transition-colors duration-500"
                style={{ fontFamily: "var(--font-unifraktur), 'UnifrakturMaguntia', serif" }}
              >
                Times of Namibia
              </div>
              <div className="text-[0.5rem] font-bold tracking-[0.2em] uppercase mt-0.5 text-ton-black/40">
                Unbiased News. Global Reach.
              </div>
            </a>
          </div>
          {/* Line 2: Search + Menu icons */}
          <div className="flex items-center justify-end gap-4 px-4 pb-2">
            <button
              className="hover:text-ton-red transition-colors duration-300 text-ton-black/70"
              aria-label="Search"
              onClick={() => window.dispatchEvent(new CustomEvent("ton-search-open"))}
            >
              <IconSearch size={20} />
            </button>
            <button
              className="hover:text-ton-red transition-colors duration-300 text-ton-black/70"
              aria-label="Menu"
              onClick={() => setMenuOpen(true)}
            >
              <IconMenu size={22} />
            </button>
          </div>
        </div>

        {/* Desktop layout - single line */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4">
          {/* Wordmark */}
          <a href="/" className="flex flex-col group">
            <div
              className="text-5xl tracking-tight leading-none text-ton-black group-hover:text-ton-red transition-colors duration-500"
              style={{ fontFamily: "var(--font-unifraktur), 'UnifrakturMaguntia', serif" }}
            >
              Times of Namibia
            </div>
            <div className="text-xs font-bold tracking-[0.2em] uppercase mt-1 text-ton-black/40">
              Unbiased News. Global Reach.
            </div>
          </a>

          {/* Navigation — consolidated to avoid overlap with CategoryNav */}
          <nav className="flex items-center gap-8 font-bold text-sm tracking-widest text-ton-black/70 uppercase">
            <a href="/section/national" className="hover:text-ton-red transition-colors duration-300">National</a>
            <a href="/section/economy" className="hover:text-ton-red transition-colors duration-300">Business</a>
            <a href="/section/sport" className="hover:text-ton-red transition-colors duration-300">Sport</a>
            <a href="/know-namibia" className="hover:text-ton-red transition-colors duration-300">Know Namibia</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6 text-ton-black/70">
            <button
              className="hover:text-ton-red transition-colors duration-300"
              aria-label="Search"
              onClick={() => window.dispatchEvent(new CustomEvent("ton-search-open"))}
            >
              <IconSearch size={22} />
            </button>
            <button
              className="hover:text-ton-red transition-colors duration-300"
              aria-label="Menu"
              onClick={() => setMenuOpen(true)}
            >
              <IconMenu size={24} />
            </button>
          </div>
        </div>
      </motion.header>

      <OffCanvasMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
