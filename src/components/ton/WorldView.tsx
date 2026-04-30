"use client";

import React from "react";
import SourceBadge, { BadgeType } from "./SourceBadge";
import Breadcrumbs from "./Breadcrumbs";
import { ArrowLeft, Globe } from "lucide-react";

interface WorldArticle {
  headline: string;
  source: string;
  timestamp: string;
  category: string;
  badge: BadgeType;
  gps?: string;
  imageDesc?: string;
}

interface WorldRegion {
  name: string;
  slug: string;
  articles: WorldArticle[];
  gps: string;
  imageDesc: string;
}

const REGIONS: WorldRegion[] = [
  {
    name: "Americas",
    slug: "americas",
    gps: "38.90 N, 77.04 W",
    imageDesc:
      "Aerial view of the Washington D.C. National Mall at dawn. Grayscale. The Lincoln Memorial reflecting pool stretches toward the Washington Monument, shot from 800m altitude. Early morning fog hangs over the Potomac. GPS overlay at bottom-left in a black box: WASHINGTON D.C. // 38.90 N, 77.04 E. JetBrains Mono timestamp. No colour. No people. Just stone and water.",
    articles: [
      {
        headline: "U.S. Federal Reserve holds rates steady amid inflation concerns",
        source: "Reuters",
        timestamp: "3h ago",
        category: "Economy",
        badge: "OFFICIAL",
      },
      {
        headline: "Brazilian Congress passes landmark Indigenous land rights bill",
        source: "Agência Brasil",
        timestamp: "5h ago",
        category: "Politics",
        badge: "VERIFIED",
      },
      {
        headline: "Canada unveils C$12bn clean energy corridor for northern provinces",
        source: "Globe and Mail",
        timestamp: "8h ago",
        category: "Infrastructure",
        badge: "VERIFIED",
      },
      {
        headline: "Argentina peso stabilises after IMF tranche approval",
        source: "Bloomberg",
        timestamp: "1h ago",
        category: "Markets",
        badge: "DEVELOPING",
      },
    ],
  },
  {
    name: "Europe",
    slug: "europe",
    gps: "48.86 N, 2.35 E",
    imageDesc:
      "High-contrast aerial of central Paris at first light. Grayscale. The Seine curves through the frame with Pont Neuf in sharp focus. Rooftops of the Marais district in the foreground. GPS overlay: PARIS // 48.86 N, 2.35 E. Timestamp in JetBrains Mono within a black rectangular box at bottom-left. No colour. No people. Just iron and stone.",
    articles: [
      {
        headline: "EU Parliament votes to expand digital sovereignty framework",
        source: "Euractiv",
        timestamp: "2h ago",
        category: "Technology",
        badge: "OFFICIAL",
      },
      {
        headline: "UK inflation falls to 2.1% — lowest since 2021",
        source: "Financial Times",
        timestamp: "4h ago",
        category: "Economy",
        badge: "VERIFIED",
      },
      {
        headline: "Germany announces €8bn rail modernisation programme",
        source: "Deutsche Welle",
        timestamp: "6h ago",
        category: "Infrastructure",
        badge: "VERIFIED",
      },
    ],
  },
  {
    name: "Asia",
    slug: "asia",
    gps: "35.68 N, 139.69 E",
    imageDesc:
      "Night aerial of the Tokyo-Yokohama corridor. Grayscale. The expressway system glows in white light against the dark urban mass, with Tokyo Bay visible to the south. GPS overlay: TOKYO // 35.68 N, 139.69 E. Timestamp in JetBrains Mono within a black rectangular box. No colour. No people. Just light and structure.",
    articles: [
      {
        headline: "Japan BOJ signals potential rate adjustment in Q3 briefing",
        source: "Nikkei Asia",
        timestamp: "1h ago",
        category: "Markets",
        badge: "ANALYSIS",
      },
      {
        headline: "India surpasses 1.5bn population milestone — UN data",
        source: "UN DESA",
        timestamp: "7h ago",
        category: "Demographics",
        badge: "OFFICIAL",
      },
      {
        headline: "South Korea and ASEAN finalise expanded trade corridor agreement",
        source: "Yonhap",
        timestamp: "9h ago",
        category: "Trade",
        badge: "VERIFIED",
      },
      {
        headline: "China semiconductor output rises 14% year-on-year",
        source: "Caixin",
        timestamp: "3h ago",
        category: "Technology",
        badge: "VERIFIED",
      },
    ],
  },
  {
    name: "Middle East",
    slug: "middle-east",
    gps: "25.20 N, 55.27 E",
    imageDesc:
      "Aerial photograph of the Dubai skyline at dusk. Grayscale. The Burj Khalifa dominates the frame, shot from 600m altitude with the Sheikh Zayed Road corridor stretching south. GPS overlay: DUBAI // 25.20 N, 55.27 E. JetBrains Mono timestamp in a black box. No colour. No people. Just glass and geometry.",
    articles: [
      {
        headline: "Saudi Aramco reports Q1 revenue decline amid OPEC+ production cuts",
        source: "Arab News",
        timestamp: "5h ago",
        category: "Energy",
        badge: "VERIFIED",
      },
      {
        headline: "UAE launches AI-driven government services platform",
        source: "Gulf News",
        timestamp: "2h ago",
        category: "Technology",
        badge: "OFFICIAL",
      },
      {
        headline: "Israel-Hamas ceasefire negotiations resume in Doha",
        source: "Al Jazeera",
        timestamp: "45m ago",
        category: "Conflict",
        badge: "DEVELOPING",
      },
    ],
  },
  {
    name: "Oceania",
    slug: "oceania",
    gps: "33.87 S, 151.21 E",
    imageDesc:
      "Dawn aerial of Sydney Harbour. Grayscale. The Harbour Bridge and Opera House are captured in sharp relief against the morning sky, with ferries tracing white lines across the water. GPS overlay: SYDNEY // 33.87 S, 151.21 E. JetBrains Mono timestamp. No colour. No people. Just water and steel.",
    articles: [
      {
        headline: "Australia RBA holds cash rate at 4.35% for sixth consecutive meeting",
        source: "ABC News AU",
        timestamp: "4h ago",
        category: "Economy",
        badge: "OFFICIAL",
      },
      {
        headline: "New Zealand releases freshwater reform package targeting agricultural runoff",
        source: "RNZ",
        timestamp: "6h ago",
        category: "Environment",
        badge: "VERIFIED",
      },
      {
        headline: "Pacific Islands Forum secures A$200m climate resilience fund",
        source: "PIF Secretariat",
        timestamp: "8h ago",
        category: "Climate",
        badge: "OFFICIAL",
      },
    ],
  },
];

