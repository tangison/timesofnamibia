"use client";

import { Cloud, Wifi } from "lucide-react";

export default function UtilityNav() {
  return (
    <div className="ton-utility-nav bg-ton-cream px-4 sm:px-6 py-1.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-[10px] sm:text-xs font-mono text-ton-black/50">
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="flex items-center gap-1.5">
            <Cloud className="w-3 h-3" />
            Windhoek 24°C
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            Times OS v2.1 — Active
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="hidden md:inline">
            {new Date().toLocaleDateString("en-NA", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="uppercase tracking-widest font-semibold text-ton-black/50 text-[9px] sm:text-[10px]">
            Digital Edition
          </span>
        </div>
      </div>
    </div>
  );
}
