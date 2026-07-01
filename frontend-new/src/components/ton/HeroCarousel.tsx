"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";

interface CarouselArticle {
  id: string;
  slug: string;
  headline: string;
  excerpt: string | null;
  section: string;
  source: string;
  imageUrl: string | null;
  publishedAt: string | Date;
}

/**
 * Hero Carousel - auto-rotating featured articles with Ken Burns effect,
 * navigation arrows, and dot indicators.
 */
export default function HeroCarousel({ articles }: { articles: CarouselArticle[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (articles.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, articles.length]);

  if (articles.length === 0) return null;

  const article = articles[current];

  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 100 : -100,
    }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -100 : 100,
    }),
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-ton-black">
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* Background image with Ken Burns effect */}
          {article.imageUrl ? (
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1.15 }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute inset-0"
            >
              <img
                src={article.imageUrl}
                alt={article.headline}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-ton-black via-ton-black/90 to-ton-red/20" />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ton-black via-ton-black/60 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-3xl">
              {/* Section badge */}
              <span className="inline-block bg-ton-red text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 mb-4">
                {article.section}
              </span>

              {/* Headline */}
              <h2 className="font-serif text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                <a href={`/article/${article.slug}`} className="hover:text-ton-red transition-colors">
                  {article.headline}
                </a>
              </h2>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-white/60 text-sm md:text-base leading-relaxed mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center gap-4 text-white/40 text-xs font-mono uppercase tracking-widest">
                <span>{article.source}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {timeAgo(article.publishedAt)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {articles.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-ton-black/40 hover:bg-ton-red text-white p-2 transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-ton-black/40 hover:bg-ton-red text-white p-2 transition-colors z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {articles.length > 1 && (
        <div className="absolute bottom-4 right-6 md:right-12 flex items-center gap-2 z-10">
          {articles.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`h-1 transition-all duration-300 ${
                i === current ? "w-8 bg-ton-red" : "w-4 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
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
