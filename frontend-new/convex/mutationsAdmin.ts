// ============================================================
// Times of Namibia - Convex admin mutations (TANGISON)
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
  // (was `token !== ADMIN_TOKEN` - vulnerable to timing attacks).
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
    // Phase 1 fields:
    seo_meta_description: v.optional(v.string()),
    key_takeaways: v.optional(v.array(v.string())),
    // Phase 2 fields:
    alt_text: v.optional(v.string()),
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
      // Phase 1 fields:
      seo_meta_description: args.seo_meta_description,
      key_takeaways: args.key_takeaways,
      // Phase 2 fields:
      alt_text: args.alt_text,
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
    // Phase 1 + 2 fields (for backfill):
    seo_meta_description: v.optional(v.string()),
    key_takeaways: v.optional(v.array(v.string())),
    alt_text: v.optional(v.string()),
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
    // Phase 1 + 2 fields (for backfill)
    if (args.seo_meta_description !== undefined) updates.seo_meta_description = args.seo_meta_description;
    if (args.key_takeaways !== undefined) updates.key_takeaways = args.key_takeaways;
    if (args.alt_text !== undefined) updates.alt_text = args.alt_text;

    await ctx.db.patch(args.articleId, updates);
    return { success: true };
  },
});

// ── CLEAR ALL ARTICLES (Phase 1, Iteration 14) ───────────────
// Permanently deletes all records from the article table.
// Used before fresh ingestion to ensure clean state.
// Repeatable reset script - Issue 5.

export const clearAllArticles = mutation({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const articles = await ctx.db.query("article").take(2000);
    let deleted = 0;
    for (const article of articles) {
      await ctx.db.delete(article._id);
      deleted++;
    }
    return { deleted };
  },
});

// ── FULL DATABASE RESET (Issue 5) ────────────────────────────
// Wipes articles, jobs, tenders, market data, social queue.
// Does NOT touch directory_places or advertisements (those are
// expensive to re-seed). Returns counts of what was deleted.

export const fullDatabaseReset = mutation({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const results: Record<string, number> = {};

    // Articles
    const articles = await ctx.db.query("article").take(2000);
    results.articles = articles.length;
    for (const a of articles) await ctx.db.delete(a._id);

    // Jobs
    const jobs = await ctx.db.query("job").take(500);
    results.jobs = jobs.length;
    for (const j of jobs) await ctx.db.delete(j._id);

    // Tenders
    const tenders = await ctx.db.query("tender").take(500);
    results.tenders = tenders.length;
    for (const t of tenders) await ctx.db.delete(t._id);

    // Market data
    const markets = await ctx.db.query("marketDatum").take(100);
    results.marketData = markets.length;
    for (const m of markets) await ctx.db.delete(m._id);

    // Social queue
    const social = await ctx.db.query("socialQueue").take(500);
    results.socialQueue = social.length;
    for (const s of social) await ctx.db.delete(s._id);

    // Ticker items
    const tickers = await ctx.db.query("tickerItem").take(100);
    results.tickerItems = tickers.length;
    for (const t of tickers) await ctx.db.delete(t._id);

    return { deleted: results, totalDeleted: Object.values(results).reduce((a, b) => a + b, 0) };
  },
});

// ── CLEAR ALL DIRECTORY PLACES (Phase 4 helper) ──────────────

export const clearAllDirectoryPlaces = mutation({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const places = await ctx.db.query("directory_places").take(200);
    let deleted = 0;
    for (const place of places) {
      await ctx.db.delete(place._id);
      deleted++;
    }
    return { deleted };
  },
});

// ── DELETE MUTATIONS (Section 5: Database cleanup) ───────────

