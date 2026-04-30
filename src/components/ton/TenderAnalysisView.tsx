"use client";

import React, { useEffect, useState } from "react";
import { TENDERS } from "@/lib/ton-data";
import ScrapedTimestamp from "./ScrapedTimestamp";
import ShareButtons from "./ShareButtons";
import Breadcrumbs from "./Breadcrumbs";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  ShieldCheck,
  Cpu,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function TenderAnalysisView() {
  const [selectedTender, setSelectedTender] = useState<string | null>(null);
  const [tenderAnalysisState, setTenderAnalysisState] = useState<"idle" | "analyzing" | "complete">("idle");
  const [expandedTender, setExpandedTender] = useState<string | null>(null);

  useEffect(() => {
    if (tenderAnalysisState === "analyzing") {
      const timer = setTimeout(() => {
        setTenderAnalysisState("complete");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [tenderAnalysisState]);

  const handleTenderClick = (id: string) => {
    setSelectedTender(id);
    setTenderAnalysisState("analyzing");
    setExpandedTender(id);
  };

  const selectedTenderData = selectedTender
    ? TENDERS.find((t) => t.id === selectedTender)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Cpu className="w-5 h-5 text-ton-red" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-ton-red/70 font-semibold border border-ton-red/20 px-2 py-0.5">
            Times OS v2.1
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight">
          Tender Analysis Agent
        </h1>
        <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
          Times OS processes RFP PDFs and extracts critical intelligence in 6 seconds.
          Upload a tender document or select from active tenders below.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <Breadcrumbs items={[{ label: "The Tender Edge" }]} />
          <span className="font-mono text-[9px] text-ton-black/20">GemsWeb Digital</span>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="py-8 sm:py-10 mb-8 sm:mb-10 border-t border-b border-dashed border-ton-black/15 text-center">
        <div className="flex flex-col items-center">
          <Upload className="w-8 h-8 text-ton-black/30 mb-3" />
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-ton-black">
            Upload Tender Document
          </h2>
          <p className="font-sans text-xs sm:text-sm text-ton-black/40 mt-1.5 max-w-md">
            Drag and drop a PDF file here, or click to browse. Times OS will extract
            key intelligence including deadlines, values, and compliance requirements.
          </p>
          <button className="mt-4 bg-ton-black text-ton-cream font-mono text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 hover:bg-ton-black/90 transition-colors">
            Browse Files
          </button>
        </div>
      </div>

      {/* Analyzing State */}
      {tenderAnalysisState === "analyzing" && selectedTenderData && (
        <div className="py-6 sm:py-8 mb-8 border-t border-ton-black/10">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 text-ton-red animate-spin" />
            <h2 className="font-mono text-xs font-bold text-ton-black uppercase tracking-wider">
              Analyzing {selectedTenderData.docId}...
            </h2>
          </div>
          <Progress value={65} className="h-1.5" />
          <div className="flex items-center justify-between mt-3">
            <p className="font-mono text-[11px] text-ton-black/40">
              Extracting clauses, cross-referencing compliance matrix, evaluating bid windows...
            </p>
            <ScrapedTimestamp label="Processed" />
          </div>
        </div>
      )}

      {/* Analysis Result */}
      {tenderAnalysisState === "complete" && selectedTenderData && (
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h2 className="font-mono text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Analysis Complete
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 font-semibold">
                {selectedTenderData.docId}
              </span>
              <ScrapedTimestamp label="Analyzed" />
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ton-black mb-3">
            {selectedTenderData.title}
          </h2>

          <div className="mb-6">
            <ShareButtons title={`${selectedTenderData.title} — ${selectedTenderData.docId}`} />
          </div>

          {/* 3-Bullet Summary */}
          <div className="pl-5 border-l-[3px] border-ton-red mb-6">
            <h3 className="font-mono text-[10px] font-bold text-ton-red uppercase tracking-wider mb-3">
              Executive Summary
            </h3>
            <ul className="space-y-2.5">
              {selectedTenderData.summary.map((s, i) => (
                <li key={i} className="font-serif text-sm text-ton-black/70 flex items-start gap-2.5">
                  <span className="text-ton-red font-bold mt-0.5">—</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Key Dates */}
            <div className="pt-5 border-t border-ton-black/10">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-ton-red" />
                <h3 className="font-mono text-[10px] font-bold text-ton-black uppercase tracking-wider">
                  Key Dates & Deadlines
                </h3>
              </div>
              <ul className="space-y-2">
                {selectedTenderData.keyDates.map((d, i) => (
                  <li key={i} className="font-mono text-xs text-ton-black/60 flex items-start gap-2">
                    <span className="text-ton-red">&#9656;</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Estimated Value */}
            <div className="pt-5 border-t border-ton-red/20">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-ton-red" />
                <h3 className="font-mono text-[10px] font-bold text-ton-red uppercase tracking-wider">
                  Estimated Value Range
                </h3>
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-ton-red">
                {selectedTenderData.estimatedValue}
              </p>
              <p className="font-mono text-[10px] text-ton-black/40 mt-2">
                Based on historical procurement data for similar scope
              </p>
            </div>
          </div>

          {/* Compliance Requirements */}
          <div className="mt-6 pt-5 border-t border-ton-black/10">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-ton-black" />
              <h3 className="font-mono text-[10px] font-bold text-ton-black uppercase tracking-wider">
                Compliance Requirements Checklist
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {selectedTenderData.compliance.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="font-sans text-xs text-ton-black/60">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Tenders List */}
      <div>
        <div className="flex items-center gap-2 mb-5 pt-6 border-t border-ton-black/10">
          <FileText className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Active Tenders
          </h2>
          <span className="font-mono text-[10px] text-ton-red/60 ml-1">
            ({TENDERS.length})
          </span>
        </div>
        <div className="divide-y divide-ton-black/5">
          {TENDERS.map((tender) => {
            const isExpanded = expandedTender === tender.id;
            return (
              <div
                key={tender.id}
                className="py-4 sm:py-5 hover:bg-white/40 transition-colors cursor-pointer group"
                onClick={() => handleTenderClick(tender.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-mono text-[10px] text-ton-red/60 font-semibold">
                        {tender.docId}
                      </span>
                      {tender.status === "closing" && (
                        <span className="flex items-center gap-1 font-mono text-[9px] text-ton-red font-semibold uppercase">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Closing Soon
                        </span>
                      )}
                      {tender.status === "open" && (
                        <span className="font-mono text-[9px] text-emerald-600 font-semibold uppercase">Open</span>
                      )}
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-ton-black leading-snug group-hover:text-ton-red transition-colors">
                      {tender.title}
                    </h3>
                    <p className="font-mono text-[11px] text-ton-black/40 mt-1">
                      {tender.department}
                    </p>
                    {isExpanded && (
                      <div className="mt-4 space-y-2.5 pl-4 border-l-2 border-ton-red/20">
                        <p className="font-mono text-xs text-ton-red font-semibold">
                          Est. Value: {tender.estimatedValue}
                        </p>
                        <p className="font-mono text-xs text-ton-black/50">
                          Deadline: {tender.deadline}
                        </p>
                        <ScrapedTimestamp label="Last verified" />
                        <ul className="space-y-1.5 mt-2">
                          {tender.summary.map((s, i) => (
                            <li key={i} className="font-sans text-xs text-ton-black/60 flex items-start gap-1.5">
                              <span className="text-ton-red">—</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2">
                          <ShareButtons title={`${tender.title} — ${tender.docId}`} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 mt-2">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-ton-black/30" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-ton-black/30" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] text-ton-black/30 uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5 text-ton-red" />
          Powered by Times OS v2.1 — GemsWeb Digital
        </span>
      </div>
    </div>
  );
}
