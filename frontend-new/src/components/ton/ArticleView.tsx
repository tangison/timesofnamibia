"use client";

import React from "react";
import { motion } from "framer-motion";
import ShareButtons from "./ShareButtons";
import Breadcrumbs from "./Breadcrumbs";
import { ArrowLeft } from "lucide-react";

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
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: springTransition },
};

// ── TYPES matching Prisma model shapes ──────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface RssFeed {
  id: string;
  name: string;
  url?: string;
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
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── COMPONENT ───────────────────────────────────────────────────

interface ArticleViewProps {
  article: Article;
}

export default function ArticleView({ article }: ArticleViewProps) {
  const isRss = article.source === "rss";
  const sectionLabel = article.section ? article.section.charAt(0).toUpperCase() + article.section.slice(1) : "News";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Breadcrumbs */}
      <div className="pt-5 sm:pt-6 md:pt-8">
        <Breadcrumbs
          items={[
            ...(article.section
              ? [{ label: sectionLabel, href: `/section/${article.section}` }]
              : []),
            { label: article.category?.name || article.categorySlug || "News" },
          ]}
        />
      </div>

      {/* Article container — broadsheet column style with Framer Motion */}
      <motion.article
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="max-w-3xl mx-auto py-6 sm:py-8 md:py-10"
      >
        {/* Category badge */}
        <motion.span
          variants={fadeUpItem}
          className="bg-ton-red text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold"
        >
          {article.category?.name || article.categorySlug || "News"}
        </motion.span>

        {/* Headline */}
        <motion.h1
          variants={fadeUpItem}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-[1.05] tracking-tight mt-4"
        >
          {article.headline}
        </motion.h1>

        {/* Subheadline — rendered as H2 for SEO + accessibility */}
        {article.subheadline && (
          <motion.h2
            variants={fadeUpItem}
            className="font-serif italic text-ton-black/50 text-lg sm:text-xl mt-3 leading-relaxed max-w-2xl font-normal"
          >
            {article.subheadline}
          </motion.h2>
        )}

        {/* Byline + Date + Reading Time */}
        <motion.div
          variants={fadeUpItem}
          className="mt-5 pb-4 border-b border-ton-black/10 flex items-center justify-between flex-wrap gap-2"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-sans text-sm text-ton-black/70 font-medium">
              {article.authorLine}
            </span>
            {isRss && article.rssFeed && (
              <span className="font-mono text-[8px] font-bold tracking-widest uppercase bg-ton-black/5 text-ton-black/50 px-2 py-0.5">
                Via {article.rssFeed.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-ton-black/25">
              {formatDate(article.publishedAt)}
            </span>
            <span className="font-mono text-[10px] text-ton-black/15">
              {article.readingTime} min read
            </span>
          </div>
        </motion.div>

        {/* Share buttons */}
        <motion.div variants={fadeUpItem} className="mt-4 flex items-center gap-3">
          <ShareButtons title={article.headline} url={`/article/${article.slug}`} articleContent={article.content} />
        </motion.div>

        {/* Image area — if image exists */}
        {article.imageUrl ? (
          <div className="mt-6 relative overflow-hidden border border-ton-black/8">
            <img
              src={article.imageUrl}
              alt={article.imageAlt || article.headline}
              className="w-full aspect-[16/9] object-cover ton-article-image"
            />
            {article.imageGps && (
              <div className="absolute bottom-2 left-2 bg-ton-black text-ton-cream px-2 py-1">
                <p className="font-mono text-[7px] sm:text-[8px] leading-tight">
                  {article.imageGps}<br />
                  {article.publishedAt
                    ? new Date(article.publishedAt).toISOString().replace("T", " ").slice(0, 19) + " CAT"
                    : ""}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Part 1 Fix #3: Silent colored block, zero visible text.
          // Previously showed "Editorial photograph — no stock imagery..."
          // as visible body copy, which looked careless.
          <div className="mt-6 bg-ton-black/[0.04] aspect-[16/9] border border-ton-black/8" />
        )}

        {/* Content with Drop Cap */}
        <div className="mt-6">
          {article.content.split("\n\n").map((para, i) => (
            <p
              key={i}
              className={`font-serif text-base sm:text-lg text-ton-black/60 leading-[1.8] mb-5 ${
                i === 0 ? "ton-dropcap" : ""
              }`}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Source attribution — if RSS */}
        {isRss && article.rssFeed && (
          <div className="mt-8 pt-4 border-t border-ton-black/8">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[8px] font-bold tracking-widest uppercase bg-ton-black/5 text-ton-black/50 px-2 py-0.5">
                Source
              </span>
              <span className="font-sans text-xs text-ton-black/40">
                This article was originally published by{" "}
                <strong className="text-ton-black/60">{article.rssFeed.name}</strong>
                {article.rssFeed.url && (
                  <>
                    {" "}—{" "}
                    <a
                      href={article.rssFeed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ton-red hover:underline"
                    >
                      Visit source
                    </a>
                  </>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Article footer */}
        <motion.div variants={fadeUpItem} className="mt-6 pt-4 border-t border-ton-black/10 flex items-center justify-between flex-wrap gap-3">
          <div className="font-mono text-[9px] text-ton-black/20 space-y-0.5">
            <p>Published {formatDateTime(article.publishedAt)}</p>
            <p>Section: {article.section} &middot; {article.readingTime} min read</p>
          </div>
          <ShareButtons title={article.headline} url={`/article/${article.slug}`} articleContent={article.content} />
        </motion.div>
      </motion.article>
    </div>
  );
}