export const deleteMarketDatum = mutation({
  args: { adminToken: v.string(), id: v.id("marketDatum") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const deleteTender = mutation({
  args: { adminToken: v.string(), id: v.id("tender") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const deleteJob = mutation({
  args: { adminToken: v.string(), id: v.id("job") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const deleteSocialQueueEntry = mutation({
  args: { adminToken: v.string(), id: v.id("socialQueue") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const deleteTickerItem = mutation({
  args: { adminToken: v.string(), id: v.id("tickerItem") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// ── UPDATE DIRECTORY PLACE IMAGES (Issue: Fill missing images) ──

export const updateDirectoryPlaceImages = mutation({
  args: {
    adminToken: v.string(),
    slug: v.string(),
    images: v.array(v.object({
      url: v.string(),
      webp_url: v.optional(v.string()),
      caption: v.string(),
      source: v.string(),
      license: v.string(),
      width: v.optional(v.number()),
      height: v.optional(v.number()),
      alt_text: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const place = await ctx.db
      .query("directory_places")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!place) {
      return { success: false, error: "Place not found" };
    }
    // Merge new images with existing ones (avoid duplicates by URL)
    const existingUrls = new Set(place.images.map((img) => img.url));
    const newImages = args.images.filter((img) => !existingUrls.has(img.url));
    const allImages = [...place.images, ...newImages];

    await ctx.db.patch(place._id, {
      images: allImages,
      gallery_featured: allImages.length > 0,
      updated_at: Date.now(),
    });
    return { success: true, imageCount: allImages.length };
  },
});

// ── INGEST DIRECTORY PLACE (Phase 4) ─────────────────────────

export const ingestDirectoryPlace = mutation({
  args: {
    adminToken: v.string(),
    slug: v.string(),
    name: v.string(),
    type: v.string(),
    region: v.string(),
    short_description: v.string(),
    rich_description: v.string(),
    seo_meta_description: v.string(),
    coordinates: v.object({ lat: v.number(), lng: v.number() }),
    images: v.array(v.object({
      url: v.string(),
      webp_url: v.optional(v.string()),
      caption: v.string(),
      source: v.string(),
      license: v.string(),
      width: v.optional(v.number()),
      height: v.optional(v.number()),
      alt_text: v.string(),
    })),
    key_facts: v.array(v.object({ label: v.string(), value: v.string() })),
    best_time_to_visit: v.string(),
    activities: v.array(v.string()),
    official_url: v.string(),
    booking_url: v.optional(v.string()),
    related_places: v.array(v.string()),
    gallery_featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const existing = await ctx.db
      .query("directory_places")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        short_description: args.short_description,
        rich_description: args.rich_description,
        seo_meta_description: args.seo_meta_description,
        images: args.images,
        key_facts: args.key_facts,
        best_time_to_visit: args.best_time_to_visit,
        activities: args.activities,
        booking_url: args.booking_url,
        related_places: args.related_places,
        gallery_featured: args.gallery_featured,
        updated_at: Date.now(),
      });
      return { id: existing._id, deduped: true };
    }
    const id = await ctx.db.insert("directory_places", {
      slug: args.slug,
      name: args.name,
      type: args.type,
      region: args.region,
      short_description: args.short_description,
      rich_description: args.rich_description,
      seo_meta_description: args.seo_meta_description,
      coordinates: args.coordinates,
      images: args.images,
      key_facts: args.key_facts,
      best_time_to_visit: args.best_time_to_visit,
      activities: args.activities,
      official_url: args.official_url,
      booking_url: args.booking_url,
      related_places: args.related_places,
      gallery_featured: args.gallery_featured,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    return { id, deduped: false };
  },
});

// ── INGEST ADVERTISEMENT (Phase 8) ───────────────────────────

export const ingestAdvertisement = mutation({
  args: {
    adminToken: v.string(),
    imageUrl: v.string(),
    targetUrl: v.string(),
    placement: v.string(),
    alt_text: v.string(),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const id = await ctx.db.insert("advertisements", {
      imageUrl: args.imageUrl,
      targetUrl: args.targetUrl,
      placement: args.placement,
      isActive: true,
      impressions: 0,
      clicks: 0,
      alt_text: args.alt_text,
      created_at: Date.now(),
    });
    return { id };
  },
});

// ── TRACK AD IMPRESSION (Phase 8) ────────────────────────────

export const trackAdImpression = mutation({
  args: { adId: v.id("advertisements") },
  handler: async (ctx, args) => {
    const ad = await ctx.db.get(args.adId);
    if (!ad) return { success: false };
    await ctx.db.patch(args.adId, { impressions: ad.impressions + 1 });
    return { success: true };
  },
});

// ── TRACK AD CLICK (Phase 8) ─────────────────────────────────

export const trackAdClick = mutation({
  args: { adId: v.id("advertisements") },
  handler: async (ctx, args) => {
    const ad = await ctx.db.get(args.adId);
    if (!ad) return { success: false };
    await ctx.db.patch(args.adId, { clicks: ad.clicks + 1 });
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

// ── DELETE DIRECTORY PLACE ───────────────────────────────────

export const deleteDirectoryPlace = mutation({
  args: { adminToken: v.string(), slug: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const place = await ctx.db
      .query("directory_places")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!place) return { deleted: false, error: "Not found" };
    await ctx.db.delete(place._id);
    return { deleted: true, name: place.name };
  },
});
