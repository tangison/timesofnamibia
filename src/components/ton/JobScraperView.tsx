"use client";

import React, { useMemo, useState } from "react";
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-5 h-5 text-ton-red" />
          <div className="flex items-center gap-2">
            <span className="ton-live-dot" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-ton-red font-semibold">
              Live
            </span>
          </div>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight">
          Job Scraper
        </h1>
        <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
          Real-time aggregation from LinkedIn, NIEIS, NamibiaJobs, and CareerPortal.
          {filteredJobs.length} positions across {NAMIBIA_REGIONS.length} regions.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <a
            href="/"
            className="font-mono text-[10px] text-ton-black/40 hover:text-ton-black transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3 h-3" />
            Newsroom
          </a>
          <span className="font-mono text-[9px] text-ton-black/20">GemsWeb Digital</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pb-5 mb-6 border-b border-ton-black/10">
        <div className="flex items-center gap-2 text-ton-black/40 flex-shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
            Filters
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
          <Select
            value={regionFilter}
            onValueChange={setRegionFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs font-mono rounded-none border-ton-black/15">
              <MapPin className="w-3.5 h-3.5 mr-1 opacity-50" />
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
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs font-mono rounded-none border-ton-black/15">
              <ExternalLink className="w-3.5 h-3.5 mr-1 opacity-50" />
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
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-wider">
            {filteredJobs.length} of {JOBS.length}
          </span>
          <span className="ton-live-dot" style={{ width: 6, height: 6 }} />
        </div>
      </div>

      {/* Job Listings */}
      {filteredJobs.length === 0 ? (
        <div className="py-12 sm:py-16 text-center">
          <p className="font-serif italic text-ton-black/50 text-lg">
            No positions match your filters.
          </p>
          <button
            onClick={() => {
              setRegionFilter("all");
              setSourceFilter("all");
            }}
            className="mt-3 font-mono text-[10px] text-ton-red font-semibold hover:underline uppercase tracking-wider"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="divide-y divide-ton-black/5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="py-5 sm:py-6 group hover:bg-white/60 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5">
                <div className="flex-1 min-w-0">
                  {/* Source + Type badges */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border rounded-none font-semibold ${sourceColor(job.source)}`}>
                      {job.source}
                    </span>
                    <span className="font-mono text-[10px] text-ton-black/30 px-2 py-0.5 border border-ton-black/10 rounded-none">
                      {job.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-ton-black leading-snug group-hover:text-ton-red transition-colors">
                    {job.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-2 text-ton-black/50 flex-wrap">
                    <span className="flex items-center gap-1 font-sans text-xs">
                      <Building2 className="w-3.5 h-3.5" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-xs">
                      <MapPin className="w-3 h-3" />
                      {job.location}, {job.region}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-xs">
                      <Clock className="w-3 h-3" />
                      {job.postedAgo}
                    </span>
                  </div>

                  {/* Salary + Timestamp */}
                  <div className="flex items-center gap-4 mt-2.5">
                    {job.salary && (
                      <span className="font-mono text-sm text-ton-red font-semibold">
                        {job.salary}
                      </span>
                    )}
                    <ScrapedTimestamp label="Scraped" />
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center gap-3 mt-3">
                    <ShareButtons title={`${job.title} — ${job.company}`} />
                    <button className="font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-red text-white px-4 py-2 hover:bg-ton-red/90 transition-colors flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3" />
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
