// ============================================================
// Times of Namibia - Shared domain types (TANGISON)
//
// TANGISON Iteration 4 Fix #14: Single source of truth for domain types.
// Previously there were three divergent type systems:
//   - src/lib/data.ts (implicit, via mapArticle return type)
//   - src/lib/dataConvex.ts (explicit Article/Job/Tender/MarketDatum)
//   - src/lib/ton-data.ts (divergent - different field names + types)
//
// Now everything imports from here. Mappers in data.ts and dataConvex.ts
// return these exact types.
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string | null;
  icon: string | null;
  order: number;
  active: boolean;
  parentId?: string | null;
  children?: Category[];
  _count?: { articles: number };
}

export interface Article {
  id: string;
  slug: string;
  headline: string;
  subheadline: string | null;
  content: string;
  excerpt: string | null;
  source: string; // rss | manual | wire
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
  // Extended fields for AI-rewritten articles (Phase 2)
  body?: string | null;
  summary?: string | null;
  categoryField?: string | null;
  coverImage?: string | null;
  sourceRegion?: string | null;
  originalUrl?: string | null;
  seo_meta_description?: string | null;
  key_takeaways?: string[] | null;
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
  direction: string; // up | down | flat
  source: string;
  active: boolean;
  updatedAt: Date;
}

export interface TickerItem {
  id: string;
  text: string;
  order: number;
  active: boolean;
}

export interface WireSubmission {
  id: string;
  title: string;
  category: string;
  priority: "routine" | "urgent" | "breaking";
  source: string;
  content: string;
  verified: boolean;
  timestamp: string;
  author?: string;
}

export interface RssFeed {
  id: string;
  name: string;
  url: string;
  description?: string;
  siteUrl?: string;
  favicon?: string;
  category?: string;
  active: boolean;
  lastFetched?: Date;
  fetchCount: number;
  errorCount: number;
  lastError?: string;
}

export interface PlatformStats {
  news: number;
  jobs: number;
  tenders: number;
  internships: number;
  total: number;
}

// Convex-specific shapes (Date → number for epoch ms)
export interface ConvexArticle {
  _id: string;
  _creationTime: number;
  slug: string;
  headline: string;
  subheadline?: string;
  content: string;
  excerpt?: string;
  source: string;
  categorySlug?: string;
  section: string;
  readingTime: number;
  imageAlt?: string;
  imageGps?: string;
  imageUrl?: string;
  authorLine: string;
  featured: boolean;
  published: boolean;
  publishedAt?: number;
  views: number;
  commentCount: number;
  categoryId?: string;
  authorId?: string;
  rssFeedId?: string;
  rssGuid?: string;
  rssFetchedAt?: number;
  deletedAt?: number;
  createdAt: number;
  updatedAt: number;
}
