"use client";

import React from "react";
import { useTonStore, type TonView } from "@/lib/ton-store";

const NAV_ITEMS: { label: string; view: TonView; highlight?: string }[] = [
  { label: "National", view: "home" },
  { label: "Economy", view: "home" },
  { label: "The Tender Edge", view: "tender", highlight: "gold" },
  { label: "Job Scraper", view: "jobs", highlight: "red" },
  { label: "Legal Desk", view: "home" },
  { label: "Mining", view: "home" },
  { label: "Contributors", view: "contributor" },
  { label: "Brand", view: "brand" },
];

export default function Navigation() {
  const { currentView, setView } = useTonStore();

  return (
    <nav className="ton-navigation bg-ton-black text-ton-cream ton-border-bottom-editorial border-ton-black">
      <div className="max-w-7xl mx-auto flex items-center overflow-x-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.label}
              onClick={() => setView(item.view)}
              className={`
                flex-shrink-0 px-4 py-2.5 font-sans text-xs font-semibold tracking-widest uppercase
                transition-colors duration-150 border-b-2
                ${
                  isActive
                    ? item.highlight === "gold"
                      ? "bg-ton-gold/20 text-ton-gold border-ton-gold"
                      : item.highlight === "red"
                      ? "bg-ton-red/20 text-ton-red border-ton-red"
                      : "bg-ton-cream/10 text-ton-cream border-ton-cream"
                    : "border-transparent text-ton-cream/60 hover:text-ton-cream hover:bg-ton-cream/5"
                }
              `}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