export default function WorldView() {
  const featuredRegion = REGIONS[0]; // Americas as featured for world page

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div>
          <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
            World Desk // International Coverage
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
            World News
          </h1>
          <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
            Verified international coverage sourced from wire services, government agencies, and
            confirmed correspondents across five continents.
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <Breadcrumbs items={[{ label: "World" }]} />
        </div>
      </div>

      {/* Source Credibility Badge Section */}
      <div className="mb-8 sm:mb-10 border-t-4 border-ton-black pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-lg sm:text-xl font-bold text-ton-black">
            Source Credibility Badges
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />
        <p className="font-serif text-sm text-ton-black/50 leading-relaxed mb-5">
          Every article on the World Desk carries a credibility badge indicating the verification
          status and nature of the source. This is not decoration — it is the structural integrity
          of international reporting.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(
            [
              {
                type: "VERIFIED",
                desc: "Information confirmed by multiple reliable sources",
              },
              {
                type: "OFFICIAL",
                desc: "Direct from government or organizational source",
              },
              {
                type: "ANALYSIS",
                desc: "Interpretation by subject matter experts",
              },
              {
                type: "DEVELOPING",
                desc: "Story is evolving, check back for updates",
              },
            ] as { type: BadgeType; desc: string }[]
          ).map((badge) => (
            <div key={badge.type} className="pt-4 border-t border-ton-black/8">
              <SourceBadge type={badge.type} />
              <p className="font-sans text-[11px] text-ton-black/40 mt-2 leading-relaxed">
                {badge.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Region — 3-Column Layout */}
      <div className="mb-8 sm:mb-10 border-t-4 border-ton-black pt-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-ton-red text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold">
            Featured
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            {featuredRegion.name}
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left — Main article */}
          <div className="md:col-span-7 ton-column-rule pr-0 md:pr-5">
            <article>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-ton-red text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold">
                  {featuredRegion.articles[0].category}
                </span>
                <SourceBadge type={featuredRegion.articles[0].badge} />
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-ton-black leading-tight">
                {featuredRegion.articles[0].headline}
              </h3>

              {/* Image description */}
              <div className="mt-4 bg-ton-black/[0.03] aspect-[16/9] relative overflow-hidden border border-ton-black/8">
                <div className="absolute inset-0 flex items-center justify-center px-8">
                  <p className="font-serif text-sm text-ton-black/25 italic text-center leading-relaxed max-w-lg">
                    {featuredRegion.imageDesc}
                  </p>
                </div>
                <div className="absolute bottom-2 left-2 bg-ton-black text-ton-cream px-2 py-1">
                  <p className="font-mono text-[7px] sm:text-[8px] leading-tight">
                    {featuredRegion.slug.toUpperCase().replace("-", " ")} {"// "} {featuredRegion.gps}
                    <br />
                    2026-04-28 14:32:07 CAT
                  </p>
                </div>
              </div>

              <div className="mt-3 pb-3 border-b border-ton-black/8 flex items-center justify-between">
                <span className="font-sans text-xs text-ton-black/60">
                  {featuredRegion.articles[0].source}
                </span>
                <span className="font-mono text-[10px] text-ton-black/25">
                  {featuredRegion.articles[0].timestamp}
                </span>
              </div>
            </article>
          </div>

          {/* Right — remaining articles */}
          <div className="md:col-span-5 pl-0 md:pl-5 mt-5 md:mt-0">
            <div className="border-t-2 border-ton-black pt-2 mb-3">
              <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-ton-black/50">
                More from {featuredRegion.name}
              </span>
            </div>
            <div className="space-y-0">
              {featuredRegion.articles.slice(1).map((article, i) => (
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
                    {region.slug.toUpperCase().replace("-", " ")} {"// "} {region.gps}
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
            <span>{region.name} {"//"} World Desk</span>
            <span>&copy; GemsWeb Digital</span>
          </div>
        </section>
      ))}

      {/* Closing Statement */}
      <div className="mt-8 sm:mt-10 py-8 sm:py-10 text-center border-t border-b border-ton-black">
        <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
          World Desk
        </span>
        <blockquote className="font-serif italic text-lg sm:text-xl md:text-2xl text-ton-black/40 leading-relaxed mt-3 max-w-2xl mx-auto">
          International coverage sourced, verified, and timestamped. Every datum carries its proof.
        </blockquote>
        <p className="font-mono text-[10px] text-ton-black/25 mt-3 tracking-wider">
          Powered by Times OS v2.1 — GemsWeb Digital
        </p>
      </div>
    </div>
  );
}
