"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, Clock, ChevronRight } from "lucide-react";
import HeroCarousel from "./HeroCarousel";
import ArticleCard from "./ArticleCard";
import BreakingTicker from "./BreakingTicker";

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
  imageUrl: string | null;
  publishedAt: string | Date;
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
  directoryPlaceCount?: number;
}

// ── HELPERS ──────────────────────────────────────────────────

function timeAgo(date: string | Date): string {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getMarketIcon(direction: string) {
  if (direction === "up") return <ArrowUpRight size={14} className="text-emerald-600" />;
  if (direction === "down") return <ArrowDownRight size={14} className="text-red-600" />;
  return <Minus size={14} className="text-ton-black/45" />;
}

// ── COMPONENT ────────────────────────────────────────────────

export default function HomeView({
  featuredArticle,
  recentArticles,
  jobs,
  tenders,
  marketData,
  directoryPlaceCount = 0,
}: HomeViewProps) {
  // Real-time article updates - poll every 30 seconds
  const [liveArticles, setLiveArticles] = useState(recentArticles);
  // Phase 2: category filter state - dynamically queries Convex
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Phase 2: When category changes, fetch filtered articles from the API
  // (which queries Convex with the section filter) - no page reload.
  useEffect(() => {
    if (activeCategory === "all") {
      setLiveArticles(recentArticles);
      return;
    }

    setCategoryLoading(true);
    fetch(`/api/articles?limit=20&section=${activeCategory}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.articles?.length > 0) {
          setLiveArticles(data.articles);
        } else {
          setLiveArticles([]);
        }
      })
      .catch(() => {
        // Silent fail, keep current articles
      })
      .finally(() => setCategoryLoading(false));
  }, [activeCategory, recentArticles]);

  // Poll for new articles every 30 seconds (only when on "all" tab)
  useEffect(() => {
    if (activeCategory !== "all") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/articles?limit=20");
        const data = await res.json();
        if (data.articles?.length > 0) {
          setLiveArticles(data.articles);
        }
      } catch {
        // Silent fail
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [activeCategory]);

  // Phase 2: Category filter tabs
  const CATEGORIES = [
    { label: "All", value: "all" },
    { label: "Politics", value: "politics" },
    { label: "Business", value: "economy" },
    { label: "Sport", value: "sport" },
    { label: "Africa", value: "africa" },
    { label: "World", value: "world" },
    { label: "Tech", value: "technology" },
    { label: "Health", value: "health" },
    { label: "Environment", value: "environment" },
  ];

  // Phase 2: articles are already filtered server-side via Convex query
  const filteredArticles = liveArticles;

  // Build carousel articles (featured + top 4 with images)
  const carouselArticles = [
    ...(featuredArticle ? [featuredArticle] : []),
    ...filteredArticles.filter(a => (a.imageUrl || (a as any).coverImage) && a.id !== featuredArticle?.id).slice(0, 4),
  ].slice(0, 5);

  // Grid articles (next 8 after carousel)
  const gridArticles = filteredArticles
    .filter(a => !carouselArticles.find(c => c.id === a.id))
    .slice(0, 8);

  // Sidebar articles (compact list)
  const sidebarArticles = filteredArticles
    .filter(a => !carouselArticles.find(c => c.id === a.id))
    .slice(8, 14);

  // Most read (articles with most content = proxy for engagement)
  const mostRead = [...filteredArticles].sort((a, b) => b.content.length - a.content.length).slice(0, 5);

  return (
    <div>
      {/* Breaking News Ticker */}
      <BreakingTicker />

      {/* Hero Carousel */}
      {carouselArticles.length > 0 && (
        <HeroCarousel articles={carouselArticles} />
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">

        {/* Market Data Strip */}
        {marketData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex flex-wrap gap-4 md:gap-8 py-4 border-y border-ton-black/10"
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

        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT - Latest News Grid (8 cols) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-bold text-2xl text-ton-black border-l-4 border-ton-red pl-4">
                Latest News
              </h2>
              <span className="text-xs font-mono text-ton-black/45 uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>

            {/* Phase 2: Category filter tabs - dynamically queries Convex */}
            <div className="mb-6 flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 border-b border-ton-black/10">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  aria-label={`Filter by ${cat.label}`}
                  aria-pressed={activeCategory === cat.value}
                  className={`flex-shrink-0 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeCategory === cat.value
                      ? "bg-ton-black text-white"
                      : "text-ton-black/50 hover:text-ton-black border border-ton-black/10 hover:border-ton-black/30"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
              {categoryLoading && (
                <span className="flex-shrink-0 font-mono text-[9px] text-ton-black/45 uppercase tracking-widest animate-pulse">
                  Loading...
                </span>
              )}
            </div>

            {/* Article Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {gridArticles.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </div>

            {/* Empty state */}
            {gridArticles.length === 0 && (
              <div className="py-12 text-center">
                <p className="font-mono text-xs uppercase tracking-widest text-ton-black/45">
                  No articles in this category yet
                </p>
              </div>
            )}

            {/* Load More */}
            <div className="mt-8 text-center">
              <a
                href={activeCategory === "all" ? "/section/national" : `/section/${activeCategory}`}
                className="inline-flex items-center gap-2 border border-ton-black/15 px-6 py-3 font-mono text-xs uppercase tracking-widest text-ton-black/60 hover:bg-ton-black hover:text-white transition-all"
              >
                View All {activeCategory !== "all" ? CATEGORIES.find(c => c.value === activeCategory)?.label : "News"}
                <ChevronRight size={16} />
              </a>
            </div>
          </div>

          {/* RIGHT - Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Most Read */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-ton-black">
                <TrendingUp className="w-5 h-5 text-ton-red" />
                <h3 className="font-serif font-bold text-lg text-ton-black">Most Read</h3>
              </div>
              <div>
                {mostRead.map((article, i) => (
                  <motion.a
                    key={article.id}
                    href={`/article/${article.slug}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 100, damping: 15 }}
                    className="group flex items-start gap-3 py-3 border-b border-ton-black/5"
                  >
                    <span className="font-serif text-3xl font-bold text-ton-red/20 group-hover:text-ton-red transition-colors flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-sm text-ton-black group-hover:text-ton-red transition-colors leading-snug line-clamp-2">
                        {article.headline}
                      </h4>
                      <span className="font-mono text-[10px] text-ton-black/45 uppercase tracking-wider mt-1 block">
                        {article.source} • {timeAgo(article.publishedAt)}
                      </span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Latest Updates (compact list) */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-ton-black">
                <h3 className="font-serif font-bold text-lg text-ton-black">Latest Updates</h3>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div>
                {sidebarArticles.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} variant="compact" />
                ))}
              </div>
            </div>

            {/* Jobs */}
            {jobs.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-ton-black">
                  <h3 className="font-serif font-bold text-lg text-ton-black">Jobs</h3>
                  <a href="/jobs" className="text-[10px] font-mono uppercase tracking-widest text-ton-red hover:text-ton-black transition-colors">
                    All →
                  </a>
                </div>
                <div className="space-y-3">
                  {jobs.slice(0, 4).map((job) => (
                    <div key={job.id} className="group">
                      <h4 className="font-serif font-bold text-sm text-ton-black group-hover:text-ton-red transition-colors leading-snug">
                        {job.url ? (
                          <a href={job.url} target="_blank" rel="noopener noreferrer">{job.title}</a>
                        ) : job.title}
                      </h4>
                      <p className="font-mono text-[10px] text-ton-black/40 mt-1 uppercase tracking-wider">
                        {job.company} • {job.location}
                      </p>
                      {job.salary && (
                        <p className="font-mono text-xs text-ton-red font-bold mt-1">{job.salary}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tenders */}
            {tenders.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-ton-black">
                  <h3 className="font-serif font-bold text-lg text-ton-black">Tenders</h3>
                  <a href="/tender" className="text-[10px] font-mono uppercase tracking-widest text-ton-red hover:text-ton-black transition-colors">
                    All →
                  </a>
                </div>
                <div className="space-y-3">
                  {tenders.slice(0, 3).map((tender) => (
                    <div key={tender.id} className="group">
                      <h4 className="font-serif font-bold text-sm text-ton-black group-hover:text-ton-red transition-colors leading-snug">
                        {tender.title}
                      </h4>
                      <p className="font-mono text-[10px] text-ton-black/40 mt-1 uppercase tracking-wider">
                        {tender.department}
                      </p>
                      <p className="font-mono text-xs text-ton-black/50 mt-1">
                        Deadline: {new Date(tender.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contribute CTA */}
            <div className="bg-ton-black text-white p-6">
              <h3 className="font-serif font-bold text-lg mb-2">Know Namibia?</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Share your knowledge of places, culture, and history. Contribute to the Namibia Guide.
              </p>
              <a
                href="/contribute"
                className="inline-flex items-center gap-2 bg-ton-red text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-ton-red/80 transition-colors"
              >
                Submit a Story
                <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Section 4: Editor's Picks module - 6 stories below main grid */}
        {gridArticles.length > 3 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif font-bold text-2xl text-ton-black border-l-4 border-ton-red pl-4">
                Editor&apos;s Picks
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles
                .filter(a => !carouselArticles.find(c => c.id === a.id) && !gridArticles.find(g => g.id === a.id))
                .slice(0, 6)
                .map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} variant="compact" />
                ))}
            </div>
          </div>
        )}

        {/* Section 4: Section preview modules - Sport */}
        {filteredArticles.some(a => (a as any).categoryField === "sport" || a.section === "sport") && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif font-bold text-2xl text-ton-black border-l-4 border-ton-red pl-4">
                Sport
              </h2>
              <a
                href="/section/sport"
                className="font-mono text-[10px] uppercase tracking-widest text-ton-red hover:text-ton-black transition-colors"
              >
                All Sport →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles
                .filter(a => (a as any).categoryField === "sport" || a.section === "sport")
                .slice(0, 3)
                .map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
            </div>
          </div>
        )}

        {/* Section 4: Section preview modules - Economy */}
        {filteredArticles.some(a => (a as any).categoryField === "economy" || a.section === "economy") && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif font-bold text-2xl text-ton-black border-l-4 border-ton-red pl-4">
                Markets &amp; Economy
              </h2>
              <a
                href="/section/economy"
                className="font-mono text-[10px] uppercase tracking-widest text-ton-red hover:text-ton-black transition-colors"
              >
                All Economy →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles
                .filter(a => (a as any).categoryField === "economy" || a.section === "economy")
                .slice(0, 3)
                .map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
            </div>
          </div>
        )}

        {/* Section 4: Know Namibia directory preview */}
        <div className="mt-16 bg-ton-navy/[0.03] p-8 border border-ton-black/8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif font-bold text-2xl text-ton-black border-l-4 border-ton-red pl-4">
              Discover Namibia
            </h2>
            <a
              href="/know-namibia"
              className="font-mono text-[10px] uppercase tracking-widest text-ton-red hover:text-ton-black transition-colors"
            >
              Explore All →
            </a>
          </div>
          <p className="font-sans text-sm text-ton-black/50 mb-4">
            {directoryPlaceCount > 0
              ? `${directoryPlaceCount} curated places — national parks, landmarks, towns, wildlife, and cultural sites across Namibia with real photos, interactive maps, and detailed guides.`
              : "National parks, landmarks, towns, wildlife, and cultural sites across Namibia with real photos, interactive maps, and detailed guides."}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/know-namibia" className="font-mono text-[10px] uppercase tracking-widest border border-ton-black/15 px-4 py-2 hover:bg-ton-black hover:text-white transition-colors">Parks</a>
            <a href="/know-namibia/big-five" className="font-mono text-[10px] uppercase tracking-widest border border-ton-black/15 px-4 py-2 hover:bg-ton-black hover:text-white transition-colors">Big Five</a>
            <a href="/know-namibia/map" className="font-mono text-[10px] uppercase tracking-widest border border-ton-black/15 px-4 py-2 hover:bg-ton-black hover:text-white transition-colors">Interactive Map</a>
            <a href="/know-namibia/gallery" className="font-mono text-[10px] uppercase tracking-widest border border-ton-black/15 px-4 py-2 hover:bg-ton-black hover:text-white transition-colors">Gallery</a>
          </div>
        </div>
      </div>
    </div>
  );
}
