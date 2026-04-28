"use client";

import { Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SidebarTrigger } from "./Sidebar";

export default function UtilityNav() {
  const handleSearchOpen = () => {
    window.dispatchEvent(new CustomEvent("ton-search-open"));
  };

  return (
    <div className="ton-utility-nav bg-ton-cream dark:bg-ton-black border-b border-ton-black/8 dark:border-white/8 px-4 sm:px-6 py-1.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between font-mono text-[8px] sm:text-[9px] text-ton-black/30 dark:text-white/30 tracking-wider uppercase">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sidebar hamburger trigger */}
          <SidebarTrigger />
          <span className="text-ton-black/10 dark:text-white/10">|</span>
          <button
            onClick={handleSearchOpen}
            className="inline-flex items-center gap-1 hover:text-ton-red dark:hover:text-ton-red transition-colors duration-300 px-1 py-0.5"
            aria-label="Search"
          >
            <Search className="w-3 h-3" />
            <span className="hidden sm:inline">Search</span>
          </button>
          <span className="text-ton-black/10 dark:text-white/10">|</span>
          <span className="text-ton-black/20 dark:text-white/20">
            Vol. I &middot; No. 127
          </span>
          <span className="text-ton-black/10 dark:text-white/10">|</span>
          <span>
            Windhoek 24°C
          </span>
          <span className="hidden sm:inline text-ton-black/10 dark:text-white/10">|</span>
          <span className="hidden sm:inline">
            Times OS Active
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="text-ton-black/10 dark:text-white/10">|</span>
          <span className="text-ton-red/40 font-semibold">
            Late City Ed.
          </span>
          <span className="text-ton-black/10 dark:text-white/10">|</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
