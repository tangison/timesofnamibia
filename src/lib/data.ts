// ============================================================
// Times of Namibia — Server-Side Data Access Layer
// Direct Prisma queries for server components
// ============================================================

import { db } from "./db";

// ── ARTICLES ─────────────────────────────────────────────────

export async function getFeaturedArticle() {
  // First try to get a featured article
  let article = await db.article.findFirst({
    where: { featured: true, published: true, deletedAt: null },
    include: {
      category: true,
      rssFeed: { select: { id: true, name: true } },
    },
    orderBy: { publishedAt: "desc" },
  });

  // If no featured article, get the latest published one
  if (!article) {
    article = await db.article.findFirst({
      where: { published: true, deletedAt: null },
      include: {
        category: true,
        rssFeed: { select: { id: true, name: true } },
      },
      orderBy: { publishedAt: "desc" },
    });
  }

  return article;
}

export async function getArticles(options?: {
  section?: string;
  category?: string;
  source?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = { published: true, deletedAt: null };
  if (options?.section) where.section = options.section;
  if (options?.category) where.categorySlug = options.category;
  if (options?.source) where.source = options.source;
  if (options?.featured) where.featured = true;

  return db.article.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: options?.limit || 20,
    skip: options?.offset || 0,
    include: {
      category: true,
      rssFeed: { select: { id: true, name: true } },
    },
  });
}

export async function getArticleBySlug(slug: string) {
  return db.article.findUnique({
    where: { slug, deletedAt: null },
    include: {
      category: true,
      rssFeed: { select: { id: true, name: true, url: true } },
    },
  });
}

export async function getArticleCount() {
  return db.article.count({ where: { published: true, deletedAt: null } });
}

// ── CATEGORIES ───────────────────────────────────────────────

export async function getCategories(options?: { active?: boolean; parentId?: string | null }) {
  const where: Record<string, unknown> = {};
  if (options?.active !== undefined) where.active = options.active;
  if (options?.parentId !== undefined) where.parentId = options.parentId;

  return db.category.findMany({
    where,
    orderBy: { order: "asc" },
    include: { children: true, _count: { select: { articles: true } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: { children: true, _count: { select: { articles: true } } },
  });
}

// ── JOBS ─────────────────────────────────────────────────────

export async function getJobs(options?: {
  region?: string;
  source?: string;
  type?: string;
  limit?: number;
}) {
  const where: Record<string, unknown> = { active: true, deletedAt: null };
  if (options?.region) where.region = options.region;
  if (options?.source) where.source = options.source;
  if (options?.type) where.type = options.type;

  return db.job.findMany({
    where,
    orderBy: { scrapedAt: "desc" },
    take: options?.limit || 50,
  });
}

// ── TENDERS ──────────────────────────────────────────────────

export async function getTenders(options?: {
  status?: string;
  department?: string;
  limit?: number;
}) {
  const where: Record<string, unknown> = { active: true, deletedAt: null };
  if (options?.status) where.status = options.status;
  if (options?.department) where.department = options.department;

  return db.tender.findMany({
    where,
    orderBy: { deadline: "asc" },
    take: options?.limit || 50,
    include: {
      summaries: { orderBy: { order: "asc" } },
      keyDates: { orderBy: { order: "asc" } },
      compliances: { orderBy: { order: "asc" } },
    },
  });
}

// ── WIRE SUBMISSIONS ─────────────────────────────────────────

export async function getWireSubmissions(options?: {
  category?: string;
  priority?: string;
  verified?: boolean;
  limit?: number;
}) {
  const where: Record<string, unknown> = { deletedAt: null };
  if (options?.category) where.category = options.category;
  if (options?.priority) where.priority = options.priority;
  if (options?.verified !== undefined) where.verified = options.verified;

  return db.wireSubmission.findMany({
    where,
    orderBy: { timestamp: "desc" },
    take: options?.limit || 50,
  });
}

// ── MARKET DATA ──────────────────────────────────────────────

export async function getMarketData() {
  return db.marketDatum.findMany({
    where: { active: true },
    orderBy: { pair: "asc" },
  });
}

// ── TICKER ────────────────────────────────────────────────────

export async function getTickerItems() {
  return db.tickerItem.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
}

// ── RSS FEEDS ────────────────────────────────────────────────

export async function getRssFeeds(activeOnly?: boolean) {
  const where: Record<string, unknown> = {};
  if (activeOnly) where.active = true;

  return db.rssFeed.findMany({
    where,
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true, articles: true } } },
  });
}

export async function getRssFeedById(id: string) {
  return db.rssFeed.findUnique({
    where: { id },
    include: { _count: { select: { items: true, articles: true } } },
  });
}

// ── SEARCH ───────────────────────────────────────────────────

export async function searchArticles(query: string, options?: { limit?: number; section?: string }) {
  const where: Record<string, unknown> = {
    published: true,
    deletedAt: null,
    OR: [
      { headline: { contains: query } },
      { subheadline: { contains: query } },
      { content: { contains: query } },
      { authorLine: { contains: query } },
    ],
  };

  if (options?.section) where.section = options.section;

  return db.article.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: options?.limit || 20,
    include: {
      category: true,
    },
  });
}

// ── STATS ─────────────────────────────────────────────────────

export async function getPlatformStats() {
  const [articles, jobs, tenders, wires, subscribers, categories, feeds] = await Promise.all([
    db.article.count({ where: { published: true, deletedAt: null } }),
    db.job.count({ where: { active: true, deletedAt: null } }),
    db.tender.count({ where: { active: true, deletedAt: null } }),
    db.wireSubmission.count({ where: { deletedAt: null } }),
    db.newsletterSubscriber.count({ where: { active: true } }),
    db.category.count({ where: { active: true } }),
    db.rssFeed.count({ where: { active: true } }),
  ]);

  return { articles, jobs, tenders, wires, subscribers, categories, feeds };
}

// ── NEWSLETTER ───────────────────────────────────────────────

export async function subscribeNewsletter(email: string, name?: string) {
  return db.newsletterSubscriber.upsert({
    where: { email },
    update: { active: true, name: name || undefined },
    create: { email, name },
  });
}

// ── FAQ ──────────────────────────────────────────────────────

export async function getFaqItems(category?: string) {
  const where: Record<string, unknown> = { active: true };
  if (category) where.category = category;

  return db.faqItem.findMany({
    where,
    orderBy: { order: "asc" },
  });
}
