"use client";

import React from "react";
import SourceBadge, { BadgeType } from "./SourceBadge";
import { ArrowLeft, MapPin } from "lucide-react";

interface AfricaArticle {
  headline: string;
  source: string;
  timestamp: string;
  category: string;
  badge: BadgeType;
}

interface AfricaRegion {
  name: string;
  slug: string;
  featured?: boolean;
  articles: AfricaArticle[];
  gps: string;
  imageDesc: string;
}

const REGIONS: AfricaRegion[] = [
  {
    name: "Southern Africa",
    slug: "southern-africa",
    featured: true,
    gps: "22.57 S, 17.08 E",
    imageDesc:
      "Aerial photograph of the Windhoek skyline at first light, shot from the Khomas Hochland plateau. Grayscale. The city grid emerges from darkness in sharp geometric lines, with the Auas Mountains silhouetted behind. GPS overlay: WINDHOEK // 22.57 S, 17.08 E. Timestamp in JetBrains Mono within a black box at bottom-left. No colour. No people. Just structure and dawn.",
    articles: [
      {
        headline: "Namibia records 3.8% GDP growth in Q1 — BoN preliminary data",
        source: "Bank of Namibia",
        timestamp: "2h ago",
        category: "Economy",
        badge: "OFFICIAL",
      },
      {
        headline: "South Africa load-shedding suspended as Kusile units return",
        source: "Eskom",
        timestamp: "4h ago",
        category: "Energy",
        badge: "OFFICIAL",
      },
      {
        headline: "Botswana diamond revenue surges 18% on rough stone demand",
        source: "Mmegi Online",
        timestamp: "6h ago",
        category: "Mining",
        badge: "VERIFIED",
      },
      {
        headline: "Mozambique LNG project resumes after force majeure lifted",
        source: "Reuters Africa",
        timestamp: "8h ago",
        category: "Energy",
        badge: "DEVELOPING",
      },
    ],
  },
  {
    name: "West Africa",
    slug: "west-africa",
    gps: "6.52 N, 3.38 E",
    imageDesc:
      "Aerial of the Lagos lagoon and Third Mainland Bridge at dusk. Grayscale. The bridge stretches across the lagoon with the Lagos Island skyline in the background. GPS overlay: LAGOS // 6.52 N, 3.38 E. JetBrains Mono timestamp. No colour. No people. Just concrete and water.",
    articles: [
      {
        headline: "Nigeria central bank holds interest rate at 24.75%",
        source: "CBN",
        timestamp: "3h ago",
        category: "Economy",
        badge: "OFFICIAL",
      },
      {
        headline: "Ghana completes $3bn IMF programme second review",
        source: "Graphic Online",
        timestamp: "5h ago",
        category: "Economy",
        badge: "VERIFIED",
      },
      {
        headline: "ECOWAS deploys election observers to Senegal",
        source: "ECOWAS Commission",
        timestamp: "7h ago",
        category: "Politics",
        badge: "OFFICIAL",
      },
    ],
  },
  {
    name: "East Africa",
    slug: "east-africa",
    gps: "1.29 S, 36.82 E",
    imageDesc:
      "Dawn aerial of Nairobi Central Business District. Grayscale. Kenyatta Avenue cuts through the frame with the Kenyatta International Conference Centre tower in sharp focus. GPS overlay: NAIROBI // 1.29 S, 36.82 E. JetBrains Mono timestamp. No colour. No people. Just glass and green.",
    articles: [
      {
        headline: "Kenya digital services tax generates KES 42bn in first year",
        source: "Kenya Revenue Authority",
        timestamp: "4h ago",
        category: "Economy",
        badge: "OFFICIAL",
      },
      {
        headline: "Tanzania inaugurates SGR phase two connecting Dodoma",
        source: "Daily Nation",
        timestamp: "6h ago",
        category: "Infrastructure",
        badge: "VERIFIED",
      },
      {
        headline: "Ethiopia peace talks resume in Addis Ababa after Tigray aid corridor opens",
        source: "ENA",
        timestamp: "1h ago",
        category: "Conflict",
        badge: "DEVELOPING",
      },
      {
        headline: "Rwanda launches AI-powered agricultural monitoring system",
        source: "The New Times",
        timestamp: "9h ago",
        category: "Technology",
        badge: "VERIFIED",
      },
    ],
  },
  {
    name: "Central Africa",
    slug: "central-africa",
    gps: "4.36 S, 15.35 E",
    imageDesc:
      "Aerial photograph of the Congo River at Kinshasa. Grayscale. The vast brown river stretches across the frame with barge traffic visible. The city sprawls along the south bank. GPS overlay: KINSHASA // 4.36 S, 15.35 E. JetBrains Mono timestamp in a black box. No colour. No people. Just water and earth.",
    articles: [
      {
        headline: "DRC mining code amendments enter parliamentary committee stage",
        source: "Radio Okapi",
        timestamp: "5h ago",
        category: "Mining",
        badge: "DEVELOPING",
      },
      {
        headline: "Cameroon doubles cocoa processing capacity with new Douala plant",
        source: "Cameroon Tribune",
        timestamp: "8h ago",
        category: "Agriculture",
        badge: "VERIFIED",
      },
      {
        headline: "Gabon transitions to civilian-led government — AU statement",
        source: "African Union",
        timestamp: "3h ago",
        category: "Politics",
        badge: "OFFICIAL",
      },
    ],
  },
  {
    name: "North Africa",
    slug: "north-africa",
    gps: "36.80 N, 10.18 E",
    imageDesc:
      "Aerial of the Tunis medina and Lake of Tunis at sunset. Grayscale. The ancient walled city contrasts with the modern port infrastructure across the water. GPS overlay: TUNIS // 36.80 N, 10.18 E. JetBrains Mono timestamp. No colour. No people. Just stone and salt.",
    articles: [
      {
        headline: "Morocco renewable energy hits 42% of total capacity — ONEE data",
        source: "ONEE",
        timestamp: "2h ago",
        category: "Energy",
        badge: "OFFICIAL",
      },
      {
        headline: "Egypt devaluation pressures ease as Suez Canal revenues stabilise",
        source: "Ahram Online",
        timestamp: "4h ago",
        category: "Economy",
        badge: "ANALYSIS",
      },
      {
        headline: "Algeria signs €4bn hydrogen partnership with European consortium",
        source: "APS",
        timestamp: "6h ago",
        category: "Energy",
        badge: "VERIFIED",
      },
    ],
  },
];

