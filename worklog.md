# Times of Namibia (TON) Web Portal — Worklog

## Date: 2026-04-26

### Summary
Built the complete "Times of Namibia" (TON) web portal — a single-page application with 5 views, all client-side, using Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, Zustand, and Framer Motion.

### Files Created/Modified

1. **`src/app/layout.tsx`** — Updated to load Playfair Display, Inter, and JetBrains Mono via `next/font/google`. Added Sonner toaster for toast notifications.

2. **`src/app/globals.css`** — Complete TON theme with:
   - Custom CSS variables for TON palette (Cream, Black, Red, Gold, Navy)
   - Ticker animation (`ton-ticker` keyframes, 60s linear infinite)
   - Drop cap styling (`ton-dropcap::first-letter`)
   - Column rules with responsive breakpoints
   - Live dot pulse animation
   - Custom scrollbar for data panels
   - Editorial border utilities
   - Comprehensive `@media print` rules (hides non-essential, 3-column layout, BW colors, page breaks)

3. **`src/app/page.tsx`** — Main page assembling Ticker → UtilityNav → Masthead → Navigation → [View] → Footer with Framer Motion AnimatePresence transitions.

4. **`src/lib/ton-store.ts`** — Zustand store managing currentView, jobFilters (region/source), selectedTender, and tenderAnalysisState.

5. **`src/lib/ton-data.ts`** — Complete mock data:
   - 14 jobs across 13 Namibian regions and 4 sources
   - 5 tenders with full analysis data (summary, key dates, compliance)
   - 5 pre-populated wire submissions
   - 13 ticker items including market data
   - Featured article with full content

6. **`src/components/ton/Ticker.tsx`** — Live news ticker with CSS animation, LIVE badge with pulse dot.

7. **`src/components/ton/UtilityNav.tsx`** — Weather, Times OS status, date, edition info.

8. **`src/components/ton/Masthead.tsx`** — Newspaper-style header with TON badge, massive Playfair Display title, tagline, edition info.

9. **`src/components/ton/Navigation.tsx`** — Editorial navigation bar with gold/red highlights for special sections, active state management.

10. **`src/components/ton/HomeView.tsx`** — 3-column newsroom layout:
    - LEFT: Job Scraper sidebar + Tender Edge sidebar
    - CENTER: Main article with drop cap, pull quote, byline
    - RIGHT: Scraped Insights, Market Data, GemsWeb Digital CTA

11. **`src/components/ton/JobScraperPanel.tsx`** — Compact sidebar job scraper with region/source filters, source badges, APPLY NOW buttons.

12. **`src/components/ton/JobScraperView.tsx`** — Full-page job scraper with grid layout, comprehensive filtering, clear filters option.

13. **`src/components/ton/TenderEdgePanel.tsx`** — Gold-themed sidebar with tender listings, status badges, PDF download buttons.

14. **`src/components/ton/TenderAnalysisView.tsx`** — Full-page Tender Analysis Agent with upload zone, simulated analysis (2s), results display with executive summary, key dates, value range, compliance checklist.

15. **`src/components/ton/ContributorDashboard.tsx`** — Journalist submission interface with form (title, category, priority, source, content, verification toggle), SUBMIT WIRE button, recent submissions list with badges.

16. **`src/components/ton/BrandSystemView.tsx`** — Brand documentation with color palette swatches, typography showcase, design philosophy cards, masthead preview.

17. **`src/components/ton/Footer.tsx`** — Black background footer with TON logo, GemsWeb Digital branding, data pipeline links, brand system button.

18. **`next.config.ts`** — Added `allowedDevOrigins` for cross-origin preview support.

### Architecture Decisions
- All data is client-side (no API routes, no Prisma)
- View state managed by Zustand (`useTonStore`)
- Framer Motion AnimatePresence for smooth view transitions
- shadcn/ui components (Select, Badge, Input, Textarea, Switch, Progress, Label) styled to match TON palette
- Responsive design: 3-column → single column on mobile
- Print rules preserve editorial layout

---

## Date: 2026-04-26 (Rebuild)

### Summary
Full rebuild of the TON portal, removing Zustand and converting to real Next.js App Router pages with proper file-based routing. Implemented all brand compliance requirements: grayscale images, no rounded corners, 6-second scraped timestamps, WhatsApp share buttons, TTS/Listen UI hooks, proper text opacity, and comprehensive mobile responsiveness.

### Breaking Changes
- **DELETED** `src/lib/ton-store.ts` — Zustand store removed entirely
- **REMOVED** Framer Motion AnimatePresence transitions (replaced with page navigation)
- All `setView()` calls replaced with Next.js `Link` components or `useRouter().push()`
- All Zustand state replaced with local `useState` hooks

### Files Created

1. **`src/components/ton/TonLayout.tsx`** — Shared layout wrapper (Ticker + UtilityNav + Masthead + Navigation + Footer) used by all pages

2. **`src/components/ton/ScrapedTimestamp.tsx`** — Live-updating 6-second timestamp component for scraped content. Increments every 6 seconds, resets at 60s.

3. **`src/components/ton/ShareButtons.tsx`** — WhatsApp share button (TumaOS) + TTS/Listen button with simulated states: idle → "Synthesizing..." (2s) → "Playing..." (6s) → idle

4. **`src/app/jobs/page.tsx`** — Job Scraper route page

5. **`src/app/tender/page.tsx`** — Tender Analysis route page

6. **`src/app/contributor/page.tsx`** — Contributor Dashboard route page

