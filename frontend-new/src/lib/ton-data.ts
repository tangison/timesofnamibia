// ============================================================
// Times of Namibia - TON-specific data + types (TANGISON)
//
// TANGISON Iteration 4 Fix #14: This file previously defined a
// DIVERGENT type system (different field names + types from data.ts
// and dataConvex.ts). It now imports the canonical types from
// @/lib/types and only keeps the TON-specific constants + initial data.
//
// The local Job/Tender/WireSubmission interfaces below are kept for
// backwards compat with components that use slightly different shapes
// (e.g. Tender.deadline: string vs Date). New code should import from
// @/lib/types instead.
// ============================================================

// ========= TYPES (legacy - prefer @/lib/types) =========

/**
 * @deprecated Use `Job` from @/lib/types instead.
 * This legacy type uses `region: string` (non-nullable) and a strict
 * source union - kept only for backwards compat with JobScraperView.
 */
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  region: string;
  source: "LinkedIn" | "NIEIS" | "NamibiaJobs" | "CareerPortal";
  postedAgo: string;
  salary?: string;
  type: string;
  url: string;
}

/**
 * @deprecated Use `Tender` from @/lib/types instead.
 * This legacy type uses `deadline: string` and flat array fields -
 * kept only for backwards compat with TenderAnalysisView.
 */
export interface Tender {
  id: string;
  docId: string;
  title: string;
  department: string;
  deadline: string;
  estimatedValue: string;
  summary: string[];
  keyDates: string[];
  compliance: string[];
  status: "open" | "closing" | "closed";
}

/**
 * @deprecated Use `WireSubmission` from @/lib/types instead.
 * This legacy type uses `timestamp: string` and required `author` -
 * kept only for backwards compat with ContributorDashboard.
 */
export interface WireSubmission {
  id: string;
  title: string;
  category: string;
  priority: "routine" | "urgent" | "breaking";
  source: string;
  content: string;
  verified: boolean;
  timestamp: string;
  author: string;
}

// ========= REGIONS =========

export const NAMIBIA_REGIONS = [
  "Khomas",
  "Erongo",
  "Otjozondjupa",
  "Kunene",
  "Oshana",
  "Hardap",
  "//Kharas",
  "Zambezi",
  "Ohangwena",
  "Omusati",
  "Oshikoto",
  "Kavango East",
  "Kavango West",
];

export const JOB_SOURCES: Job["source"][] = [
  "LinkedIn",
  "NIEIS",
  "NamibiaJobs",
  "CareerPortal",
];

// ========= INITIAL DATA (empty - populated at runtime via Convex) =========

export const JOBS: Job[] = [];

export const TENDERS: Tender[] = [];

export const INITIAL_SUBMISSIONS: WireSubmission[] = [];

export const TICKER_ITEMS: never[] = [];

export const FEATURED_ARTICLE = null;
