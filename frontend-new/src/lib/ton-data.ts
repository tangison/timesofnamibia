// ========= TYPES =========

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

// ========= JOBS DATA =========

export const JOBS: Job[] = [];

// ========= TENDER DATA =========

export const TENDERS: Tender[] = [];

// ========= WIRE SUBMISSIONS =========

export const INITIAL_SUBMISSIONS: WireSubmission[] = [];

// ========= TICKER ITEMS =========

export const TICKER_ITEMS = [];

// ========= FEATURED ARTICLE =========

export const FEATURED_ARTICLE = null;