7. **`src/app/brand/page.tsx`** — Brand System route page

### Files Modified

1. **`src/app/page.tsx`** — Converted from SPA client component to server component wrapping `<TonLayout><HomeView /></TonLayout>`

2. **`src/app/layout.tsx`** — Removed Framer Motion import, simplified to clean root layout with fonts + Toaster

3. **`src/app/globals.css`** — Added:
   - `.ton-article-image` — grayscale(100%) with hover reveal to color
   - `.ton-no-radius` — Forces 0 border-radius for TON Block aesthetic
   - `.scrollbar-none` — Hides scrollbar for mobile nav
   - `.ton-ticker-paused` — Pause state for ticker
   - `.ton-share-btn` — WhatsApp/TumaOS button styles with active scale
   - Responsive drop cap at `@media (max-width: 640px)` — 3rem font size

4. **`src/components/ton/Navigation.tsx`** — Replaced Zustand `currentView`/`setView` with Next.js `Link` + `usePathname()` for active state. Added snap scroll, min-h-[44px] touch targets, hidden items on small screens.

5. **`src/components/ton/Footer.tsx`** — Replaced all `setView()` calls with `Link` from `next/link`. Fixed text opacity to /80 minimum. Added GemsWeb Digital attribution.

6. **`src/components/ton/Ticker.tsx`** — Added tap-to-pause/resume functionality with `useState`. Smaller text on mobile. Accessible with aria-labels.

7. **`src/components/ton/UtilityNav.tsx`** — Responsive text sizing (text-[10px] on mobile), proper hiding of less-critical info on small screens.

8. **`src/components/ton/Masthead.tsx`** — Title scales from text-3xl (mobile) to text-7xl (desktop). LIVE badge always visible. Edition info hides on smallest screens. Added rounded-none to badges.

9. **`src/components/ton/HomeView.tsx`** — Major changes:
   - Replaced Zustand with Link components for navigation
   - Added `ScrapedTimestamp` to mobile job/tender panels
   - Added `ShareButtons` to main article byline area
   - Added `ton-article-image` class for grayscale→color hover effect
   - Mobile: compact job scraper (top 3 jobs with "View All" link)
   - Mobile: compact tender panel (top 2 tenders with "View All" link)
   - Market data: 2-column grid on mobile, table rows on desktop
   - Fixed text opacity: replaced /40, /50 with /80 for readable text
   - Headline upgraded to text-5xl on desktop (300% larger than body)
   - Added `ton-no-radius` and `rounded-none` to all badges/buttons

10. **`src/components/ton/JobScraperPanel.tsx`** — Replaced Zustand with local `useState` for filters. Added `ScrapedTimestamp` and `ShareButtons` to each job. Added `rounded-none` to buttons/badges. GemsWeb Digital attribution.

11. **`src/components/ton/JobScraperView.tsx`** — Replaced Zustand with local `useState` for filters. Replaced `setView("home")` with `Link href="/"`. Added `ScrapedTimestamp` and `ShareButtons`. Mobile: single column cards, full-width apply buttons, stacked filter selects. Job count visible at top. `rounded-none` throughout.

12. **`src/components/ton/TenderEdgePanel.tsx`** — Replaced `setView("tender")` with `Link href="/tender"`. Replaced `setSelectedTender()` state with direct navigation. Added `ScrapedTimestamp` and `ShareButtons`. `rounded-none` on badges/buttons.

13. **`src/components/ton/TenderAnalysisView.tsx`** — Replaced Zustand with local `useState` for selectedTender, tenderAnalysisState, expandedTender. Added `ScrapedTimestamp` and `ShareButtons`. Mobile: compact upload zone, single column results, full-width cards. Back to Newsroom link. `rounded-none` throughout.

14. **`src/components/ton/ContributorDashboard.tsx`** — Confirmed no Zustand imports (already used local useState). Form NOT sticky on mobile (only `lg:sticky`). Full width on mobile. `rounded-none` on form elements. Back to Newsroom link.

15. **`src/components/ton/BrandSystemView.tsx`** — Confirmed no Zustand imports. Mobile: 2-column color swatches, stacked typography, stacked design principles. `rounded-none` throughout. Back to Newsroom link.

### Brand Compliance Checklist
- [x] NO imports from `@/lib/ton-store` anywhere
- [x] NO Zustand usage anywhere
- [x] All navigation uses Next.js `Link` or `useRouter`
- [x] `usePathname()` used in Navigation for active state
- [x] All pages have proper route files
- [x] Grayscale images with hover color reveal (`.ton-article-image`)
- [x] No rounded corners on buttons/badges/cards (TON Block style: `rounded-none`, `ton-no-radius`)
- [x] 6-second `ScrapedTimestamp` on jobs and tenders
- [x] WhatsApp share buttons on article, tenders, jobs (TumaOS)
- [x] TTS/Listen button on main article (simulated: idle → synthesizing → playing)
- [x] Text opacity never below 70% for readable content (`/80` minimum)
- [x] Headlines 300% larger than body text (text-5xl on desktop for H2)
- [x] Perfect mobile responsiveness on ALL views
- [x] `bun run lint` passes with zero errors
- [x] App compiles and serves at localhost:3000 with HTTP 200
- [x] GemsWeb Digital attribution (never "Pty Ltd")

### Verification Results
- `bun run lint` — PASSED (zero errors)
- `GET /` — 200 OK
- `GET /jobs` — 200 OK
- `GET /tender` — 200 OK
- `GET /contributor` — 200 OK
- `GET /brand` — 200 OK
