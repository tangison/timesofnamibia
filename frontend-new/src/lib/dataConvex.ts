// ============================================================
// Times of Namibia — Convex data layer (TANGISON)
//
// Wraps Convex queries so they return the same shapes as the
// existing FastAPI-backed functions in data.ts.
//
// Used automatically when NEXT_PUBLIC_CONVEX_URL is set.
// Falls back to the FastAPI backend otherwise.
// ============================================================

import { convexClient } from "@/lib/convex";
import { api } from "@convex/_generated/api";

const hasConvex = () => convexClient !== null;

// --- Type shape returned by all getX() functions (matches mapArticle in data.ts) ---
export interface Article {
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
  publishedAt: Date;
  views: number;
  commentCount: number;
  category: { id: string; name: string; slug: string; color: string | null } | null;
  rssFeed: { id: string; name: string; url: string } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
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

export interface Tender {
  id: string;
  docId: string;
  title: string;
  department: string;
  deadline: Date;
  estimatedValue: string | null;
  status: string;
  createdAt?: Date;
  summaries: Array<{ id: string; text: string; order: number }>;
  keyDates: Array<{ id: string; text: string; order: number }>;
  compliances: Array<{ id: string; requirement: string; order: number }>;
}

export interface MarketDatum {
  id: string;
  pair: string;
  rate: string;
  change: string;
  direction: string;
  source: string;
  active: boolean;
  updatedAt: Date;
}

// --- Mappers: Convex row → public shape ---

function mapArticle(a: any): Article {
  return {
    id: a._id,
    slug: a.slug,
    headline: a.headline,
    subheadline: a.subheadline ?? null,
    content: a.content,
    excerpt: a.excerpt ?? null,
    source: a.source,
    categorySlug: a.categorySlug ?? null,
    section: a.section,
    readingTime: a.readingTime,
    imageAlt: a.imageAlt ?? null,
    imageGps: a.imageGps ?? null,
    imageUrl: a.imageUrl ?? null,
    authorLine: a.authorLine,
    featured: a.featured,
    published: a.published,
    publishedAt: new Date(a.publishedAt ?? a.createdAt),
    views: a.views ?? 0,
    commentCount: a.commentCount ?? 0,
    category: a.categorySlug
      ? { id: a.categorySlug, name: a.categorySlug, slug: a.categorySlug, color: null }
      : null,
    rssFeed: null,
    createdAt: new Date(a.createdAt),
    updatedAt: new Date(a.updatedAt ?? a.createdAt),
  };
}

function mapJob(j: any): Job {
  return {
    id: j._id,
    title: j.title,
    company: j.company,
    location: j.location,
    region: j.region ?? null,
    source: j.source,
    salary: j.salary ?? null,
    type: j.type ?? null,
    url: j.url ?? null,
    postedAgo: j.postedAgo ?? null,
    scrapedAt: new Date(j.scrapedAt),
    active: j.active,
  };
}

function mapTender(t: any): Tender {
  return {
    id: t._id,
    docId: t.docId,
    title: t.title,
    department: t.department,
    deadline: new Date(t.deadline),
    estimatedValue: t.estimatedValue ?? null,
    status: t.status,
    createdAt: new Date(t.createdAt),
    summaries: [{ id: `sum-${t._id}`, text: t.title, order: 0 }], // populated via separate query if needed
    keyDates: [{ id: `kd-${t._id}`, text: new Date(t.deadline).toISOString().slice(0, 10), order: 0 }],
    compliances: [],
  };
}

function mapMarket(m: any): MarketDatum {
  return {
    id: m._id,
    pair: m.pair,
    rate: m.rate,
    change: m.change,
    direction: m.direction,
    source: m.source,
    active: m.active,
    updatedAt: new Date(m.updatedAt),
  };
}

// --- Public API (mirrors data.ts signatures) ---

export const dataConvex = {
  isAvailable: hasConvex,

  async getFeaturedArticle(): Promise<Article | null> {
    if (!hasConvex()) return null;
    const row = await convexClient!.query(api.queries.getFeaturedArticle, {});
    return row ? mapArticle(row) : null;
  },

  async getArticles(options?: {
    section?: string;
    category?: string;
    source?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Article[]> {
    if (!hasConvex()) return [];
    const rows = await convexClient!.query(api.queries.listArticles, {
      limit: options?.limit,
      section: options?.section,
      featured: options?.featured,
    });
    let articles = rows.map(mapArticle);
    if (options?.category) {
      const wanted = options.category.toLowerCase();
      articles = articles.filter((a) => (a.categorySlug || "").toLowerCase().includes(wanted));
    }
    if (options?.source) {
      const s = options.source.toLowerCase();
      articles = articles.filter((a) => a.authorLine.toLowerCase().includes(s));
    }
    if (options?.offset) articles = articles.slice(options.offset);
    return articles;
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (!hasConvex()) return null;
    const row = await convexClient!.query(api.queries.getArticleBySlug, { slug });
    return row ? mapArticle(row) : null;
  },

  async getJobs(options?: { region?: string; source?: string; type?: string; limit?: number }): Promise<Job[]> {
    if (!hasConvex()) return [];
    const rows = await convexClient!.query(api.queries.listJobs, {
      limit: options?.limit,
      region: options?.region,
      source: options?.source,
    });
    return rows.map(mapJob);
  },

  async getTenders(options?: { status?: string; department?: string; limit?: number }): Promise<Tender[]> {
    if (!hasConvex()) return [];
    const rows = await convexClient!.query(api.queries.listTenders, {
      limit: options?.limit,
      status: options?.status,
      department: options?.department,
    });
    return rows.map(mapTender);
  },

  async getMarketData(): Promise<MarketDatum[]> {
    if (!hasConvex()) return [];
    const rows = await convexClient!.query(api.queries.getMarketData, {});
    return rows.map(mapMarket);
  },

  async searchArticles(q: string, options?: { limit?: number; section?: string }): Promise<Article[]> {
    if (!hasConvex()) return [];
    const rows = await convexClient!.query(api.queries.searchArticles, {
      q,
      limit: options?.limit,
      section: options?.section,
    });
    return rows.map(mapArticle);
  },

  async getStats(): Promise<{
    articles: number;
    jobs: number;
    tenders: number;
    rssFeeds: number;
    marketData: number;
    total: number;
  } | null> {
    if (!hasConvex()) return null;
    return await convexClient!.query(api.queries.getStats, {});
  },
};
