"use client";

import { useState, useEffect } from "react";
import { Activity, CheckCircle, Clock } from "lucide-react";

interface IngestionStatusData {
  activeFeeds: number;
  articleCount: number;
  lastFetched: string | null;
  isRunning: boolean;
}

export default function IngestionStatus() {
  const [status, setStatus] = useState<IngestionStatusData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/rss/status");
      if (res.ok) {
        const data = await res.json();
        setStatus({
          activeFeeds: data.activeFeeds || 0,
          articleCount: data.publishedArticles || 0,
          lastFetched: data.lastFetched || null,
          isRunning: false,
        });
      }
    } catch {
      // Silently fail
    }
  }

  if (!mounted || !status) return null;

  const lastFetchedTime = status.lastFetched
    ? new Date(status.lastFetched).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : "Pending";

  return (
    <div className="flex items-center gap-2 font-mono text-[8px] text-ton-black/20 uppercase tracking-wider">
      {status.isRunning ? (
        <>
          <Activity className="w-3 h-3 text-ton-red animate-pulse" />
          <span>Ingesting feeds...</span>
        </>
      ) : (
        <>
          <CheckCircle className="w-3 h-3 text-emerald-600/40" />
          <span>{status.activeFeeds} feeds active</span>
          <span className="text-ton-black/10">|</span>
          <Clock className="w-3 h-3" />
          <span>Last: {lastFetchedTime} CAT</span>
        </>
      )}
    </div>
  );
}
