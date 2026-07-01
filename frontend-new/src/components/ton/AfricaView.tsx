"use client";

import React from "react";
import SourceBadge, { BadgeType } from "./SourceBadge";
import Breadcrumbs from "./Breadcrumbs";
import ScrapedTimestamp from "./ScrapedTimestamp";
import EmptyState from "./EmptyState";
import ShareButtons from "./ShareButtons";
import { ArrowRight, MapPin, Clock, Newspaper } from "lucide-react";

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
    lower.includes("bank") ||
    lower.includes("government") ||
    lower.includes("ministry") ||
    lower.includes("authority") ||
    lower.includes("commission") ||
    lower.includes("union") ||
    lower.includes("ecowas") ||
    lower.includes("au ") ||
    lower.includes(" central ")
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

interface AfricaViewProps {
  articles: Article[];
}

export default function AfricaView({ articles }: AfricaViewProps) {
  // ── No articles: show EmptyState ──
  if (articles.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <div>
            <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
              Africa Desk // Continental Coverage
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
              Africa News
            </h1>
            <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
              Continental coverage from Windhoek. Verified. Timestamped. Every source carries its proof.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Breadcrumbs items={[{ label: "Africa" }]} />
          </div>
        </div>

        <EmptyState
          type="articles"
          title="No Africa Articles Available"
          description="Our Africa Desk is gathering the latest continental stories. Check back soon for verified reports from five African regions."
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
            Africa Desk // Continental Coverage
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
            Africa News
          </h1>
          <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
            Continental coverage from Windhoek. Verified. Timestamped. Every source carries its proof.
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <Breadcrumbs items={[{ label: "Africa" }]} />
        </div>
      </div>

      {/* Namibia Callout */}
      <div className="mb-8 sm:mb-10 bg-ton-black text-ton-cream p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <MapPin className="w-4 h-4 text-ton-red" />
          <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
            Our Home // Southern Africa
          </span>
        </div>
        <p className="font-serif text-base sm:text-lg text-ton-cream/80 leading-relaxed mb-2">
          This is our home. Southern Africa coverage powered by Times OS v2.1 with 14 dedicated
          regional nodes.
        </p>
        <p className="font-sans text-xs text-ton-cream/40 leading-relaxed">
          Windhoek serves as the primary data collection hub for the Southern Africa desk. Every
          article is sourced through the same 3-point verification matrix that governs all TON
          reporting. No exceptions. No shortcuts.
        </p>
      </div>

      {/* Featured Article - 3-Column Layout */}
      <div className="mb-8 sm:mb-10 border-t-4 border-ton-red pt-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-ton-red text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold">
            Featured
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            {featuredArticle.category?.name || featuredArticle.categorySlug || "Africa"}
          </h2>
          <span className="font-mono text-[8px] text-ton-red font-bold tracking-widest uppercase">
            Africa Desk
          </span>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left - Main featured article */}
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
                    {featuredArticle.imageAlt || "Editorial photograph - no stock imagery. High-contrast grayscale image accompanying this report."}
                  </p>
                </div>
                {featuredArticle.imageGps && (
                  <div className="absolute bottom-2 left-2 bg-ton-black text-ton-cream px-2 py-1">
                    <p className="font-mono text-[7px] sm:text-[8px] leading-tight">
                      AFRICA {"//"} {featuredArticle.imageGps}
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

          {/* Right - remaining articles */}
          <div className="md:col-span-5 pl-0 md:pl-5 mt-5 md:mt-0">
            <div className="border-t-2 border-ton-red pt-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-ton-red">
                  More from Africa
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
              <span>{articles.length} articles // Africa Desk</span>
              <span>&copy; TANGISON</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Time Summary Bar */}
      <div className="mb-8 sm:mb-10 border-t-4 border-ton-black pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Newspaper className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-lg sm:text-xl font-bold text-ton-black">
            Africa Desk - Reading Room
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
              Verified continental reports
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
              Distinct verified sources
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
          Africa Desk
        </span>
        <blockquote className="font-serif italic text-lg sm:text-xl md:text-2xl text-ton-black/40 leading-relaxed mt-3 max-w-2xl mx-auto">
          From Windhoek to the continent. Every story verified, timestamped, and sourced. This is
          Africa, covered from home.
        </blockquote>
        <p className="font-mono text-[10px] text-ton-black/25 mt-3 tracking-wider">
          14 Regional Nodes - Times OS v2.1 - TANGISON
        </p>
      </div>
    </div>
  );
}
