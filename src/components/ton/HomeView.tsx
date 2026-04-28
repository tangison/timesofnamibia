"use client";

import React from "react";
import { FEATURED_ARTICLE, JOBS, TENDERS } from "@/lib/ton-data";
import ScrapedTimestamp from "./ScrapedTimestamp";
import ShareButtons from "./ShareButtons";
import { TrendingUp, ArrowRight } from "lucide-react";

export default function HomeView() {
  const sidebarJobs = JOBS.slice(0, 5);
  const sidebarTenders = TENDERS.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* ====== MAIN 3-COLUMN LAYOUT ====== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 py-5 sm:py-6 md:py-8">

        {/* LEFT COLUMN — Sidebar Data */}
        <div className="md:col-span-3 ton-column-rule pr-0 md:pr-5 space-y-6">
          {/* Job Scraper Summary */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] font-bold tracking-widest uppercase text-ton-black/40">
                Job Scraper
              </span>
              <span className="ton-live-dot" style={{ width: 5, height: 5 }} />
            </div>
            <div className="space-y-0">
              {sidebarJobs.map((job, i) => (
                <div key={job.id} className={`py-2.5 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                  <h4 className="font-serif text-sm font-semibold text-ton-black leading-snug">
                    {job.title}
                  </h4>
                  <p className="font-mono text-[10px] text-ton-black/35 mt-0.5">
                    {job.company} &middot; {job.location}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <ScrapedTimestamp label="Scraped" />
                    {job.salary && (
                      <span className="font-mono text-[9px] text-ton-red font-semibold">
                        {job.salary}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <a
              href="/jobs"
              className="mt-2 inline-flex items-center gap-1 font-mono text-[9px] text-ton-red font-semibold uppercase tracking-wider hover:gap-2 transition-all"
            >
              All Jobs <ArrowRight className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Tender Edge Summary */}
          <div className="pt-5 border-t border-ton-black/10 md:border-t-0 md:pt-0">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] font-bold tracking-widest uppercase text-ton-red">
                The Tender Edge
              </span>
              <TrendingUp className="w-3 h-3 text-ton-red" />
            </div>
            <div className="space-y-0">
              {sidebarTenders.map((tender, i) => (
                <div key={tender.id} className={`py-2.5 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                  <span className="font-mono text-[9px] text-ton-red/50 font-semibold">
                    {tender.docId}
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-ton-black leading-snug">
                    {tender.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <ScrapedTimestamp label="Verified" />
                    <span className="font-mono text-[9px] text-ton-red font-semibold">
                      {tender.estimatedValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="/tender"
              className="mt-2 inline-flex items-center gap-1 font-mono text-[9px] text-ton-red font-semibold uppercase tracking-wider hover:gap-2 transition-all"
            >
              Full Analysis <ArrowRight className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* CENTER COLUMN — Main Article */}
        <div className="md:col-span-6 ton-column-rule px-0 md:px-5 mt-6 md:mt-0">
          <article>
            {/* Category */}
            <span className="bg-ton-red text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold">
              Economy
            </span>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-ton-black leading-[1.05] tracking-tight mt-3">
              {FEATURED_ARTICLE.headline}
            </h2>

            {/* Subheadline */}
            <p className="font-serif italic text-ton-black/40 text-sm sm:text-base mt-2 leading-relaxed max-w-2xl">
              {FEATURED_ARTICLE.subheadline}
            </p>

            {/* Image Description — No stock photos */}
            <div className="mt-5 bg-ton-black/[0.03] aspect-[16/9] relative overflow-hidden border border-ton-black/8">
              <div className="absolute inset-0 flex items-center justify-center px-8">
                <p className="font-serif text-sm text-ton-black/25 italic text-center leading-relaxed max-w-lg">
                  High-contrast aerial photograph of the //Kharas Region desert landscape at dusk. Grayscale. The vast gravel plains stretching toward the Orange River basin, shot from 600m altitude. The last light paints the escarpment in deep shadow. GPS overlay at bottom-left in a black box: //KHARAS // 27.76 S, 18.49 E. JetBrains Mono timestamp. No colour. No people. Just land and light.
                </p>
              </div>
              {/* GPS watermark overlay */}
              <div className="absolute bottom-2 left-2 bg-ton-black text-ton-cream px-2 py-1">
                <p className="font-mono text-[7px] sm:text-[8px] leading-tight">
                  //KHARAS // 27.76 S, 18.49 E<br />
                  2026-04-28 16:45:12 CAT
                </p>
              </div>
            </div>

            {/* Byline + Share Buttons */}
            <div className="mt-4 pb-3 border-b border-ton-black/8 flex items-center justify-between flex-wrap gap-2">
              <span className="font-sans text-xs text-ton-black/60">
                {FEATURED_ARTICLE.author}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-ton-black/25">
                  {FEATURED_ARTICLE.date}
                </span>
                <ShareButtons title={FEATURED_ARTICLE.headline} />
              </div>
            </div>

            {/* Content with Drop Cap */}
            <div className="mt-4">
              {FEATURED_ARTICLE.content.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className={`font-serif text-sm sm:text-base text-ton-black/60 leading-[1.75] mb-4 ${
                    i === 0 ? "ton-dropcap" : ""
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Pull Quote */}
            <div className="my-6 md:my-8 pl-4 border-l-[3px] border-ton-red">
              <p className="font-serif italic text-base sm:text-lg md:text-xl text-ton-black/50 leading-relaxed">
                &ldquo;We cannot drink hydrogen. What good is a green revolution if our people
                still live without clean water and reliable electricity?&rdquo;
              </p>
              <p className="font-mono text-[10px] text-ton-black/25 mt-2">
                — Anna Fredericks, Community Leader, Lüderitz
              </p>
            </div>
          </article>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-3 pl-0 md:pl-5 mt-6 md:mt-0 space-y-6">
          {/* Scraped Insights */}
          <div>
            <span className="font-mono text-[9px] font-bold tracking-widest uppercase text-ton-black/35">
              Scraped Insights
            </span>
            <div className="mt-3 space-y-0">
              {[
                { title: "BoN holds repo rate at 7.75%", cat: "Economy", time: "2h ago" },
                { title: "Gold Road Mining EPL-7892 granted", cat: "Mining", time: "4h ago" },
                { title: "AfDB N$340M for Trans-Kalahari", cat: "Infrastructure", time: "6h ago" },
                { title: "NamPort Lüderitz feasibility study open", cat: "Tenders", time: "8h ago" },
                { title: "USD/NAD at 18.42 — 0.3% up", cat: "Markets", time: "Live" },
              ].map((item, i) => (
                <div key={i} className={`py-2.5 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                  <p className="font-serif text-sm font-semibold text-ton-black leading-snug">
                    {item.title}
                  </p>
                  <p className="font-mono text-[10px] text-ton-black/25 mt-0.5">
                    {item.cat} &middot; {item.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Data */}
          <div className="pt-5 border-t border-ton-black/10">
            <span className="font-mono text-[9px] font-bold tracking-widest uppercase text-ton-black/35">
              Market Data
            </span>
            <div className="mt-3 space-y-0 font-mono text-xs">
              {[
                { pair: "USD/NAD", val: "18.42", change: "+0.3%", up: true },
                { pair: "EUR/NAD", val: "20.15", change: "+0.1%", up: true },
                { pair: "ZAR/NAD", val: "1.00", change: "0.0%", up: null },
                { pair: "JSE All Share", val: "89,234", change: "-0.1%", up: false },
                { pair: "BTC/USD", val: "$94,210", change: "+1.2%", up: true },
                { pair: "Gold/oz", val: "$3,312", change: "+0.5%", up: true },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between py-2 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                  <span className="text-ton-black/30">{item.pair}</span>
                  <span className="font-semibold text-ton-black">{item.val}</span>
                  <span className={
                    item.up === true ? "text-emerald-600" :
                    item.up === false ? "text-ton-red" :
                    "text-ton-black/15"
                  }>
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* GemsWeb Digital */}
          <div className="pt-5 border-t border-ton-black/10">
            <span className="font-serif text-sm font-bold text-ton-black">GemsWeb Digital</span>
            <p className="font-sans text-[11px] text-ton-black/35 leading-relaxed mt-1.5 mb-3">
              Enterprise data pipelines for Namibian business intelligence.
            </p>
            <div className="font-mono text-[9px] text-ton-black/25 space-y-1">
              <p>14 regions monitored</p>
              <p>4 job sources scraped</p>
              <p>200+ tenders tracked</p>
              <p>6-second RFP analysis</p>
            </div>
            <button className="mt-3 w-full bg-ton-black text-ton-cream font-mono text-[9px] font-bold uppercase tracking-widest py-2 hover:bg-ton-black/90 transition-colors">
              Request Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
