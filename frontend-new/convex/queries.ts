// ============================================================
// Times of Namibia — Convex queries (TANGISON)
// All read operations for articles, jobs, tenders, market data,
// RSS feeds, newsletter, wire submissions.
// ============================================================

import { query } from "./_generated/server";
import { v } from "convex/values";

// ── ARTICLES ─────────────────────────────────────────────────

export const listArticles = query({
  args: {
    limit: v.optional(v.number()),
    section: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 20, 200);
    let q = ctx.db
      .query("article")
      .filter((q) => q.eq(q.field("published"), true))
      .filter((q) => q.eq(q.field("deletedAt"), undefined));

    if (args.section) {
      q = q.filter((qf) => qf.eq(qf.field("section"), args.section));
    }
    if (args.featured !== undefined) {
      q = q.filter((qf) => qf.eq(qf.field("featured"), args.featured));
    }

    return await q
      .order("desc")
      .take(limit);
  },
});

export const getArticleBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("article")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("published"), true))
      .first();
  },
});

// ── DEDUP CHECK (for RSS ingestion — avoid wasting image gen calls) ─
// Checks if an article already exists by slug OR rssGuid.

export const checkArticleExists = query({
  args: {
    slug: v.string(),
    rssGuid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const bySlug = await ctx.db
      .query("article")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (bySlug) return true;

    if (args.rssGuid) {
      const byGuid = await ctx.db
        .query("article")
        .withIndex("by_rssGuid", (q) => q.eq("rssGuid", args.rssGuid))
        .first();
      if (byGuid) return true;
    }

    return false;
  },
});

export const getFeaturedArticle = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("article")
      .filter((q) => q.eq(q.field("published"), true))
      .filter((q) => q.eq(q.field("featured"), true))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .order("desc")
      .first();
  },
});

export const searchArticles = query({
  args: {
    q: v.string(),
    limit: v.optional(v.number()),
    section: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 30, 50);
    const term = args.q.toLowerCase().trim();
    if (!term) return [];

    // Convex doesn't have built-in full-text search yet — use filter with
    // contains on headline + excerpt. For larger datasets, consider
    // external search (Algolia, Typesense).
    const candidates = await ctx.db
      .query("article")
      .filter((q) => q.eq(q.field("published"), true))
      .order("desc")
      .take(500);

    const filtered = candidates.filter((a) => {
      const matches =
        a.headline.toLowerCase().includes(term) ||
        (a.excerpt ?? "").toLowerCase().includes(term) ||
        (a.content ?? "").toLowerCase().includes(term);
      if (!matches) return false;
      if (args.section && a.section !== args.section) return false;
      return true;
    });

    return filtered.slice(0, limit);
  },
});

// ── JOBS ─────────────────────────────────────────────────────

export const listJobs = query({
  args: {
    limit: v.optional(v.number()),
    region: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 50, 200);
    const q = ctx.db
      .query("job")
      .filter((qf) => qf.eq(qf.field("active"), true))
      .filter((qf) => qf.eq(qf.field("deletedAt"), undefined));

    const results = await q.order("desc").take(limit * 2);
    let filtered = results;
    if (args.region) {
      filtered = filtered.filter((j) => (j.region ?? "").toLowerCase() === args.region!.toLowerCase());
    }
    if (args.source) {
      filtered = filtered.filter((j) => j.source.toLowerCase().includes(args.source!.toLowerCase()));
    }
    return filtered.slice(0, limit);
  },
});

// ── TENDERS ──────────────────────────────────────────────────

export const listTenders = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 50, 200);
    const results = await ctx.db
      .query("tender")
      .filter((q) => q.eq(q.field("active"), true))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .order("asc")
      .take(limit * 2);

    let filtered = results;
    if (args.status) {
      filtered = filtered.filter((t) => t.status === args.status);
    }
    if (args.department) {
      const d = args.department.toLowerCase();
      filtered = filtered.filter((t) => t.department.toLowerCase().includes(d));
    }
    return filtered.slice(0, limit);
  },
});

