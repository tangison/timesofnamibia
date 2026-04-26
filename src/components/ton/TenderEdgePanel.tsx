"use client";

import React from "react";
import Link from "next/link";
import { TENDERS } from "@/lib/ton-data";
import ScrapedTimestamp from "./ScrapedTimestamp";
import ShareButtons from "./ShareButtons";
import { FileText, Download, AlertTriangle, Clock } from "lucide-react";

function statusLabel(status: TENDERS[number]["status"]) {
  switch (status) {
    case "open":
      return <span className="font-mono text-[9px] text-emerald-600 font-semibold uppercase">Open</span>;
    case "closing":
      return (
        <span className="flex items-center gap-1 font-mono text-[9px] text-ton-red font-semibold uppercase">
          <AlertTriangle className="w-2.5 h-2.5" />
          Closing Soon
        </span>
      );
    case "closed":
      return <span className="font-mono text-[9px] text-ton-black/30 font-semibold uppercase">Closed</span>;
  }
}

export default function TenderEdgePanel() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-3.5 h-3.5 text-ton-gold" />
        <h2 className="font-serif text-base font-bold text-ton-gold">
          The Tender Edge
        </h2>
      </div>
      <p className="font-mono text-[10px] text-ton-gold/60 mb-4">
        Government procurement intelligence — GemsWeb Digital
      </p>

      <div className="divide-y divide-ton-black/5">
        {TENDERS.map((tender) => (
          <div key={tender.id} className="py-3 group">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] text-ton-gold/60 font-semibold">
                {tender.docId}
              </span>
              {statusLabel(tender.status)}
            </div>
            <h4 className="font-serif text-sm font-semibold text-ton-black leading-snug">
              {tender.title}
            </h4>
            <p className="font-mono text-[10px] text-ton-black/40 mt-1">
              {tender.department}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-ton-black/40">
              <Clock className="w-3 h-3" />
              <span className="font-mono text-[10px]">Deadline: {tender.deadline}</span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="font-mono text-[10px] text-ton-gold font-semibold">
                Est. {tender.estimatedValue}
              </span>
              <ScrapedTimestamp label="Verified" />
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/tender"
        className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] text-ton-gold font-semibold uppercase tracking-wider hover:gap-2 transition-all"
      >
        Full Tender Analysis →
      </Link>
    </div>
  );
}
