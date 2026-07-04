"use client";

import React from "react";
import { Printer, Download, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function BusinessPlanView() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHTML = () => {
    const htmlContent = generateStandaloneHTML();
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TON-Business-Plan-2026-2028.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Business Plan downloaded as HTML");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Screen-only header */}
      <div className="mb-8 sm:mb-10 ton-no-print">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
              Confidential // Print Edition
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
              Business Plan
            </h1>
            <p className="font-serif italic text-ton-black/40 text-sm sm:text-base mt-2 max-w-xl">
              Strategic Business Plan 2026 — 2028. The constitutional document of Times of Namibia.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-widest px-4 py-2 bg-ton-black text-ton-cream hover:bg-ton-black/90 transition-colors"
            >
              <Printer className="w-3 h-3" />
              Print / Save PDF
            </button>
            <button
              onClick={handleDownloadHTML}
              className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-widest px-4 py-2 bg-ton-red text-white hover:bg-ton-red/90 transition-colors"
            >
              <Download className="w-3 h-3" />
              Download HTML
            </button>
            <span className="font-mono text-[8px] text-ton-black/25 uppercase tracking-wider">
              A4 Optimized
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3">
          <a
            href="/"
            className="font-mono text-[9px] text-ton-black/30 hover:text-ton-black transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3 h-3" />
            Newsroom
          </a>
          <span className="font-mono text-[9px] text-ton-black/20">Doc_Ref: TON-BP-2026-01</span>
        </div>
      </div>

      {/* ========= PRINT-READY DOCUMENT ========= */}
      <div className="ton-business-plan">

        {/* ===== PAGE 1: TITLE & EXECUTIVE SUMMARY ===== */}
        <section className="ton-bp-page border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
          <div className="flex items-center justify-between mb-5">
            <span className="font-mono text-[8px] text-ton-black/25 uppercase tracking-widest">Doc_Ref: TON-BP-2026-01</span>
            <span className="font-mono text-[8px] text-ton-red font-bold uppercase tracking-widest">Confidential // Print Edition</span>
          </div>

          {/* Masthead */}
          <div className="text-center border-b-2 border-ton-black pb-5 mb-6">
            <div className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-ton-black leading-none">
              TIMES OF NAMIBIA
            </div>
            <p className="font-mono text-[10px] sm:text-xs text-ton-black/40 mt-2.5 tracking-wider uppercase">
              Strategic Business Plan // 2026 — 2028
            </p>
            <p className="font-mono text-[9px] text-ton-black/20 mt-1 tracking-wider uppercase">
              A TANGISON Publication
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="md:border-r md:border-ton-black/8 md:pr-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-3">
                I. The Manifesto
              </h2>
              <div className="ton-dropcap">
                <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
                  We carry the gravitas of print into the digital age. Times of Namibia is not merely a news platform; it is a high-density information architecture designed to serve the intellectual capacity of the Namibian people. In an era of fragmented attention and engagement bait, we provide depth, verification, and the kind of authority that only comes from treating every screen as a front page.
                </p>
              </div>
              <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
                Our design language — the &ldquo;Broadsheet Digital&rdquo; philosophy — merges the authority of traditional journalism with the precision of real-time data scraping through the Times OS engine. We do not chase clicks. We inform. We do not optimise for engagement. We optimise for understanding.
              </p>
              <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
                This document is the constitution of the company. It outlines not merely what we build, but why we build it, how we sustain it, and the principles that will govern every editorial and commercial decision from Windhoek to //Kharas, from Oshana to the Zambezi.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-3">
                II. Key Pillars
              </h2>
              <ul style={{ listStyle: "none", padding: 0 }} className="space-y-4 mt-3">
                <li>
                  <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">01 // Broad Reach</span>
                  <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-1.5">
                    Optimised for 3G networks across all 14 regions. CSS-heavy, image-light. Every byte must earn its place on the page. If a feature cannot load on a Nokia browsing through MTC in Oshakati within 6 seconds, it does not ship.
                  </p>
                </li>
                <li>
                  <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">02 // System Trust</span>
                  <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-1.5">
                    Every datum is verified by a 6-second scraping loop. The timestamp is not decoration — it is proof. When a reader sees &ldquo;Scraped 6s ago,&rdquo; they know the information is live, verified, and current.
                  </p>
                </li>
                <li>
                  <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">03 // Regional Identity</span>
                  <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-1.5">
                    Dedicated data nodes in //Kharas, Oshana, and Erongo. Our scraping targets Namibian government portals — NIEIS, the Government Gazette, CRAN filings. We do not repurpose international feeds. We mine Namibian data for Namibian readers.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Imagery description */}
          <div className="mt-6 pt-5 border-t border-ton-black/8">
            <div className="bg-ton-black/[0.02] p-5 sm:p-6">
              <span className="font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">Visual Anchor</span>
              <div className="h-44 sm:h-56 bg-ton-black/[0.04] mt-2.5 flex items-center justify-center border border-ton-black/6">
                <div className="text-center px-6">
                  <p className="font-serif text-sm text-ton-black/20 italic max-w-md mx-auto leading-relaxed">
                    High-contrast aerial photograph of the Central Plateau at dawn. Grayscale. The vast gravel plains stretching toward the escarpment, shot from 800m altitude. GPS overlay: 22.56 S, 17.08 E. Timestamp in JetBrains Mono within a black rectangular box at bottom-left. No colour. No people. Just land and light.
                  </p>
                </div>
              </div>
              <div className="bg-ton-black text-ton-cream px-2.5 py-1 inline-block mt-2">
                <span className="font-mono text-[8px]">Visual Anchor: Central Plateau // Ref: 22.56 S, 17.08 E</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
            <span>Page 01 // Executive Summary</span>
            <span>&copy; TANGISON</span>
          </div>
        </section>

        {/* ===== PAGE 2: OPERATIONS ===== */}
        <section className="ton-bp-page border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-2">
            III. Operational Architecture
          </h2>
          <div className="h-px bg-ton-black/8 mb-5" />

          <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-5">
            The Times of Namibia operates on a proprietary integration layer — <strong className="text-ton-black/80">Times OS</strong>. This system enables real-time monitoring of regional sentiment, government procurement data, and employment market dynamics across all 14 administrative regions. The architecture follows a &ldquo;6-second rule&rdquo;: all technical data is refreshed within a 6-second cycle, proving the veracity and currency of every figure presented to the reader.
          </p>

          <h3 className="font-mono text-[9px] font-bold text-ton-black uppercase tracking-wider mb-3">
            Regional Node Deployment
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left">
              <caption className="sr-only">Regional Node Deployment — Status and scraping frequency across Namibian regions</caption>
              <thead>
                <tr className="border-b-2 border-ton-black">
                  <th className="font-mono text-[8px] font-bold uppercase tracking-widest py-2.5 pr-3">Region</th>
                  <th className="font-mono text-[8px] font-bold uppercase tracking-widest py-2.5 pr-3">Status</th>
                  <th className="font-mono text-[8px] font-bold uppercase tracking-widest py-2.5 pr-3">Scraping Freq.</th>
                  <th className="font-mono text-[8px] font-bold uppercase tracking-widest py-2.5">Core Focus</th>
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
                  { region: "Kunene", status: "Planned Q4", freq: "—", focus: "Conservation, Community Development" },
                  { region: "Hardap", status: "Planned Q4", freq: "—", focus: "Solar Energy, Irrigation" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-ton-black/5">
                    <td className="font-serif text-sm py-2.5 pr-3 text-ton-black font-semibold">{row.region}</td>
                    <td className="font-mono text-[10px] py-2.5 pr-3">
                      <span className={row.status === "Active" ? "text-ton-red font-bold" : row.status === "Staging" ? "text-ton-black/30" : "text-ton-black/15"}>
                        {row.status}
                      </span>
                    </td>
                    <td className="font-mono text-[10px] py-2.5 pr-3 text-ton-black/40">{row.freq}</td>
                    <td className="font-sans text-[11px] py-2.5 text-ton-black/40">{row.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Times OS Specifications */}
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-2 mt-6">
            IV. Times OS — Technical Foundation
          </h2>
          <div className="h-px bg-ton-black/8 mb-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
                Times OS is the proprietary scraping and verification engine that powers every data point on the platform. Built on a microservices architecture, it aggregates from NIEIS, the Government Gazette, LinkedIn, CareerPortal, and NamibiaJobs in real-time. Each source is scraped on an independent cycle, with results validated against a 3-point verification matrix before publication.
              </p>
              <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
                The engine maintains a compliance-first approach: every scraped datum carries its source, timestamp, and verification status. This metadata is visible to the reader, creating a trust chain from government portal to reader screen in under 6 seconds.
              </p>
            </div>
            <div className="bg-ton-black text-ton-cream p-5">
              <h3 className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-wider mb-3">
                Times OS v2.1 — Specifications
              </h3>
              <div className="space-y-2 font-mono text-[10px]">
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
                  <div key={i} className="flex items-center justify-between border-b border-ton-cream/8 pb-1.5">
                    <span className="text-ton-cream/40">{spec.label}</span>
                    <span className="text-ton-cream font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Imagery */}
          <div className="mt-6 pt-5 border-t border-ton-black/8">
            <div className="bg-ton-black/[0.02] p-5">
              <span className="font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">System Integration Visual</span>
              <div className="h-36 sm:h-44 bg-ton-black/[0.04] mt-2.5 flex items-center justify-center border border-ton-black/6">
                <div className="text-center px-6">
                  <p className="font-serif text-xs text-ton-black/20 italic max-w-md mx-auto leading-relaxed">
                    Close-up of server rack LEDs in a darkened data centre. Grayscale. Green and amber indicator lights captured in sharp focus with shallow depth of field. Timestamp overlay in JetBrains Mono at bottom-right within a black box. The image conveys infrastructure, reliability, and the physical reality behind digital data.
                  </p>
                </div>
              </div>
              <div className="bg-ton-black text-ton-cream px-2.5 py-1 inline-block mt-2">
                <span className="font-mono text-[8px]">System Integration: Times OS v2.1 Infrastructure</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
            <span>Page 02 // Operations & Technology</span>
            <span>&copy; TANGISON</span>
          </div>
        </section>

        {/* ===== PAGE 3: FINANCIALS ===== */}
        <section className="ton-bp-page border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-2">
            V. Financial Roadmap
          </h2>
          <div className="h-px bg-ton-black/8 mb-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
            <div>
              <h3 className="font-mono text-[9px] font-bold text-ton-black uppercase tracking-wider mb-3">
                Monetisation Strategy
              </h3>
              <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
                We reject intrusive advertising. The reader experience is sacrosanct. Revenue is derived from three verticals, each aligned with the editorial mission rather than working against it. Our commercial model treats data as the product and attention as the byproduct, never the reverse.
              </p>
              <ul style={{ listStyle: "none", padding: 0 }} className="space-y-3">
                <li>
                  <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Broadsheet Sponsorships</span>
                  <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-1.5">
                    High-density branded content modules integrated into the editorial grid. Sponsors do not buy banners — they buy columns. Each sponsorship is clearly labelled and must provide informational value to the reader.
                  </p>
                </li>
                <li>
                  <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Times OS Data Licensing</span>
                  <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-1.5">
                    B2B data streams for logistics companies, legal firms, and procurement consultants who require real-time access to Namibian government tender data, job market analytics, and regulatory filings. Sold as API access with tiered pricing.
                  </p>
                </li>
                <li>
                  <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Premium Archive & Print</span>
                  <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-1.5">
                    High-fidelity print-on-demand assets for institutional subscribers. Research reports, annual tender compilations, and curated regional data packages delivered in the Broadsheet Digital print format on 120gsm cream stock.
                  </p>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-[9px] font-bold text-ton-black uppercase tracking-wider mb-3">
                Financial Projections
              </h3>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-left">
                  <caption className="sr-only">Financial Projections — Revenue and operational status by period</caption>
                  <thead>
                    <tr className="border-b-2 border-ton-black">
                      <th className="font-mono text-[8px] font-bold uppercase tracking-widest py-2.5 pr-3">Period</th>
                      <th className="font-mono text-[8px] font-bold uppercase tracking-widest py-2.5 pr-3">Revenue</th>
                      <th className="font-mono text-[8px] font-bold uppercase tracking-widest py-2.5">Status</th>
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
                        <td className="font-mono text-[10px] py-2.5 pr-3 text-ton-black/50">{row.period}</td>
                        <td className="font-serif text-sm py-2.5 pr-3 text-ton-black font-bold">{row.revenue}</td>
                        <td className="font-sans text-[10px] py-2.5 text-ton-black/30">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* FY28 Target — black box */}
              <div className="bg-ton-black text-ton-cream p-5">
                <h3 className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-wider mb-2">FY28 Target</h3>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-ton-cream leading-none mb-1.5">45%</p>
                <p className="font-mono text-[8px] text-ton-cream/35 uppercase tracking-widest leading-relaxed">
                  Projected market share of digital editorial in regional centres across Khomas, Erongo, and //Kharas.
                </p>
              </div>
            </div>
          </div>

          {/* Imagery */}
          <div className="mt-5 pt-5 border-t border-ton-black/8">
            <div className="bg-ton-black/[0.02] p-5">
              <span className="font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">Financial Visual</span>
              <div className="h-32 sm:h-40 bg-ton-black/[0.04] mt-2.5 flex items-center justify-center border border-ton-black/6">
                <div className="text-center px-6">
                  <p className="font-serif text-xs text-ton-black/20 italic max-w-md mx-auto leading-relaxed">
                    Wide shot of the Windhoek skyline at dusk, shot from the Auas Mountains looking north. Grayscale. The city lights form a grid pattern against the darkening sky. GPS overlay: 22.57 S, 17.08 E. The image represents commerce, concentration, and the urban core of Namibian economic activity.
                  </p>
                </div>
              </div>
              <div className="bg-ton-black text-ton-cream px-2.5 py-1 inline-block mt-2">
                <span className="font-mono text-[8px]">Financial Anchor: Windhoek CBD // Ref: 22.57 S, 17.08 E</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
            <span>Page 03 // Financial Roadmap</span>
            <span>&copy; TANGISON</span>
          </div>
        </section>

        {/* ===== PAGE 4: PRINT MATERIALS & SOCIAL ===== */}
        <section className="ton-bp-page border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-2">
            VI. Print Materials & Social Output
          </h2>
          <div className="h-px bg-ton-black/8 mb-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
            {/* Print Materials */}
            <div>
              <h3 className="font-mono text-[9px] font-bold text-ton-black uppercase tracking-wider mb-3">
                Physical Print Specifications
              </h3>
              <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
                All Times of Namibia print materials adhere to the Broadsheet Digital specification. There is no compromise on physical quality. Paper stock, typography, and layout are governed by the same rules that govern the digital platform: authority, density, and precision.
              </p>
              <ul style={{ listStyle: "none", padding: 0 }} className="space-y-3">
                <li>
                  <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Paper Stock</span>
                  <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-1.5">
                    Pure White or Cream stock, minimum 120gsm. No gloss. Matte finish only. The texture must feel like authority — thick, unyielding, and archival. Every page must be suitable for filing, framing, or archiving without degradation.
                  </p>
                </li>
                <li>
                  <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Typography Grid</span>
                  <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-1.5">
                    All type aligned to a baseline grid. Headlines in Playfair Display 900 weight, body in Inter 400, data in JetBrains Mono. No exceptions. The grid is non-negotiable — it is the structural integrity of the page.
                  </p>
                </li>
                <li>
                  <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Imagery Rules</span>
                  <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-1.5">
                    All photography must be high-contrast grayscale. No stock photography. If it is not Namibia, it is not Times of Namibia. Every image must be watermarked with its GPS coordinates and a JetBrains Mono timestamp in a black box. No colour in print. No exceptions.
                  </p>
                </li>
                <li>
                  <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Physical Space</span>
                  <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-1.5">
                    Brutalist minimalism. Sharp corners only. No soft textures. No rounded edges. The physical form of Times of Namibia materials must convey the same authority as the editorial content they carry.
                  </p>
                </li>
              </ul>
            </div>

            {/* The Broadside */}
            <div>
              <h3 className="font-mono text-[9px] font-bold text-ton-black uppercase tracking-wider mb-3">
                The Broadside — Physical Distribution
              </h3>
              <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
                The Broadside is a single-page physical printout designed for high-density reading environments: regional transport hubs, taxi ranks, municipal notice boards, and government building entrances. It is designed to be read standing up, in transit, in under 90 seconds.
              </p>
              <div className="bg-ton-black text-ton-cream p-5 mb-4">
                <h4 className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-wider mb-2.5">
                  Broadside Specifications
                </h4>
                <div className="space-y-1.5 font-mono text-[10px]">
                  {[
                    { label: "Format", value: "A3 Single Sheet, Double-Sided" },
                    { label: "Stock", value: "120gsm Cream, Matte" },
                    { label: "Distribution", value: "14 Regional Transport Hubs" },
                    { label: "Frequency", value: "Weekly, Monday 06:00 CAT" },
                    { label: "Print Run", value: "5,000 copies/week initial" },
                    { label: "Content", value: "Top 10 Stories + 5 Active Tenders" },
                    { label: "Reading Time", value: "90 Seconds Maximum" },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-ton-cream/8 pb-1.5">
                      <span className="text-ton-cream/40">{spec.label}</span>
                      <span className="text-ton-cream font-bold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="font-mono text-[9px] font-bold text-ton-black uppercase tracking-wider mb-3">
                Social Media — Digital Telegrams
              </h3>
              <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
                Every social media post must look like an excerpt from a ledger or a telegram. Monospaced timestamps. No emojis unless functional. Information density over engagement bait. The format is rigid: timestamp, source, headline, single data point. No threads. No hot takes. Just the verified fact, delivered with the same stoic precision as the platform itself.
              </p>
            </div>
          </div>

          {/* Print imagery */}
          <div className="mt-5 pt-5 border-t border-ton-black/8">
            <div className="bg-ton-black/[0.02] p-5">
              <span className="font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">Print Material Visual</span>
              <div className="h-32 sm:h-40 bg-ton-black/[0.04] mt-2.5 flex items-center justify-center border border-ton-black/6">
                <div className="text-center px-6">
                  <p className="font-serif text-xs text-ton-black/20 italic max-w-md mx-auto leading-relaxed">
                    Flat-lay photograph of a printed Broadside on a concrete surface. Grayscale. The A3 sheet shows sharp black typography on cream stock, with column rules and editorial borders clearly visible. A hand with a wedding ring holds the top corner. GPS overlay: 22.57 S, 17.08 E. The image conveys tactility, authority, and the physical reality of print in a digital age.
                  </p>
                </div>
              </div>
              <div className="bg-ton-black text-ton-cream px-2.5 py-1 inline-block mt-2">
                <span className="font-mono text-[8px]">Print Specification: The Broadside // A3 on 120gsm Cream</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
            <span>Page 04 // Print Materials & Social Output</span>
            <span>&copy; TANGISON</span>
          </div>
        </section>

        {/* ===== PAGE 5: DIRECTIVE ===== */}
        <section className="ton-bp-page border-t-4 border-ton-black pt-6">
          <div className="py-10 sm:py-14 text-center border-t border-b border-ton-black mb-6">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Final Directive</span>
            <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl text-ton-black/50 leading-relaxed mt-5 max-w-3xl mx-auto">
              &ldquo;Information is the only currency that appreciates when shared correctly.&rdquo;
            </blockquote>
            <p className="font-mono text-[10px] text-ton-black/20 mt-4 tracking-wider">
              — TANGISON Editorial Board
            </p>
          </div>

          {/* Signatory Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="pt-5 border-t border-ton-black/8">
              <span className="font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">Authorised By</span>
              <p className="font-serif text-base font-bold text-ton-black mt-2">TANGISON</p>
              <p className="font-mono text-[10px] text-ton-black/30 mt-0.5">Editorial & Architectural Board</p>
              <div className="h-px bg-ton-black/15 mt-5 mb-1.5" />
              <p className="font-mono text-[8px] text-ton-black/15 uppercase tracking-widest">Signature</p>
            </div>
            <div className="pt-5 border-t border-ton-black/8">
              <span className="font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">Date of Issue</span>
              <p className="font-serif text-base font-bold text-ton-black mt-2">
                {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
              <p className="font-mono text-[10px] text-ton-black/30 mt-0.5">Document Reference: TON-BP-2026-01</p>
              <p className="font-mono text-[10px] text-ton-red mt-0.5">Classification: Confidential</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
            <span>Page 05 // Final Directive</span>
            <span>End of Document</span>
          </div>
        </section>

      </div>
    </div>
  );
}

/* ================================================================
   STANDALONE HTML GENERATOR — Downloadable Business Plan
   ================================================================ */
function generateStandaloneHTML(): string {
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Plan - Times of Namibia (A4 Print Edition)</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --ton-cream: #F9F8F6;
            --ton-black: #111111;
            --ton-red: #CB102E;
            --font-display: 'Playfair Display', serif;
            --font-sans: 'Inter', sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
        }
        * { box-sizing: border-box; border-radius: 0 !important; }
        body {
            background-color: #f0f0f0;
            margin: 0;
            padding: 40px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .page {
            background: var(--ton-cream);
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin-bottom: 30px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            position: relative;
            display: flex;
            flex-direction: column;
            color: var(--ton-black);
        }
        @media print {
            body { padding: 0; background: none; }
            .page { margin: 0; box-shadow: none; page-break-after: always; width: 210mm; height: 297mm; }
        }
        h1, h2, h3 { font-family: var(--font-display); text-transform: uppercase; margin: 0; line-height: 1; }
        p, li, td { font-family: var(--font-sans); font-size: 11pt; line-height: 1.5; text-align: justify; }
        .mono { font-family: var(--font-mono); font-size: 8pt; text-transform: uppercase; letter-spacing: 0.05em; }
        .masthead { font-size: 58pt; font-weight: 900; text-align: center; border-bottom: 4px solid var(--ton-black); padding: 20px 0; margin: 20px 0; }
        .editorial-rule { border-top: 1px solid var(--ton-black); margin: 20px 0; }
        .red-marker { color: var(--ton-red); font-weight: bold; }
        .drop-cap::first-letter { font-family: var(--font-display); font-size: 45pt; float: left; line-height: 0.8; padding-right: 8px; font-weight: 900; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .col-rule { border-right: 1px solid var(--ton-black); padding-right: 20px; }
        .img-container { width: 100%; height: 250px; background: #eee; margin: 20px 0 5px 0; border: 1px solid var(--ton-black); display: flex; align-items: center; justify-content: center; }
        .caption { background: var(--ton-black); color: var(--ton-cream); padding: 4px 8px; display: inline-block; margin-bottom: 20px; }
        footer { margin-top: auto; border-top: 1px solid var(--ton-black); padding-top: 10px; display: flex; justify-content: space-between; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { font-family: var(--font-mono); font-size: 8pt; text-align: left; padding: 10px; border-bottom: 2px solid var(--ton-black); }
        td { padding: 10px; border-bottom: 1px solid #ddd; font-size: 9pt; }
    </style>
</head>
<body>
    <article class="page">
        <div class="mono" style="display: flex; justify-content: space-between;">
            <span>Doc_Ref: TON-BP-2026-01</span>
            <span class="red-marker">Status: Confidential // Print Edition</span>
        </div>
        <h1 class="masthead">Times of Namibia</h1>
        <div style="text-align: center; margin-bottom: 40px;">
            <p class="mono" style="font-size: 12pt;">Strategic Business Plan // 2026 — 2028</p>
            <p class="mono" style="margin-top: 5px;">A TANGISON Publication</p>
        </div>
        <div class="editorial-rule"></div>
        <div class="grid-2">
            <div class="col-rule">
                <h2>I. The Manifesto</h2>
                <p class="drop-cap" style="margin-top: 15px;">
                    We carry the gravitas of print into the digital age. Times of Namibia is not merely a news platform; it is a high-density information architecture designed to serve the intellectual capacity of the Namibian people. In an era of fragmented attention, we provide depth.
                </p>
                <p>
                    Every screen is treated as a front page. Our design language — the "Broadsheet Digital" philosophy — merges the authority of traditional journalism with the precision of real-time data scraping through the Times OS.
                </p>
            </div>
            <div>
                <h2>II. Key Pillars</h2>
                <ul style="list-style: none; padding: 0; margin-top: 15px;">
                    <li style="margin-bottom: 15px;">
                        <span class="mono red-marker">01 // Broad Reach</span><br>
                        Optimized for 3G networks. CSS-heavy, image-light. If it cannot load in Oshakati within 6 seconds, it does not ship.
                    </li>
                    <li style="margin-bottom: 15px;">
                        <span class="mono red-marker">02 // System Trust</span><br>
                        Every datum is verified by a 6-second scraping loop. The timestamp is proof, not decoration.
                    </li>
                    <li style="margin-bottom: 15px;">
                        <span class="mono red-marker">03 // Regional Identity</span><br>
                        Dedicated nodes in //Kharas, Oshana, and Erongo. Namibian data for Namibian readers.
                    </li>
                </ul>
            </div>
        </div>
        <div class="img-container">
            <p style="font-family: var(--font-display); font-style: italic; font-size: 10pt; color: #999; text-align: center; padding: 20px;">
                High-contrast aerial photograph of the Central Plateau at dawn. Grayscale. GPS overlay: 22.56 S, 17.08 E. JetBrains Mono timestamp in a black box at bottom-left.
            </p>
        </div>
        <span class="mono caption">Visual Anchor: Central Plateau // Ref: 22.56 S, 17.08 E</span>
        <footer>
            <span class="mono">Page 01 // Executive Summary</span>
            <span class="mono">&copy; TANGISON</span>
        </footer>
    </article>

    <article class="page">
        <h2>III. Operational Architecture</h2>
        <div class="editor-rule"></div>
        <p style="margin-bottom: 20px;">
            The Times of Namibia utilizes a proprietary integration layer — <strong>Times OS</strong>. This system allows for the real-time monitoring of regional sentiment and data. We respect the "6-second rule," where all technical data is refreshed to prove the veracity of the information presented.
        </p>
        <h3 class="mono" style="margin-bottom: 10px; font-weight: bold;">Regional Node Deployment</h3>
        <table>
            <thead>
                <tr><th>Region</th><th>Status</th><th>Scraping Frequency</th><th>Core Focus</th></tr>
            </thead>
            <tbody>
                <tr><td>//Kharas</td><td class="red-marker">Active</td><td>6 Seconds</td><td>Resource Management, Green Hydrogen</td></tr>
                <tr><td>Oshana</td><td class="red-marker">Active</td><td>6 Seconds</td><td>Market Liquidity, Retail Sector</td></tr>
                <tr><td>Khomas</td><td class="red-marker">Active</td><td>6 Seconds</td><td>Governance, Policy, Central Business</td></tr>
                <tr><td>Erongo</td><td class="red-marker">Active</td><td>6 Seconds</td><td>Logistics, Maritime Trade, Mining</td></tr>
                <tr><td>Otjozondjupa</td><td style="opacity: 0.5;">Staging</td><td>Planned</td><td>Agriculture, Transport Corridor</td></tr>
                <tr><td>Zambezi</td><td style="opacity: 0.5;">Staging</td><td>Planned</td><td>Cross-border Trade, Tourism</td></tr>
            </tbody>
        </table>

        <h2 style="margin-top: 30px;">IV. Times OS — Technical Foundation</h2>
        <div class="editorial-rule"></div>
        <div class="grid-2">
            <div>
                <p>Times OS is the proprietary scraping and verification engine that powers every data point on the platform. Built on a microservices architecture, it aggregates from NIEIS, the Government Gazette, LinkedIn, CareerPortal, and NamibiaJobs in real-time.</p>
                <p>Each source is scraped on an independent cycle, with results validated against a 3-point verification matrix before publication. The engine maintains a compliance-first approach: every scraped datum carries its source, timestamp, and verification status.</p>
            </div>
            <div style="background: var(--ton-black); color: var(--ton-cream); padding: 15px;">
                <h3 class="mono" style="color: var(--ton-red);">Times OS v2.1 — Specifications</h3>
                <div style="font-family: var(--font-mono); font-size: 8pt; margin-top: 10px;">
                    <p>Sources Monitored: 4 Primary + 12 Secondary</p>
                    <p>Scraping Cycle: 6 Seconds</p>
                    <p>Verification: 3-Point Source Validation</p>
                    <p>Regions: 8 Active / 14 Total</p>
                    <p>Tenders Tracked: 200+ Active</p>
                    <p>Jobs Aggregated: 847/week avg</p>
                    <p>Uptime SLA: 99.7%</p>
                </div>
            </div>
        </div>

        <div class="img-container" style="height: 200px;">
            <p style="font-family: var(--font-display); font-style: italic; font-size: 10pt; color: #999; text-align: center; padding: 20px;">
                Close-up of server rack LEDs in a darkened data centre. Grayscale. JetBrains Mono timestamp in a black box at bottom-right.
            </p>
        </div>
        <span class="mono caption">System Integration: Times OS v1.0.4 Log Output</span>
        <footer>
            <span class="mono">Page 02 // Operations & Technology</span>
            <span class="mono">&copy; TANGISON</span>
        </footer>
    </article>

    <article class="page">
        <h2>V. Financial Roadmap</h2>
        <div class="editorial-rule"></div>
        <div class="grid-2">
            <div>
                <h3>Monetization</h3>
                <p style="font-size: 10pt; margin-top: 10px;">We reject intrusive advertising. Revenue is derived from:</p>
                <ul style="font-size: 10pt; margin-top: 10px;">
                    <li><strong>Broadsheet Sponsorships:</strong> High-density branded content.</li>
                    <li><strong>Times OS Data Licensing:</strong> B2B data streams for regional logistics.</li>
                    <li><strong>Premium Archive:</strong> High-fidelity print-on-demand assets.</li>
                </ul>
                <h3 style="margin-top: 20px;">Financial Projections</h3>
                <table style="margin-top: 10px;">
                    <thead><tr><th>Period</th><th>Revenue</th><th>Status</th></tr></thead>
                    <tbody>
                        <tr><td>FY 2026 H1</td><td>Seed + Pilot</td><td>Pre-revenue</td></tr>
                        <tr><td>FY 2026 H2</td><td>N$ 420K</td><td>Data Licensing Launch</td></tr>
                        <tr><td>FY 2027 H1</td><td>N$ 1.2M</td><td>Sponsorship Pipeline</td></tr>
                        <tr><td>FY 2027 H2</td><td>N$ 2.8M</td><td>Full Commercial Ops</td></tr>
                        <tr><td>FY 2028</td><td>N$ 6.5M</td><td>Profitability Target</td></tr>
                    </tbody>
                </table>
            </div>
            <div>
                <div style="background: var(--ton-black); color: var(--ton-cream); padding: 15px; margin-bottom: 20px;">
                    <h3 class="mono" style="color: var(--ton-red);">FY28 Goal</h3>
                    <p style="font-size: 24pt; font-family: var(--font-display); margin: 10px 0;">45%</p>
                    <p class="mono" style="font-size: 7pt;">Projected Market Share of Digital Editorial in Regional Centers.</p>
                </div>
                <div class="img-container" style="height: 180px;">
                    <p style="font-family: var(--font-display); font-style: italic; font-size: 10pt; color: #999; text-align: center; padding: 20px;">
                        Wide shot of Windhoek skyline at dusk from the Auas Mountains. Grayscale. GPS overlay: 22.57 S, 17.08 E.
                    </p>
                </div>
                <span class="mono caption">Financial Anchor: Windhoek CBD // Ref: 22.57 S, 17.08 E</span>
            </div>
        </div>
        <footer>
            <span class="mono">Page 03 // Financial Roadmap</span>
            <span class="mono">&copy; TANGISON</span>
        </footer>
    </article>

    <article class="page">
        <h2>VI. Print Materials & Social Output</h2>
        <div class="editorial-rule"></div>
        <div class="grid-2">
            <div>
                <h3>Physical Print Specifications</h3>
                <ul style="list-style: none; padding: 0; margin-top: 15px;">
                    <li style="margin-bottom: 12px;">
                        <span class="mono red-marker">Paper Stock</span><br>
                        Pure White or Cream stock, minimum 120gsm. No gloss. Matte finish only.
                    </li>
                    <li style="margin-bottom: 12px;">
                        <span class="mono red-marker">Typography Grid</span><br>
                        All type aligned to a baseline grid. Playfair Display 900, Inter 400, JetBrains Mono.
                    </li>
                    <li style="margin-bottom: 12px;">
                        <span class="mono red-marker">Imagery Rules</span><br>
                        High-contrast grayscale. No stock photography. GPS coordinates and JetBrains Mono timestamp in a black box.
                    </li>
                    <li style="margin-bottom: 12px;">
                        <span class="mono red-marker">Physical Space</span><br>
                        Brutalist minimalism. Sharp corners only. No soft textures. No rounded edges.
                    </li>
                </ul>
            </div>
            <div>
                <h3>The Broadside</h3>
                <p style="font-size: 10pt;">Single-page physical printout for high-density reading environments: transport hubs, taxi ranks, municipal notice boards.</p>
                <div style="background: var(--ton-black); color: var(--ton-cream); padding: 15px; margin-top: 15px;">
                    <h4 class="mono" style="color: var(--ton-red); margin: 0 0 10px 0;">Broadside Specs</h4>
                    <div style="font-family: var(--font-mono); font-size: 8pt;">
                        <p>Format: A3 Single Sheet, Double-Sided</p>
                        <p>Stock: 120gsm Cream, Matte</p>
                        <p>Distribution: 14 Regional Transport Hubs</p>
                        <p>Frequency: Weekly, Monday 06:00 CAT</p>
                        <p>Print Run: 5,000 copies/week initial</p>
                        <p>Content: Top 10 Stories + 5 Active Tenders</p>
                        <p>Reading Time: 90 Seconds Maximum</p>
                    </div>
                </div>
                <h3 style="margin-top: 20px;">Social Media — Digital Telegrams</h3>
                <p style="font-size: 10pt;">Every post must look like an excerpt from a ledger or a telegram. Monospaced timestamps. No emojis unless functional. Information density over engagement bait.</p>
            </div>
        </div>
        <footer>
            <span class="mono">Page 04 // Print Materials & Social Output</span>
            <span class="mono">&copy; TANGISON</span>
        </footer>
    </article>

    <article class="page">
        <div style="padding: 40px 0; text-align: center; border-top: 1px solid var(--ton-black); border-bottom: 1px solid var(--ton-black);">
            <span class="mono red-marker" style="font-size: 9pt;">Final Directive</span>
            <blockquote style="font-family: var(--font-display); font-style: italic; font-size: 18pt; color: #666; line-height: 1.5; margin: 20px auto; max-width: 500px;">
                "Information is the only currency that appreciates when shared correctly."
            </blockquote>
            <p class="mono" style="margin-top: 15px; color: #999;">— TANGISON Editorial Board</p>
        </div>
        <div class="grid-2" style="margin-top: 40px;">
            <div style="border-top: 1px solid #ddd; padding-top: 15px;">
                <span class="mono" style="color: #999;">Authorised By</span>
                <p style="font-family: var(--font-display); font-size: 14pt; font-weight: bold; margin-top: 10px;">TANGISON</p>
                <p class="mono" style="font-size: 8pt; color: #999;">Editorial & Architectural Board</p>
                <div style="border-top: 1px solid var(--ton-black); margin-top: 20px; padding-top: 5px;">
                    <p class="mono" style="color: #ccc;">Signature</p>
                </div>
            </div>
            <div style="border-top: 1px solid #ddd; padding-top: 15px;">
                <span class="mono" style="color: #999;">Date of Issue</span>
                <p style="font-family: var(--font-display); font-size: 14pt; font-weight: bold; margin-top: 10px;">${today}</p>
                <p class="mono" style="font-size: 8pt; color: #999;">Document Reference: TON-BP-2026-01</p>
                <p class="mono" style="font-size: 8pt; color: var(--ton-red);">Classification: Confidential</p>
            </div>
        </div>
        <footer>
            <span class="mono">Page 05 // Final Directive</span>
            <span class="mono">End of Document</span>
        </footer>
    </article>
</body>
</html>`;
}
