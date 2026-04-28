"use client";

import React from "react";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { toast } from "sonner";

export default function BusinessPlanView() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Screen-only header */}
      <div className="mb-8 sm:mb-10 ton-no-print">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-ton-red font-semibold">
              Confidential // Print Edition
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
              Business Plan
            </h1>
            <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
              Strategic Business Plan 2026 — 2028. The constitutional document
              of Times of Namibia. Authoritative, readable, and physically imposing.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 bg-ton-black text-ton-cream hover:bg-ton-black/90 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-wider">
              A4 Optimized
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <a
            href="/"
            className="font-mono text-[10px] text-ton-black/40 hover:text-ton-black transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3 h-3" />
            Newsroom
          </a>
          <span className="font-mono text-[10px] text-ton-black/30">Doc_Ref: TON-BP-2026-01</span>
        </div>
      </div>

      {/* ========= PRINT-READY DOCUMENT ========= */}
      <div className="ton-business-plan">

        {/* ===== PAGE 1: TITLE & MANIFESTO ===== */}
        <section className="ton-bp-page border-t-4 border-ton-black pt-8 mb-12 sm:mb-16">
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">Doc_Ref: TON-BP-2026-01</span>
            <span className="font-mono text-[9px] text-ton-red font-bold uppercase tracking-widest">Confidential</span>
          </div>

          {/* Masthead */}
          <div className="text-center border-b-2 border-ton-black pb-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="bg-ton-black text-ton-cream font-mono text-[10px] font-bold px-2.5 py-1 tracking-widest">TON</div>
              <div className="h-px flex-1 max-w-16 bg-ton-black/20" />
              <div className="bg-ton-red text-white font-mono text-[10px] font-bold px-2.5 py-1 tracking-widest flex items-center gap-1.5">
                <span className="ton-live-dot" style={{ width: 5, height: 5 }} />
                LIVE
              </div>
            </div>
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-ton-black leading-none">
              TIMES OF NAMIBIA
            </h1>
            <p className="font-mono text-xs sm:text-sm text-ton-black/50 mt-3 tracking-wider uppercase">
              Strategic Business Plan // 2026 — 2028
            </p>
            <p className="font-mono text-[10px] text-ton-black/30 mt-1 tracking-wider uppercase">
              A GemsWeb Digital Publication
            </p>
          </div>

          {/* Two-column manifesto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div className="md:border-r md:border-ton-black/10 md:pr-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ton-black mb-4">
                I. The Manifesto
              </h2>
              <div className="ton-dropcap">
                <p className="font-serif text-sm sm:text-base text-ton-black/70 leading-[1.8] mb-4">
                  We carry the gravitas of print into the digital age. Times of Namibia is not merely a news platform; it is a high-density information architecture designed to serve the intellectual capacity of the Namibian people. In an era of fragmented attention and engagement bait, we provide depth, verification, and the kind of authority that only comes from treating every screen as a front page.
                </p>
              </div>
              <p className="font-serif text-sm sm:text-base text-ton-black/70 leading-[1.8] mb-4">
                Our design language — the &ldquo;Broadsheet Digital&rdquo; philosophy — merges the authority of traditional journalism with the precision of real-time data scraping through the Times OS engine. We do not chase clicks. We inform. We do not optimise for engagement. We optimise for understanding.
              </p>
              <p className="font-serif text-sm sm:text-base text-ton-black/70 leading-[1.8]">
                This document is the constitution of the company. It outlines not merely what we build, but why we build it, how we sustain it, and the principles that will govern every editorial and commercial decision from Windhoek to //Kharas, from Oshana to the Zambezi.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ton-black mb-4">
                II. Key Pillars
              </h2>
              <div className="space-y-6">
                <div className="pt-4 border-t border-ton-black/10">
                  <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">01 // Broad Reach</span>
                  <p className="font-serif text-sm text-ton-black/60 leading-relaxed mt-2">
                    Optimised for 3G networks across all 14 regions. CSS-heavy, image-light. Every byte must earn its place on the page. If a feature cannot load on a Nokia browsing through MTC in Oshakati within 6 seconds, it does not ship.
                  </p>
                </div>
                <div className="pt-4 border-t border-ton-black/10">
                  <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">02 // System Trust</span>
                  <p className="font-serif text-sm text-ton-black/60 leading-relaxed mt-2">
                    Every datum is verified by a 6-second scraping loop. The timestamp is not decoration — it is proof. When a reader sees &ldquo;Scraped 6s ago,&rdquo; they know the information is live, verified, and current. System trust is the foundation of editorial trust.
                  </p>
                </div>
                <div className="pt-4 border-t border-ton-black/10">
                  <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">03 // Regional Identity</span>
                  <p className="font-serif text-sm text-ton-black/60 leading-relaxed mt-2">
                    Dedicated data nodes in //Kharas, Oshana, and Erongo. Our scraping targets Namibian government portals — NIEIS, the Government Gazette, CRAN filings. We do not repurpose international feeds. We mine Namibian data for Namibian readers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Imagery description */}
          <div className="mt-8 pt-6 border-t border-ton-black/10">
            <div className="bg-ton-black/3 p-6 sm:p-8">
              <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">Visual Anchor</span>
              <div className="h-48 sm:h-64 bg-ton-black/5 mt-3 flex items-center justify-center border border-ton-black/10">
                <div className="text-center px-6">
                  <p className="font-mono text-[10px] text-ton-black/20 uppercase tracking-widest">[ Imagery Placeholder ]</p>
                  <p className="font-serif text-sm text-ton-black/40 italic mt-2 max-w-md mx-auto">
                    High-contrast aerial photograph of the Central Plateau at dawn. Grayscale. The vast gravel plains stretching toward the escarpment, shot from 800m altitude. GPS overlay: 22.56 S, 17.08 E. Timestamp in JetBrains Mono within a black rectangular box at bottom-left. No colour. No people. Just land and light.
                  </p>
                </div>
              </div>
              <div className="bg-ton-black text-ton-cream px-3 py-1.5 inline-block mt-2">
                <span className="font-mono text-[9px]">Visual Anchor: Central Plateau // Ref: 22.56 S, 17.08 E</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-ton-black/10 font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">
            <span>Page 01 // Executive Summary</span>
            <span>GemsWeb Digital</span>
          </div>
        </section>

        {/* ===== PAGE 2: OPERATIONS & TECHNOLOGY ===== */}
        <section className="ton-bp-page border-t-4 border-ton-black pt-8 mb-12 sm:mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ton-black mb-2">
            III. Operational Architecture
          </h2>
          <div className="h-px bg-ton-black/10 mb-6" />

          <p className="font-serif text-sm sm:text-base text-ton-black/70 leading-[1.8] mb-6">
            The Times of Namibia operates on a proprietary integration layer — <strong>Times OS</strong>. This system enables real-time monitoring of regional sentiment, government procurement data, and employment market dynamics across all 14 administrative regions. The architecture follows a &ldquo;6-second rule&rdquo;: all technical data is refreshed within a 6-second cycle, proving the veracity and currency of every figure presented to the reader.
          </p>

          <h3 className="font-mono text-xs font-bold text-ton-black uppercase tracking-wider mb-4">
            Regional Node Deployment
          </h3>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-ton-black">
                  <th className="font-mono text-[9px] font-bold uppercase tracking-widest py-3 pr-4">Region</th>
                  <th className="font-mono text-[9px] font-bold uppercase tracking-widest py-3 pr-4">Status</th>
                  <th className="font-mono text-[9px] font-bold uppercase tracking-widest py-3 pr-4">Scraping Freq.</th>
                  <th className="font-mono text-[9px] font-bold uppercase tracking-widest py-3">Core Focus</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { region: "//Kharas", status: "Active", freq: "6 Seconds", focus: "Resource Management, Green Hydrogen" },
                  { region: "Oshana", status: "Active", freq: "6 Seconds", focus: "Market Liquidity, Retail Sector" },
                  { region: "Khomas", status: "Active", freq: "6 Seconds", focus: "Governance, Policy, Central Business" },
                  { region: "Erongo", status: "Active", freq: "6 Seconds", focus: "Logistics, Maritime Trade, Mining" },
                  { region: "Otjozondjupa", status: "Staging", freq: "Planned", focus: "Agriculture, Transport Corridor" },
                  { region: "Zambezi", status: "Staging", freq: "Planned", focus: "Cross-border Trade, Tourism" },
                  { region: "Kunene", status: "Planned Q4", freq: "-", focus: "Conservation, Community Development" },
                  { region: "Hardap", status: "Planned Q4", freq: "-", focus: "Solar Energy, Irrigation" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-ton-black/5">
                    <td className="font-serif text-sm py-3 pr-4 text-ton-black font-semibold">{row.region}</td>
                    <td className="font-mono text-xs py-3 pr-4">
                      <span className={row.status === "Active" ? "text-ton-red font-bold" : row.status === "Staging" ? "text-ton-black/40" : "text-ton-black/20"}>
                        {row.status}
                      </span>
                    </td>
                    <td className="font-mono text-xs py-3 pr-4 text-ton-black/50">{row.freq}</td>
                    <td className="font-sans text-xs py-3 text-ton-black/50">{row.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Times OS Architecture */}
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ton-black mb-2 mt-10">
            IV. Times OS — Technical Foundation
          </h2>
          <div className="h-px bg-ton-black/10 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div>
              <p className="font-serif text-sm text-ton-black/70 leading-[1.8] mb-4">
                Times OS is the proprietary scraping and verification engine that powers every data point on the platform. Built on a microservices architecture, it aggregates from NIEIS, the Government Gazette, LinkedIn, CareerPortal, and NamibiaJobs in real-time. Each source is scraped on an independent cycle, with results validated against a 3-point verification matrix before publication.
              </p>
              <p className="font-serif text-sm text-ton-black/70 leading-[1.8]">
                The engine maintains a compliance-first approach: every scraped datum carries its source, timestamp, and verification status. This metadata is visible to the reader, creating a trust chain from government portal to reader screen in under 6 seconds.
              </p>
            </div>
            <div className="bg-ton-black text-ton-cream p-6">
              <h3 className="font-mono text-xs text-ton-red font-bold uppercase tracking-wider mb-4">
                Times OS v2.1 — Specifications
              </h3>
              <div className="space-y-3 font-mono text-[11px]">
                {[
                  { label: "Sources Monitored", value: "4 Primary + 12 Secondary" },
                  { label: "Scraping Cycle", value: "6 Seconds" },
                  { label: "Verification Matrix", value: "3-Point Source Validation" },
                  { label: "Regions Covered", value: "8 Active / 14 Total" },
                  { label: "Tender Documents Tracked", value: "200+ Active" },
                  { label: "Job Listings Aggregated", value: "847 / Week Average" },
                  { label: "Uptime SLA", value: "99.7%" },
                  { label: "Data Freshness", value: "Max 6s Staleness" },
                ].map((spec, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-ton-cream/10 pb-2">
                    <span className="text-ton-cream/50">{spec.label}</span>
                    <span className="text-ton-cream font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Imagery description */}
          <div className="mt-8 pt-6 border-t border-ton-black/10">
            <div className="bg-ton-black/3 p-6 sm:p-8">
              <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">System Integration Visual</span>
              <div className="h-40 sm:h-52 bg-ton-black/5 mt-3 flex items-center justify-center border border-ton-black/10">
                <div className="text-center px-6">
                  <p className="font-mono text-[10px] text-ton-black/20 uppercase tracking-widest">[ Imagery Placeholder ]</p>
                  <p className="font-serif text-sm text-ton-black/40 italic mt-2 max-w-md mx-auto">
                    Close-up of server rack LEDs in a darkened data centre. Grayscale. Green and amber indicator lights captured in sharp focus with shallow depth of field. Timestamp overlay in JetBrains Mono at bottom-right within a black box. The image conveys infrastructure, reliability, and the physical reality behind digital data.
                  </p>
                </div>
              </div>
              <div className="bg-ton-black text-ton-cream px-3 py-1.5 inline-block mt-2">
                <span className="font-mono text-[9px]">System Integration: Times OS v2.1 Infrastructure</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-ton-black/10 font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">
            <span>Page 02 // Operations & Technology</span>
            <span>GemsWeb Digital</span>
          </div>
        </section>

        {/* ===== PAGE 3: FINANCIALS ===== */}
        <section className="ton-bp-page border-t-4 border-ton-black pt-8 mb-12 sm:mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ton-black mb-2">
            V. Financial Roadmap
          </h2>
          <div className="h-px bg-ton-black/10 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-8">
            <div>
              <h3 className="font-mono text-xs font-bold text-ton-black uppercase tracking-wider mb-4">
                Monetisation Strategy
              </h3>
              <p className="font-serif text-sm text-ton-black/70 leading-[1.8] mb-4">
                We reject intrusive advertising. The reader experience is sacrosanct. Revenue is derived from three verticals, each aligned with the editorial mission rather than working against it. Our commercial model treats data as the product and attention as the byproduct, never the reverse.
              </p>
              <div className="space-y-4">
                <div className="pt-4 border-t border-ton-black/10">
                  <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">Broadsheet Sponsorships</span>
                  <p className="font-serif text-sm text-ton-black/60 leading-relaxed mt-2">
                    High-density branded content modules integrated into the editorial grid. Sponsors do not buy banners — they buy columns. Each sponsorship is clearly labelled and must provide informational value to the reader, not merely promotional value to the sponsor.
                  </p>
                </div>
                <div className="pt-4 border-t border-ton-black/10">
                  <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">Times OS Data Licensing</span>
                  <p className="font-serif text-sm text-ton-black/60 leading-relaxed mt-2">
                    B2B data streams for logistics companies, legal firms, and procurement consultants who require real-time access to Namibian government tender data, job market analytics, and regulatory filings. Sold as API access with tiered pricing.
                  </p>
                </div>
                <div className="pt-4 border-t border-ton-black/10">
                  <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">Premium Archive & Print</span>
                  <p className="font-serif text-sm text-ton-black/60 leading-relaxed mt-2">
                    High-fidelity print-on-demand assets for institutional subscribers. Research reports, annual tender compilations, and curated regional data packages delivered in the Broadsheet Digital print format on 120gsm cream stock.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-mono text-xs font-bold text-ton-black uppercase tracking-wider mb-4">
                Financial Projections
              </h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-ton-black">
                      <th className="font-mono text-[9px] font-bold uppercase tracking-widest py-3 pr-4">Period</th>
                      <th className="font-mono text-[9px] font-bold uppercase tracking-widest py-3 pr-4">Revenue</th>
                      <th className="font-mono text-[9px] font-bold uppercase tracking-widest py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { period: "FY 2026 H1", revenue: "Seed + Pilot", status: "Pre-revenue" },
                      { period: "FY 2026 H2", revenue: "N$ 420K", status: "Data Licensing Launch" },
                      { period: "FY 2027 H1", revenue: "N$ 1.2M", status: "Sponsorship Pipeline" },
                      { period: "FY 2027 H2", revenue: "N$ 2.8M", status: "Full Commercial Ops" },
                      { period: "FY 2028", revenue: "N$ 6.5M", status: "Profitability Target" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-ton-black/5">
                        <td className="font-mono text-xs py-3 pr-4 text-ton-black/70">{row.period}</td>
                        <td className="font-serif text-sm py-3 pr-4 text-ton-black font-bold">{row.revenue}</td>
                        <td className="font-sans text-xs py-3 text-ton-black/40">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-ton-black text-ton-cream p-6">
                <h3 className="font-mono text-xs text-ton-red font-bold uppercase tracking-wider mb-3">FY28 Target</h3>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-ton-cream leading-none mb-2">45%</p>
                <p className="font-mono text-[9px] text-ton-cream/40 uppercase tracking-widest leading-relaxed">
                  Projected market share of digital editorial in regional centres across Khomas, Erongo, and //Kharas.
                </p>
              </div>
            </div>
          </div>

          {/* Imagery */}
          <div className="mt-6 pt-6 border-t border-ton-black/10">
            <div className="bg-ton-black/3 p-6 sm:p-8">
              <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">Financial Visual</span>
              <div className="h-36 sm:h-48 bg-ton-black/5 mt-3 flex items-center justify-center border border-ton-black/10">
                <div className="text-center px-6">
                  <p className="font-mono text-[10px] text-ton-black/20 uppercase tracking-widest">[ Imagery Placeholder ]</p>
                  <p className="font-serif text-sm text-ton-black/40 italic mt-2 max-w-md mx-auto">
                    Wide shot of the Windhoek skyline at dusk, shot from the Auas Mountains looking north. Grayscale. The city lights form a grid pattern against the darkening sky. GPS overlay: 22.57 S, 17.08 E. The image represents commerce, concentration, and the urban core of Namibian economic activity.
                  </p>
                </div>
              </div>
              <div className="bg-ton-black text-ton-cream px-3 py-1.5 inline-block mt-2">
                <span className="font-mono text-[9px]">Financial Anchor: Windhoek CBD // Ref: 22.57 S, 17.08 E</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-ton-black/10 font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">
            <span>Page 03 // Financial Roadmap</span>
            <span>GemsWeb Digital</span>
          </div>
        </section>

        {/* ===== PAGE 4: PRINT MATERIALS & SOCIAL ===== */}
        <section className="ton-bp-page border-t-4 border-ton-black pt-8 mb-12 sm:mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ton-black mb-2">
            VI. Print Materials & Social Output
          </h2>
          <div className="h-px bg-ton-black/10 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-8">
            {/* Print Materials */}
            <div>
              <h3 className="font-mono text-xs font-bold text-ton-black uppercase tracking-wider mb-4">
                Physical Print Specifications
              </h3>
              <p className="font-serif text-sm text-ton-black/70 leading-[1.8] mb-4">
                All Times of Namibia print materials adhere to the Broadsheet Digital specification. There is no compromise on physical quality. Paper stock, typography, and layout are governed by the same rules that govern the digital platform: authority, density, and precision.
              </p>
              <div className="space-y-4">
                <div className="pt-4 border-t border-ton-black/10">
                  <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">Paper Stock</span>
                  <p className="font-serif text-sm text-ton-black/60 leading-relaxed mt-2">
                    Pure White or Cream stock, minimum 120gsm. No gloss. Matte finish only. The texture must feel like authority — thick, unyielding, and archival. Every page must be suitable for filing, framing, or archiving without degradation.
                  </p>
                </div>
                <div className="pt-4 border-t border-ton-black/10">
                  <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">Typography Grid</span>
                  <p className="font-serif text-sm text-ton-black/60 leading-relaxed mt-2">
                    All type must be aligned to a baseline grid. Headlines in Playfair Display 900 weight, body in Inter 400, data in JetBrains Mono. No exceptions. The grid is non-negotiable — it is the structural integrity of the page.
                  </p>
                </div>
                <div className="pt-4 border-t border-ton-black/10">
                  <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">Imagery Rules</span>
                  <p className="font-serif text-sm text-ton-black/60 leading-relaxed mt-2">
                    All photography must be high-contrast grayscale. No stock photography. If it is not Namibia, it is not Times of Namibia. Every image must be watermarked with its GPS coordinates and a JetBrains Mono timestamp in a black box. No colour in print. No exceptions.
                  </p>
                </div>
                <div className="pt-4 border-t border-ton-black/10">
                  <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">Physical Space</span>
                  <p className="font-serif text-sm text-ton-black/60 leading-relaxed mt-2">
                    Brutalist minimalism. Sharp corners only. No soft textures. No rounded edges. The physical form of Times of Namibia materials must convey the same authority as the editorial content they carry.
                  </p>
                </div>
              </div>
            </div>

            {/* The Broadside */}
            <div>
              <h3 className="font-mono text-xs font-bold text-ton-black uppercase tracking-wider mb-4">
                The Broadside — Physical Distribution
              </h3>
              <p className="font-serif text-sm text-ton-black/70 leading-[1.8] mb-4">
                The Broadside is a single-page physical printout designed for high-density reading environments: regional transport hubs, taxi ranks, municipal notice boards, and government building entrances. It is designed to be read standing up, in transit, in under 90 seconds.
              </p>
              <div className="bg-ton-black text-ton-cream p-6 mb-4">
                <h4 className="font-mono text-xs text-ton-red font-bold uppercase tracking-wider mb-3">
                  Broadside Specifications
                </h4>
                <div className="space-y-2 font-mono text-[11px]">
                  {[
                    { label: "Format", value: "A3 Single Sheet, Double-Sided" },
                    { label: "Stock", value: "120gsm Cream, Matte" },
                    { label: "Distribution", value: "14 Regional Transport Hubs" },
                    { label: "Frequency", value: "Weekly, Monday 06:00 CAT" },
                    { label: "Print Run", value: "5,000 copies/week initial" },
                    { label: "Content", value: "Top 10 Stories + 5 Active Tenders" },
                    { label: "Reading Time", value: "90 Seconds Maximum" },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-ton-cream/10 pb-2">
                      <span className="text-ton-cream/50">{spec.label}</span>
                      <span className="text-ton-cream font-bold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="font-mono text-xs font-bold text-ton-black uppercase tracking-wider mb-4">
                Social Media — Digital Telegrams
              </h3>
              <p className="font-serif text-sm text-ton-black/70 leading-[1.8]">
                Every social media post must look like an excerpt from a ledger or a telegram. Monospaced timestamps. No emojis unless functional. Information density over engagement bait. The format is rigid: timestamp, source, headline, single data point. No threads. No hot takes. Just the verified fact, delivered with the same stoic precision as the platform itself.
              </p>
            </div>
          </div>

          {/* Print imagery */}
          <div className="mt-6 pt-6 border-t border-ton-black/10">
            <div className="bg-ton-black/3 p-6 sm:p-8">
              <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">Print Material Visual</span>
              <div className="h-36 sm:h-48 bg-ton-black/5 mt-3 flex items-center justify-center border border-ton-black/10">
                <div className="text-center px-6">
                  <p className="font-mono text-[10px] text-ton-black/20 uppercase tracking-widest">[ Imagery Placeholder ]</p>
                  <p className="font-serif text-sm text-ton-black/40 italic mt-2 max-w-md mx-auto">
                    Flat-lay photograph of a printed Broadside on a concrete surface. Grayscale. The A3 sheet shows sharp black typography on cream stock, with column rules and editorial borders clearly visible. A hand with a wedding ring holds the top corner. GPS overlay: 22.57 S, 17.08 E. The image conveys tactility, authority, and the physical reality of print in a digital age.
                  </p>
                </div>
              </div>
              <div className="bg-ton-black text-ton-cream px-3 py-1.5 inline-block mt-2">
                <span className="font-mono text-[9px]">Print Specification: The Broadside // A3 on 120gsm Cream</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-ton-black/10 font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">
            <span>Page 04 // Print Materials & Social Output</span>
            <span>GemsWeb Digital</span>
          </div>
        </section>

        {/* ===== PAGE 5: DIRECTIVE ===== */}
        <section className="ton-bp-page border-t-4 border-ton-black pt-8">
          <div className="py-12 sm:py-16 text-center border-t border-b border-ton-black mb-8">
            <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">Final Directive</span>
            <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ton-black/70 leading-relaxed mt-6 max-w-3xl mx-auto">
              &ldquo;Information is the only currency that appreciates when shared correctly.&rdquo;
            </blockquote>
            <p className="font-mono text-xs text-ton-black/30 mt-6 tracking-wider">
              — GemsWeb Digital Editorial Board
            </p>
          </div>

          {/* Signatory Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div className="pt-6 border-t border-ton-black/10">
              <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">Authorised By</span>
              <p className="font-serif text-lg font-bold text-ton-black mt-3">GemsWeb Digital</p>
              <p className="font-mono text-xs text-ton-black/40 mt-1">Editorial & Architectural Board</p>
              <div className="h-px bg-ton-black mt-6 mb-2" />
              <p className="font-mono text-[9px] text-ton-black/20 uppercase tracking-widest">Signature</p>
            </div>
            <div className="pt-6 border-t border-ton-black/10">
              <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">Date of Issue</span>
              <p className="font-serif text-lg font-bold text-ton-black mt-3">
                {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
              <p className="font-mono text-xs text-ton-black/40 mt-1">Document Reference: TON-BP-2026-01</p>
              <p className="font-mono text-xs text-ton-red mt-1">Classification: Confidential</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-ton-black/10 font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">
            <span>Page 05 // Final Directive</span>
            <span>End of Document</span>
          </div>
        </section>

      </div>
    </div>
  );
}
