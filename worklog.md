---
Task ID: 1
Agent: Super Z (main)
Task: Rebuild Times of Namibia portal with open editorial spacing (not boxed), real pages, no Zustand

Work Log:
- Initialized Next.js project with fullstack-dev skill
- Read all existing component files to understand current architecture
- Rewrote globals.css: removed heavy `ton-border-editorial` (4px solid) box styles, added refined `.ton-rule-top`, `.ton-rule-bottom`, `.ton-rule-accent`, `.ton-rule-gold` for subtle editorial rules, enhanced `.ton-section` spacing system
- Rebuilt Masthead: more generous vertical padding (py-6 to py-10), 300% headline scaling (text-4xl to text-8xl), refined badge spacing
- Rebuilt Navigation: clean cream background with thin top border, subtle active states, softer inactive text color
- Rebuilt Ticker: unchanged core behavior, refined visual weight
- Rebuilt UtilityNav: reduced visual weight with text-ton-black/50
- Rebuilt TonLayout: clean flex column, no changes needed to structure
- Rebuilt Footer: generous vertical padding (py-10 to py-14), more spacing between sections, refined opacity levels
- Rebuilt HomeView: replaced all `ton-border-editorial` boxes with open sections separated by subtle `border-ton-black/5` dividers, removed white card containers, 3-column layout with clean column rules, generous spacing between sections (py-3 per item, mb-4 between groups)
- Rebuilt JobScraperView: replaced boxed grid with open vertical list (`divide-y divide-ton-black/5`), each job as a spacious row with generous padding (py-5 to py-6), hover effect with subtle bg-white/60
- Rebuilt JobScraperPanel: clean open list for sidebar
- Rebuilt TenderEdgePanel: clean open list without container boxes
- Rebuilt TenderAnalysisView: open page layout with spacious sections, thin dividers, dashed upload zone border, generous padding
- Rebuilt ContributorDashboard: open form + feed layout, clean dividers, spacious wire list items
- Rebuilt BrandSystemView: open showcase with border-t separators, generous section spacing
- Rebuilt ShareButtons and ScrapedTimestamp: refined opacity levels for subtlety
- Fixed border-l-3 → border-l-[3px] for Tailwind v4 compatibility
- Ran lint — clean
- Tested all 5 routes — all return 200

Stage Summary:
- All pages rebuilt with open, nicely-spaced editorial layout
- Removed all "boxed" feeling — no more 4px solid borders on every section
- Replaced with thin dividers (border-ton-black/5), generous whitespace, and subtle section separations
- Content breathes naturally on cream background
- Mobile responsive: sections stack cleanly, generous touch targets
- No Zustand — real Next.js pages with App Router
- All 5 routes working: /, /jobs, /tender, /contributor, /brand
