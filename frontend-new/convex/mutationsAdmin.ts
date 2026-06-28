// ============================================================
// Times of Namibia — Convex admin mutations (TANGISON)
//
// Ingestion endpoints used by the data-agent scraper.
// SECURITY: guarded by CONVEX_ADMIN_TOKEN check.
// Configure the token via the CONVEX_ADMIN_TOKEN env var in Convex
// dashboard → Settings → Environment Variables.
// ============================================================

import { mutation } from "./_generated/server";
import { v } from "convex/values";

const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;

/**
 * Constant-time string equality to prevent timing-attack brute-force
 * of the admin token. Mirrors the pattern used in frontend auth.ts.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function requireAdmin(token: string | null) {
  if (!ADMIN_TOKEN) {
    throw new Error("CONVEX_ADMIN_TOKEN env var not configured");
  }
  // TANGISON Iteration 4 Fix #10: Use constant-time comparison
  // (was `token !== ADMIN_TOKEN` — vulnerable to timing attacks).
  if (!token || !constantTimeEqual(token, ADMIN_TOKEN)) {
    throw new Error("Unauthorized: invalid admin token");
  }
}

// ── ARTICLE INGEST ───────────────────────────────────────────

export const ingestArticle = mutation({
  args: {
    adminToken: v.string(),
    slug: v.string(),
    headline: v.string(),
    subheadline: v.optional(v.string()),
    content: v.string(),
    excerpt: v.optional(v.string()),
    source: v.string(),
    section: v.string(),
    categorySlug: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageAlt: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    authorLine: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    rssFeedId: v.optional(v.id("rssFeed")),
    rssGuid: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    readingTime: v.optional(v.number()),
    // Task 4 new fields:
    body: v.optional(v.string()),
    summary: v.optional(v.string()),
    category: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    sourceRegion: v.optional(v.string()),
    originalUrl: v.optional(v.string()),
    postedToSocial: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    // Dedup by slug OR rssGuid
    const existing = await ctx.db
      .query("article")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      return { id: existing._id, deduped: true };
    }

    if (args.rssGuid) {
      const existingByGuid = await ctx.db
        .query("article")
        .withIndex("by_rssGuid", (q) => q.eq("rssGuid", args.rssGuid))
        .first();
      if (existingByGuid) {
        return { id: existingByGuid._id, deduped: true };
      }
    }

    // If a storage ID was provided (from image generation), get the URL
    let imageUrl = args.imageUrl;
    if (args.imageStorageId) {
      const url = await ctx.storage.getUrl(args.imageStorageId);
      if (url) imageUrl = url;
    }

    const id = await ctx.db.insert("article", {
      slug: args.slug,
      headline: args.headline,
      subheadline: args.subheadline,
      content: args.content,
      excerpt: args.excerpt,
      source: args.source,
      section: args.section,
      categorySlug: args.categorySlug,
      imageUrl,
      imageAlt: args.imageAlt,
      authorLine: args.authorLine ?? "TANGISON Editorial",
      publishedAt: args.publishedAt ?? Date.now(),
      rssFeedId: args.rssFeedId,
      rssGuid: args.rssGuid,
      featured: args.featured ?? false,
      readingTime: args.readingTime ?? 5,
      published: true,
      views: 0,
      commentCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      // Task 4 new fields (write alongside legacy fields for backwards compat):
      body: args.body ?? args.content,
      summary: args.summary ?? args.excerpt,
      category: args.category ?? args.section,
      coverImage: imageUrl,
      sourceRegion: args.sourceRegion,
      originalUrl: args.originalUrl,
      postedToSocial: args.postedToSocial ?? false,
    });

    return { id, deduped: false };
  },
});

// ── JOB INGEST ───────────────────────────────────────────────

export const ingestJob = mutation({
  args: {
    adminToken: v.string(),
    title: v.string(),
    company: v.string(),
    location: v.string(),
    region: v.optional(v.string()),
    source: v.string(),
    salary: v.optional(v.string()),
    type: v.optional(v.string()),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    postedAgo: v.optional(v.string()),
    closingDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    // Dedup by URL (if provided)
    if (args.url) {
      const existing = await ctx.db
        .query("job")
        .filter((q) => q.eq(q.field("url"), args.url))
        .filter((q) => q.eq(q.field("active"), true))
        .first();
      if (existing) {
        return { id: existing._id, deduped: true };
      }
    }

    const id = await ctx.db.insert("job", {
      title: args.title,
      company: args.company,
      location: args.location,
      region: args.region,
      source: args.source,
      salary: args.salary,
      type: args.type,
      description: args.description,
      url: args.url,
      postedAgo: args.postedAgo,
      closingDate: args.closingDate,
      scrapedAt: Date.now(),
      active: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { id, deduped: false };
  },
});

// ── TENDER INGEST ────────────────────────────────────────────

export const ingestTender = mutation({
  args: {
    adminToken: v.string(),
    docId: v.string(),
    title: v.string(),
    department: v.string(),
    deadline: v.number(),
    estimatedValue: v.optional(v.string()),
    contactPerson: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    documentUrl: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    // Dedup by docId
    const existing = await ctx.db
      .query("tender")
      .withIndex("by_docId", (q) => q.eq("docId", args.docId))
      .first();
    if (existing) {
      return { id: existing._id, deduped: true };
    }

    const id = await ctx.db.insert("tender", {
      docId: args.docId,
      title: args.title,
      department: args.department,
      deadline: args.deadline,
      estimatedValue: args.estimatedValue,
      contactPerson: args.contactPerson,
      contactEmail: args.contactEmail,
      contactPhone: args.contactPhone,
      documentUrl: args.documentUrl,
      status: args.status ?? "open",
      active: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { id, deduped: false };
  },
});

// ── MARKET DATA UPSERT ───────────────────────────────────────

export const upsertMarketDatum = mutation({
  args: {
    adminToken: v.string(),
    pair: v.string(),
    rate: v.string(),
    change: v.string(),
    direction: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    const existing = await ctx.db
      .query("marketDatum")
      .withIndex("by_pair_active", (q) =>
        q.eq("pair", args.pair).eq("active", true)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        rate: args.rate,
        change: args.change,
        direction: args.direction,
        source: args.source ?? existing.source,
        updatedAt: Date.now(),
      });
      return { id: existing._id, updated: true };
    }

    const id = await ctx.db.insert("marketDatum", {
      pair: args.pair,
      rate: args.rate,
      change: args.change,
      direction: args.direction,
      source: args.source ?? "BoN",
      active: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { id, updated: false };
  },
});

// ── TICKER ITEM ──────────────────────────────────────────────

export const upsertTickerItem = mutation({
  args: {
    adminToken: v.string(),
    text: v.string(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    const id = await ctx.db.insert("tickerItem", {
      text: args.text,
      active: true,
      order: args.order ?? 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { id };
  },
});

// ── NAMIBIA GUIDE ENTRY ──────────────────────────────────────

export const ingestGuideEntry = mutation({
  args: {
    adminToken: v.string(),
    slug: v.string(),
    title: v.string(),
    region: v.string(),
    category: v.string(),
    body: v.string(),
    sources: v.array(v.object({
      name: v.string(),
      url: v.string(),
      license: v.string(),
    })),
    images: v.array(v.object({
      url: v.string(),
      credit: v.string(),
      sourceUrl: v.string(),
      license: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    const existing = await ctx.db
      .query("namibiaGuide")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) return { id: existing._id, deduped: true };

    const id = await ctx.db.insert("namibiaGuide", {
      slug: args.slug,
      title: args.title,
      region: args.region,
      category: args.category,
      body: args.body,
      sources: args.sources,
      images: args.images,
      status: "draft",
      origin: "system",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { id, deduped: false };
  },
});

// ── PUBLISH GUIDE ENTRY ──────────────────────────────────────

export const publishGuideEntry = mutation({
  args: { adminToken: v.string(), id: v.id("namibiaGuide") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.patch(args.id, { status: "published", updatedAt: Date.now() });
    return { success: true };
  },
});

// ── APPROVE CONTRIBUTION → GUIDE ENTRY ───────────────────────

export const approveContribution = mutation({
  args: {
    adminToken: v.string(),
    contributionId: v.id("contributions"),
    moderatorNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    const contribution = await ctx.db.get(args.contributionId);
    if (!contribution) throw new Error("Contribution not found");

    // Copy into namibiaGuide as published
    const slug = contribution.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const guideId = await ctx.db.insert("namibiaGuide", {
      slug,
      title: contribution.title,
      region: contribution.region || "Unknown",
      category: contribution.category || "culture",
      body: contribution.body,
      sources: [],
      images: contribution.imageUrls.map((url) => ({
        url,
        credit: contribution.submitterName,
        sourceUrl: "",
        license: "Submitted",
      })),
      status: "published",
      origin: "contribution",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Mark contribution as approved
    await ctx.db.patch(args.contributionId, {
      status: "approved",
      moderatorNotes: args.moderatorNotes,
    });

    return { guideId, success: true };
  },
});

export const rejectContribution = mutation({
  args: {
    adminToken: v.string(),
    contributionId: v.id("contributions"),
    moderatorNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.patch(args.contributionId, {
      status: "rejected",
      moderatorNotes: args.moderatorNotes,
    });
    return { success: true };
  },
});

// ── INGESTION HEALTH ─────────────────────────────────────────

export const updateIngestionHealth = mutation({
  args: {
    adminToken: v.string(),
    articlesInserted: v.number(),
    errors: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    const existing = await ctx.db
      .query("ingestionHealth")
      .withIndex("by_key", (q) => q.eq("key", "rss_ingestion"))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        lastSuccessfulRun: Date.now(),
        articlesInserted: args.articlesInserted,
        errors: args.errors,
      });
      return { id: existing._id };
    }

    const id = await ctx.db.insert("ingestionHealth", {
      key: "rss_ingestion",
      lastSuccessfulRun: Date.now(),
      articlesInserted: args.articlesInserted,
      errors: args.errors,
    });
    return { id };
  },
});

// ── UPDATE ARTICLE CONTENT (for backfill) ────────────────────

export const updateArticleContent = mutation({
  args: {
    adminToken: v.string(),
    articleId: v.id("article"),
    content: v.optional(v.string()),
    subheadline: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    section: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    // Task 4 new fields:
    body: v.optional(v.string()),
    summary: v.optional(v.string()),
    category: v.optional(v.string()),
    sourceRegion: v.optional(v.string()),
    originalUrl: v.optional(v.string()),
    postedToSocial: v.optional(v.boolean()),
    socialPostedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    const updates: Record<string, any> = { updatedAt: Date.now() };
    if (args.content) updates.content = args.content;
    if (args.subheadline !== undefined) updates.subheadline = args.subheadline;
    if (args.excerpt) updates.excerpt = args.excerpt;
    if (args.section) updates.section = args.section;
    if (args.imageStorageId) {
      const url = await ctx.storage.getUrl(args.imageStorageId);
      if (url) {
        updates.imageUrl = url;
        updates.coverImage = url; // Task 4 alias
      }
    }
    // Task 4 new fields
    if (args.body) updates.body = args.body;
    if (args.summary) updates.summary = args.summary;
    if (args.category) updates.category = args.category;
    if (args.sourceRegion !== undefined) updates.sourceRegion = args.sourceRegion;
    if (args.originalUrl !== undefined) updates.originalUrl = args.originalUrl;
    if (args.postedToSocial !== undefined) updates.postedToSocial = args.postedToSocial;
    if (args.socialPostedAt !== undefined) updates.socialPostedAt = args.socialPostedAt;

    await ctx.db.patch(args.articleId, updates);
    return { success: true };
  },
});

// ── QUEUE SOCIAL POST (Task 5) ───────────────────────────────

export const queueSocialPost = mutation({
  args: {
    adminToken: v.string(),
    articleId: v.id("article"),
    imageUrl: v.optional(v.string()),
    caption: v.string(),
    hashtags: v.array(v.string()),
    platforms: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    // Don't queue duplicates for the same article
    const existing = await ctx.db
      .query("socialQueue")
      .withIndex("by_article", (q) => q.eq("articleId", args.articleId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();
    if (existing) {
      return { id: existing._id, deduped: true };
    }

    const id = await ctx.db.insert("socialQueue", {
      articleId: args.articleId,
      imageUrl: args.imageUrl,
      caption: args.caption,
      hashtags: args.hashtags,
      platforms: args.platforms,
      status: "pending",
      queuedAt: Date.now(),
    });

    return { id, deduped: false };
  },
});

// ── MARK SOCIAL POST STATUS (Task 5) ─────────────────────────
// Called by external automation after posting to update status.

export const updateSocialPostStatus = mutation({
  args: {
    adminToken: v.string(),
    socialQueueId: v.id("socialQueue"),
    status: v.string(), // "posted" | "failed"
    postResults: v.optional(v.array(v.object({
      platform: v.string(),
      success: v.boolean(),
      error: v.optional(v.string()),
      postId: v.optional(v.string()),
    }))),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    await ctx.db.patch(args.socialQueueId, {
      status: args.status,
      postedAt: args.status === "posted" ? Date.now() : undefined,
      ...(args.postResults ? { postResults: args.postResults } : {}),
    });

    return { success: true };
  },
});
