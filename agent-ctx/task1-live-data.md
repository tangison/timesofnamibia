# Task: Update TON Frontend to Use Live Database Data

## Summary
Updated the TON frontend to fetch and display live database data instead of hardcoded mock data from `@/lib/ton-data`. Created article detail page with broadsheet editorial styling.

## Files Modified
1. **`src/app/page.tsx`** — Changed from importing static `HomeView` to a server component that fetches live data using `getFeaturedArticle()`, `getArticles()`, `getJobs()`, `getTenders()`, and `getMarketData()` from `@/lib/data`. Added `export const dynamic = "force-dynamic"`.

2. **`src/components/ton/HomeView.tsx`** — Replaced hardcoded imports from `@/lib/ton-data` with typed props. Updated interfaces to match Prisma model shapes (category is `{ id, name, slug } | null`). Added `formatDate()` and `formatTimeAgo()` helpers. Handled null `featuredArticle`. "News in Brief" section now uses `recentArticles` prop with links to `/article/[slug]`. Market data uses `marketData` prop. Category badge renders `article.category?.name || article.categorySlug || "News"`. GPS watermark uses `article.imageGps`. Date formatted with "en-GB" locale.

3. **`src/app/article/[slug]/page.tsx`** — New server component with `dynamic = "force-dynamic"`. Fetches article by slug using `getArticleBySlug()`. Calls `notFound()` if not found. Renders `ArticleView` inside `TonLayout`.

4. **`src/components/ton/ArticleView.tsx`** — New client component for article detail page in broadsheet editorial style. Features: category badge (bg-ton-red), large headline (font-serif, text-3xl to text-5xl), subheadline (italic, muted), author line + date + reading time, content with drop-cap on first paragraph, source attribution badge for RSS-sourced articles, share buttons, GPS watermark overlay, back link.

## Design Decisions
- All existing CSS classes, layout structure, and visual design preserved exactly
- No `next/link` used — plain `<a href>` only per project rules
- No rounded corners (TON brand)
- Fallback UI for empty states (no articles, no market data)
- "We cannot drink hydrogen" pull quote kept hardcoded as editorial content
