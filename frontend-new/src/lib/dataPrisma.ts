// ============================================================
// Times of Namibia — Prisma data layer (Vercel Postgres)
//
// PRIMARY data source. Takes precedence over Convex and FastAPI.
// Falls back gracefully when DATABASE_URL is not available.
//
// Architecture priority:
//   1. Prisma (Vercel Postgres) — this file
//   2. Convex — dataConvex.ts (legacy, disabled on free plan)
//   3. FastAPI backend — data.ts fallback
// ============================================================

import { db } from "@/lib/db";
import type { Article, Job, Tender, MarketDatum } from "@/lib/types";

const hasPrisma = (): boolean => {
  try {
    return !!process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres");
  } catch {
    return false;
  }
};

export const dataPrisma = {
  isAvailable: hasPrisma,

  async getArticles(options?: {
    section?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<Article[]> {
    if (!hasPrisma()) return [];
    try {
      const where: Record<string, unknown> = { published: true, deletedAt: null };
      if (options?.section) where.section = options.section;

      const rows = await db.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: options?.limit || 20,
        skip: options?.offset || 0,
        include: { category: true, rssFeed: true },
      });

      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        headline: r.headline,
        subheadline: r.subheadline,
        content: r.content,
        excerpt: r.excerpt,
        source: r.source,
        categorySlug: r.categorySlug,
        section: r.section,
        readingTime: r.readingTime,
        imageAlt: r.imageAlt,
        imageGps: r.imageGps,
        imageUrl: r.imageUrl,
        authorLine: r.authorLine,
        featured: r.featured,
        published: r.published,
        publishedAt: r.publishedAt ?? new Date(),
        views: r.views,
        commentCount: r.commentCount,
        body: (r as Record<string, unknown>).body as string | null,
        summary: (r as Record<string, unknown>).summary as string | null,
        categoryField: (r as Record<string, unknown>).categoryField as string | null,
        coverImage: (r as Record<string, unknown>).coverImage as string | null,
        sourceRegion: (r as Record<string, unknown>).sourceRegion as string | null,
        originalUrl: (r as Record<string, unknown>).originalUrl as string | null,
        seo_meta_description: (r as Record<string, unknown>).seo_meta_description as string | null,
        key_takeaways: (r as Record<string, unknown>).key_takeaways as string[] | null,
        category: r.category
          ? { id: r.category.id, name: r.category.name, slug: r.category.slug, color: null }
          : null,
        rssFeed: r.rssFeed
          ? { id: r.rssFeed.id, name: r.rssFeed.name, url: r.rssFeed.url ?? "" }
          : null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }));
    } catch (err) {
      console.warn("[prisma] getArticles failed:", err instanceof Error ? err.message : err);
      return [];
    }
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (!hasPrisma()) return null;
    try {
      const r = await db.article.findUnique({
        where: { slug },
        include: { category: true, rssFeed: true },
      });
      if (!r || !r.published) return null;
      return {
        id: r.id,
        slug: r.slug,
        headline: r.headline,
        subheadline: r.subheadline,
        content: r.content,
        excerpt: r.excerpt,
        source: r.source,
        categorySlug: r.categorySlug,
        section: r.section,
        readingTime: r.readingTime,
        imageAlt: r.imageAlt,
        imageGps: r.imageGps,
        imageUrl: r.imageUrl,
        authorLine: r.authorLine,
        featured: r.featured,
        published: r.published,
        publishedAt: r.publishedAt ?? new Date(),
        views: r.views,
        commentCount: r.commentCount,
        body: (r as Record<string, unknown>).body as string | null,
        summary: (r as Record<string, unknown>).summary as string | null,
        categoryField: (r as Record<string, unknown>).categoryField as string | null,
        coverImage: (r as Record<string, unknown>).coverImage as string | null,
        sourceRegion: (r as Record<string, unknown>).sourceRegion as string | null,
        originalUrl: (r as Record<string, unknown>).originalUrl as string | null,
        seo_meta_description: (r as Record<string, unknown>).seo_meta_description as string | null,
        key_takeaways: (r as Record<string, unknown>).key_takeaways as string[] | null,
        category: r.category
          ? { id: r.category.id, name: r.category.name, slug: r.category.slug, color: null }
          : null,
        rssFeed: r.rssFeed
          ? { id: r.rssFeed.id, name: r.rssFeed.name, url: r.rssFeed.url ?? "" }
          : null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    } catch (err) {
      console.warn("[prisma] getArticleBySlug failed:", err instanceof Error ? err.message : err);
      return null;
    }
  },

  async getFeaturedArticle(): Promise<Article | null> {
    if (!hasPrisma()) return null;
    try {
      const r = await db.article.findFirst({
        where: { published: true, featured: true, deletedAt: null },
        orderBy: { publishedAt: "desc" },
        include: { category: true, rssFeed: true },
      });
      if (!r) {
        // Fall back to most recent published article
        const fallback = await db.article.findFirst({
          where: { published: true, deletedAt: null },
          orderBy: { publishedAt: "desc" },
          include: { category: true, rssFeed: true },
        });
        if (!fallback) return null;
        return this.getArticleBySlug(fallback.slug);
      }
      return this.getArticleBySlug(r.slug);
    } catch (err) {
      console.warn("[prisma] getFeaturedArticle failed:", err instanceof Error ? err.message : err);
      return null;
    }
  },

  async getJobs(options?: { region?: string; limit?: number }): Promise<Job[]> {
    if (!hasPrisma()) return [];
    try {
      const where: Record<string, unknown> = { active: true, deletedAt: null };
      if (options?.region) where.region = options.region;

      const rows = await db.job.findMany({
        where,
        orderBy: { scrapedAt: "desc" },
        take: options?.limit || 50,
      });

      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        company: r.company,
        location: r.location,
        region: r.region,
        source: r.source,
        salary: r.salary,
        type: r.type,
        url: r.url,
        postedAgo: r.postedAgo,
        scrapedAt: r.scrapedAt,
        active: r.active,
      }));
    } catch (err) {
      console.warn("[prisma] getJobs failed:", err instanceof Error ? err.message : err);
      return [];
    }
  },

  async getTenders(options?: { status?: string; department?: string; limit?: number }): Promise<Tender[]> {
    if (!hasPrisma()) return [];
    try {
      const where: Record<string, unknown> = { active: true, deletedAt: null };
      if (options?.status) where.status = options.status;
      if (options?.department) where.department = { contains: options.department, mode: "insensitive" };

      const rows = await db.tender.findMany({
        where,
        orderBy: { deadline: "asc" },
        take: options?.limit || 50,
        include: { summaries: true, keyDates: true, compliances: true },
      });

      return rows.map((r) => ({
        id: r.id,
        docId: r.docId,
        title: r.title,
        department: r.department,
        deadline: r.deadline,
        estimatedValue: r.estimatedValue,
        status: r.status,
        createdAt: r.createdAt,
        summaries: r.summaries.map((s) => ({ id: s.id, text: s.text, order: s.order })),
        keyDates: r.keyDates.map((k) => ({ id: k.id, text: k.text, order: k.order })),
        compliances: r.compliances.map((c) => ({ id: c.id, requirement: c.requirement, order: c.order })),
      }));
    } catch (err) {
      console.warn("[prisma] getTenders failed:", err instanceof Error ? err.message : err);
      return [];
    }
  },

  async getMarketData(): Promise<MarketDatum[]> {
    if (!hasPrisma()) return [];
    try {
      const rows = await db.marketDatum.findMany({
        where: { active: true },
        orderBy: { updatedAt: "desc" },
      });
      return rows.map((r) => ({
        id: r.id,
        pair: r.pair,
        rate: r.rate,
        change: r.change,
        direction: r.direction,
        source: r.source,
        active: r.active,
        updatedAt: r.updatedAt,
      }));
    } catch (err) {
      console.warn("[prisma] getMarketData failed:", err instanceof Error ? err.message : err);
      return [];
    }
  },

  async getStats(): Promise<{ articles: number; jobs: number; tenders: number; total: number } | null> {
    if (!hasPrisma()) return null;
    try {
      const [articles, jobs, tenders] = await Promise.all([
        db.article.count({ where: { published: true, deletedAt: null } }),
        db.job.count({ where: { active: true, deletedAt: null } }),
        db.tender.count({ where: { active: true, deletedAt: null } }),
      ]);
      return { articles, jobs, tenders, total: articles + jobs + tenders };
    } catch (err) {
      console.warn("[prisma] getStats failed:", err instanceof Error ? err.message : err);
      return null;
    }
  },

  async searchArticles(query: string, options?: { limit?: number; section?: string }): Promise<Article[]> {
    if (!hasPrisma()) return [];
    try {
      const where: Record<string, unknown> = {
        published: true,
        deletedAt: null,
        OR: [
          { headline: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
        ],
      };
      if (options?.section) where.section = options.section;

      const rows = await db.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: options?.limit || 20,
        include: { category: true, rssFeed: true },
      });

      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        headline: r.headline,
        subheadline: r.subheadline,
        content: r.content,
        excerpt: r.excerpt,
        source: r.source,
        categorySlug: r.categorySlug,
        section: r.section,
        readingTime: r.readingTime,
        imageAlt: r.imageAlt,
        imageGps: r.imageGps,
        imageUrl: r.imageUrl,
        authorLine: r.authorLine,
        featured: r.featured,
        published: r.published,
        publishedAt: r.publishedAt ?? new Date(),
        views: r.views,
        commentCount: r.commentCount,
        body: (r as Record<string, unknown>).body as string | null,
        summary: (r as Record<string, unknown>).summary as string | null,
        categoryField: (r as Record<string, unknown>).categoryField as string | null,
        coverImage: (r as Record<string, unknown>).coverImage as string | null,
        sourceRegion: (r as Record<string, unknown>).sourceRegion as string | null,
        originalUrl: (r as Record<string, unknown>).originalUrl as string | null,
        seo_meta_description: (r as Record<string, unknown>).seo_meta_description as string | null,
        key_takeaways: (r as Record<string, unknown>).key_takeaways as string[] | null,
        category: r.category
          ? { id: r.category.id, name: r.category.name, slug: r.category.slug, color: null }
          : null,
        rssFeed: r.rssFeed
          ? { id: r.rssFeed.id, name: r.rssFeed.name, url: r.rssFeed.url ?? "" }
          : null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }));
    } catch (err) {
      console.warn("[prisma] searchArticles failed:", err instanceof Error ? err.message : err);
      return [];
    }
  },
};
