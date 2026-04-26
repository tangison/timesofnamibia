"use client";

import React, { useEffect, useState } from "react";
import { useTonStore } from "@/lib/ton-store";
import { TENDERS } from "@/lib/ton-data";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function TenderAnalysisView() {
  const { selectedTender, setSelectedTender, tenderAnalysisState, setTenderAnalysisState } =
    useTonStore();
  const [expandedTender, setExpandedTender] = useState<string | null>(null);

  // Simulate analysis
  useEffect(() => {
    if (tenderAnalysisState === "analyzing") {
      const timer = setTimeout(() => {
        setTenderAnalysisState("complete");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [tenderAnalysisState, setTenderAnalysisState]);

  const handleTenderClick = (id: string) => {
    setSelectedTender(id);
    setExpandedTender(id);
  };

  const selectedTenderData = selectedTender
    ? TENDERS.find((t) => t.id === selectedTender)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-ton-black text-ton-cream p-6 sm:p-8 ton-border-editorial mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Cpu className="w-6 h-6 text-ton-gold" />
          <Badge className="bg-ton-gold/20 text-ton-gold font-mono text-[10px] tracking-widest uppercase border-ton-gold/30">
            Times OS v2.1
          </Badge>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Tender Analysis Agent
        </h1>
        <p className="font-serif italic text-ton-cream/60 text-sm sm:text-base mt-3 max-w-2xl">
          Times OS processes RFP PDFs and extracts critical intelligence in 6 seconds.
          Upload a tender document or select from active tenders below.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white ton-border-editorial p-8 mb-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-ton-cream flex items-center justify-center mb-4">
          <Upload className="w-8 h-8 text-ton-black/40" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-ton-black">
          Upload Tender Document
        </h3>
        <p className="font-sans text-sm text-ton-black/50 mt-1 max-w-md">
          Drag and drop a PDF file here, or click to browse. Times OS will extract
          key intelligence including deadlines, values, and compliance requirements.
        </p>
        <button className="mt-4 bg-ton-black text-ton-cream font-mono text-xs font-bold uppercase tracking-widest px-6 py-2.5 hover:bg-ton-black/90 transition-colors">
          Browse Files
        </button>
      </div>

      {/* Analyzing State */}
      {tenderAnalysisState === "analyzing" && selectedTenderData && (
        <div className="bg-ton-cream border-2 border-ton-black/10 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 text-ton-red animate-spin" />
            <h3 className="font-mono text-sm font-bold text-ton-black uppercase tracking-wider">
              Analyzing {selectedTenderData.docId}...
            </h3>
          </div>
          <Progress value={65} className="h-2" />
          <p className="font-mono text-xs text-ton-black/40 mt-2">
            Extracting clauses, cross-referencing compliance matrix, evaluating bid windows...
          </p>
        </div>
      )}

      {/* Analysis Result */}
      {tenderAnalysisState === "complete" && selectedTenderData && (
        <div className="bg-white ton-border-editorial p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-mono text-sm font-bold text-emerald-700 uppercase tracking-wider">
                Analysis Complete
              </h3>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 font-mono text-[10px]">
              {selectedTenderData.docId}
            </Badge>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-4">
            {selectedTenderData.title}
          </h2>

          {/* 3-Bullet Summary */}
          <div className="bg-ton-cream/50 p-4 mb-4 border-l-4 border-ton-gold">
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
            <div className="p-4 border border-ton-black/10">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-ton-red" />
                <h4 className="font-mono text-xs font-bold text-ton-black uppercase tracking-wider">
                  Key Dates & Deadlines
                </h4>
              </div>
              <ul className="space-y-1.5">
                {selectedTenderData.keyDates.map((d, i) => (
                  <li key={i} className="font-mono text-xs text-ton-black/70 flex items-start gap-2">
                    <span className="text-ton-red">▸</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Estimated Value */}
            <div className="p-4 border border-ton-black/10">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-ton-gold" />
                <h4 className="font-mono text-xs font-bold text-ton-gold uppercase tracking-wider">
                  Estimated Value Range
                </h4>
              </div>
              <p className="font-serif text-2xl font-bold text-ton-gold">
                {selectedTenderData.estimatedValue}
              </p>
              <p className="font-mono text-xs text-ton-black/40 mt-1">
                Based on historical procurement data for similar scope
              </p>
            </div>
          </div>

          {/* Compliance Requirements */}
          <div className="mt-4 p-4 border border-ton-black/10">
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
                  <span className="font-sans text-xs text-ton-black/70">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Tenders List */}
      <div className="bg-white ton-border-editorial">
        <div className="bg-ton-gold/10 px-6 py-3 border-b border-ton-gold/20 flex items-center gap-2">
          <FileText className="w-4 h-4 text-ton-gold" />
          <h2 className="font-serif text-lg font-bold text-ton-gold">
            Active Tenders
          </h2>
          <span className="font-mono text-xs text-ton-gold/60 ml-2">
            ({TENDERS.length} tenders)
          </span>
        </div>
        <div className="divide-y divide-ton-black/5">
          {TENDERS.map((tender) => {
            const isExpanded = expandedTender === tender.id;
            return (
              <div
                key={tender.id}
                className="px-6 py-4 hover:bg-ton-cream/50 transition-colors cursor-pointer"
                onClick={() => handleTenderClick(tender.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs text-ton-gold font-semibold">
                        {tender.docId}
                      </span>
                      {tender.status === "closing" && (
                        <Badge className="bg-ton-red/10 text-ton-red font-mono text-[10px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          CLOSING SOON
                        </Badge>
                      )}
                      {tender.status === "open" && (
                        <Badge className="bg-emerald-100 text-emerald-700 font-mono text-[10px]">
                          OPEN
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-serif text-base font-semibold text-ton-black">
                      {tender.title}
                    </h3>
                    <p className="font-mono text-xs text-ton-black/50 mt-0.5">
                      {tender.department}
                    </p>
                    {isExpanded && (
                      <div className="mt-3 space-y-2">
                        <p className="font-mono text-xs text-ton-gold font-semibold">
                          Est. Value: {tender.estimatedValue}
                        </p>
                        <p className="font-mono text-xs text-ton-black/50">
                          Deadline: {tender.deadline}
                        </p>
                        <ul className="space-y-1 mt-2">
                          {tender.summary.map((s, i) => (
                            <li
                              key={i}
                              className="font-sans text-xs text-ton-black/70 flex items-start gap-1.5"
                            >
                              <span className="text-ton-gold">•</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 mt-1">
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
      <div className="mt-6 text-center">
        <span className="inline-flex items-center gap-2 bg-ton-black text-ton-cream font-mono text-xs px-4 py-2">
          <Cpu className="w-3.5 h-3.5 text-ton-gold" />
          Powered by Times OS v2.1
        </span>
      </div>
    </div>
  );
}
