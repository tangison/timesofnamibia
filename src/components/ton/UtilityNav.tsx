"use client";

import React from "react";
import { Cloud, Wifi } from "lucide-react";

export default function UtilityNav() {
  return (
    <div className="ton-utility-nav bg-ton-cream border-b border-ton-black/10 px-4 py-1.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono text-ton-black/60">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5" />
            Windhoek 24°C
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-green-600" />
            Times OS v2.1 — Active
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">
            {new Date().toLocaleDateString("en-NA", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="uppercase tracking-widest font-semibold text-ton-black/80">
            Digital Edition
          </span>
        </div>
      </div>
    </div>
  );
}
