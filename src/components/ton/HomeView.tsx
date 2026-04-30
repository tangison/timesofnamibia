"use client";

import React from "react";
import ScrapedTimestamp from "./ScrapedTimestamp";
import ShareButtons from "./ShareButtons";
import IngestionStatus from "./IngestionStatus";
import { TrendingUp, ArrowRight, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

// ── TYPES matching Prisma model shapes ──────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface RssFeed {
  id: string;
  name: string;
}

interface Article {
  id: string;
  slug: string;
  headline: string;
  subheadline: string | null;
  content: string;
  excerpt: string | null;
  source: string;
  categorySlug: string | null;
  section: string;
  readingTime: number;
  imageAlt: string | null;
  imageGps: string | null;
  imageUrl: string | null;
  authorLine: string;
  featured: boolean;
  published: boolean;
  publishedAt: Date | null;
  views: number;
  commentCount: number;
  category: Category | null;
  rssFeed: RssFeed | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  region: string | null;
  source: string;
  salary: string | null;
  type: string | null;
  url: string | null;
  postedAgo: string | null;
  scrapedAt: Date;
  active: boolean;
}

interface TenderSummary {
  id: string;
  text: string;
  order: number;
}

interface TenderKeyDate {
  id: string;
  text: string;
  order: number;
}

interface TenderCompliance {
  id: string;
  requirement: string;
  order: number;
}

interface Tender {
  id: string;
  docId: string;
  title: string;
  department: string;
  deadline: Date;
  estimatedValue: string | null;
  status: string;
  summaries: TenderSummary[];
  keyDates: TenderKeyDate[];
  compliances: TenderCompliance[];
}

interface MarketDatum {
  id: string;
  pair: string;
  rate: string;
  change: string;
  direction: string;
  source: string;
  active: boolean;
  updatedAt: Date;
}

