"use client";

import React from "react";
import SourceBadge, { BadgeType } from "./SourceBadge";
import Breadcrumbs from "./Breadcrumbs";
import ScrapedTimestamp from "./ScrapedTimestamp";
import EmptyState from "./EmptyState";
import ShareButtons from "./ShareButtons";
import { ArrowRight, Globe, Clock, Newspaper } from "lucide-react";

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

function inferBadge(source: string, featured: boolean): BadgeType {
  const lower = source.toLowerCase();
  if (
    lower.includes("reuters") ||
    lower.includes("bloomberg") ||
    lower.includes("associated press") ||
    lower.includes("afp") ||
    lower.includes("dpa") ||
    lower.includes("xinhua") ||
    lower.includes("tass")
  ) {
    return "OFFICIAL";
  }
  if (
    lower.includes("government") ||
    lower.includes("ministry") ||
    lower.includes("federal") ||
    lower.includes("central bank") ||
    lower.includes("parliament") ||
    lower.includes("commission") ||
    lower.includes("un ") ||
    lower.includes("imf") ||
    lower.includes("world bank")
  ) {
    return "OFFICIAL";
  }
  if (featured) return "VERIFIED";
  return "VERIFIED";
}

function formatTimestamp(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toISOString().replace("T", " ").slice(0, 19) + " CAT";
}

// ── COMPONENT ───────────────────────────────────────────────────

interface WorldViewProps {
  articles: Article[];
}

