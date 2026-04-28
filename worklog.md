---
Task ID: 3
Agent: Main Agent
Task: TON Anti-AI Redesign + Business Plan + The Plan + Brand TON-GI Integration

Work Log:
- Removed Navigation from TonLayout header — navigation now lives exclusively in the footer
- Redesigned Footer to include navigation section with activePage highlighting + mobile-responsive grid
- Simplified Masthead — removed decorative TON badge, LIVE badge, horizontal rules; pure typographic authority
- Simplified UtilityNav — reduced to single-line minimal info, removed Cloud/Wifi icons
- Overhauled HomeView — removed Unsplash stock images, replaced with imagery descriptions with GPS watermarks
- Applied anti-AI aesthetic: reduced opacity values (text-ton-black/60 → text-ton-black/40), subtler borders (/10 → /8), smaller font sizes on metadata
- Completely rewrote BusinessPlanView — 5-page A4 print-ready document with downloadable HTML button
- Business Plan includes all content from provided HTML template: Manifesto, Key Pillars, Operations, Times OS specs, Financial Roadmap, Print Materials, Broadside specs, Social Output, Final Directive, Signatory Block
- Standalone HTML download function generates a complete self-contained HTML file matching the original template
- Enhanced ThePlanView — added downloadable HTML button, newspaper layout descriptions for each phase (Broadside A3 layout, Digital Telegram template, Display Stand specification, API Documentation booklet, Premium Archive Annual Compilation)
- Added TON-GI System Prompt content to BrandSystemView clipboard copy output (generateBrandSystemText)
- Added visible TON-GI section to Brand System page with all 5 sections displayed in a black box
- Updated print CSS to remove ton-footer and ton-navigation from print exclusion
- All pages build successfully and return HTTP 200

Stage Summary:
- 10 files modified: TonLayout, Footer, Masthead, UtilityNav, HomeView, BusinessPlanView, ThePlanView, BrandSystemView, JobScraperView, TenderAnalysisView, ContributorDashboard, globals.css
- Navigation moved from header to footer
- All stock images removed — replaced with described imagery + GPS watermarks
- Business Plan is downloadable as standalone HTML and print-ready PDF
- The Plan is downloadable as standalone HTML and print-ready PDF
- TON-GI system prompt integrated into brand copy and visible on brand page
- Anti-AI redesign: less uniform spacing, subtler borders, reduced opacity, smaller metadata text
