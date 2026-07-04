
/**
 * Category Navigation Bar - sticky below the masthead.
 * Pure white background. Horizontally scrollable on ALL screen sizes.
 * No toggle, no hamburger, no collapse - just a clean scrollable strip.
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
    <nav className="sticky top-[73px] z-40 bg-white border-b border-ton-black/10">
      <div className="max-w-7xl mx-auto">
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
          <a
            href="/know-namibia"
            className="font-mono text-[11px] font-bold uppercase tracking-widest text-ton-red hover:text-ton-black transition-colors whitespace-nowrap flex-shrink-0 border-l border-ton-black/10 pl-4"
          >
            Know Namibia
          </a>
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
