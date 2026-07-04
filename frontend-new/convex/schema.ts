// ============================================================
// Times of Namibia — Convex Schema (TANGISON)
//
// Ported from the Prisma schema. Key changes:
//   - All tables use Convex's `defineTable()` + index() instead of @@index
//   - Date fields use `v.number()` (Unix epoch ms) instead of `DateTime`
//   - Optional relations replaced with explicit foreign-key fields
//   - `id` fields use Convex's auto-generated `Id<"table">` (cuid-like)
//
// Convention: table names are singular (article, job, tender) to match
// the existing frontend code (`db.article.findMany` → `ctx.db.query("article")`).
// ============================================================

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ── USERS & AUTH ─────────────────────────────────────────────
  user: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    role: v.string(), // reader | journalist | editor | admin
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // ── CATEGORIES ───────────────────────────────────────────────
  category: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    order: v.number(),
    active: v.boolean(),
    parentId: v.optional(v.id("category")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_parent", ["parentId"])
    .index("by_active_order", ["active", "order"]),

  // ── TAGS ─────────────────────────────────────────────────────
  tag: defineTable({
    name: v.string(),
    slug: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  articleTag: defineTable({
    articleId: v.id("article"),
    tagId: v.id("tag"),
  })
    .index("by_article", ["articleId"])
    .index("by_tag", ["tagId"]),

  // ── ARTICLES ─────────────────────────────────────────────────
  article: defineTable({
    slug: v.string(),
    headline: v.string(),
    subheadline: v.optional(v.string()),
    content: v.string(),
    excerpt: v.optional(v.string()),
    source: v.string(), // rss | manual | wire
    categorySlug: v.optional(v.string()),
    section: v.string(), // national | economy | mining | energy | politics | africa | world | sport | etc.
    readingTime: v.number(),
    imageAlt: v.optional(v.string()),
    imageGps: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    authorLine: v.string(),
    featured: v.boolean(),
    published: v.boolean(),
    publishedAt: v.optional(v.number()),
    views: v.number(),
    commentCount: v.number(),
    seoTitle: v.optional(v.string()),
    seoKeywords: v.optional(v.string()),
    categoryId: v.optional(v.id("category")),
    authorId: v.optional(v.id("user")),
    rssFeedId: v.optional(v.id("rssFeed")),
    rssGuid: v.optional(v.string()),
    rssFetchedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published_section_publishedAt", ["published", "section", "publishedAt"])
    .index("by_published_featured", ["published", "featured"])
    .index("by_published_deletedAt", ["published", "deletedAt"])
    .index("by_category", ["categoryId"])
    .index("by_author", ["authorId"])
    .index("by_rssFeed", ["rssFeedId"])
    .index("by_rssGuid", ["rssGuid"]),

  // ── MEDIA ────────────────────────────────────────────────────
  media: defineTable({
    url: v.string(),
    alt: v.optional(v.string()),
    caption: v.optional(v.string()),
    mimeType: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    fileSize: v.optional(v.number()),
    source: v.optional(v.string()), // upload | rss | wire
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  articleMedia: defineTable({
    articleId: v.id("article"),
    mediaId: v.id("media"),
    order: v.number(),
    role: v.string(), // hero | inline | gallery
  })
    .index("by_article", ["articleId"])
    .index("by_media", ["mediaId"]),

  articleRevision: defineTable({
    articleId: v.id("article"),
    version: v.number(),
    headline: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_article_version", ["articleId", "version"]),

  // ── COMMENTS ─────────────────────────────────────────────────
  comment: defineTable({
    content: v.string(),
    status: v.string(), // pending | approved | rejected
    parentId: v.optional(v.id("comment")),
    articleId: v.id("article"),
    userId: v.optional(v.id("user")),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_article_status", ["articleId", "status"])
    .index("by_status_createdAt", ["status", "createdAt"])
    .index("by_parent", ["parentId"]),

  // ── BOOKMARKS ────────────────────────────────────────────────
  bookmark: defineTable({
    userId: v.id("user"),
    articleId: v.id("article"),
    createdAt: v.number(),
  })
    .index("by_user_article", ["userId", "articleId"])
    .index("by_user", ["userId"]),

  // ── ARTICLE VIEWS ────────────────────────────────────────────
  articleView: defineTable({
    articleId: v.id("article"),
    sessionId: v.optional(v.string()),
    userId: v.optional(v.id("user")),
    referer: v.optional(v.string()),
    country: v.optional(v.string()),
    device: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_article", ["articleId"]),

  // ── RSS FEEDS ────────────────────────────────────────────────
  rssFeed: defineTable({
    name: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    siteUrl: v.optional(v.string()),
    favicon: v.optional(v.string()),
    category: v.optional(v.string()),
    active: v.boolean(),
    lastFetched: v.optional(v.number()),
    fetchCount: v.number(),
    errorCount: v.number(),
    lastError: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_url", ["url"])
    .index("by_active", ["active"]),

  rssItem: defineTable({
    feedId: v.id("rssFeed"),
    title: v.string(),
    link: v.string(),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    author: v.optional(v.string()),
    guid: v.optional(v.string()),
    pubDate: v.optional(v.number()),
    ingested: v.boolean(),
    articleId: v.optional(v.id("article")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_feed_guid", ["feedId", "guid"])
    .index("by_feed_ingested", ["feedId", "ingested"])
    .index("by_ingested", ["ingested"]),

  // ── JOBS ─────────────────────────────────────────────────────
  job: defineTable({
    title: v.string(),
    company: v.string(),
    location: v.string(),
    region: v.optional(v.string()),
    source: v.string(),
    salary: v.optional(v.string()),
    salaryMin: v.optional(v.number()),
    salaryMax: v.optional(v.number()),
    type: v.optional(v.string()), // Full-time | Contract | Part-time
    description: v.optional(v.string()),
    requirements: v.optional(v.string()),
    closingDate: v.optional(v.number()),
    url: v.optional(v.string()),
    postedAgo: v.optional(v.string()),
    scrapedAt: v.number(),
    active: v.boolean(),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_active_deletedAt_scrapedAt", ["active", "deletedAt", "scrapedAt"])
    .index("by_region_active", ["region", "active"])
    .index("by_source_active", ["source", "active"]),

  // ── TENDERS ──────────────────────────────────────────────────
  tender: defineTable({
    docId: v.string(),
    title: v.string(),
    department: v.string(),
    contactPerson: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    deadline: v.number(),
    estimatedValue: v.optional(v.string()),
    valueMin: v.optional(v.number()),
    valueMax: v.optional(v.number()),
    status: v.string(), // open | closing | closed | awarded
    awardedTo: v.optional(v.string()),
    documentUrl: v.optional(v.string()),
    active: v.boolean(),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_docId", ["docId"])
    .index("by_active_deadline", ["active", "deadline"])
    .index("by_status_active", ["status", "active"])
    .index("by_department", ["department"]),

  tenderSummary: defineTable({
    text: v.string(),
    order: v.number(),
    tenderId: v.id("tender"),
  }).index("by_tender", ["tenderId"]),

  tenderKeyDate: defineTable({
    text: v.string(),
    order: v.number(),
    tenderId: v.id("tender"),
  }).index("by_tender", ["tenderId"]),

  tenderCompliance: defineTable({
    requirement: v.string(),
    order: v.number(),
    tenderId: v.id("tender"),
  }).index("by_tender", ["tenderId"]),

  // ── WIRE SUBMISSIONS (contributor programme + contact form) ──
  wireSubmission: defineTable({
    title: v.string(),
    category: v.string(),
    priority: v.string(), // routine | urgent | breaking
    source: v.string(),
    content: v.string(),
    verified: v.boolean(),
    timestamp: v.number(),
    authorId: v.optional(v.id("user")),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_priority", ["priority"])
    .index("by_deletedAt", ["deletedAt"]),

  // ── NEWSLETTER ───────────────────────────────────────────────
  newsletterSubscriber: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    active: v.boolean(),
    source: v.string(), // website | api | import
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  // ── MARKET DATA ──────────────────────────────────────────────
  marketDatum: defineTable({
    pair: v.string(),
    rate: v.string(),
    change: v.string(),
    direction: v.string(), // up | down | flat
    source: v.string(),
    active: v.boolean(),
    updatedAt: v.number(),
    createdAt: v.number(),
  }).index("by_pair_active", ["pair", "active"]),

  // ── TICKER ───────────────────────────────────────────────────
  tickerItem: defineTable({
    text: v.string(),
    active: v.boolean(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_active_order", ["active", "order"]),

  // ── FAQ ──────────────────────────────────────────────────────
  faqItem: defineTable({
    question: v.string(),
    answer: v.string(),
    category: v.string(),
    order: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_category_order", ["category", "order"]),

  // ── PAGES ────────────────────────────────────────────────────
  page: defineTable({
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    section: v.optional(v.string()),
    published: v.boolean(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_section_order", ["section", "order"]),

  // ── ADVERTS ──────────────────────────────────────────────────
  advert: defineTable({
    title: v.string(),
    imageUrl: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    placement: v.string(), // sidebar | banner | inline | footer
    impressions: v.number(),
    clicks: v.number(),
    active: v.boolean(),
    startDate: v.number(),
    endDate: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_active_placement", ["active", "placement"]),

  // ── SITE CONFIG (key/value settings) ─────────────────────────
  siteConfig: defineTable({
    key: v.string(),
    value: v.string(),
    type: v.string(), // string | number | boolean | json
    group: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  // ── NAMIBIA GUIDE (Part 1 — evergreen info hub) ─────────────
  namibiaGuide: defineTable({
    slug: v.string(),
    title: v.string(),
    region: v.string(),
    category: v.string(), // landscape | wildlife | coastal | culture | history
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
    status: v.string(), // draft | published
    origin: v.string(), // system | contribution
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_status", ["status"]),

  // ── COMMUNITY CONTRIBUTIONS (Part 2) ─────────────────────────
  contributions: defineTable({
    title: v.string(),
    body: v.string(),
    region: v.optional(v.string()),
    category: v.optional(v.string()),
    submitterName: v.string(),
    submitterEmail: v.string(),
    imageUrls: v.array(v.string()),
    status: v.string(), // pending | approved | rejected
    moderatorNotes: v.optional(v.string()),
    submittedAt: v.number(),
  }).index("by_status", ["status"]),

  // ── INGESTION HEALTH (Part 5 — visibility) ──────────────────
  ingestionHealth: defineTable({
    key: v.string(),
    lastSuccessfulRun: v.number(),
    articlesInserted: v.number(),
    errors: v.array(v.string()),
  }).index("by_key", ["key"]),
});
