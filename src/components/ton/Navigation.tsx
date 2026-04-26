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
    <nav className="ton-navigation ton-rule-top bg-ton-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center overflow-x-auto scrollbar-none snap-x snap-mandatory -mx-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href !== "/" && item.href !== "/?section=economy"
                ? pathname.startsWith(item.href)
                : pathname === "/";
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex-shrink-0 px-3 sm:px-4 py-3 min-h-[44px] flex items-center font-sans text-[11px] sm:text-xs font-semibold tracking-widest uppercase transition-colors duration-150 border-b-2 whitespace-nowrap snap-start ${
                  isActive
                    ? item.highlight === "gold"
                      ? "text-ton-gold border-ton-gold"
                      : item.highlight === "red"
                      ? "text-ton-red border-ton-red"
                      : "text-ton-black border-ton-black"
                    : "border-transparent text-ton-black/50 hover:text-ton-black hover:border-ton-black/30"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
