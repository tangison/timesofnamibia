"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Image from "next/image";

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    headline: string;
    excerpt: string | null;
    section: string;
    source: string;
    imageUrl: string | null;
    publishedAt: string | Date;
    readingTime?: number;
  };
  index?: number;
  variant?: "default" | "compact" | "horizontal";
}

const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
  mass: 1,
};

/**
 * Article Card — reusable card component with 3 variants:
 * - default: vertical card with image on top
 * - compact: smaller card for sidebar
 * - horizontal: horizontal layout for lists
 */
export default function ArticleCard({ article, index = 0, variant = "default" }: ArticleCardProps) {
  const delay = (index % 6) * 0.08;

  if (variant === "horizontal") {
    return (
      <motion.a
        href={`/article/${article.slug}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...springTransition, delay }}
        className="group flex gap-4 py-4 border-b border-ton-black/8 hover:border-ton-red/20 transition-colors"
      >
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-20 h-20 bg-ton-black/5 overflow-hidden">
          {article.imageUrl ? (
            <img src={article.imageUrl} alt={article.headline} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ton-black/5 to-ton-red/5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-ton-red">
            {article.section}
          </span>
          <h3 className="font-serif font-bold text-sm text-ton-black leading-snug mt-1 group-hover:text-ton-red transition-colors line-clamp-2">
            {article.headline}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-ton-black/30 uppercase tracking-wider">
            <span>{article.source}</span>
            <span>•</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </motion.a>
    );
  }

  if (variant === "compact") {
    return (
      <motion.a
        href={`/article/${article.slug}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springTransition, delay }}
        className="group block py-3 border-b border-ton-black/5 hover:border-ton-red/20 transition-colors"
      >
        <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-ton-red">
          {article.section}
        </span>
        <h3 className="font-serif font-bold text-sm text-ton-black leading-snug mt-1 group-hover:text-ton-red transition-colors line-clamp-2">
          {article.headline}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-ton-black/30 uppercase tracking-wider">
          <span>{article.source}</span>
          <span>•</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
      </motion.a>
    );
  }

  // Default variant — vertical card with image
  return (
    <motion.a
      href={`/article/${article.slug}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springTransition, delay }}
      whileHover={{ y: -6 }}
      className="group block bg-ton-cream/50 border-t-4 border-transparent hover:border-ton-red transition-all duration-300 h-full"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-ton-black/5">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.headline}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ton-black/5 to-ton-red/5" />
        )}
        {/* Section badge */}
        <span className="absolute top-2 left-2 bg-ton-red text-white font-mono text-[8px] font-bold uppercase tracking-widest px-2 py-0.5">
          {article.section}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif font-bold text-lg text-ton-black leading-snug mb-2 group-hover:text-ton-red transition-colors line-clamp-2">
          {article.headline}
        </h3>
        {article.excerpt && (
          <p className="font-sans text-sm text-ton-black/65 leading-relaxed mb-3 line-clamp-2">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between text-[10px] font-mono text-ton-black/30 uppercase tracking-wider pt-3 border-t border-ton-black/5">
          <span>{article.source}</span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {timeAgo(article.publishedAt)}
          </span>
        </div>
      </div>
    </motion.a>
  );
}

function timeAgo(date: string | Date): string {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
