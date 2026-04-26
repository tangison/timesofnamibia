"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { JOBS, NAMIBIA_REGIONS, JOB_SOURCES, type Job } from "@/lib/ton-data";
import ScrapedTimestamp from "./ScrapedTimestamp";
import ShareButtons from "./ShareButtons";
import {
  MapPin,
  Building2,
  Clock,
  ExternalLink,
  Filter,
  Zap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function sourceColor(source: Job["source"]): string {
  switch (source) {
    case "LinkedIn":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "NIEIS":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "NamibiaJobs":
      return "text-amber-700 bg-amber-50 border-amber-200";
    case "CareerPortal":
      return "text-purple-700 bg-purple-50 border-purple-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export default function JobScraperPanel() {
  const [regionFilter, setRegionFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const filteredJobs = useMemo(() => {
    return JOBS.filter((job) => {
      if (regionFilter !== "all" && job.region !== regionFilter) return false;
      if (sourceFilter !== "all" && job.source !== sourceFilter) return false;
      return true;
    });
  }, [regionFilter, sourceFilter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-ton-red" />
          <h2 className="font-serif text-base font-bold">Job Scraper</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="ton-live-dot" style={{ width: 5, height: 5 }} />
          <span className="font-mono text-[10px] text-ton-red font-semibold">LIVE</span>
        </div>
      </div>
      <p className="font-mono text-[10px] text-ton-black/40 mb-3">
        {filteredJobs.length} positions — GemsWeb Digital
      </p>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="h-7 text-[10px] font-mono rounded-none border-ton-black/15">
            <MapPin className="w-3 h-3 mr-1 opacity-50" />
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {NAMIBIA_REGIONS.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="h-7 text-[10px] font-mono rounded-none border-ton-black/15">
            <ExternalLink className="w-3 h-3 mr-1 opacity-50" />
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {JOB_SOURCES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Job Listings — clean list */}
      <div className="divide-y divide-ton-black/5">
        {filteredJobs.length === 0 ? (
          <div className="py-4 text-center">
            <p className="font-serif italic text-xs text-ton-black/40">
              No positions match filters.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="py-3 group">
              <span className={`font-mono text-[9px] px-1.5 py-0.5 border rounded-none font-semibold ${sourceColor(job.source)}`}>
                {job.source}
              </span>
              <h4 className="font-serif text-sm font-semibold text-ton-black leading-snug mt-1.5">
                {job.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-1 text-ton-black/50">
                <Building2 className="w-3 h-3 flex-shrink-0" />
                <span className="font-mono text-[11px] truncate">{job.company}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-ton-black/40 font-mono text-[10px]">
                  <MapPin className="w-2.5 h-2.5" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1 text-ton-black/40 font-mono text-[10px]">
                  <Clock className="w-2.5 h-2.5" />
                  {job.postedAgo}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                {job.salary && (
                  <span className="font-mono text-[10px] text-ton-gold font-semibold">{job.salary}</span>
                )}
                <ScrapedTimestamp label="Scraped" />
              </div>
            </div>
          ))
        )}
      </div>

      <Link
        href="/jobs"
        className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] text-ton-red font-semibold uppercase tracking-wider hover:gap-2 transition-all"
      >
        View Full Scraper →
      </Link>
    </div>
  );
}