export default function AfricaView() {
  const southernAfrica = REGIONS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div>
          <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
            Africa Desk // Continental Coverage
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
            Africa News
          </h1>
          <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
            Continental coverage from Windhoek. Verified. Timestamped. Every source carries its proof.
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <a
            href="/"
            className="font-mono text-[10px] text-ton-black/40 hover:text-ton-black transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3 h-3" />
            Newsroom
          </a>
        </div>
      </div>

      {/* Namibia Callout */}
      <div className="mb-8 sm:mb-10 bg-ton-black text-ton-cream p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <MapPin className="w-4 h-4 text-ton-red" />
          <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
            Our Home // Southern Africa
          </span>
        </div>
        <p className="font-serif text-base sm:text-lg text-ton-cream/80 leading-relaxed mb-2">
          This is our home. Southern Africa coverage powered by Times OS v2.1 with 14 dedicated
          regional nodes.
        </p>
        <p className="font-sans text-xs text-ton-cream/40 leading-relaxed">
          Windhoek serves as the primary data collection hub for the Southern Africa desk. Every
          article is sourced through the same 3-point verification matrix that governs all TON
          reporting. No exceptions. No shortcuts.
        </p>
      </div>

      {/* Featured Region — Southern Africa — 3-Column Layout */}
      <div className="mb-8 sm:mb-10 border-t-4 border-ton-red pt-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-ton-red text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold">
            Featured
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            {southernAfrica.name}
          </h2>
          <span className="font-mono text-[8px] text-ton-red font-bold tracking-widest uppercase">
            Home Region
          </span>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left — Main article */}
          <div className="md:col-span-7 ton-column-rule pr-0 md:pr-5">
            <article>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-ton-red text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold">
                  {southernAfrica.articles[0].category}
                </span>
                <SourceBadge type={southernAfrica.articles[0].badge} />
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-ton-black leading-tight">
                {southernAfrica.articles[0].headline}
              </h3>

              {/* Image description */}
              <div className="mt-4 bg-ton-black/[0.03] aspect-[16/9] relative overflow-hidden border border-ton-black/8">
                <div className="absolute inset-0 flex items-center justify-center px-8">
                  <p className="font-serif text-sm text-ton-black/25 italic text-center leading-relaxed max-w-lg">
                    {southernAfrica.imageDesc}
                  </p>
                </div>
                <div className="absolute bottom-2 left-2 bg-ton-black text-ton-cream px-2 py-1">
                  <p className="font-mono text-[7px] sm:text-[8px] leading-tight">
                    SOUTHERN AFRICA // {southernAfrica.gps}
                    <br />
                    2026-04-28 14:32:07 CAT
                  </p>
                </div>
              </div>

              <div className="mt-3 pb-3 border-b border-ton-black/8 flex items-center justify-between">
                <span className="font-sans text-xs text-ton-black/60">
                  {southernAfrica.articles[0].source}
                </span>
                <span className="font-mono text-[10px] text-ton-black/25">
                  {southernAfrica.articles[0].timestamp}
                </span>
              </div>
            </article>
          </div>

          {/* Right — remaining Southern Africa articles */}
          <div className="md:col-span-5 pl-0 md:pl-5 mt-5 md:mt-0">
            <div className="border-t-2 border-ton-red pt-2 mb-3">
              <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-ton-red">
                More from {southernAfrica.name}
              </span>
            </div>
            <div className="space-y-0">
              {southernAfrica.articles.slice(1).map((article, i) => (
                <div
                  key={i}
                  className={`py-3 ${i > 0 ? "border-t border-ton-black/5" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[8px] text-ton-black/30 uppercase tracking-wider">
                      {article.category}
                    </span>
                    <SourceBadge type={article.badge} />
                  </div>
                  <h4 className="font-serif text-sm sm:text-base font-semibold text-ton-black leading-snug">
                    {article.headline}
                  </h4>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-sans text-[10px] text-ton-black/35">
                      {article.source}
                    </span>
                    <span className="font-mono text-[9px] text-ton-black/25">
                      {article.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Other Regions */}
      {REGIONS.slice(1).map((region, rIdx) => (
        <section
          key={region.slug}
          className={`border-t-4 border-ton-black pt-6 ${rIdx < REGIONS.length - 2 ? "mb-8 sm:mb-10" : ""}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
              {region.name}
            </h2>
            <span className="font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
              {region.articles.length} articles
            </span>
          </div>
          <div className="h-px bg-ton-black/8 mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Region image */}
            <div className="md:col-span-4 ton-column-rule pr-0 md:pr-5 mb-4 md:mb-0">
              <div className="bg-ton-black/[0.03] aspect-[4/3] relative overflow-hidden border border-ton-black/8">
                <div className="absolute inset-0 flex items-center justify-center px-5">
                  <p className="font-serif text-xs text-ton-black/20 italic text-center leading-relaxed">
                    {region.imageDesc}
                  </p>
                </div>
                <div className="absolute bottom-2 left-2 bg-ton-black text-ton-cream px-2 py-1">
                  <p className="font-mono text-[7px] leading-tight">
                    {region.slug.toUpperCase().replace(/-/g, " ")} {"// "} {region.gps}
                    <br />
                    2026-04-28 14:32:07 CAT
                  </p>
                </div>
              </div>
            </div>

            {/* Region articles */}
            <div className="md:col-span-8 pl-0 md:pl-5">
              <div className="space-y-0">
                {region.articles.map((article, i) => (
                  <div
                    key={i}
                    className={`py-3 ${i > 0 ? "border-t border-ton-black/5" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-ton-red text-white font-mono text-[8px] tracking-widest uppercase px-1.5 py-0.5 font-bold">
                        {article.category}
                      </span>
                      <SourceBadge type={article.badge} />
                    </div>
                    <h4 className="font-serif text-sm sm:text-base font-semibold text-ton-black leading-snug">
                      {article.headline}
                    </h4>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="font-sans text-[10px] text-ton-black/35">
                        {article.source}
                      </span>
                      <span className="font-mono text-[9px] text-ton-black/25">
                        {article.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
            <span>{region.name} {"//"} Africa Desk</span>
            <span>&copy; GemsWeb Digital</span>
          </div>
        </section>
      ))}

      {/* Closing Statement */}
      <div className="mt-8 sm:mt-10 py-8 sm:py-10 text-center border-t border-b border-ton-black">
        <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
          Africa Desk
        </span>
        <blockquote className="font-serif italic text-lg sm:text-xl md:text-2xl text-ton-black/40 leading-relaxed mt-3 max-w-2xl mx-auto">
          From Windhoek to the continent. Every story verified, timestamped, and sourced. This is
          Africa, covered from home.
        </blockquote>
        <p className="font-mono text-[10px] text-ton-black/25 mt-3 tracking-wider">
          14 Regional Nodes — Times OS v2.1 — GemsWeb Digital
        </p>
      </div>
    </div>
  );
}
