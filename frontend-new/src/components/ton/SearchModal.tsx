"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";

interface SearchItem {
  title: string;
  category: string;
  href: string;
  snippet: string;
}

const searchData: SearchItem[] = [
  {
    title: "Available Government Tenders",
    category: "Tenders",
    href: "/tender",
    snippet: "Browse active tender opportunities from Namibian government departments and state-owned enterprises.",
  },
  {
    title: "Job Listings Across Namibia",
    category: "Jobs",
    href: "/jobs",
    snippet: "Current employment opportunities aggregated from public and private sector organisations nationwide.",
  },
  {
    title: "National News Headlines",
    category: "National",
    href: "/",
    snippet: "Breaking stories and in-depth coverage of events shaping the Republic of Namibia.",
  },
  {
    title: "About Times of Namibia",
    category: "Pages",
    href: "/about",
    snippet: "Our mission, editorial standards, and commitment to open-access journalism in Namibia.",
  },
  {
    title: "Brand System & Visual Identity",
    category: "Pages",
    href: "/brand",
    snippet: "The TON brand guidelines - typography, colour system, and editorial design principles.",
  },
  {
    title: "Business Plan 2025–2030",
    category: "Pages",
    href: "/business-plan",
    snippet: "Strategic roadmap for building Namibia's first open-access digital newspaper platform.",
  },
  {
    title: "The Plan - Our Roadmap",
    category: "Pages",
    href: "/plan",
    snippet: "A detailed execution timeline covering technology, content strategy, and community growth.",
  },
  {
    title: "Editorial Standards & Ethics",
    category: "Pages",
    href: "/editorial-standards",
    snippet: "Our commitment to accuracy, fairness, and transparency in all published content.",
  },
  {
    title: "Contact the Newsroom",
    category: "Pages",
    href: "/contact",
    snippet: "Reach the TON editorial desk, submit a tip, or inquire about partnerships.",
  },
  {
    title: "Tender Analysis & Insights",
    category: "Tenders",
    href: "/tender",
    snippet: "Data-driven analysis of Namibia's public procurement landscape - trends, values, and awardees.",
  },
];

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const openModal = useCallback(() => {
    setOpen(true);
    setQuery("");
    // Focus input after render
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          closeModal();
        } else {
          openModal();
        }
      }
      if (e.key === "Escape" && open) {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, openModal, closeModal]);

  // Listen for custom event from UtilityNav search button
  useEffect(() => {
    const handleSearchOpen = () => {
      openModal();
    };
    window.addEventListener("ton-search-open", handleSearchOpen);
    return () => window.removeEventListener("ton-search-open", handleSearchOpen);
  }, [openModal]);

  // Filter results
  const results = query.trim()
    ? searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.snippet.toLowerCase().includes(query.toLowerCase())
      )
    : searchData;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh]"
      onClick={closeModal}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Search Panel */}
      <div
        className="relative w-full max-w-2xl mx-4 bg-ton-cream dark:bg-ton-black border border-ton-black/10 dark:border-white/10 shadow-2xl"
        style={{ borderRadius: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Area */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ton-black/10 dark:border-white/10">
          <Search className="w-4 h-4 text-ton-black/45 dark:text-white/30 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Times of Namibia…"
            className="flex-1 bg-transparent font-mono text-sm text-ton-black dark:text-ton-cream placeholder:text-ton-black/40 dark:placeholder:text-white/25 outline-none"
            style={{ borderRadius: 0 }}
          />
          <button
            onClick={closeModal}
            className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-ton-black/40 dark:text-white/25 hover:text-ton-red dark:hover:text-ton-red transition-colors px-1.5 py-1 border border-ton-black/10 dark:border-white/10"
            style={{ borderRadius: 0 }}
          >
            Esc
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto ton-scrollbar">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-mono text-xs text-ton-black/45 dark:text-white/30 uppercase tracking-wider">
                No results for &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            <div className="py-1">
              {results.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  onClick={closeModal}
                  className="block px-4 py-3 hover:bg-ton-black/[0.03] dark:hover:bg-white/[0.03] transition-colors border-b border-ton-black/[0.04] dark:border-white/[0.04] last:border-b-0"
                  style={{ borderRadius: 0 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-bold text-sm text-ton-black dark:text-ton-cream leading-tight truncate">
                        {item.title}
                      </p>
                      <p className="font-sans text-xs text-ton-black/55 dark:text-white/40 mt-1 line-clamp-2 leading-relaxed">
                        {item.snippet}
                      </p>
                    </div>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-ton-red flex-shrink-0 mt-0.5">
                      {item.category}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-ton-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-wider text-ton-black/40 dark:text-white/20">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-wider text-ton-black/40 dark:text-white/20">
            Ctrl+K to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
