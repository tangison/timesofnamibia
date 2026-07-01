"use client";

import React from "react";

export type BadgeType = "VERIFIED" | "OFFICIAL" | "ANALYSIS" | "DEVELOPING";

const BADGE_CONFIG: Record<
  BadgeType,
  { label: string; description: string; textClass: string; bgClass: string; borderClass?: string }
> = {
  VERIFIED: {
    label: "VERIFIED",
    description: "Information confirmed by multiple reliable sources",
    textClass: "text-ton-red",
    bgClass: "bg-ton-red/10",
  },
  OFFICIAL: {
    label: "OFFICIAL",
    description: "Direct from government or organizational source",
    textClass: "text-ton-black",
    bgClass: "bg-ton-black/5",
  },
  ANALYSIS: {
    label: "ANALYSIS",
    description: "Interpretation by subject matter experts",
    textClass: "text-ton-black/60",
    bgClass: "bg-ton-black/[0.03]",
  },
  DEVELOPING: {
    label: "DEVELOPING",
    description: "Story is evolving, check back for updates",
    textClass: "text-ton-red",
    bgClass: "bg-transparent",
    borderClass: "border border-ton-red/20",
  },
};

export default function SourceBadge({
  type,
  showDescription = false,
  className = "",
}: {
  type: BadgeType;
  showDescription?: boolean;
  className?: string;
}) {
  const config = BADGE_CONFIG[type];

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${config.bgClass} ${config.textClass} ${config.borderClass || ""} font-mono text-[8px] sm:text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 ${className}`}
    >
      {type === "DEVELOPING" && (
        <span
          className="w-1.5 h-1.5 bg-ton-red flex-shrink-0"
          style={{
            animation: "ton-pulse 1.5s ease-in-out infinite",
          }}
        />
      )}
      {config.label}
      {showDescription && (
        <span className="font-sans font-normal text-[8px] tracking-normal normal-case opacity-60 ml-1">
          - {config.description}
        </span>
      )}
    </span>
  );
}
