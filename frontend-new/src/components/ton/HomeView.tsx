"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, ChevronRight, TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import Image from "next/image";

// ── TYPES ────────────────────────────────────────────────────

interface Article {
  id: string;
  slug: string;
  headline: string;
  subheadline: string | null;
  content: string;
  excerpt: string | null;
  source: string;
  section: string;
  publishedAt: Date;
  authorLine: string;
  readingTime: number;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  url: string | null;
}

interface Tender {
  id: string;
  docId: string;
  title: string;
  department: string;
  deadline: Date;
  estimatedValue: string | null;
}

interface MarketDatum {
  id: string;
  pair: string;
  rate: string;
  change: string;
  direction: string;
}

interface HomeViewProps {
  featuredArticle: Article | null;
  recentArticles: Article[];
  jobs: Job[];
  tenders: Tender[];
  marketData: MarketDatum[];
}

// ── MOTION ───────────────────────────────────────────────────

const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
  mass: 1,
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: springTransition },
};

// ── NAMIBIAN IMAGES (Unsplash, free, no watermarks) ─────────

const NAMIBIAN_IMAGES = [
  "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80", // Sossusvlei dunes
  "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80", // Namib desert
  "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80", // Quiver trees
  "https://images.unsplash.com/photo-1513415564515-763d91423bdd?w=800&q=80", // Skeleton Coast
];

// ── HELPERS ──────────────────────────────────────────────────

