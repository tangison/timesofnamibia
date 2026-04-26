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
