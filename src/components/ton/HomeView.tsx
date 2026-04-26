"use client";

import React from "react";
import Link from "next/link";
import { FEATURED_ARTICLE, JOBS, TENDERS } from "@/lib/ton-data";
import JobScraperPanel from "./JobScraperPanel";
import TenderEdgePanel from "./TenderEdgePanel";
import ScrapedTimestamp from "./ScrapedTimestamp";
import ShareButtons from "./ShareButtons";
import { Badge } from "@/components/ui/badge";
import { Cpu, TrendingUp, Rss } from "lucide-react";

export default function HomeView() {
  // Show top 3 jobs on mobile, all on desktop
  const mobileJobs = JOBS.slice(0, 3);
  // Show top 2 tenders on mobile
  const mobileTenders = TENDERS.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* LEFT COLUMN */}
        <div className="md:col-span-3 ton-column-rule pr-0 md:pr-4">
          {/* Desktop: Full panels */}
          <div className="hidden md:block">
            <JobScraperPanel />
            <div className="mt-4">
              <TenderEdgePanel />
            </div>
          </div>

          {/* Mobile: Compact job scraper */}
          <div className="md:hidden">
            <div className="bg-white ton-border-editorial">
              <div className="bg-ton-black text-ton-cream px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rss className="w-3.5 h-3.5 text-ton-red" />
                    <h2 className="font-serif text-base font-bold">Job Scraper</h2>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="ton-live-dot" style={{ width: 6, height: 6 }} />
                    <span className="font-mono text-[10px]">LIVE</span>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-ton-black/5">
                {mobileJobs.map((job) => (
                  <div key={job.id} className="px-3 py-2.5">
                    <h4 className="font-serif text-sm font-semibold text-ton-black leading-tight">
                      {job.title}
                    </h4>
                    <p className="font-mono text-xs text-ton-black/80 mt-0.5">
                      {job.company} • {job.location}
                    </p>
                    <div className="flex items-center justify-between mt-1">
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
              <div className="px-3 py-2 border-t border-ton-black/10 bg-ton-cream/50">
                <Link
                  href="/jobs"
                  className="font-mono text-xs text-ton-red font-semibold hover:underline uppercase tracking-wider block text-center"
                >
                  View All Jobs →
                </Link>
              </div>
            </div>

            {/* Mobile: Compact tender panel */}
            <div className="mt-4 bg-white border-l-4 border-ton-gold">
              <div className="bg-ton-gold/10 px-3 py-2.5 border-b border-ton-gold/20">
                <h2 className="font-serif text-base font-bold text-ton-gold">
                  The Tender Edge
                </h2>
              </div>
              <div className="divide-y divide-ton-black/5">
                {mobileTenders.map((tender) => (
                  <div key={tender.id} className="px-3 py-2.5">
                    <span className="font-mono text-[10px] text-ton-gold font-semibold">
                      {tender.docId}
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-ton-black leading-tight">
                      {tender.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <ScrapedTimestamp label="Verified" />
                      <span className="font-mono text-[10px] text-ton-gold font-semibold">
                        {tender.estimatedValue}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-3 py-2 border-t border-ton-gold/20 bg-ton-gold/5">
                <Link
                  href="/tender"
                  className="font-mono text-xs text-ton-gold font-semibold hover:underline uppercase tracking-wider block text-center"
                >
                  Full Tender Analysis →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN — Main Article */}
        <div className="md:col-span-6 ton-column-rule px-0 md:px-4 mt-4 md:mt-0">
          <article className="bg-white ton-border-editorial ton-no-radius">
            {/* Category + Breaking */}
            <div className="flex items-center gap-2 px-4 sm:px-6 pt-4">
              <Badge className="bg-ton-red text-white font-mono text-[10px] tracking-widest uppercase rounded-none">
                Economy
              </Badge>
              <Badge
                variant="outline"
                className="font-mono text-[10px] tracking-widest uppercase border-ton-black/20 rounded-none"
              >
                Feature
              </Badge>
            </div>

            {/* Headline - 300% larger than body (text-5xl on desktop) */}
            <div className="px-4 sm:px-6 pt-3 pb-2">
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight">
                {FEATURED_ARTICLE.headline}
              </h2>
              <p className="font-serif italic text-ton-black/80 text-sm sm:text-base mt-2 leading-relaxed">
                {FEATURED_ARTICLE.subheadline}
              </p>
            </div>

            {/* Image - Grayscale with color on hover */}
            <div className="mx-4 sm:mx-6 my-3 bg-ton-black/5 aspect-[16/9] relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=675&fit=crop"
                alt={FEATURED_ARTICLE.imageAlt}
                className="w-full h-full object-cover ton-article-image"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 sm:p-3">
                <span className="font-mono text-[9px] sm:text-[10px] text-white/80">
                  Illustration: Namib Desert, //Kharas Region
                </span>
              </div>
            </div>

            {/* Byline + Share Buttons */}
            <div className="px-4 sm:px-6 py-2 border-t border-b border-ton-black/10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-sans text-xs font-semibold text-ton-black">
                  {FEATURED_ARTICLE.author}
                </span>
                <span className="font-mono text-xs text-ton-black/80 ml-2">
                  {FEATURED_ARTICLE.date}
                </span>
              </div>
              <ShareButtons title={FEATURED_ARTICLE.headline} />
            </div>

            {/* Content with Drop Cap */}
            <div className="px-4 sm:px-6 py-4">
              {FEATURED_ARTICLE.content.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className={`font-serif text-sm sm:text-base text-ton-black/80 leading-relaxed mb-4 ${
                    i === 0 ? "ton-dropcap" : ""
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Pull Quote */}
            <div className="mx-4 sm:mx-6 my-4 border-l-4 border-ton-black pl-4">
              <p className="font-serif italic text-lg sm:text-xl text-ton-black/80 leading-relaxed">
                &ldquo;We cannot drink hydrogen. What good is a green revolution if our people
                still live without clean water and reliable electricity?&rdquo;
              </p>
              <p className="font-mono text-xs text-ton-black/80 mt-2">
                — Anna Fredericks, Community Leader, Lüderitz
              </p>
            </div>
          </article>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-3 pl-0 md:pl-4 mt-4 md:mt-0 space-y-4">
          {/* Scraped Insights */}
          <div className="bg-white border border-ton-black/10 ton-no-radius">
            <div className="bg-ton-black px-3 sm:px-4 py-2.5 flex items-center gap-2">
              <Rss className="w-3.5 h-3.5 text-ton-red" />
              <h3 className="font-mono text-xs font-bold text-ton-cream tracking-widest uppercase">
                Scraped Insights
              </h3>
            </div>
            <div className="divide-y divide-ton-black/5">
              <div className="px-3 sm:px-4 py-3">
                <p className="font-serif text-sm font-semibold text-ton-black">
                  BoN holds repo rate at 7.75%
                </p>
                <p className="font-mono text-xs text-ton-black/80 mt-0.5">
                  Economy • 2h ago
                </p>
              </div>
              <div className="px-3 sm:px-4 py-3">
                <p className="font-serif text-sm font-semibold text-ton-black">
                  Gold Road Mining EPL-7892 granted
                </p>
                <p className="font-mono text-xs text-ton-black/80 mt-0.5">
                  Mining • 4h ago
                </p>
              </div>
              <div className="px-3 sm:px-4 py-3">
                <p className="font-serif text-sm font-semibold text-ton-black">
                  AfDB N$340M for Trans-Kalahari
                </p>
                <p className="font-mono text-xs text-ton-black/80 mt-0.5">
                  Infrastructure • 6h ago
                </p>
              </div>
              <div className="px-3 sm:px-4 py-3">
                <p className="font-serif text-sm font-semibold text-ton-black">
                  NamPort Lüderitz feasibility study open
                </p>
                <p className="font-mono text-xs text-ton-black/80 mt-0.5">
                  Tenders • 8h ago
                </p>
              </div>
              <div className="px-3 sm:px-4 py-3">
                <p className="font-serif text-sm font-semibold text-ton-black">
                  USD/NAD at 18.42 — 0.3% up
                </p>
                <p className="font-mono text-xs text-ton-black/80 mt-0.5">
                  Markets • Live
                </p>
              </div>
            </div>
          </div>

          {/* Market Data - 2-column grid on mobile instead of table rows */}
          <div className="bg-white border border-ton-black/10 ton-no-radius">
            <div className="bg-ton-gold/10 px-3 sm:px-4 py-2.5 flex items-center gap-2 border-b border-ton-gold/20">
              <TrendingUp className="w-3.5 h-3.5 text-ton-gold" />
              <h3 className="font-mono text-xs font-bold text-ton-gold tracking-widest uppercase">
                Market Data
              </h3>
            </div>
            {/* Desktop: table rows */}
            <div className="hidden sm:block divide-y divide-ton-black/5 font-mono text-xs">
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-ton-black/80">USD/NAD</span>
                <span className="font-semibold text-ton-black">18.42</span>
                <span className="text-emerald-600">▲ 0.3%</span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-ton-black/80">EUR/NAD</span>
                <span className="font-semibold text-ton-black">20.15</span>
                <span className="text-emerald-600">▲ 0.1%</span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-ton-black/80">ZAR/NAD</span>
                <span className="font-semibold text-ton-black">1.00</span>
                <span className="text-ton-black/60">— 0.0%</span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-ton-black/80">JSE All Share</span>
                <span className="font-semibold text-ton-black">89,234</span>
                <span className="text-red-500">▼ 0.1%</span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-ton-black/80">BTC/USD</span>
                <span className="font-semibold text-ton-black">$94,210</span>
                <span className="text-emerald-600">▲ 1.2%</span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-ton-black/80">Gold/oz</span>
                <span className="font-semibold text-ton-black">$3,312</span>
                <span className="text-emerald-600">▲ 0.5%</span>
              </div>
            </div>
            {/* Mobile: 2-column grid */}
            <div className="sm:hidden grid grid-cols-2 gap-px bg-ton-black/5 font-mono text-xs">
              <div className="bg-white px-3 py-2">
                <p className="text-ton-black/80">USD/NAD</p>
                <p className="font-semibold text-ton-black">18.42</p>
                <p className="text-emerald-600 text-[10px]">▲ 0.3%</p>
              </div>
              <div className="bg-white px-3 py-2">
                <p className="text-ton-black/80">EUR/NAD</p>
                <p className="font-semibold text-ton-black">20.15</p>
                <p className="text-emerald-600 text-[10px]">▲ 0.1%</p>
              </div>
              <div className="bg-white px-3 py-2">
                <p className="text-ton-black/80">ZAR/NAD</p>
                <p className="font-semibold text-ton-black">1.00</p>
                <p className="text-ton-black/60 text-[10px]">— 0.0%</p>
              </div>
              <div className="bg-white px-3 py-2">
                <p className="text-ton-black/80">JSE All</p>
                <p className="font-semibold text-ton-black">89,234</p>
                <p className="text-red-500 text-[10px]">▼ 0.1%</p>
              </div>
              <div className="bg-white px-3 py-2">
                <p className="text-ton-black/80">BTC/USD</p>
                <p className="font-semibold text-ton-black">$94,210</p>
                <p className="text-emerald-600 text-[10px]">▲ 1.2%</p>
              </div>
              <div className="bg-white px-3 py-2">
                <p className="text-ton-black/80">Gold/oz</p>
                <p className="font-semibold text-ton-black">$3,312</p>
                <p className="text-emerald-600 text-[10px]">▲ 0.5%</p>
              </div>
            </div>
          </div>

          {/* GemsWeb Digital CTA */}
          <div className="bg-ton-black text-ton-cream p-4 sm:p-5 ton-no-radius">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-ton-gold" />
              <h3 className="font-serif text-base font-bold">GemsWeb Digital</h3>
            </div>
            <p className="font-sans text-xs text-ton-cream/80 leading-relaxed mb-3">
              Enterprise data pipelines for Namibian business intelligence.
              Real-time tender monitoring, job market analytics, and compliance tracking.
            </p>
            <div className="font-mono text-[10px] text-ton-cream/80 space-y-1">
              <p>▸ 14 regions monitored</p>
              <p>▸ 4 job sources scraped</p>
              <p>▸ 200+ tenders tracked</p>
              <p>▸ 6-second RFP analysis</p>
            </div>
            <button className="mt-3 w-full bg-ton-gold text-white font-mono text-xs font-bold uppercase tracking-widest py-2 hover:bg-ton-gold/90 transition-colors rounded-none">
              Request Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
