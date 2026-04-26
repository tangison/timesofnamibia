"use client";

import React from "react";
import Link from "next/link";
import { TENDERS } from "@/lib/ton-data";
import ScrapedTimestamp from "./ScrapedTimestamp";
import ShareButtons from "./ShareButtons";
import { FileText, Download, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function statusBadge(status: TENDERS[number]["status"]) {
  switch (status) {
    case "open":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-mono rounded-none">
          OPEN
        </Badge>
      );
    case "closing":
      return (
        <Badge className="bg-ton-red/10 text-ton-red border-ton-red/20 text-[10px] font-mono flex items-center gap-1 rounded-none">
          <AlertTriangle className="w-3 h-3" />
          CLOSING
        </Badge>
      );
    case "closed":
      return (
        <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-[10px] font-mono rounded-none">
          CLOSED
        </Badge>
      );
  }
}

export default function TenderEdgePanel() {
  return (
    <div className="bg-white border-l-4 border-ton-gold ton-no-radius h-full flex flex-col">
      {/* Header */}
      <div className="bg-ton-gold/10 px-4 py-3 border-b border-ton-gold/20">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-ton-gold" />
          <h2 className="font-serif text-lg font-bold text-ton-gold">
            The Tender Edge
          </h2>
        </div>
        <p className="font-mono text-xs text-ton-gold/80 mt-0.5">
          Government procurement intelligence — GemsWeb Digital
        </p>
      </div>

      {/* Tender Listings */}
      <div className="flex-1 overflow-y-auto ton-scrollbar max-h-[600px]">
        {TENDERS.map((tender) => (
          <div
            key={tender.id}
            className="px-4 py-3 border-b border-ton-black/5 hover:bg-ton-gold/5 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-ton-gold font-semibold">
                    {tender.docId}
                  </span>
                  {statusBadge(tender.status)}
                </div>
                <h4 className="font-serif text-sm font-semibold text-ton-black leading-tight">
                  {tender.title}
                </h4>
                <p className="font-mono text-xs text-ton-black/80 mt-1">
                  {tender.department}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 text-ton-black/80">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono text-xs">
                    Deadline: {tender.deadline}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-mono text-xs text-ton-gold font-semibold">
                    Est. {tender.estimatedValue}
                  </p>
                  <ScrapedTimestamp label="Verified" />
                </div>
                <div className="mt-2">
                  <ShareButtons title={`${tender.title} — ${tender.docId}`} />
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button className="font-mono text-[10px] font-bold uppercase tracking-wider bg-ton-gold text-white px-2.5 py-1 hover:bg-ton-gold/90 transition-colors flex items-center gap-1 rounded-none">
                <Download className="w-3 h-3" />
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-ton-gold/20 bg-ton-gold/5">
        <Link
          href="/tender"
          className="font-mono text-xs text-ton-gold font-semibold hover:underline uppercase tracking-wider block text-center"
        >
          Full Tender Analysis →
        </Link>
      </div>
    </div>
  );
}
