"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "National", href: "/", highlight: undefined as string | undefined },
  { label: "Economy", href: "/?section=economy", highlight: undefined as string | undefined },
  { label: "The Tender Edge", href: "/tender", highlight: "gold" },
  { label: "Job Scraper", href: "/jobs", highlight: "red" },
  { label: "Legal Desk", href: "/", highlight: undefined as string | undefined },
  { label: "Mining", href: "/", highlight: undefined as string | undefined },
  { label: "Contributors", href: "/contributor", highlight: undefined as string | undefined },
  { label: "Brand", href: "/brand", highlight: undefined as string | undefined },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="ton-navigation bg-ton-black text-ton-cream ton-border-bottom-editorial border-ton-black">
      <div className="max-w-7xl mx-auto flex items-center overflow-x-auto scrollbar-none snap-x snap-mandatory">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href !== "/" && item.href !== "/?section=economy"
              ? pathname.startsWith(item.href)
              : pathname === "/";
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex-shrink-0 px-3 sm:px-4 py-2.5 min-h-[44px] flex items-center font-sans text-xs font-semibold tracking-widest uppercase transition-colors duration-150 border-b-2 whitespace-nowrap snap-start ${
                isActive
                  ? item.highlight === "gold"
                    ? "bg-ton-gold/20 text-ton-gold border-ton-gold"
                    : item.highlight === "red"
                    ? "bg-ton-red/20 text-ton-red border-ton-red"
                    : "bg-ton-cream/10 text-ton-cream border-ton-cream"
                  : "border-transparent text-ton-cream/70 hover:text-ton-cream hover:bg-ton-cream/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
