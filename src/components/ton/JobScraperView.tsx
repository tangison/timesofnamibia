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
  ArrowLeft,
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

export default function JobScraperView() {
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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="bg-ton-black text-ton-cream p-4 sm:p-6 md:p-8 ton-border-editorial mb-4 sm:mb-6 ton-no-radius">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-ton-red" />
          <div className="flex items-center gap-1.5">
            <span className="ton-live-dot" />
            <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-ton-red">
              Live
            </span>
          </div>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Job Scraper
        </h1>
        <p className="font-serif italic text-ton-cream/80 text-sm sm:text-base mt-3 max-w-2xl">
          Real-time aggregation from LinkedIn, NIEIS, NamibiaJobs, and CareerPortal.
          {filteredJobs.length} positions across {NAMIBIA_REGIONS.length} regions.
        </p>
        <div className="flex items-center justify-between mt-3">
          <Link
            href="/"
            className="font-mono text-xs text-ton-cream/80 hover:text-ton-cream transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Newsroom
          </Link>
          <span className="font-mono text-[10px] text-ton-cream/60">GemsWeb Digital</span>
        </div>
      </div>

      {/* Job Count - visible at top */}
      <div className="bg-ton-red/10 border border-ton-red/20 px-4 py-2 mb-4 flex items-center justify-between ton-no-radius">
        <span className="font-mono text-xs font-bold text-ton-red uppercase tracking-wider">
          {filteredJobs.length} of {JOBS.length} positions
        </span>
        <div className="flex items-center gap-1.5">
          <span className="ton-live-dot" style={{ width: 6, height: 6 }} />
          <span className="font-mono text-[10px] text-ton-red">LIVE</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white ton-border-editorial ton-no-radius p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-ton-black/80 flex-shrink-0">
          <Filter className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">
            Filters
          </span>
        </div>
        <div className="flex flex-col sm:flex-row flex-1 gap-3">
          <Select
            value={regionFilter}
            onValueChange={setRegionFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs font-mono rounded-none">
              <MapPin className="w-3.5 h-3.5 mr-1" />
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
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs font-mono rounded-none">
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
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
      </div>

      {/* Job Listings Grid - single column on mobile */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white ton-border-editorial ton-no-radius p-8 sm:p-12 text-center">
          <p className="font-serif italic text-ton-black/80 text-lg">
            No positions match your filters.
          </p>
          <button
            onClick={() => {
              setRegionFilter("all");
              setSourceFilter("all");
            }}
            className="mt-3 font-mono text-xs text-ton-red font-semibold hover:underline uppercase tracking-wider"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-ton-black/10 hover:ton-border-editorial hover:border-ton-black transition-colors group ton-no-radius"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono rounded-none ${sourceColor(job.source)}`}
                  >
                    {job.source}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="font-mono text-[10px] bg-ton-cream rounded-none"
                  >
                    {job.type}
                  </Badge>
                </div>

                <h3 className="font-serif text-base font-bold text-ton-black leading-tight group-hover:text-ton-red transition-colors">
                  {job.title}
                </h3>

                <div className="flex items-center gap-1.5 mt-2 text-ton-black/80">
                  <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-sans text-xs">{job.company}</span>
                </div>

                <div className="flex items-center gap-3 mt-1.5 text-ton-black/80 flex-wrap">
                  <span className="flex items-center gap-1 font-mono text-xs">
                    <MapPin className="w-3 h-3" />
                    {job.location}, {job.region}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs">
                    <Clock className="w-3 h-3" />
                    {job.postedAgo}
                  </span>
                </div>

                {job.salary && (
                  <p className="font-mono text-sm text-ton-gold font-semibold mt-2">
                    {job.salary}
                  </p>
                )}

                <div className="mt-2">
                  <ScrapedTimestamp label="Scraped" />
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <ShareButtons title={`${job.title} — ${job.company}`} />
                </div>

                <button className="mt-4 w-full bg-ton-red text-white font-mono text-xs font-bold uppercase tracking-widest py-2.5 hover:bg-ton-red/90 transition-colors flex items-center justify-center gap-1.5 rounded-none">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
