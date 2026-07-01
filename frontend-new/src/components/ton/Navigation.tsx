const NAV_ITEMS = [
  { label: "National", href: "/", key: "national" },
  { label: "Politics", href: "/section/politics", key: "politics" },
  { label: "Economy", href: "/section/economy", key: "economy" },
  { label: "Mining", href: "/section/mining", key: "mining" },
  { label: "Energy", href: "/section/energy", key: "energy" },
  { label: "Africa", href: "/africa", key: "africa" },
  { label: "World", href: "/world", key: "world" },
  { label: "Sport", href: "/section/sport", key: "sport" },
  { label: "Tenders", href: "/tender", key: "tender" },
  { label: "Jobs", href: "/jobs", key: "jobs" },
  { label: "Environment", href: "/section/environment", key: "environment" },
];

export default function Navigation({ activePage }: { activePage?: string }) {
  return (
    <nav className="ton-navigation bg-ton-cream border-t-2 border-ton-black">
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
                    ? "text-ton-black border-ton-red bg-ton-red/[0.04]"
                    : "border-transparent text-ton-black/40 hover:text-ton-black hover:border-ton-black/20"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
        {/* Thin bottom rule - section divider */}
        <div className="border-b border-ton-black/8" />
      </div>
    </nav>
  );
}