function timeAgo(date: Date): string {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getMarketIcon(direction: string) {
  if (direction === "up") return <ArrowUpRight size={14} className="text-emerald-600" />;
  if (direction === "down") return <ArrowDownRight size={14} className="text-red-600" />;
  return <Minus size={14} className="text-ton-black/30" />;
}

// ── COMPONENT ────────────────────────────────────────────────

export default function HomeView({
  featuredArticle,
  recentArticles,
  jobs,
  tenders,
  marketData,
}: HomeViewProps) {
  const sidebarJobs = jobs.slice(0, 4);
  const sidebarTenders = tenders.slice(0, 3);
  const feedArticles = recentArticles.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* ═══════════════════════════════════════════════════════
          HERO — Featured Article
          Matches the reference design: category badge, large serif
          headline, summary, metadata, abstract visual
         ═══════════════════════════════════════════════════════ */}
      {featuredArticle && (
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUpItem}
          className="mb-16 border-b border-ton-black/10 pb-16"
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <span className="bg-ton-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  {featuredArticle.section}
                </span>
                <span className="text-ton-black/40 text-xs font-bold uppercase tracking-widest">
                  {featuredArticle.source}
                </span>
              </div>

              <h1 className="font-serif font-black text-3xl md:text-5xl lg:text-6xl text-ton-black leading-tight hover:text-ton-red transition-colors duration-500 cursor-pointer">
                <a href={`/article/${featuredArticle.slug}`}>
                  {featuredArticle.headline}
                </a>
              </h1>

              <p className="text-ton-black/50 text-base md:text-lg leading-relaxed font-sans max-w-3xl">
                {featuredArticle.excerpt || featuredArticle.subheadline || featuredArticle.content.slice(0, 200)}
              </p>

              <div className="flex items-center gap-4 text-sm font-bold text-ton-black/60 uppercase tracking-wider pt-4">
                <span className="flex items-center gap-1">
                  <Clock size={16} /> {timeAgo(featuredArticle.publishedAt)}
                </span>
                <span>•</span>
                <span>{featuredArticle.readingTime} min read</span>
                <a
                  href={`/article/${featuredArticle.slug}`}
                  className="flex items-center gap-1 hover:text-ton-red group ml-auto"
                >
                  Read Full Report
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Namibian landscape image */}
            <div className="w-full md:w-5/12 h-64 md:h-96 relative overflow-hidden">
              <Image
                src={NAMIBIAN_IMAGES[0]}
                alt="Namibian landscape"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ton-black/20 to-transparent" />
            </div>
          </div>
        </motion.section>
      )}

      {/* ═══════════════════════════════════════════════════════
          MARKET DATA TICKER — Compact strip
         ═══════════════════════════════════════════════════════ */}
      {marketData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12 flex flex-wrap gap-4 md:gap-8 py-4 border-y border-ton-black/10"
        >
          {marketData.slice(0, 6).map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              {getMarketIcon(m.direction)}
              <span className="font-mono text-xs font-bold text-ton-black/70 uppercase tracking-wider">
                {m.pair}
              </span>
              <span className="font-mono text-xs text-ton-black/50">{m.rate}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════
          THE AI BRIEFING — Latest articles grid
         ═══════════════════════════════════════════════════════ */}
      <div className="flex justify-between items-end mb-8">
        <h2 className="font-serif font-bold text-2xl md:text-3xl text-ton-black border-l-4 border-ton-red pl-4">
          The AI Briefing
        </h2>
        <span className="text-xs font-bold text-ton-black/40 uppercase tracking-wider hidden md:block">
          Aggregated & Summarized in Real-Time
        </span>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
      >
        {feedArticles.map((article, i) => (
          <motion.article
            key={article.id}
            variants={fadeUpItem}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={springTransition}
            className="bg-ton-cream/50 p-6 flex flex-col justify-between border-t-4 border-transparent hover:border-ton-red transition-all duration-300 cursor-pointer h-full group"
          >
            <a href={`/article/${article.slug}`} className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className="text-ton-red text-xs font-black uppercase tracking-widest">
                  {article.section}
                </span>
              </div>

              <h3 className="font-serif font-bold text-lg text-ton-black leading-snug mb-3 group-hover:text-ton-red transition-colors">
                {article.headline}
              </h3>

              <p className="font-sans text-ton-black/50 text-sm leading-relaxed mb-6 flex-1">
                {article.excerpt || article.content.slice(0, 120) + "..."}
              </p>

              <div className="mt-auto border-t border-ton-black/10 pt-4 flex justify-between items-center text-xs font-bold text-ton-black/40 uppercase tracking-wider">
                <span>{article.source}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {timeAgo(article.publishedAt)}
                </span>
              </div>
            </a>
          </motion.article>
        ))}
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          TWO-COLUMN: Jobs + Tenders
         ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Jobs */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, ...springTransition }}>
          <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-ton-black">
            <h2 className="font-serif font-bold text-xl text-ton-black">Jobs</h2>
            <a href="/jobs" className="text-xs font-bold uppercase tracking-widest text-ton-red hover:text-ton-black transition-colors">
              All Jobs →
            </a>
          </div>
          <div className="space-y-4">
            {sidebarJobs.map((job) => (
              <div key={job.id} className="group">
                <h3 className="font-serif font-bold text-sm text-ton-black group-hover:text-ton-red transition-colors leading-snug">
                  {job.url ? (
                    <a href={job.url} target="_blank" rel="noopener noreferrer">{job.title}</a>
                  ) : (
                    job.title
                  )}
                </h3>
                <p className="font-mono text-[10px] text-ton-black/40 mt-1 uppercase tracking-wider">
                  {job.company} • {job.location}
                </p>
                {job.salary && (
                  <p className="font-mono text-xs text-ton-red font-bold mt-1">{job.salary}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tenders */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, ...springTransition }}>
          <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-ton-black">
            <h2 className="font-serif font-bold text-xl text-ton-black">Tenders</h2>
            <a href="/tender" className="text-xs font-bold uppercase tracking-widest text-ton-red hover:text-ton-black transition-colors">
              All Tenders →
            </a>
          </div>
          <div className="space-y-4">
            {sidebarTenders.map((tender) => (
              <div key={tender.id} className="group">
                <h3 className="font-serif font-bold text-sm text-ton-black group-hover:text-ton-red transition-colors leading-snug">
                  {tender.title}
                </h3>
                <p className="font-mono text-[10px] text-ton-black/40 mt-1 uppercase tracking-wider">
                  {tender.department}
                </p>
                <p className="font-mono text-xs text-ton-black/50 mt-1">
                  Deadline: {new Date(tender.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
