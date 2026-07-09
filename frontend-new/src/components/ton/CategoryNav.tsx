"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Category Navigation Bar — sticky below the masthead.
 *
 * Premium design:
 *   - Desktop (md+): horizontal list with ton-red underline on active page.
 *     "Know Namibia" pinned right with divider. Contribute CTA follows.
 *   - Mobile (<md): collapsed "Sections" button reveals a 2-column grid
 *     covering all categories. Prevents horizontal overflow.
 *
 * Motion archetype: Premium (350-600ms, cubic-bezier(0.4,0,0.2,1))
 */

const CATEGORIES = [
  { label: "National", slug: "national", href: "/section/national" },
  { label: "Politics", slug: "politics", href: "/section/politics" },
  { label: "Economy", slug: "economy", href: "/section/economy" },
  { label: "Mining", slug: "mining", href: "/section/mining" },
  { label: "Energy", slug: "energy", href: "/section/energy" },
  { label: "Sport", slug: "sport", href: "/section/sport" },
  { label: "Technology", slug: "technology", href: "/section/technology" },
  { label: "Africa", slug: "africa", href: "/africa" },
  { label: "World", slug: "world", href: "/world" },
  { label: "Environment", slug: "environment", href: "/section/environment" },
  { label: "Health", slug: "health", href: "/section/health" },
  { label: "Opinion", slug: "opinion", href: "/section/opinion" },
];

const PREMIUM_EASE = [0.4, 0, 0.2, 1] as const;

export default function CategoryNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeSlug = (() => {
    if (!pathname) return null;
    const sectionMatch = pathname.match(/^\/section\/([a-z-]+)/i);
    if (sectionMatch) return sectionMatch[1];
    if (pathname === "/africa") return "africa";
    if (pathname === "/world") return "world";
    if (pathname.startsWith("/know-namibia")) return "know-namibia";
    if (pathname === "/") return "national";
    return null;
  })();

  const activeLabel =
    CATEGORIES.find((c) => c.slug === activeSlug)?.label ||
    (activeSlug === "know-namibia" ? "Know Namibia" : null);

  return (
    <nav className="sticky top-[73px] z-40 bg-white border-b border-ton-black/10">
      <div className="max-w-7xl mx-auto">
        {/* ── Desktop ────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1 px-4 md:px-8 py-2.5">
          {CATEGORIES.map((cat) => {
            const isActive = cat.slug === activeSlug;
            return (
              <a
                key={cat.slug}
                href={cat.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative font-mono text-[11px] font-bold uppercase tracking-widest whitespace-nowrap flex-shrink-0 px-3 py-1.5 transition-colors duration-300 ${
                  isActive
                    ? "text-ton-red"
                    : "text-ton-black/60 hover:text-ton-red"
                }`}
                style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
              >
                {cat.label}
                {isActive && (
                  <motion.span
                    layoutId="active-underline"
                    className="absolute left-3 right-3 -bottom-[10px] h-[2px] bg-ton-red"
                    transition={{ duration: 0.35, ease: PREMIUM_EASE }}
                  />
                )}
              </a>
            );
          })}

          {/* Know Namibia — pinned right */}
          <a
            href="/know-namibia"
            aria-current={activeSlug === "know-namibia" ? "page" : undefined}
            className={`relative font-mono text-[11px] font-bold uppercase tracking-widest whitespace-nowrap flex-shrink-0 px-3 py-1.5 ml-auto transition-colors duration-300 ${
              activeSlug === "know-namibia"
                ? "text-ton-red"
                : "text-ton-black/60 hover:text-ton-red"
            }`}
          >
            Know Namibia
            {activeSlug === "know-namibia" && (
              <motion.span
                layoutId="active-underline"
                className="absolute left-3 right-3 -bottom-[10px] h-[2px] bg-ton-red"
                transition={{ duration: 0.35, ease: PREMIUM_EASE }}
              />
            )}
          </a>

          {/* Contribute CTA */}
          <a
            href="/contribute"
            className="ml-3 inline-flex font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-red text-white px-4 py-1.5 hover:bg-ton-black transition-colors duration-300 flex-shrink-0"
          >
            Contribute
          </a>
        </div>

        {/* ── Mobile (collapsed) ─────────────────────────────── */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-category-panel"
            className="w-full flex items-center justify-between px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-widest text-ton-black/70 hover:text-ton-red transition-colors duration-300"
          >
            <span className="flex items-center gap-2">
              {activeLabel ? (
                <>
                  <span className="w-1.5 h-1.5 bg-ton-red rounded-full" />
                  {activeLabel}
                </>
              ) : (
                "All Sections"
              )}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${mobileOpen ? "rotate-180" : ""}`}
              style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
            />
          </button>

          {mobileOpen && (
            <div
              id="mobile-category-panel"
              className="border-t border-ton-black/10 bg-white overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-px bg-ton-black/8">
                {CATEGORIES.map((cat) => {
                  const isActive = cat.slug === activeSlug;
                  return (
                    <a
                      key={cat.slug}
                      href={cat.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`block px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                        isActive
                          ? "bg-ton-red text-white"
                          : "bg-white text-ton-black/70 active:bg-ton-black/5"
                      }`}
                    >
                      {cat.label}
                    </a>
                  );
                })}
                <a
                  href="/know-namibia"
                  aria-current={activeSlug === "know-namibia" ? "page" : undefined}
                  className={`block px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                    activeSlug === "know-namibia"
                      ? "bg-ton-red text-white"
                      : "bg-white text-ton-black/70 active:bg-ton-black/5"
                  }`}
                >
                  Know Namibia
                </a>
              </div>
              <a
                href="/contribute"
                className="block bg-ton-black text-white px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-widest text-center"
              >
                Contribute a Story →
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
