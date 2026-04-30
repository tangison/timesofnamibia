// ============================================================
// Times of Namibia — Empty State Component
// Ghost state for pages with no data
// ============================================================

import { Newspaper, Briefcase, FileText, TrendingUp, Search, Inbox } from "lucide-react";

type EmptyStateType = "articles" | "jobs" | "tenders" | "market" | "search" | "generic";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

const CONFIGS: Record<EmptyStateType, { icon: typeof Newspaper; title: string; description: string }> = {
  articles: {
    icon: Newspaper,
    title: "No Articles Available",
    description: "Our editorial team is gathering the latest stories. Check back soon for verified Namibian news.",
  },
  jobs: {
    icon: Briefcase,
    title: "No Job Listings Found",
    description: "The Job Scraper is scanning Namibian employment portals. New positions appear throughout the day.",
  },
  tenders: {
    icon: FileText,
    title: "No Active Tenders",
    description: "Government procurement opportunities are refreshed every 6 hours. Check back for new listings.",
  },
  market: {
    icon: TrendingUp,
    title: "Market Data Unavailable",
    description: "Currency rates and commodity prices are updated hourly during trading hours.",
  },
  search: {
    icon: Search,
    title: "No Results Found",
    description: "Try adjusting your search terms or browse our sections for relevant content.",
  },
  generic: {
    icon: Inbox,
    title: "Nothing Here Yet",
    description: "This section is being populated by the Times OS data engine.",
  },
};

export default function EmptyState({ type = "generic", title, description, action }: EmptyStateProps) {
  const config = CONFIGS[type];
  const Icon = config.icon;

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 text-center">
      {/* Icon */}
      <div className="flex items-center justify-center mb-5">
        <div className="w-16 h-16 border border-ton-black/10 flex items-center justify-center">
          <Icon className="w-8 h-8 text-ton-black/15" />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-ton-black leading-tight">
        {title || config.title}
      </h3>

      {/* Description */}
      <p className="font-serif italic text-ton-black/40 text-sm sm:text-base mt-3 leading-relaxed">
        {description || config.description}
      </p>

      {/* Timestamp */}
      <p className="font-mono text-[8px] text-ton-black/15 uppercase tracking-wider mt-3">
        Times OS — Data engine active
      </p>

      {/* Action */}
      {action && (
        <div className="mt-6">
          <a
            href={action.href}
            className="inline-flex items-center gap-2 bg-ton-black text-ton-cream font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-3 hover:bg-ton-black/90 transition-colors"
          >
            {action.label}
          </a>
        </div>
      )}
    </div>
  );
}