// ── HELPERS ─────────────────────────────────────────────────────

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTimeAgo(date: Date | null): string {
  if (!date) return "";
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

// ── COMPONENT ───────────────────────────────────────────────────

interface HomeViewProps {
  featuredArticle: Article | null;
  recentArticles: Article[];
  jobs: Job[];
  tenders: Tender[];
  marketData: MarketDatum[];
}

export default function HomeView({
  featuredArticle,
  recentArticles,
  jobs,
  tenders,
  marketData,
}: HomeViewProps) {
  const sidebarJobs = jobs.slice(0, 5);
  const sidebarTenders = tenders.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* ====== ABOVE THE FOLD label ====== */}
      <div className="flex items-center gap-3 pt-5 sm:pt-6 md:pt-8 pb-0">
        <div className="flex-1 border-t border-ton-black/10" />
        <div className="flex items-center gap-4">
          <h1 className="font-mono text-[8px] tracking-[0.3em] uppercase text-ton-black/20 font-normal">
            Above the Fold
          </h1>
          <IngestionStatus />
        </div>
        <div className="flex-1 border-t border-ton-black/10" />
      </div>

      {/* ====== MAIN 3-COLUMN LAYOUT ====== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 py-4 sm:py-5 md:py-6">

        {/* LEFT COLUMN — Sidebar Data */}
        <div className="md:col-span-3 ton-column-rule pr-0 md:pr-5 space-y-5">
          {/* Job Scraper Summary */}
          <div>
            {/* Newspaper column header with rule */}
            <div className="border-t-2 border-ton-black pt-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-ton-black/50">
                  Job Scraper
                </span>
                <span className="ton-live-dot" style={{ width: 5, height: 5 }} />
              </div>
            </div>
            <div className="space-y-0">
              {sidebarJobs.map((job, i) => (
                <div key={job.id} className={`py-2.5 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                  <h3 className="font-serif text-sm font-semibold text-ton-black leading-snug">
                    {job.title}
                  </h3>
                  <p className="font-mono text-[10px] text-ton-black/35 mt-0.5">
                    {job.company} &middot; {job.location}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <ScrapedTimestamp label="Scraped" date={job.scrapedAt} />
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
          <div className="pt-4 border-t border-ton-black/8">
            {/* Newspaper column header with red rule */}
            <div className="border-t-2 border-ton-red pt-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-ton-red">
                  The Tender Edge
                </span>
                <TrendingUp className="w-3 h-3 text-ton-red" />
              </div>
            </div>
            <div className="space-y-0">
              {sidebarTenders.map((tender, i) => (
                <div key={tender.id} className={`py-2.5 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                  <span className="font-mono text-[9px] text-ton-red/50 font-semibold">
                    {tender.docId}
                  </span>
                  <h3 className="font-serif text-sm font-semibold text-ton-black leading-snug">
                    {tender.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <ScrapedTimestamp label="Verified" date={tender.deadline} />
                    <span className="font-mono text-[9px] text-ton-red font-semibold">
                      {tender.estimatedValue || "—"}
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
        <div className="md:col-span-6 ton-column-rule px-0 md:px-5 mt-5 md:mt-0">
          {featuredArticle ? (
            <article>
              {/* Category */}
              <span className="bg-ton-red text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold">
                {featuredArticle.category?.name || featuredArticle.categorySlug || "News"}
              </span>

              {/* Headline */}
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-ton-black leading-[1.05] tracking-tight mt-3">
                {featuredArticle.headline}
              </h2>

              {/* Subheadline */}
              {featuredArticle.subheadline && (
                <p className="font-serif italic text-ton-black/40 text-sm sm:text-base mt-2 leading-relaxed max-w-2xl">
                  {featuredArticle.subheadline}
                </p>
              )}

              {/* Image Description — No stock photos */}
              <div className="mt-5 bg-ton-black/[0.03] aspect-[16/9] relative overflow-hidden border border-ton-black/8">
                <div className="absolute inset-0 flex items-center justify-center px-8">
                  <p className="font-serif text-sm text-ton-black/25 italic text-center leading-relaxed max-w-lg">
                    {featuredArticle.imageAlt || "Editorial photograph — no stock imagery. High-contrast grayscale image accompanying this report."}
                  </p>
                </div>
                {/* GPS watermark overlay */}
                {featuredArticle.imageGps && (
                  <div className="absolute bottom-2 left-2 bg-ton-black text-ton-cream px-2 py-1">
                    <p className="font-mono text-[7px] sm:text-[8px] leading-tight">
                      {featuredArticle.imageGps}<br />
                      {featuredArticle.publishedAt
                        ? new Date(featuredArticle.publishedAt).toISOString().replace("T", " ").slice(0, 19) + " CAT"
                        : ""}
                    </p>
                  </div>
                )}
              </div>

              {/* Byline + Share Buttons */}
              <div className="mt-4 pb-3 border-b border-ton-black/8 flex items-center justify-between flex-wrap gap-2">
                <span className="font-sans text-xs text-ton-black/60">
                  {featuredArticle.authorLine}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-ton-black/25">
                    {formatDate(featuredArticle.publishedAt)}
                  </span>
                  <ShareButtons title={featuredArticle.headline} />
                </div>
              </div>

              {/* Content with Drop Cap */}
              <div className="mt-4">
                {featuredArticle.content.split("\n\n").map((para, i) => (
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
          ) : (
            <article>
              <div className="py-20 text-center">
                <p className="font-serif text-xl text-ton-black/30 italic">
                  No featured article available yet.
                </p>
                <p className="font-mono text-[10px] text-ton-black/20 mt-2">
                  Articles will appear here once published.
                </p>
              </div>
            </article>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-3 pl-0 md:pl-5 mt-5 md:mt-0 space-y-5">
          {/* News in Brief (was Scraped Insights) */}
          <div>
            {/* Newspaper column header with rule */}
            <div className="border-t-2 border-ton-black pt-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-ton-black/50">
                  News in Brief
                </span>
                <span className="font-mono text-[7px] text-ton-black/15 tracking-wider uppercase">
                  Scraped
                </span>
              </div>
            </div>
            <div className="space-y-0">
              {recentArticles.length > 0 ? (
                recentArticles.slice(0, 5).map((article, i) => (
                  <div key={article.id} className={`py-2.5 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                    <a href={`/article/${article.slug}`} className="block">
                      <p className="font-serif text-sm font-semibold text-ton-black leading-snug hover:text-ton-red transition-colors">
                        {article.headline}
                      </p>
                    </a>
                    <p className="font-mono text-[10px] text-ton-black/25 mt-0.5">
                      {article.category?.name || article.categorySlug || "News"} &middot; {formatTimeAgo(article.publishedAt)}
                    </p>
                  </div>
                ))
              ) : (
                [1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className={`py-2.5 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                    <p className="font-serif text-sm text-ton-black/20 italic">
                      Awaiting articles…
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Market Data — financial page feel */}
          <div className="pt-4 border-t border-ton-black/8">
            {/* Financial page header */}
            <div className="border-t-2 border-ton-black pt-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-ton-black/50">
                  Markets
                </span>
                <span className="font-mono text-[7px] text-ton-black/15 tracking-wider uppercase">
                  CAT
                </span>
              </div>
            </div>
            {/* Column headers like a financial page */}
            <div className="flex items-center justify-between pb-1.5 border-b border-ton-black/15">
              <span className="font-mono text-[7px] text-ton-black/25 uppercase tracking-wider">Pair</span>
              <span className="font-mono text-[7px] text-ton-black/25 uppercase tracking-wider">Rate</span>
              <span className="font-mono text-[7px] text-ton-black/25 uppercase tracking-wider">Chg</span>
            </div>
            <div className="space-y-0 font-mono text-xs">
              {marketData.length > 0 ? (
                marketData.map((item, i) => (
                  <div key={item.id} className={`flex items-center justify-between py-1.5 ${i > 0 ? "border-t border-ton-black/[0.03]" : ""}`}>
                    <span className="text-ton-black/30 text-[11px]">{item.pair}</span>
                    <span className="font-semibold text-ton-black text-[11px]">{item.rate}</span>
                    <span className={
                      "flex items-center gap-0.5 text-[10px] " + (
                      item.direction === "up" ? "text-emerald-600" :
                      item.direction === "down" ? "text-ton-red" :
                      "text-ton-black/15")
                    }>
                      {item.direction === "up" && <ArrowUpRight className="w-2.5 h-2.5" />}
                      {item.direction === "down" && <ArrowDownRight className="w-2.5 h-2.5" />}
                      {item.direction === "flat" && <Minus className="w-2.5 h-2.5" />}
                      {item.change}
                    </span>
                  </div>
                ))
              ) : (
                [
                  { pair: "USD/NAD", val: "—", change: "—", direction: "flat" },
                  { pair: "EUR/NAD", val: "—", change: "—", direction: "flat" },
                  { pair: "ZAR/NAD", val: "—", change: "—", direction: "flat" },
                  { pair: "JSE All", val: "—", change: "—", direction: "flat" },
                  { pair: "BTC/USD", val: "—", change: "—", direction: "flat" },
                  { pair: "Gold/oz", val: "—", change: "—", direction: "flat" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between py-1.5 ${i > 0 ? "border-t border-ton-black/[0.03]" : ""}`}>
                    <span className="text-ton-black/30 text-[11px]">{item.pair}</span>
                    <span className="font-semibold text-ton-black text-[11px]">{item.val}</span>
                    <span className="flex items-center gap-0.5 text-[10px] text-ton-black/15">
                      <Minus className="w-2.5 h-2.5" />
                      {item.change}
                    </span>
                  </div>
                ))
              )}
            </div>
            {/* Market footer — newspaper financial page style */}
            <div className="mt-2 pt-2 border-t border-ton-black/5">
              <p className="font-mono text-[7px] text-ton-black/15 leading-relaxed">
                Rates sourced from BoN &amp; JSE. Delayed 15 min. BTC via CoinGecko.
              </p>
            </div>
          </div>

          {/* GemsWeb Digital — now links to /about */}
          <div className="pt-4 border-t border-ton-black/8">
            <div className="border-t-2 border-ton-black pt-2 mb-2">
              <span className="font-serif text-sm font-bold text-ton-black">GemsWeb Digital</span>
            </div>
            <p className="font-sans text-[11px] text-ton-black/35 leading-relaxed mt-1.5 mb-3">
              Enterprise data pipelines powering TON&apos;s real-time intelligence. Automated scraping, verification, and analysis across Namibia&apos;s business landscape.
            </p>
            <div className="font-mono text-[9px] text-ton-black/25 space-y-1">
              <p>14 regions monitored</p>
              <p>4 job sources scraped</p>
              <p>200+ tenders tracked</p>
              <p>6-second RFP analysis</p>
            </div>
            <a
              href="/about"
              className="mt-3 flex items-center justify-center gap-1.5 w-full bg-ton-black text-ton-cream font-mono text-[9px] font-bold uppercase tracking-widest py-2 hover:bg-ton-black/90 transition-colors"
            >
              About GemsWeb <ArrowRight className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
