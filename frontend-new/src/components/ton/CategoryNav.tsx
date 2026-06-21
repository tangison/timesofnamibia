"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

/**
 * Category Navigation Bar — sticky below the masthead.
 * Horizontal scrolling on mobile, full nav on desktop.
 */
const CATEGORIES = [
  { label: "National", slug: "national" },
  { label: "Politics", slug: "politics" },
  { label: "Economy", slug: "economy" },
  { label: "Mining", slug: "mining" },
  { label: "Energy", slug: "energy" },
  { label: "Sport", slug: "sport" },
  { label: "Technology", slug: "technology" },
  { label: "Africa", slug: "africa" },
  { label: "World", slug: "world" },
  { label: "Environment", slug: "environment" },
  { label: "Health", slug: "health" },
  { label: "Opinion", slug: "opinion" },
];

export default function CategoryNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-[73px] z-40 bg-ton-cream/95 backdrop-blur-md border-b border-ton-black/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Desktop nav */}
          <div className="hidden lg:flex items-center justify-between py-3">
            <div className="flex items-center gap-6 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.slug}
                  href={`/section/${cat.slug}`}
                  className="font-mono text-[11px] font-bold uppercase tracking-widest text-ton-black/60 hover:text-ton-red transition-colors whitespace-nowrap"
                >
                  {cat.label}
                </a>
              ))}
            </div>
            <a
              href="/contribute"
              className="font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-red text-white px-4 py-2 hover:bg-ton-red/80 transition-colors flex-shrink-0"
            >
              Contribute
            </a>
          </div>

          {/* Mobile nav trigger */}
          <div className="lg:hidden flex items-center justify-between py-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-ton-black/40">
              Sections
            </span>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-ton-black/60 hover:text-ton-red transition-colors"
              aria-label="Toggle categories"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-ton-black/10"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <a
                    key={cat.slug}
                    href={`/section/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="font-mono text-[10px] font-bold uppercase tracking-widest text-ton-black/60 hover:text-ton-red transition-colors py-2 text-center border border-ton-black/5"
                  >
                    {cat.label}
                  </a>
                ))}
                <a
                  href="/contribute"
                  onClick={() => setMobileOpen(false)}
                  className="font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-red text-white py-2 text-center col-span-3 mt-2"
                >
                  Contribute to the Namibia Guide
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
