"use client";

import { useState, useEffect } from "react";

export default function ScrapedTimestamp({ label = "Scraped" }: { label?: string }) {
  const [seconds, setSeconds] = useState(6);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev >= 60 ? 6 : prev + 6));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-[10px] text-ton-black/70 uppercase tracking-wider">
      {label} {seconds}s ago
    </span>
  );
}
