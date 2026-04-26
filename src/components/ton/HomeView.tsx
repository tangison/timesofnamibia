"use client";

import React from "react";
import Link from "next/link";
import { FEATURED_ARTICLE, JOBS, TENDERS } from "@/lib/ton-data";
import ScrapedTimestamp from "./ScrapedTimestamp";
import ShareButtons from "./ShareButtons";
import { Cpu, TrendingUp, Rss, ArrowRight } from "lucide-react";

export default function HomeView() {
  const sidebarJobs = JOBS.slice(0, 5);
  const sidebarTenders = TENDERS.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* ====== MAIN 3-COLUMN LAYOUT ====== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 py-6 sm:py-8 md:py-10">

        {/* LEFT COLUMN — Sidebar Data */}
        <div className="md:col-span-3 ton-column-rule pr-0 md:pr-6 space-y-8 md:space-y-6">
          {/* Job Scraper Summary */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Rss className="w-3.5 h-3.5 text-ton-red" />
              <h2 className="font-mono text-[10px] font-bold tracking-widest uppercase text-ton-black/60">
                Job Scraper
              </h2>
              <span className="ton-live-dot" style={{ width: 5, height: 5 }} />
            </div>
            <div className="space-y-0">
              {sidebarJobs.map((job, i) => (
                <div key={job.id} className={`py-3 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                  <h4 className="font-serif text-sm font-semibold text-ton-black leading-snug">
                    {job.title}
                  </h4>
                  <p className="font-mono text-[11px] text-ton-black/40 mt-0.5">
                    {job.company} &middot; {job.location}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <ScrapedTimestamp label="Scraped" />
                    {job.salary && (
                      <span className="font-mono text-[10px] text-ton-gold font-semibold">
                        {job.salary}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/jobs"
              className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] text-ton-red font-semibold uppercase tracking-wider hover:gap-2.5 transition-all"
            >
              View All Jobs <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Tender Edge Summary */}
          <div className="pt-8 md:pt-0 border-t md:border-t-0 border-ton-black/5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-3.5 h-3.5 text-ton-gold" />
              <h2 className="font-mono text-[10px] font-bold tracking-widest uppercase text-ton-gold">
                The Tender Edge
              </h2>
            </div>
            <div className="space-y-0">
              {sidebarTenders.map((tender, i) => (
                <div key={tender.id} className={`py-3 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                  <span className="font-mono text-[10px] text-ton-gold/60 font-semibold">
                    {tender.docId}
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-ton-black leading-snug">
                    {tender.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1.5">
                    <ScrapedTimestamp label="Verified" />
                    <span className="font-mono text-[10px] text-ton-gold font-semibold">
                      {tender.estimatedValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/tender"
              className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] text-ton-gold font-semibold uppercase tracking-wider hover:gap-2.5 transition-all"
            >
              Full Tender Analysis <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* CENTER COLUMN — Main Article */}
        <div className="md:col-span-6 ton-column-rule px-0 md:px-6 mt-8 md:mt-0">
          <article>
            {/* Category + Breaking */}
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-ton-red text-white font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 font-bold">
                Economy
              </span>
              <span className="font-mono text-[10px] tracking-widest uppercase text-ton-black/40 border border-ton-black/10 px-2 py-0.5">
                Feature
              </span>
            </div>

            {/* Headline — 300% larger than body */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-ton-black leading-[1.08] tracking-tight">
              {FEATURED_ARTICLE.headline}
            </h2>

            {/* Subheadline */}
            <p className="font-serif italic text-ton-black/50 text-sm sm:text-base md:text-lg mt-3 leading-relaxed max-w-2xl">
              {FEATURED_ARTICLE.subheadline}
            </p>

            {/* Image — Grayscale with color on hover */}
            <div className="mt-6 bg-ton-black/3 aspect-[16/9] relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=675&fit=crop"
                alt={FEATURED_ARTICLE.imageAlt}
                className="w-full h-full object-cover ton-article-image"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 sm:p-4">
                <span className="font-mono text-[9px] sm:text-[10px] text-white/60">
                  Illustration: Namib Desert, //Kharas Region
                </span>
              </div>
            </div>

            {/* Byline + Share Buttons */}
            <div className="mt-5 pb-4 border-b border-ton-black/10 flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="font-sans text-xs font-semibold text-ton-black">
                  {FEATURED_ARTICLE.author}
                </span>
                <span className="font-mono text-[11px] text-ton-black/30 ml-2">
                  {FEATURED_ARTICLE.date}
                </span>
              </div>
              <ShareButtons title={FEATURED_ARTICLE.headline} />
            </div>

            {/* Content with Drop Cap */}
            <div className="mt-5">
              {FEATURED_ARTICLE.content.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className={`font-serif text-sm sm:text-base text-ton-black/70 leading-[1.75] mb-5 ${
                    i === 0 ? "ton-dropcap" : ""
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Pull Quote */}
            <div className="my-8 md:my-10 pl-5 border-l-[3px] border-ton-black">
              <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-ton-black/60 leading-relaxed">
                &ldquo;We cannot drink hydrogen. What good is a green revolution if our people
                still live without clean water and reliable electricity?&rdquo;
              </p>
              <p className="font-mono text-xs text-ton-black/30 mt-3">
                — Anna Fredericks, Community Leader, Lüderitz
              </p>
            </div>
          </article>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-3 pl-0 md:pl-6 mt-8 md:mt-0 space-y-8 md:space-y-6">
          {/* Scraped Insights */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Rss className="w-3.5 h-3.5 text-ton-red" />
              <h3 className="font-mono text-[10px] font-bold tracking-widest uppercase text-ton-black/60">
                Scraped Insights
              </h3>
            </div>
            <div className="space-y-0">
              {[
                { title: "BoN holds repo rate at 7.75%", cat: "Economy", time: "2h ago" },
                { title: "Gold Road Mining EPL-7892 granted", cat: "Mining", time: "4h ago" },
                { title: "AfDB N$340M for Trans-Kalahari", cat: "Infrastructure", time: "6h ago" },
                { title: "NamPort Lüderitz feasibility study open", cat: "Tenders", time: "8h ago" },
                { title: "USD/NAD at 18.42 — 0.3% up", cat: "Markets", time: "Live" },
              ].map((item, i) => (
                <div key={i} className={`py-3 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                  <p className="font-serif text-sm font-semibold text-ton-black leading-snug">
                    {item.title}
                  </p>
                  <p className="font-mono text-[11px] text-ton-black/30 mt-0.5">
                    {item.cat} &middot; {item.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Data */}
          <div className="pt-8 md:pt-0 border-t md:border-t-0 border-ton-black/5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-3.5 h-3.5 text-ton-gold" />
              <h3 className="font-mono text-[10px] font-bold tracking-widest uppercase text-ton-gold">
                Market Data
              </h3>
            </div>
            <div className="space-y-0 font-mono text-xs">
              {[
                { pair: "USD/NAD", val: "18.42", change: "+0.3%", up: true },
                { pair: "EUR/NAD", val: "20.15", change: "+0.1%", up: true },
                { pair: "ZAR/NAD", val: "1.00", change: "0.0%", up: null },
                { pair: "JSE All Share", val: "89,234", change: "-0.1%", up: false },
                { pair: "BTC/USD", val: "$94,210", change: "+1.2%", up: true },
                { pair: "Gold/oz", val: "$3,312", change: "+0.5%", up: true },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between py-2.5 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                  <span className="text-ton-black/40">{item.pair}</span>
                  <span className="font-semibold text-ton-black">{item.val}</span>
                  <span className={
                    item.up === true ? "text-emerald-600" :
                    item.up === false ? "text-ton-red" :
                    "text-ton-black/20"
                  }>
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* GemsWeb Digital CTA */}
          <div className="pt-8 md:pt-0 border-t md:border-t-0 border-ton-black/5">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-ton-gold" />
              <h3 className="font-serif text-base font-bold text-ton-black">GemsWeb Digital</h3>
            </div>
            <p className="font-sans text-xs text-ton-black/40 leading-relaxed mb-4">
              Enterprise data pipelines for Namibian business intelligence.
              Real-time tender monitoring, job market analytics, and compliance tracking.
            </p>
            <div className="font-mono text-[10px] text-ton-black/30 space-y-1.5">
              <p>14 regions monitored</p>
              <p>4 job sources scraped</p>
              <p>200+ tenders tracked</p>
              <p>6-second RFP analysis</p>
            </div>
            <button className="mt-4 w-full bg-ton-black text-ton-cream font-mono text-[10px] font-bold uppercase tracking-widest py-2.5 hover:bg-ton-black/90 transition-colors">
              Request Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
