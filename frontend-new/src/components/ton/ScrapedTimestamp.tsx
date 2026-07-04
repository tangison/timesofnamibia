"use client";

import { useState, useEffect, useSyncExternalStore } from "react";

function computeTimeAgo(dateObj: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
  return `${Math.floor(diffMin / 1440)}d ago`;
}

const emptySubscribe = () => () => {};

export default function ScrapedTimestamp({ label = "Scraped", date }: { label?: string; date?: Date | string | null }) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const dateObj = date ? (typeof date === "string" ? new Date(date) : date) : null;

  // If no real date provided, show the classic "6s ago" placeholder
  if (!date) {
    return (
      <span className="font-mono text-[10px] text-ton-black/30 uppercase tracking-wider">
        {label} 6s ago
      </span>
    );
  }

  if (!mounted || !dateObj) {
    // SSR: show static date
    return (
      <span className="font-mono text-[10px] text-ton-black/30 uppercase tracking-wider">
        {label} {dateObj ? dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}
      </span>
    );
  }

  return <ScrapedTimestampClient label={label} dateObj={dateObj} />;
}

function ScrapedTimestampClient({ label, dateObj }: { label: string; dateObj: Date }) {
  const [timeAgo, setTimeAgo] = useState(() => computeTimeAgo(dateObj));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(computeTimeAgo(dateObj));
    }, 60000);
    return () => clearInterval(interval);
  }, [dateObj]);

  return (
    <span className="font-mono text-[10px] text-ton-black/30 uppercase tracking-wider">
      {label} {timeAgo}
    </span>
  );
}
