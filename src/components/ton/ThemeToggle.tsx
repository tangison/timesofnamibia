"use client";

import { useCallback, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme on mount — read from localStorage / system preference
  useEffect(() => {
    const stored = localStorage.getItem("ton-theme");
    let dark = false;
    if (stored === "dark") {
      dark = true;
    } else if (stored === "light") {
      dark = false;
    } else {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    if (dark) {
      document.documentElement.classList.add("dark");
    }
    // Queue state update outside the synchronous effect body
    const id = requestAnimationFrame(() => {
      setIsDark(dark);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("ton-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("ton-theme", "light");
      }
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-1 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-ton-black/30 dark:text-white/30 hover:text-ton-red dark:hover:text-ton-red transition-colors duration-300 px-1 py-0.5"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <>
          <Sun className="w-3 h-3" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3 h-3" />
          <span className="hidden sm:inline">Onyx</span>
        </>
      )}
    </button>
  );
}
