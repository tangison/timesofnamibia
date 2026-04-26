"use client";

import React, { useMemo } from "react";
import { useTonStore } from "@/lib/ton-store";
import { JOBS, NAMIBIA_REGIONS, JOB_SOURCES, type Job } from "@/lib/ton-data";
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
  const { jobFilters, setJobFilter, setView } = useTonStore();

  const filteredJobs = useMemo(() => {
    return JOBS.filter((job) => {
      if (jobFilters.region !== "all" && job.region !== jobFilters.region)
        return false;
      if (jobFilters.source !== "all" && job.source !== jobFilters.source)
        return false;
      return true;
    });
  }, [jobFilters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-ton-black text-ton-cream p-6 sm:p-8 ton-border-editorial mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-6 h-6 text-ton-red" />
          <div className="flex items-center gap-1.5">
            <span className="ton-live-dot" />
            <span className="font-mono text-xs tracking-widest uppercase text-ton-red">
              Live
            </span>
          </div>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Job Scraper
        </h1>
        <p className="font-serif italic text-ton-cream/60 text-sm sm:text-base mt-3 max-w-2xl">
          Real-time aggregation from LinkedIn, NIEIS, NamibiaJobs, and CareerPortal.
          {filteredJobs.length} positions across {NAMIBIA_REGIONS.length} regions.
        </p>
        <button
          onClick={() => setView("home")}
          className="mt-4 font-mono text-xs text-ton-cream/50 hover:text-ton-cream transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Newsroom
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white ton-border-editorial p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-ton-black/50 flex-shrink-0">
          <Filter className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">
            Filters
          </span>
        </div>
        <div className="flex flex-1 flex-wrap gap-3">
          <Select
            value={jobFilters.region}
            onValueChange={(v) => setJobFilter("region", v)}
          >
            <SelectTrigger className="w-[180px] h-9 text-xs font-mono">
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
            value={jobFilters.source}
            onValueChange={(v) => setJobFilter("source", v)}
          >
            <SelectTrigger className="w-[180px] h-9 text-xs font-mono">
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
        <div className="font-mono text-xs text-ton-black/40">
          {filteredJobs.length} of {JOBS.length} jobs
        </div>
      </div>

      {/* Job Listings Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white ton-border-editorial p-12 text-center">
          <p className="font-serif italic text-ton-black/40 text-lg">
            No positions match your filters.
          </p>
          <button
            onClick={() => {
              setJobFilter("region", "all");
              setJobFilter("source", "all");
            }}
            className="mt-3 font-mono text-xs text-ton-red font-semibold hover:underline uppercase tracking-wider"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-ton-black/10 hover:ton-border-editorial hover:border-ton-black transition-colors group"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono ${sourceColor(job.source)}`}
                  >
                    {job.source}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="font-mono text-[10px] bg-ton-cream"
                  >
                    {job.type}
                  </Badge>
                </div>

                <h3 className="font-serif text-base font-bold text-ton-black leading-tight group-hover:text-ton-red transition-colors">
                  {job.title}
                </h3>

                <div className="flex items-center gap-1.5 mt-2 text-ton-black/50">
                  <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-sans text-xs">{job.company}</span>
                </div>

                <div className="flex items-center gap-3 mt-1.5 text-ton-black/40 flex-wrap">
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

                <button className="mt-4 w-full bg-ton-red text-white font-mono text-xs font-bold uppercase tracking-widest py-2.5 hover:bg-ton-red/90 transition-colors flex items-center justify-center gap-1.5">
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