// ── MARKET DATA ──────────────────────────────────────────────

export const getMarketData = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("marketDatum")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

// ── TICKER ───────────────────────────────────────────────────

export const getTickerItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tickerItem")
      .filter((q) => q.eq(q.field("active"), true))
      .order("asc")
      .collect();
  },
});

// ── RSS FEEDS ────────────────────────────────────────────────

export const listRssFeeds = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("rssFeed");
    if (args.activeOnly) {
      q = q.filter((qf) => qf.eq(qf.field("active"), true));
    }
    return await q.collect();
  },
});

// ── STATS ────────────────────────────────────────────────────

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const [articles, jobs, tenders, feeds, market] = await Promise.all([
      ctx.db
        .query("article")
        .filter((q) => q.eq(q.field("published"), true))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect(),
      ctx.db
        .query("job")
        .filter((q) => q.eq(q.field("active"), true))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect(),
      ctx.db
        .query("tender")
        .filter((q) => q.eq(q.field("active"), true))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect(),
      ctx.db
        .query("rssFeed")
        .filter((q) => q.eq(q.field("active"), true))
        .collect(),
      ctx.db
        .query("marketDatum")
        .filter((q) => q.eq(q.field("active"), true))
        .collect(),
    ]);

    return {
      articles: articles.length,
      jobs: jobs.length,
      tenders: tenders.length,
      rssFeeds: feeds.length,
      marketData: market.length,
      total: articles.length + jobs.length + tenders.length,
    };
  },
});

// ── WIRE SUBMISSIONS (contact form + contributor) ────────────
// TANGISON Iteration 4 Fix #6: This query is ADMIN-ONLY.
// Wire submissions contain PII (submitter email + message body).
// Public access enabled an email-harvesting + impersonation vector.
// Use the admin-only variant below; the public variant returns []

export const listWireSubmissions = query({
  args: {
    limit: v.optional(v.number()),
    adminToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Require admin token to access wire submissions (PII protection).
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || !args.adminToken || args.adminToken !== ADMIN_TOKEN) {
      return [];
    }
    const limit = Math.min(args.limit ?? 50, 200);
    return await ctx.db
      .query("wireSubmission")
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .order("desc")
      .take(limit);
  },
});

// ── NEWSLETTER ───────────────────────────────────────────────
// TANGISON Iteration 4 Fix (M-1): getSubscriberByEmail is admin-only.
// Public access enabled subscription-status enumeration.
// Public callers get `null` (no leak); the subscribeNewsletter mutation
// handles its own dedup check internally.

export const getSubscriberByEmail = query({
  args: {
    email: v.string(),
    adminToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || !args.adminToken || args.adminToken !== ADMIN_TOKEN) {
      return null;
    }
    return await ctx.db
      .query("newsletterSubscriber")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();
  },
});

// ── NAMIBIA GUIDE ────────────────────────────────────────────

export const getGuideBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("namibiaGuide")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const listPublishedGuides = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("namibiaGuide")
      .filter((qf) => qf.eq(qf.field("status"), "published"));

    if (args.category) {
      q = q.filter((qf) => qf.eq(qf.field("category"), args.category!));
    }

    return await q.collect();
  },
});

// ── COMMUNITY CONTRIBUTIONS ──────────────────────────────────

export const listPendingContributions = query({
  args: { adminToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || !args.adminToken || args.adminToken !== ADMIN_TOKEN) {
      return []; // Public callers get empty list (no PII leak)
    }
    return await ctx.db
      .query("contributions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

// ── INGESTION HEALTH ─────────────────────────────────────────

export const getIngestionHealth = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("ingestionHealth")
      .withIndex("by_key", (q) => q.eq("key", "rss_ingestion"))
      .first();
  },
});

// ── STORAGE URL (for image backfill) ─────────────────────────

export const getStorageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId as any);
  },
});