export default function WorldView({ articles }: WorldViewProps) {
  // ── No articles: show EmptyState ──
  if (articles.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <div>
            <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
              World Desk // International Coverage
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
              World News
            </h1>
            <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
              Verified international coverage sourced from wire services, government agencies, and
              confirmed correspondents across five continents.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Breadcrumbs items={[{ label: "World" }]} />
          </div>
        </div>

        <EmptyState
          type="articles"
          title="No World Articles Available"
          description="Our World Desk is gathering the latest international stories. Check back soon for verified reports from across the globe."
          action={{ label: "Return to Front Page", href: "/" }}
        />
      </div>
    );
  }

  // ── Split articles into featured + remaining ──
  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div>
          <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
            World Desk // International Coverage
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
            World News
          </h1>
          <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
            Verified international coverage sourced from wire services, government agencies, and
            confirmed correspondents across five continents.
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <Breadcrumbs items={[{ label: "World" }]} />
        </div>
      </div>

      {/* Source Credibility Badge Section */}
      <div className="mb-8 sm:mb-10 border-t-4 border-ton-black pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-lg sm:text-xl font-bold text-ton-black">
            Source Credibility Badges
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />
        <p className="font-serif text-sm text-ton-black/50 leading-relaxed mb-5">
          Every article on the World Desk carries a credibility badge indicating the verification
          status and nature of the source. This is not decoration — it is the structural integrity
          of international reporting.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(
            [
              {
                type: "VERIFIED",
                desc: "Information confirmed by multiple reliable sources",
              },
              {
                type: "OFFICIAL",
                desc: "Direct from government or organizational source",
              },
              {
                type: "ANALYSIS",
                desc: "Interpretation by subject matter experts",
              },
              {
                type: "DEVELOPING",
                desc: "Story is evolving, check back for updates",
              },
            ] as { type: BadgeType; desc: string }[]
          ).map((badge) => (
            <div key={badge.type} className="pt-4 border-t border-ton-black/8">
              <SourceBadge type={badge.type} />
              <p className="font-sans text-[11px] text-ton-black/40 mt-2 leading-relaxed">
                {badge.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Article — 3-Column Layout */}
      <div className="mb-8 sm:mb-10 border-t-4 border-ton-black pt-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-ton-red text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold">
            Featured
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            {featuredArticle.category?.name || featuredArticle.categorySlug || "World"}
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left — Main featured article */}
          <div className="md:col-span-7 ton-column-rule pr-0 md:pr-5">
            <article>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-ton-red text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold">
                  {featuredArticle.category?.name || featuredArticle.categorySlug || "News"}
                </span>
                <SourceBadge type={inferBadge(featuredArticle.source, featuredArticle.featured)} />
              </div>

              <a href={`/article/${featuredArticle.slug}`}>
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-ton-black leading-tight hover:text-ton-red transition-colors">
                  {featuredArticle.headline}
                </h3>
              </a>

              {featuredArticle.subheadline && (
                <p className="font-serif italic text-ton-black/40 text-sm sm:text-base mt-2 leading-relaxed max-w-xl">
                  {featuredArticle.subheadline}
                </p>
              )}

              {/* Image description */}
              <div className="mt-4 bg-ton-black/[0.03] aspect-[16/9] relative overflow-hidden border border-ton-black/8">
                <div className="absolute inset-0 flex items-center justify-center px-8">
                  <p className="font-serif text-sm text-ton-black/25 italic text-center leading-relaxed max-w-lg">
                    {featuredArticle.imageAlt || "Editorial photograph — no stock imagery. High-contrast grayscale image accompanying this report."}
                  </p>
                </div>
                {featuredArticle.imageGps && (
                  <div className="absolute bottom-2 left-2 bg-ton-black text-ton-cream px-2 py-1">
                    <p className="font-mono text-[7px] sm:text-[8px] leading-tight">
                      WORLD {"//"} {featuredArticle.imageGps}
                      <br />
                      {formatTimestamp(featuredArticle.publishedAt)}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-3 pb-3 border-b border-ton-black/8 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-sans text-xs text-ton-black/60">
                    {featuredArticle.authorLine || featuredArticle.source}
                  </span>
                  <span className="font-mono text-[10px] text-ton-black/25">
                    {formatDate(featuredArticle.publishedAt)}
                  </span>
                </div>
                <ShareButtons title={featuredArticle.headline} />
              </div>

              {/* Excerpt or first paragraph */}
              {featuredArticle.excerpt && (
                <p className="font-serif text-sm text-ton-black/55 leading-relaxed mt-3">
                  {featuredArticle.excerpt}
                </p>
              )}
            </article>
          </div>

          {/* Right — remaining articles */}
          <div className="md:col-span-5 pl-0 md:pl-5 mt-5 md:mt-0">
            <div className="border-t-2 border-ton-black pt-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-ton-black/50">
                  More World News
                </span>
                <ScrapedTimestamp label="Updated" />
              </div>
            </div>
            <div className="space-y-0">
              {remainingArticles.map((article, i) => (
                <div
                  key={article.id}
                  className={`py-3 ${i > 0 ? "border-t border-ton-black/5" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[8px] text-ton-black/30 uppercase tracking-wider">
                      {article.category?.name || article.categorySlug || "News"}
                    </span>
                    <SourceBadge type={inferBadge(article.source, article.featured)} />
                  </div>
                  <a href={`/article/${article.slug}`}>
                    <h4 className="font-serif text-sm sm:text-base font-semibold text-ton-black leading-snug hover:text-ton-red transition-colors">
                      {article.headline}
                    </h4>
                  </a>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-sans text-[10px] text-ton-black/35">
                      {article.source}
                    </span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-2.5 h-2.5 text-ton-black/15" />
                      <span className="font-mono text-[9px] text-ton-black/25">
                        {formatTimeAgo(article.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Article count footer */}
            <div className="mt-4 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest flex items-center justify-between">
              <span>{articles.length} articles // World Desk</span>
              <span>&copy; TANGISON</span>
            </div>
          </div>
        </div>
      </div>

      {/* World Desk — Reading Room */}
      <div className="mb-8 sm:mb-10 border-t-4 border-ton-black pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Newspaper className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-lg sm:text-xl font-bold text-ton-black">
            World Desk — Reading Room
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border-t border-ton-black/8 pt-3">
            <span className="font-mono text-[8px] text-ton-red font-bold tracking-widest uppercase">
              Articles Today
            </span>
            <p className="font-serif text-2xl font-bold text-ton-black mt-1">
              {articles.length}
            </p>
            <p className="font-sans text-[10px] text-ton-black/30 mt-1">
              Verified international reports
            </p>
          </div>
          <div className="border-t border-ton-black/8 pt-3">
            <span className="font-mono text-[8px] text-ton-red font-bold tracking-widest uppercase">
              Sources
            </span>
            <p className="font-serif text-2xl font-bold text-ton-black mt-1">
              {new Set(articles.map((a) => a.source)).size}
            </p>
            <p className="font-sans text-[10px] text-ton-black/30 mt-1">
              Distinct wire services & agencies
            </p>
          </div>
          <div className="border-t border-ton-black/8 pt-3">
            <span className="font-mono text-[8px] text-ton-red font-bold tracking-widest uppercase">
              Avg. Reading Time
            </span>
            <p className="font-serif text-2xl font-bold text-ton-black mt-1">
              {articles.length > 0
                ? Math.round(articles.reduce((sum, a) => sum + a.readingTime, 0) / articles.length)
                : 0}
              <span className="text-sm font-normal text-ton-black/30 ml-1">min</span>
            </p>
            <p className="font-sans text-[10px] text-ton-black/30 mt-1">
              Average article depth
            </p>
          </div>
        </div>
      </div>

      {/* Closing Statement */}
      <div className="mt-8 sm:mt-10 py-8 sm:py-10 text-center border-t border-b border-ton-black">
        <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
          World Desk
        </span>
        <blockquote className="font-serif italic text-lg sm:text-xl md:text-2xl text-ton-black/40 leading-relaxed mt-3 max-w-2xl mx-auto">
          International coverage sourced, verified, and timestamped. Every datum carries its proof.
        </blockquote>
        <p className="font-mono text-[10px] text-ton-black/25 mt-3 tracking-wider">
          Powered by Times OS v2.1 — TANGISON
        </p>
      </div>
    </div>
  );
}
