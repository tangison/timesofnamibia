"use client";

import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ShareToolbar from "./ShareToolbar";
import Breadcrumbs from "./Breadcrumbs";

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

// ── TYPES ─────────────────────────────────────────────────────

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
  // Task 4 new fields
  body?: string | null;
  summary?: string | null;
  categoryField?: string | null;
  coverImage?: string | null;
  sourceRegion?: string | null;
  originalUrl?: string | null;
  // Phase 1 fields
  seo_meta_description?: string | null;
  key_takeaways?: string[] | null;
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

// Phase 2: text label for sourceRegion (no emojis)
function regionLabel(region: string | null | undefined): string | null {
  if (!region) return null;
  if (region === "namibia") return "NAM";
  if (region === "africa") return "AFR";
  if (region === "world") return "WLD";
  return region.toUpperCase();
}

// Issue 2: Proper markdown renderer using react-markdown
// Ensures ## becomes styled <h2>, not visible text.
const markdownComponents = {
  h1: ({ node, ...props }: any) => (
    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ton-black mt-8 mb-4 leading-tight" {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mt-8 mb-4 leading-tight" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="font-serif text-lg sm:text-xl font-bold text-ton-black mt-6 mb-3 leading-tight" {...props} />
  ),
  p: ({ node, ...props }: any) => (
    <p className="font-serif text-base sm:text-lg text-ton-black/70 leading-[1.8] mb-5" {...props} />
  ),
  strong: ({ node, ...props }: any) => (
    <strong className="font-bold text-ton-black" {...props} />
  ),
  em: ({ node, ...props }: any) => (
    <em className="italic" {...props} />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc pl-6 mb-5 space-y-1" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal pl-6 mb-5 space-y-1" {...props} />
  ),
  li: ({ node, ...props }: any) => (
    <li className="font-serif text-base text-ton-black/70 leading-[1.8]" {...props} />
  ),
  blockquote: ({ node, ...props }: any) => (
    <blockquote className="border-l-4 border-ton-red pl-4 italic text-ton-black/60 my-4" {...props} />
  ),
  a: ({ node, ...props }: any) => (
    <a className="text-ton-red hover:underline" {...props} />
  ),
};

function renderBody(body: string) {
  return (
    <div className="ton-article-body">
      <ReactMarkdown components={markdownComponents}>{body}</ReactMarkdown>
    </div>
  );
}

// ── COMPONENT ───────────────────────────────────────────────────

interface ArticleViewProps {
  article: Article;
}

export default function ArticleView({ article }: ArticleViewProps) {
  const isRss = article.source === "rss";

  // Task 6: prefer new field names, fall back to legacy
  const heroImage = article.coverImage || article.imageUrl;
  const articleBody = article.body || article.content;
  const section = article.categoryField || article.section;
  const keyTakeaways = article.key_takeaways;
  const regionText = regionLabel(article.sourceRegion);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Breadcrumbs */}
      <div className="pt-5 sm:pt-6 md:pt-8">
        <Breadcrumbs
          items={[
            ...(section
              ? [{ label: section.charAt(0).toUpperCase() + section.slice(1), href: `/section/${section}` }]
              : []),
            { label: article.category?.name || article.categorySlug || "News" },
          ]}
        />
      </div>

      {/* Article container - broadsheet column style with Framer Motion */}
      <motion.article
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="max-w-3xl mx-auto py-6 sm:py-8 md:py-10"
      >
        {/* Category badge + Phase 2 sourceRegion text label (no emoji) */}
        <div className="flex items-center gap-3">
          <motion.span
            variants={fadeUpItem}
            className="bg-ton-red text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold"
          >
            {article.category?.name || article.categorySlug || section || "News"}
          </motion.span>
          {regionText && (
            <motion.span
              variants={fadeUpItem}
              className="font-mono text-[9px] tracking-widest uppercase text-ton-black/40 border border-ton-black/15 px-1.5 py-0.5"
            >
              {regionText}
            </motion.span>
          )}
        </div>

        {/* Headline */}
        <motion.h1
          variants={fadeUpItem}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-[1.05] tracking-tight mt-4"
        >
          {article.headline}
        </motion.h1>

        {/* Subheadline */}
        {article.subheadline && (
          <motion.h2
            variants={fadeUpItem}
            className="font-serif italic text-ton-black/50 text-lg sm:text-xl mt-3 leading-relaxed max-w-2xl font-normal"
          >
            {article.subheadline}
          </motion.h2>
        )}

        {/* Phase 2: Key Takeaways box - visually distinct, bordered, below headline */}
        {keyTakeaways && keyTakeaways.length > 0 && (
          <motion.div
            variants={fadeUpItem}
            className="mt-6 border-l-4 border-ton-red bg-ton-navy/[0.03] p-5"
          >
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-ton-red mb-3">
              Key Takeaways
            </h3>
            <ul className="space-y-2">
              {keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-serif font-bold text-ton-red text-sm flex-shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-sm sm:text-base text-ton-black/70 leading-relaxed">
                    {takeaway}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
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
            <span className="font-mono text-[10px] text-ton-black/40">
              {formatDate(article.publishedAt)}
            </span>
            <span className="font-mono text-[10px] text-ton-black/40">
              {article.readingTime} min read
            </span>
          </div>
        </motion.div>

        {/* Phase 2: Sticky ShareToolbar at top of article body */}
        <motion.div
          variants={fadeUpItem}
          className="sticky top-[60px] z-30 mt-4 py-3 bg-ton-cream/95 backdrop-blur-sm border-b border-ton-black/10"
        >
          <ShareToolbar
            title={article.headline}
            url={`/article/${article.slug}`}
            articleContent={articleBody}
          />
        </motion.div>

        {/* Image area - Task 6: use coverImage with fallback to imageUrl */}
        {heroImage ? (
          <div className="mt-6 relative overflow-hidden border border-ton-black/8">
            <img
              src={heroImage}
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
          // Phase 3: clean navy div block, zero broken image icons
          <div className="mt-6 bg-ton-navy aspect-[16/9] border border-ton-black/8 flex items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
              Times of Namibia
            </span>
          </div>
        )}

        {/* Content - Phase 1: render Markdown H2 subheadings */}
        <div className="mt-6">
          {renderBody(articleBody)}
        </div>

        {/* Source attribution - if RSS */}
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
                    {" - "}
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

        {/* Phase 2: ShareToolbar at bottom of article */}
        <motion.div
          variants={fadeUpItem}
          className="mt-6 pt-4 border-t border-ton-black/10 flex items-center justify-between flex-wrap gap-3"
        >
          <div className="font-mono text-[9px] text-ton-black/40 space-y-0.5">
            <p>Published {formatDateTime(article.publishedAt)}</p>
            <p>Section: {article.section} - {article.readingTime} min read</p>
          </div>
          <ShareToolbar
            title={article.headline}
            url={`/article/${article.slug}`}
            articleContent={articleBody}
          />
        </motion.div>
      </motion.article>
    </div>
  );
}
