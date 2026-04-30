# Task 6: Accessibility Fixes for Times of Namibia

## Summary

Fixed 7 categories of accessibility issues across 8 component files as identified in the TON accessibility audit.

## Changes Made

### Task 1: Fix Multiple H1 — Masthead.tsx
- **File**: `src/components/ton/Masthead.tsx`
- **Change**: Replaced `<h1>` with `<div>` for "TIMES OF NAMIBIA" masthead title
- **Reason**: Each page has its own H1 in the content area; the global masthead should not create duplicate H1s

### Task 2: Fix Ticker button label mismatch — Ticker.tsx
- **File**: `src/components/ton/Ticker.tsx`
- **Change**: Updated `aria-label` from `"Resume ticker"` / `"Pause ticker"` to `"Resume live news ticker"` / `"Pause live news ticker"`
- **Reason**: The visible button text says "LIVE" but the aria-label said "Resume/Pause ticker" — no reference to the visible "LIVE" text, causing a label/content name mismatch

### Task 3: Fix SidebarTrigger label mismatch — Sidebar.tsx
- **File**: `src/components/ton/Sidebar.tsx`
- **Changes**:
  - Changed `aria-label="Open navigation"` → `aria-label="Open menu"` (matches visible text "Menu")
  - Changed `aria-label="Close navigation"` → `aria-label="Close menu"` (for consistency)
- **Reason**: Visible text says "Menu" but aria-label said "Open navigation" — label/content name mismatch

### Task 4: Fix ThemeToggle label mismatch — ThemeToggle.tsx
- **File**: `src/components/ton/ThemeToggle.tsx`
- **Changes**:
  - Changed visible text from "Onyx" to "Dark" (to match aria-label terminology)
  - Changed aria-label from `"Switch to light mode"` / `"Switch to dark mode"` to `"Light mode — click to switch to dark"` / `"Dark mode — click to switch to light"`
- **Reason**: Visible text "Onyx" didn't match aria-label "Switch to dark mode"; now both use consistent "Dark/Light mode" terminology

### Task 5: Fix form accessibility — ContactView.tsx
- **File**: `src/components/ton/ContactView.tsx`
- **Changes**: Added `id` and `htmlFor` attributes to link labels with their form controls:
  - Name: `id="contact-name"` / `htmlFor="contact-name"`
  - Email: `id="contact-email"` / `htmlFor="contact-email"`
  - Department (select): `id="contact-category"` / `htmlFor="contact-category"`
  - Message (textarea): `id="contact-message"` / `htmlFor="contact-message"`
- **Reason**: Input fields, select elements, and textareas without programmatically associated labels are inaccessible to screen readers

### Task 6: Fix heading hierarchy issues

**AboutView.tsx**:
- Changed `<h4>` "Broadside Specifications" → `<h3>` (was after H2 section header with no H3 parent, creating a skip)

**HomeView.tsx**:
- Changed `<h4>` job titles → `<h3>` (sidebar items, no H2/H3 parent heading; span headers are not semantic headings)
- Changed `<h4>` tender titles → `<h3>` (same reason)

**TenderAnalysisView.tsx**:
- Changed `<h3>` "Upload Tender Document" → `<h2>` (follows H1, was skipping H2)
- Changed `<h3>` "Analyzing..." → `<h2>` (follows H1, was skipping H2)
- Changed `<h3>` "Analysis Complete" → `<h2>` (follows H1, was skipping H2)
- Changed `<h4>` "Executive Summary" → `<h3>` (follows H2, was skipping H3)
- Changed `<h4>` "Key Dates & Deadlines" → `<h3>` (follows H2, was skipping H3)
- Changed `<h4>` "Estimated Value Range" → `<h3>` (follows H2, was skipping H3)
- Changed `<h4>` "Compliance Requirements Checklist" → `<h3>` (follows H2, was skipping H3)

### Task 7: Fix table accessibility — BusinessPlanView.tsx
- **File**: `src/components/ton/BusinessPlanView.tsx`
- **Changes**: Added `<caption className="sr-only">` to both tables:
  - Regional Node Deployment table: `"Regional Node Deployment — Status and scraping frequency across Namibian regions"`
  - Financial Projections table: `"Financial Projections — Revenue and operational status by period"`
- **Reason**: Tables without accessible names are not announced properly by screen readers; `sr-only` captions are visually hidden but accessible

## Verification

- ESLint passed with no errors
- Dev server compiles successfully with no errors
