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
import { Badge } from "@/components/ui/badge";
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
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "NIEIS":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "NamibiaJobs":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "CareerPortal":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
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
    <div className="bg-white ton-border-editorial ton-no-radius h-full flex flex-col">
      {/* Header */}
      <div className="bg-ton-black text-ton-cream px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-ton-red" />
            <h2 className="font-serif text-lg font-bold">Job Scraper</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="ton-live-dot" />
            <span className="font-mono text-xs">LIVE</span>
          </div>
        </div>
        <p className="font-mono text-xs text-ton-cream/80 mt-1">
          {filteredJobs.length} positions found — GemsWeb Digital
        </p>
      </div>

      {/* Filters */}
      <div className="px-3 py-2 border-b border-ton-black/10 space-y-2">
        <div className="flex items-center gap-1.5 text-ton-black/80">
          <Filter className="w-3 h-3" />
          <span className="font-mono text-xs uppercase tracking-wider">
            Filters
          </span>
        </div>
        <Select
          value={regionFilter}
          onValueChange={setRegionFilter}
        >
          <SelectTrigger className="h-8 text-xs font-mono rounded-none">
            <MapPin className="w-3 h-3 mr-1" />
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {NAMIBIA_REGIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sourceFilter}
          onValueChange={setSourceFilter}
        >
          <SelectTrigger className="h-8 text-xs font-mono rounded-none">
            <ExternalLink className="w-3 h-3 mr-1" />
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {JOB_SOURCES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Job Listings */}
      <div className="flex-1 overflow-y-auto ton-scrollbar max-h-[600px]">
        {filteredJobs.length === 0 ? (
          <div className="p-6 text-center">
            <p className="font-serif italic text-ton-black/80">
              No positions match your filters.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="px-4 py-3 border-b border-ton-black/5 hover:bg-ton-cream/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-semibold text-ton-black leading-tight truncate">
                    {job.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1 text-ton-black/80">
                    <Building2 className="w-3 h-3 flex-shrink-0" />
                    <span className="font-mono text-xs truncate">
                      {job.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-ton-black/80 font-mono text-xs">
                      <MapPin className="w-2.5 h-2.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-ton-black/80 font-mono text-xs">
                      <Clock className="w-2.5 h-2.5" />
                      {job.postedAgo}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    {job.salary && (
                      <p className="font-mono text-xs text-ton-gold font-semibold">
                        {job.salary}
                      </p>
                    )}
                    <ScrapedTimestamp label="Scraped" />
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono flex-shrink-0 rounded-none ${sourceColor(job.source)}`}
                >
                  {job.source}
                </Badge>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="font-mono text-[10px] bg-ton-cream rounded-none"
                >
                  {job.type}
                </Badge>
                <div className="flex items-center gap-2">
                  <ShareButtons title={`${job.title} — ${job.company}`} />
                  <button className="font-mono text-[10px] font-bold uppercase tracking-wider bg-ton-red text-white px-2.5 py-1 hover:bg-ton-red/90 transition-colors rounded-none">
                    APPLY NOW
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-ton-black/10 bg-ton-cream/50">
        <Link
          href="/jobs"
          className="font-mono text-xs text-ton-red font-semibold hover:underline uppercase tracking-wider block text-center"
        >
          View Full Scraper →
        </Link>
      </div>
    </div>
  );
}
