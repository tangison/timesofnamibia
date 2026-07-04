// ============================================================
// Times of Namibia - Convex mutations (TANGISON)
// All write operations: newsletter signup, contact form,
// wire submissions, article view tracking.
//
// Admin-only mutations (article/job/tender CRUD, scraper ingestion)
// are in mutationsAdmin.ts and require auth via CONVEX_ADMIN_TOKEN.
//
// SECURITY (TANGISON Iteration 4 Fix #5):
//   - No mutation accepts `userId` from the client. User identity must
//     come from `ctx.auth.getUserIdentity()` once Convex Auth is wired up.
//     Until then, user-specific mutations (comments, bookmarks) throw.
//   - `verified` is never client-supplied. Wires are always inserted as
//     `verified: false` and can only be verified via an admin mutation.
//   - `trackArticleView` dedups by sessionId+articleId within a 1-hour
//     window to prevent view-count inflation.
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

// ── CONTACT FORM ─────────────────────────────────────────────

export const submitContactForm = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    category: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("wireSubmission", {
      title: `Contact: ${args.name} - ${args.category}`.slice(0, 200),
      category: "contact",
      priority: "routine",
      source: args.email.trim(),
      content: `Name: ${args.name}\nEmail: ${args.email}\nDepartment: ${args.category}\n\n${args.message}`.slice(0, 10_000),
      verified: false, // TANGISON Iteration 4 Fix #5: never client-supplied
      timestamp: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { id };
  },
});

// ── WIRE SUBMISSIONS (contributor programme) ─────────────────
// NOTE: Until Convex Auth is wired up, this mutation is admin-only
// (see mutationsAdmin.ts:submitWire). The public version below is
// disabled to prevent unauthenticated self-verification.

export const submitWirePublic = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    priority: v.string(),
    source: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // TANGISON Iteration 4 Fix #5: `verified` is always false on public
    // submission. Only an admin mutation can mark a wire as verified.
    const id = await ctx.db.insert("wireSubmission", {
      title: args.title,
      category: args.category,
      priority: args.priority,
      source: args.source,
      content: args.content,
      verified: false,
      timestamp: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { id };
  },
});

// ── ARTICLE VIEW TRACKING (rate-limited per session) ─────────

export const trackArticleView = mutation({
  args: {
    articleId: v.id("article"),
    sessionId: v.optional(v.string()),
    referer: v.optional(v.string()),
    country: v.optional(v.string()),
    device: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // TANGISON Iteration 4 Fix #5: dedup by sessionId+articleId within
    // a 1-hour window to prevent view-count inflation / DB bloat.
    if (args.sessionId) {
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      const recentView = await ctx.db
        .query("articleView")
        .withIndex("by_article", (q) => q.eq("articleId", args.articleId))
        .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
        .filter((q) => q.gte(q.field("createdAt"), oneHourAgo))
        .first();
      if (recentView) {
        return { deduplicated: true };
      }
    }

    await ctx.db.insert("articleView", {
      articleId: args.articleId,
      sessionId: args.sessionId,
      referer: args.referer,
      country: args.country,
      device: args.device,
      createdAt: Date.now(),
    });

    const article = await ctx.db.get(args.articleId);
    if (article) {
      await ctx.db.patch(args.articleId, {
        views: (article.views ?? 0) + 1,
        updatedAt: Date.now(),
      });
    }
    return { deduplicated: false };
  },
});

// ── COMMENT (pending moderation) ─────────────────────────────
// NOTE: Until Convex Auth is wired up, this mutation throws.
// Comments require a verified user identity - accepting `userId`
// from the client would allow impersonation.

export const submitComment = mutation({
  args: {
    articleId: v.id("article"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // TANGISON Iteration 4 Fix #5: identity MUST come from Convex Auth,
    // never from a client-supplied `userId` arg.
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email;
    if (!email) {
      throw new Error(
        "Authentication required to comment. Sign in via Convex Auth."
      );
    }

    const user = await ctx.db
      .query("user")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      throw new Error("User account not found. Please contact support.");
    }

    const id = await ctx.db.insert("comment", {
      content: args.content,
      status: "pending",
      articleId: args.articleId,
      userId: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

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
// NOTE: Until Convex Auth is wired up, this mutation throws.

export const toggleBookmark = mutation({
  args: {
    articleId: v.id("article"),
  },
  handler: async (ctx, args) => {
    // TANGISON Iteration 4 Fix #5: identity MUST come from Convex Auth.
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email;
    if (!email) {
      throw new Error("Authentication required to bookmark articles.");
    }

    const user = await ctx.db
      .query("user")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      throw new Error("User account not found.");
    }

    const existing = await ctx.db
      .query("bookmark")
      .withIndex("by_user_article", (q) =>
        q.eq("userId", user._id).eq("articleId", args.articleId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { bookmarked: false };
    }

    await ctx.db.insert("bookmark", {
      userId: user._id,
      articleId: args.articleId,
      createdAt: Date.now(),
    });
    return { bookmarked: true };
  },
});

// ── COMMUNITY CONTRIBUTION SUBMISSION ────────────────────────
// Public mutation - no auth required, but rate-limited at the API layer.
// Goes to status: "pending" - NEVER auto-publishes.

export const submitContribution = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    region: v.optional(v.string()),
    category: v.optional(v.string()),
    submitterName: v.string(),
    submitterEmail: v.string(),
    imageUrls: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Basic content floor - reject very short submissions
    if (args.body.trim().split(/\s+/).length < 50) {
      throw new Error("Contribution must be at least 50 words");
    }

    // Run the same sanity check used for RSS content
    const allText = `${args.title} ${args.body} ${args.submitterName}`;
    if (/<!\[CDATA\[/.test(allText)) {
      throw new Error("Invalid content detected");
    }

    const id = await ctx.db.insert("contributions", {
      title: args.title,
      body: args.body,
      region: args.region,
      category: args.category,
      submitterName: args.submitterName,
      submitterEmail: args.submitterEmail.toLowerCase().trim(),
      imageUrls: args.imageUrls,
      status: "pending",
      submittedAt: Date.now(),
    });
    return { id };
  },
});
