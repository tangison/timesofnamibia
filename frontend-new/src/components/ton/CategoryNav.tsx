"use client";

/**
 * Category Navigation Bar — sticky below the masthead.
 * On ALL screen sizes, categories are horizontally scrollable.
 * No toggle/menu icon — just a clean scrollable strip.
 * Desktop also shows the "Contribute" button at the end.
 */
const CATEGORIES = [
  { label: "National", slug: "national" },
  { label: "Politics", slug: "politics" },
  { label: "Economy", slug: "economy" },
  { label: "Mining", slug: "mining" },
  { label: "Energy", slug: "energy" },
  { label: "Sport", slug: "sport" },
  { label: "Technology", slug: "technology" },
  { label: "Africa", slug: "africa" },
  { label: "World", slug: "world" },
  { label: "Environment", slug: "environment" },
  { label: "Health", slug: "health" },
  { label: "Opinion", slug: "opinion" },
];

export default function CategoryNav() {
  return (
    <nav className="sticky top-[73px] z-40 bg-ton-cream/95 backdrop-blur-md border-b border-ton-black/10">
      <div className="max-w-7xl mx-auto">
        {/* Scrollable category strip — works on all screen sizes */}
        <div className="flex items-center gap-4 px-4 md:px-8 py-2.5 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.slug}
              href={cat.slug === "africa" ? "/africa" : cat.slug === "world" ? "/world" : `/section/${cat.slug}`}
              className="font-mono text-[11px] font-bold uppercase tracking-widest text-ton-black/60 hover:text-ton-red transition-colors whitespace-nowrap flex-shrink-0"
            >
              {cat.label}
            </a>
          ))}
          {/* Contribute button — desktop only (inline at end of scroll) */}
          <a
            href="/contribute"
            className="hidden lg:inline-flex font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-red text-white px-4 py-1.5 hover:bg-ton-red/80 transition-colors flex-shrink-0"
          >
            Contribute
          </a>
        </div>
      </div>
    </nav>
  );
}
