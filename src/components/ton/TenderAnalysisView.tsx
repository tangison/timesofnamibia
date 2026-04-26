"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TENDERS } from "@/lib/ton-data";
import ScrapedTimestamp from "./ScrapedTimestamp";
import ShareButtons from "./ShareButtons";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function TenderAnalysisView() {
  const [selectedTender, setSelectedTender] = useState<string | null>(null);
  const [tenderAnalysisState, setTenderAnalysisState] = useState<"idle" | "analyzing" | "complete">("idle");
  const [expandedTender, setExpandedTender] = useState<string | null>(null);

  // Simulate analysis
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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="bg-ton-black text-ton-cream p-4 sm:p-6 md:p-8 ton-border-editorial mb-4 sm:mb-6 ton-no-radius">
        <div className="flex items-center gap-3 mb-3">
          <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-ton-gold" />
          <Badge className="bg-ton-gold/20 text-ton-gold font-mono text-[10px] tracking-widest uppercase border-ton-gold/30 rounded-none">
            Times OS v2.1
          </Badge>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Tender Analysis Agent
        </h1>
        <p className="font-serif italic text-ton-cream/80 text-sm sm:text-base mt-3 max-w-2xl">
          Times OS processes RFP PDFs and extracts critical intelligence in 6 seconds.
          Upload a tender document or select from active tenders below.
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

      {/* Upload Zone - compact on mobile */}
      <div className="bg-white ton-border-editorial ton-no-radius p-4 sm:p-8 mb-4 sm:mb-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-ton-cream flex items-center justify-center mb-3 sm:mb-4 rounded-none">
          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-ton-black/80" />
        </div>
        <h3 className="font-serif text-base sm:text-lg font-semibold text-ton-black">
          Upload Tender Document
        </h3>
        <p className="font-sans text-xs sm:text-sm text-ton-black/80 mt-1 max-w-md">
          Drag and drop a PDF file here, or click to browse. Times OS will extract
          key intelligence including deadlines, values, and compliance requirements.
        </p>
        <button className="mt-3 sm:mt-4 bg-ton-black text-ton-cream font-mono text-xs font-bold uppercase tracking-widest px-6 py-2.5 hover:bg-ton-black/90 transition-colors rounded-none">
          Browse Files
        </button>
      </div>

      {/* Analyzing State */}
      {tenderAnalysisState === "analyzing" && selectedTenderData && (
        <div className="bg-ton-cream border-2 border-ton-black/10 p-4 sm:p-6 mb-4 sm:mb-6 ton-no-radius">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 text-ton-red animate-spin" />
            <h3 className="font-mono text-sm font-bold text-ton-black uppercase tracking-wider">
              Analyzing {selectedTenderData.docId}...
            </h3>
          </div>
          <Progress value={65} className="h-2" />
          <div className="flex items-center justify-between mt-2">
            <p className="font-mono text-xs text-ton-black/80">
              Extracting clauses, cross-referencing compliance matrix, evaluating bid windows...
            </p>
            <ScrapedTimestamp label="Processed" />
          </div>
        </div>
      )}

      {/* Analysis Result */}
      {tenderAnalysisState === "complete" && selectedTenderData && (
        <div className="bg-white ton-border-editorial ton-no-radius p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-mono text-sm font-bold text-emerald-700 uppercase tracking-wider">
                Analysis Complete
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-100 text-emerald-800 font-mono text-[10px] rounded-none">
                {selectedTenderData.docId}
              </Badge>
              <ScrapedTimestamp label="Analyzed" />
            </div>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-4">
            {selectedTenderData.title}
          </h2>

          <div className="mb-4">
            <ShareButtons title={`${selectedTenderData.title} — ${selectedTenderData.docId}`} />
          </div>

          {/* 3-Bullet Summary */}
          <div className="bg-ton-cream/50 p-3 sm:p-4 mb-4 border-l-4 border-ton-gold">
            <h4 className="font-mono text-xs font-bold text-ton-gold uppercase tracking-wider mb-3">
              Executive Summary
            </h4>
            <ul className="space-y-2">
              {selectedTenderData.summary.map((s, i) => (
                <li key={i} className="font-serif text-sm text-ton-black/80 flex items-start gap-2">
                  <span className="text-ton-gold font-bold mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Key Dates */}
            <div className="p-3 sm:p-4 border border-ton-black/10 ton-no-radius">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-ton-red" />
                <h4 className="font-mono text-xs font-bold text-ton-black uppercase tracking-wider">
                  Key Dates & Deadlines
                </h4>
              </div>
              <ul className="space-y-1.5">
                {selectedTenderData.keyDates.map((d, i) => (
                  <li key={i} className="font-mono text-xs text-ton-black/80 flex items-start gap-2">
                    <span className="text-ton-red">▸</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Estimated Value */}
            <div className="p-3 sm:p-4 border border-ton-black/10 ton-no-radius">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-ton-gold" />
                <h4 className="font-mono text-xs font-bold text-ton-gold uppercase tracking-wider">
                  Estimated Value Range
                </h4>
              </div>
              <p className="font-serif text-2xl font-bold text-ton-gold">
                {selectedTenderData.estimatedValue}
              </p>
              <p className="font-mono text-xs text-ton-black/80 mt-1">
                Based on historical procurement data for similar scope
              </p>
            </div>
          </div>

          {/* Compliance Requirements */}
          <div className="mt-4 p-3 sm:p-4 border border-ton-black/10 ton-no-radius">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-ton-navy" />
              <h4 className="font-mono text-xs font-bold text-ton-navy uppercase tracking-wider">
                Compliance Requirements Checklist
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedTenderData.compliance.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="font-sans text-xs text-ton-black/80">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Tenders List */}
      <div className="bg-white ton-border-editorial ton-no-radius">
        <div className="bg-ton-gold/10 px-4 sm:px-6 py-3 border-b border-ton-gold/20 flex items-center gap-2">
          <FileText className="w-4 h-4 text-ton-gold" />
          <h2 className="font-serif text-base sm:text-lg font-bold text-ton-gold">
            Active Tenders
          </h2>
          <span className="font-mono text-xs text-ton-gold/80 ml-2">
            ({TENDERS.length} tenders)
          </span>
        </div>
        <div className="divide-y divide-ton-black/5">
          {TENDERS.map((tender) => {
            const isExpanded = expandedTender === tender.id;
            return (
              <div
                key={tender.id}
                className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-ton-cream/50 transition-colors cursor-pointer"
                onClick={() => handleTenderClick(tender.id)}
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs text-ton-gold font-semibold">
                        {tender.docId}
                      </span>
                      {tender.status === "closing" && (
                        <Badge className="bg-ton-red/10 text-ton-red font-mono text-[10px] flex items-center gap-1 rounded-none">
                          <AlertTriangle className="w-3 h-3" />
                          CLOSING SOON
                        </Badge>
                      )}
                      {tender.status === "open" && (
                        <Badge className="bg-emerald-100 text-emerald-700 font-mono text-[10px] rounded-none">
                          OPEN
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-serif text-sm sm:text-base font-semibold text-ton-black">
                      {tender.title}
                    </h3>
                    <p className="font-mono text-xs text-ton-black/80 mt-0.5">
                      {tender.department}
                    </p>
                    {isExpanded && (
                      <div className="mt-3 space-y-2">
                        <p className="font-mono text-xs text-ton-gold font-semibold">
                          Est. Value: {tender.estimatedValue}
                        </p>
                        <p className="font-mono text-xs text-ton-black/80">
                          Deadline: {tender.deadline}
                        </p>
                        <div className="mt-1">
                          <ScrapedTimestamp label="Last verified" />
                        </div>
                        <ul className="space-y-1 mt-2">
                          {tender.summary.map((s, i) => (
                            <li
                              key={i}
                              className="font-sans text-xs text-ton-black/80 flex items-start gap-1.5"
                            >
                              <span className="text-ton-gold">•</span>
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
                  <div className="flex-shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-ton-black/80" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-ton-black/80" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Badge */}
      <div className="mt-4 sm:mt-6 text-center">
        <span className="inline-flex items-center gap-2 bg-ton-black text-ton-cream font-mono text-xs px-4 py-2 rounded-none">
          <Cpu className="w-3.5 h-3.5 text-ton-gold" />
          Powered by Times OS v2.1 — GemsWeb Digital
        </span>
      </div>
    </div>
  );
}
