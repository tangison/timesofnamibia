import React from "react";
import { ArrowLeft, FileText, ExternalLink, Clock } from "lucide-react";

const DOCUMENTS = [
  {
    title: "Business Plan",
    description: "Strategic Business Plan 2026-2028. The constitutional document of Times of Namibia — covering operations, financials, print materials, and the founding manifesto.",
    format: "HTML",
    status: "Available" as const,
    href: "/business-plan",
  },
  {
    title: "The Plan",
    description: "Strategic Execution Plan. The operational blueprint for deploying Times OS, TumaOS, and The Broadside across all 14 Namibian regions.",
    format: "HTML",
    status: "Available" as const,
    href: "/plan",
  },
  {
    title: "Brand System",
    description: "Visual identity guidelines — the 3-color palette, typography hierarchy, imagery rules, print specifications, and the TON-GI global identity system prompt.",
    format: "HTML",
    status: "Available" as const,
    href: "/brand",
  },
  {
    title: "Times OS API Documentation",
    description: "Technical reference for the Times OS v2.1 scraping and verification engine. Endpoints, data schemas, authentication, and rate limits.",
    format: "PDF",
    status: "Coming Soon" as const,
    href: null,
  },
  {
    title: "Annual Tender Compilation",
    description: "Curated annual report of all tracked government tenders, procurement data, and contract awards across all 14 Namibian regions. Print-ready on 120gsm cream stock.",
    format: "PDF",
    status: "Coming Soon" as const,
    href: null,
  },
];

export default function DocumentsView() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div>
          <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
            Documents // The Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
            Documents
          </h1>
          <p className="font-serif italic text-ton-black/65 text-sm sm:text-base mt-2 max-w-xl">
            The institutional archive. Every document, every specification, every protocol — catalogued and accessible.
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <a
            href="/"
            className="font-mono text-[10px] text-ton-black/55 hover:text-ton-black transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3 h-3" />
            Newsroom
          </a>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="flex items-center gap-6 mb-8 sm:mb-10 pt-5 border-t border-ton-black/8">
        <div>
          <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">Total Documents</span>
          <p className="font-serif text-2xl font-bold text-ton-black mt-0.5">{DOCUMENTS.length}</p>
        </div>
        <div className="h-8 w-px bg-ton-black/8" />
        <div>
          <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">Available</span>
          <p className="font-serif text-2xl font-bold text-ton-black mt-0.5">{DOCUMENTS.filter(d => d.status === "Available").length}</p>
        </div>
        <div className="h-8 w-px bg-ton-black/8" />
        <div>
          <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">Coming Soon</span>
          <p className="font-serif text-2xl font-bold text-ton-black/30 mt-0.5">{DOCUMENTS.filter(d => d.status === "Coming Soon").length}</p>
        </div>
      </div>

      {/* Document Registry */}
      <div className="space-y-0">
        {DOCUMENTS.map((doc, i) => (
          <div
            key={i}
            className="border-t border-ton-black/8 py-5 sm:py-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[9px] text-ton-black/20 font-bold tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-ton-black">
                    {doc.title}
                  </h3>
                </div>
                <p className="font-sans text-xs sm:text-sm text-ton-black/65 leading-relaxed max-w-2xl ml-0 sm:ml-8">
                  {doc.description}
                </p>
                <div className="flex items-center gap-4 mt-3 ml-0 sm:ml-8">
                  {/* Format badge */}
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest bg-ton-black/5 px-2 py-0.5 text-ton-black/55">
                    {doc.format}
                  </span>
                  {/* Status badge */}
                  {doc.status === "Available" ? (
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-ton-red">
                      Available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-ton-black/25">
                      <Clock className="w-3 h-3" />
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="flex-shrink-0 ml-0 sm:ml-4">
                {doc.status === "Available" && doc.href ? (
                  <a
                    href={doc.href}
                    className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-black text-ton-cream px-4 py-2.5 hover:bg-ton-black/90 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Document
                  </a>
                ) : (
                  <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-black/5 text-ton-black/20 px-4 py-2.5">
                    <Clock className="w-3.5 h-3.5" />
                    Not Yet Available
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Bottom border */}
        <div className="border-t border-ton-black/8" />
      </div>

      {/* Note about upcoming documents */}
      <div className="mt-8 sm:mt-10 bg-ton-black text-ton-cream p-5">
        <div className="flex items-start gap-3">
          <ExternalLink className="w-4 h-4 text-ton-red flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-wider mb-2">
              Upcoming Releases
            </h3>
            <p className="font-sans text-xs text-ton-cream/50 leading-relaxed">
              The Times OS API Documentation and Annual Tender Compilation are currently in preparation. Both documents will be released as print-ready PDF files on 120gsm cream stock and as accessible digital formats. Register your interest via the <a href="/contact" className="text-ton-cream underline hover:text-ton-red transition-colors">Contact</a> page to receive notification upon release.
            </p>
          </div>
        </div>
      </div>

      {/* TANGISON */}
      <div className="py-8 text-center border-t border-ton-black/8 mt-8">
        <p className="font-serif italic text-ton-black/30 text-sm">
          All documents are published by TANGISON.
        </p>
        <a
          href="https://tangison.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-widest mt-2 inline-block hover:text-ton-red/80 transition-colors"
        >
          tangison.com
        </a>
      </div>
    </div>
  );
}
