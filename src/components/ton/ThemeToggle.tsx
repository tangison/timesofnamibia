"use client";

import { useCallback, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme on mount — default to LIGHT, only go dark if explicitly chosen
  useEffect(() => {
    const stored = localStorage.getItem("ton-theme");
    let dark = false;
    if (stored === "dark") {
      dark = true;
    } else if (stored === "light") {
      dark = false;
    } else {
      // Default to light — TON is a newspaper, broadsheets are cream
      dark = false;
    }
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
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
      aria-label={isDark ? "Light mode — click to switch to dark" : "Dark mode — click to switch to light"}
    >
      {isDark ? (
        <>
          <Sun className="w-3 h-3" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3 h-3" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
}
