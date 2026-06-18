// ============================================================
// Times of Namibia — Convex mutations (TANGISON)
// All write operations: newsletter signup, contact form,
// wire submissions, article view tracking.
//
// Admin-only mutations (article/job/tender CRUD, scraper ingestion)
// are in mutationsAdmin.ts and require auth via Convex Auth or
// an admin secret header check.
// ============================================================

import { mutation } from "./_generated/server";
import { v } from "convex/values";

// ── NEWSLETTER ───────────────────────────────────────────────

export const subscribeNewsletter = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    const existing = await ctx.db
      .query("newsletterSubscriber")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existing) {
      // Reactivate if previously unsubscribed
      if (!existing.active) {
        await ctx.db.patch(existing._id, {
          active: true,
          name: args.name ?? existing.name,
          updatedAt: Date.now(),
        });
      }
      return { id: existing._id, reactivated: true };
    }

    const id = await ctx.db.insert("newsletterSubscriber", {
      email: normalizedEmail,
      name: args.name,
      active: true,
      source: "website",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { id, reactivated: false };
  },
});

// ── CONTACT FORM / WIRE SUBMISSIONS ──────────────────────────

export const submitContactForm = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    category: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("wireSubmission", {
      title: `Contact: ${args.name} — ${args.category}`.slice(0, 200),
      category: "contact",
      priority: "routine",
      source: args.email.trim(),
      content: `Name: ${args.name}\nEmail: ${args.email}\nDepartment: ${args.category}\n\n${args.message}`.slice(0, 10_000),
      verified: false,
      timestamp: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { id };
  },
});

export const submitWire = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    priority: v.string(),
    source: v.string(),
    content: v.string(),
    verified: v.boolean(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("wireSubmission", {
      title: args.title,
      category: args.category,
      priority: args.priority,
      source: args.source,
      content: args.content,
      verified: args.verified,
      timestamp: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { id };
  },
});

// ── ARTICLE VIEW TRACKING ────────────────────────────────────

export const trackArticleView = mutation({
  args: {
    articleId: v.id("article"),
    sessionId: v.optional(v.string()),
    referer: v.optional(v.string()),
    country: v.optional(v.string()),
    device: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Record the view
    await ctx.db.insert("articleView", {
      articleId: args.articleId,
      sessionId: args.sessionId,
      referer: args.referer,
      country: args.country,
      device: args.device,
      createdAt: Date.now(),
    });

    // Increment the article's view counter
    const article = await ctx.db.get(args.articleId);
    if (article) {
      await ctx.db.patch(args.articleId, {
        views: (article.views ?? 0) + 1,
        updatedAt: Date.now(),
      });
    }
  },
});

// ── COMMENT (pending moderation) ─────────────────────────────

export const submitComment = mutation({
  args: {
    articleId: v.id("article"),
    content: v.string(),
    userId: v.optional(v.id("user")),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("comment", {
      content: args.content,
      status: "pending",
      articleId: args.articleId,
      userId: args.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Increment comment count on the article
    const article = await ctx.db.get(args.articleId);
    if (article) {
      await ctx.db.patch(args.articleId, {
        commentCount: (article.commentCount ?? 0) + 1,
        updatedAt: Date.now(),
      });
    }

    return { id };
  },
});

// ── BOOKMARKS ────────────────────────────────────────────────

export const toggleBookmark = mutation({
  args: {
    userId: v.id("user"),
    articleId: v.id("article"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("bookmark")
      .withIndex("by_user_article", (q) =>
        q.eq("userId", args.userId).eq("articleId", args.articleId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { bookmarked: false };
    }

    await ctx.db.insert("bookmark", {
      userId: args.userId,
      articleId: args.articleId,
      createdAt: Date.now(),
    });
    return { bookmarked: true };
  },
});
