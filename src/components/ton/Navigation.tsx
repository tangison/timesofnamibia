const NAV_ITEMS = [
  { label: "National", href: "/", key: "national" },
  { label: "Economy", href: "/?section=economy", key: "economy" },
  { label: "The Tender Edge", href: "/tender", key: "tender" },
  { label: "Job Scraper", href: "/jobs", key: "jobs" },
  { label: "Legal Desk", href: "/", key: "legal" },
  { label: "Mining", href: "/", key: "mining" },
  { label: "Contributors", href: "/contributor", key: "contributor" },
  { label: "Brand", href: "/brand", key: "brand" },
];

export default function Navigation({ activePage }: { activePage?: string }) {
  return (
    <nav className="ton-navigation ton-rule-top bg-ton-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center overflow-x-auto scrollbar-none snap-x snap-mandatory -mx-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === activePage;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex-shrink-0 px-3 sm:px-4 py-3 min-h-[44px] flex items-center font-sans text-[11px] sm:text-xs font-semibold tracking-widest uppercase transition-colors duration-150 border-b-2 whitespace-nowrap snap-start ${
                  isActive
                    ? "text-ton-red border-ton-red"
                    : "border-transparent text-ton-black/50 hover:text-ton-black hover:border-ton-black/30"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
