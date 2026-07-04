"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Times of Namibia - Minimalist Footer
 *
 * Dark themed. Namibian landscape image as subtle accent.
 * No clutter - just the wordmark, tagline, essential links, and credit.
 */
export default function Footer() {
  return (
    <footer className="relative text-ton-cream mt-20 overflow-hidden">
      {/* Section 2: Skeleton Coast background image */}
      <div className="absolute inset-0">
        <Image
          src="/skeleton-coast-bg.webp"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Wordmark + tagline */}
          <div className="flex items-center gap-4">
            <div>
              <div
                className="text-3xl text-ton-cream leading-none"
                style={{ fontFamily: "var(--font-unifraktur), 'UnifrakturMaguntia', serif" }}
              >
                Times of Namibia
              </div>
              <div className="text-[0.55rem] font-bold tracking-[0.2em] uppercase mt-1.5 text-ton-cream/40">
                Est. 2026 • Windhoek
              </div>
            </div>
          </div>

          {/* Minimal links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-widest text-ton-cream/60">
            <a href="/about" className="hover:text-ton-red transition-colors">About</a>
            <a href="/contact" className="hover:text-ton-red transition-colors">Contact</a>
            <a href="/editorial-standards" className="hover:text-ton-red transition-colors">Ethics</a>
            <a href="/privacy" className="hover:text-ton-red transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-ton-red transition-colors">Terms</a>
            <a href="/technology" className="hover:text-ton-red transition-colors">Technology</a>
            <a href="/tangison" className="hover:text-ton-red transition-colors">TANGISON</a>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-ton-cream/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-ton-cream/30">
          <div>Powered by TANGISON Applied AI</div>
          <div>© {new Date().getFullYear()} Times of Namibia. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
