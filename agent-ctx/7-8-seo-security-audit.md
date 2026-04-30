# Task 7-8: SEO & Security Audit Fixes

## Summary
Fixed four audit findings for the Times of Namibia (TON) news portal:
1. No XML sitemap → Created dynamic sitemap
2. No Content-Security-Policy header → Added security headers
3. No X-Frame-Options header → Added security headers
4. Source maps exposed in production → Disabled production source maps

## Changes Made

### 1. Created `src/app/sitemap.ts`
- Generates a dynamic XML sitemap using Next.js MetadataRoute API
- Includes 17 static pages (home, world, africa, tender, jobs, about, contact, brand, gemsweb, contributor, plan, privacy, terms, editorial-standards, accessibility, business-plan, documents)
- Dynamically fetches up to 500 published articles via `getArticles()` and adds them with slug-based URLs
- Gracefully falls back to static pages only if article fetch fails
- Proper `lastModified`, `changeFrequency`, and `priority` values per page type

### 2. Updated `public/robots.txt`
- Preserved existing bot-specific rules (Googlebot, Bingbot, Twitterbot, facebookexternalhit)
- Added `Disallow: /api/` to the catch-all `User-agent: *` section to prevent crawling of API routes
- Added `Sitemap: https://timesofnamibia.com/sitemap.xml` reference

### 3. Updated `next.config.ts`
- Added `productionBrowserSourceMaps: false` to prevent source map exposure in production builds
- Added `headers()` function with security headers applied to all routes:
  - `X-Frame-Options: DENY` — prevents clickjacking
  - `X-Content-Type-Options: nosniff` — prevents MIME type sniffing
  - `Referrer-Policy: strict-origin-when-cross-origin` — controls referrer information
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()` — disables sensitive browser APIs
  - `X-XSS-Protection: 1; mode=block` — enables XSS filter
  - `Content-Security-Policy` — comprehensive CSP with frame-ancestors 'none'

## Files Modified
- `src/app/sitemap.ts` (new)
- `public/robots.txt` (updated)
- `next.config.ts` (updated)
