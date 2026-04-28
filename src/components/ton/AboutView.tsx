import React from "react";
import { ArrowLeft, Cpu, Radio, MapPin, Printer, Zap } from "lucide-react";

const REGIONS = [
  { name: "//Kharas", status: "Active", focus: "Resource Management, Green Hydrogen" },
  { name: "Oshana", status: "Active", focus: "Market Liquidity, Retail Sector" },
  { name: "Khomas", status: "Active", focus: "Governance, Policy, Central Business" },
  { name: "Erongo", status: "Active", focus: "Logistics, Maritime Trade, Mining" },
  { name: "Otjozondjupa", status: "Active", focus: "Agriculture, Transport Corridor" },
  { name: "Zambezi", status: "Active", focus: "Cross-border Trade, Tourism" },
  { name: "Kunene", status: "Staging", focus: "Conservation, Community Development" },
  { name: "Hardap", status: "Staging", focus: "Solar Energy, Irrigation" },
  { name: "Oshikoto", status: "Staging", focus: "Mining, Agriculture" },
  { name: "Ohangwena", status: "Staging", focus: "Border Trade, Agriculture" },
  { name: "Omusati", status: "Planned", focus: "Agriculture, Education" },
  { name: "Kavango East", status: "Planned", focus: "Agriculture, Forestry" },
  { name: "Kavango West", status: "Planned", focus: "Community Development" },
  { name: "Omaheke", status: "Planned", focus: "Livestock, Farming" },
];

export default function AboutView() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div>
          <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
            About // The Institution
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
            About Times of Namibia
          </h1>
          <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
            A GemsWeb Digital publication. Carrying print gravitas into the digital age since inception.
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

      {/* Mission Statement — hero block */}
      <div className="py-8 sm:py-10 text-center border-t border-b border-ton-black mb-8 sm:mb-10">
        <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Mission</span>
        <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-ton-black leading-tight mt-4">
          Namibia. Informed. Instantly.
        </blockquote>
        <p className="font-mono text-[10px] text-ton-black/30 mt-4 tracking-widest uppercase">
          Times of Namibia — GemsWeb Digital
        </p>
      </div>

      {/* Section I: Founding Vision */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            I. The Founding Vision
          </h2>
          <span className="font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">Est. GemsWeb Digital</span>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="md:border-r md:border-ton-black/8 md:pr-6">
            <div className="ton-dropcap">
              <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
                Times of Namibia was not founded to chase clicks. It was built to serve the intellectual capacity of a nation that deserves better than engagement bait and repurposed international feeds. We mine Namibian data for Namibian readers, and we present it with the authority that only print-born design language can carry into the digital age.
              </p>
            </div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
              As a GemsWeb Digital publication, TON operates at the intersection of editorial integrity and systems engineering. Every data point is scraped, verified, and timestamped. Every headline respects the reader&rsquo;s time. Every design decision prioritises information density over decorative excess.
            </p>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
              This is not a website. It is a high-density information architecture — a digital broadsheet that treats every screen as a front page and every reader as a citizen who demands the truth, delivered with precision, at the speed of data.
            </p>
          </div>

          <div>
            <div className="bg-ton-black text-ton-cream p-5">
              <h3 className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-wider mb-3">
                At a Glance
              </h3>
              <div className="space-y-2 font-mono text-[10px]">
                {[
                  { label: "Publisher", value: "GemsWeb Digital" },
                  { label: "Founded", value: "Windhoek, Namibia" },
                  { label: "Philosophy", value: "Broadsheet Digital" },
                  { label: "Engine", value: "Times OS v2.1" },
                  { label: "Verification", value: "3-Point Source Validation" },
                  { label: "Refresh Cycle", value: "6 Seconds" },
                  { label: "Regional Nodes", value: "14 Namibian Regions" },
                  { label: "Mission", value: "Namibia. Informed. Instantly." },
                ].map((spec, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-ton-cream/8 pb-1.5">
                    <span className="text-ton-cream/40">{spec.label}</span>
                    <span className="text-ton-cream font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Imagery placeholder */}
        <div className="mt-6 pt-5 border-t border-ton-black/8">
          <div className="bg-ton-black/[0.02] p-5 sm:p-6">
            <span className="font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">Visual Anchor</span>
            <div className="h-44 sm:h-56 bg-ton-black/[0.04] mt-2.5 flex items-center justify-center border border-ton-black/6">
              <div className="text-center px-6">
                <p className="font-serif text-sm text-ton-black/20 italic max-w-md mx-auto leading-relaxed">
                  Aerial photograph of Windhoek at first light, shot from the Khomas Hochland plateau looking east. Grayscale. The city grid emerges from the darkness in sharp geometric lines, with the Auas Mountains silhouetted behind. GPS overlay: 22.34 S, 17.08 E. Timestamp in JetBrains Mono within a black rectangular box at bottom-left. No colour. No people. Just structure and dawn.
                </p>
              </div>
            </div>
            <div className="bg-ton-black text-ton-cream px-2.5 py-1 inline-block mt-2">
              <span className="font-mono text-[8px]">Visual Anchor: Windhoek Dawn // Ref: 22.34 S, 17.08 E</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Section I // Founding Vision</span>
          <span>&copy; GemsWeb Digital</span>
        </div>
      </section>

      {/* Section II: Broadsheet Digital */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <Zap className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            II. The Broadsheet Digital Philosophy
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
              &ldquo;Broadsheet Digital&rdquo; is not a style. It is a philosophy. It dictates that every screen must carry the gravitas of a printed front page — heavy editorial borders, column rules, serif-dominant typography, and high-contrast cream-and-black palette. The reader should feel the weight of information before they read a single word.
            </p>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
              We reject the shallow scroll. We reject infinite feeds. We design for density, not duration. If a reader can grasp the essential truth of a story from the layout alone — headline, timestamp, source, verification status — then the design has succeeded. If they must scroll past three banners to find the lede, the design has failed.
            </p>
          </div>
          <div>
            <ul style={{ listStyle: "none", padding: 0 }} className="space-y-4">
              {[
                { label: "Authority of Print", desc: "Heavy borders, column rules, serif headlines. Every screen is a front page. The design carries the visual vocabulary of a broadsheet newspaper — not a social media feed." },
                { label: "Precision of Data", desc: "Monospaced timestamps, verification badges, source attribution. The interface between human editorial and machine intelligence is visible and honest." },
                { label: "Density over Decoration", desc: "Every pixel must inform. There is no room for decorative excess. Whitespace is generous but purposeful — it separates, not adorns." },
                { label: "3G-First Engineering", desc: "CSS-heavy, image-light. If a feature cannot load on a Nokia browsing through MTC in Oshakati within 6 seconds, it does not ship." },
              ].map((item, i) => (
                <li key={i}>
                  <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
                    {String(i + 1).padStart(2, "0")} {"//"} {item.label}
                  </span>
                  <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-1.5">
                    {item.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Section II // Broadsheet Digital</span>
          <span>&copy; GemsWeb Digital</span>
        </div>
      </section>

      {/* Section III: Times OS */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <Cpu className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            III. Times OS — The Verification Engine
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-5">
          Times OS is the proprietary scraping and verification engine that powers every data point on the platform. Built on a microservices architecture, it aggregates from NIEIS, the Government Gazette, LinkedIn, CareerPortal, and NamibiaJobs in real-time. Each source is scraped on an independent 6-second cycle, with results validated against a 3-point verification matrix before publication.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-6">
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">6-Second Cycle</span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              All technical data is refreshed within a 6-second cycle. When a reader sees &ldquo;Scraped 6s ago,&rdquo; they know the information is live, verified, and current. The timestamp is not decoration — it is proof.
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">3-Point Verification</span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              Every datum is validated against three independent sources before publication. Source A confirms Source B confirms Source C. If verification fails, the datum is flagged, not buried. Transparency is the protocol.
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Scraped Timestamps</span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              Every piece of data carries its source, timestamp, and verification status. This metadata is visible to the reader, creating a trust chain from government portal to reader screen in under 6 seconds.
            </p>
          </div>
        </div>

        {/* Times OS spec box */}
        <div className="bg-ton-black text-ton-cream p-5">
          <h3 className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-wider mb-3">
            Times OS v2.1 — Specifications
          </h3>
          <div className="space-y-2 font-mono text-[10px]">
            {[
              { label: "Sources Monitored", value: "4 Primary + 12 Secondary" },
              { label: "Scraping Cycle", value: "6 Seconds" },
              { label: "Verification Matrix", value: "3-Point Source Validation" },
              { label: "Regions Covered", value: "14 Total" },
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

        {/* Imagery */}
        <div className="mt-6 pt-5 border-t border-ton-black/8">
          <div className="bg-ton-black/[0.02] p-5">
            <span className="font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">System Visual</span>
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
          <span>Section III // Times OS</span>
          <span>&copy; GemsWeb Digital</span>
        </div>
      </section>

      {/* Section IV: TumaOS */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <Radio className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            IV. TumaOS — WhatsApp Share &amp; Listen Pipeline
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
              TumaOS is the WhatsApp-native distribution pipeline that extends TON&rsquo;s reach beyond the browser. In a country where WhatsApp is the primary internet interface for millions, TumaOS ensures that every verified story, tender alert, and job listing reaches the reader where they already are — inside a chat window.
            </p>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
              The pipeline supports two modes: <strong className="text-ton-black/80">Share</strong>, which formats any TON article as a high-density WhatsApp message with source attribution and timestamp; and <strong className="text-ton-black/80">Listen</strong>, which converts verified articles into audio dispatches for low-bandwidth and accessibility contexts. No engagement bait. No clickbait formatting. Just the verified fact, delivered stoically.
            </p>
          </div>
          <div className="bg-ton-black/[0.02] p-5 border border-ton-black/6">
            <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-3">TumaOS Capabilities</h3>
            <ul className="space-y-2.5">
              {[
                "One-tap share to WhatsApp with full source attribution",
                "Audio dispatch generation for verified articles",
                "Low-bandwidth optimised: text-first, image-optional",
                "Automatic timestamp and verification badge in shared content",
                "Regional targeting: share content relevant to the reader's node",
                "No emojis. No engagement formatting. Stoic delivery.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-ton-red flex-shrink-0 mt-1.5" />
                  <span className="font-sans text-xs text-ton-black/50 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Section IV // TumaOS</span>
          <span>&copy; GemsWeb Digital</span>
        </div>
      </section>

      {/* Section V: Regional Coverage */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <MapPin className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            V. Regional Coverage — 14 Namibian Regions
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-5">
          Times of Namibia maintains dedicated data nodes across all 14 administrative regions of Namibia. Each node scrapes regional government portals, procurement databases, and employment markets on an independent cycle. Our coverage is not performative — it is structural. Every region, from //Kharas in the south to Zambezi in the north-east, has a dedicated pipeline and a commitment to regional accuracy.
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-ton-black">
                <th className="font-mono text-[8px] font-bold uppercase tracking-widest py-2.5 pr-3">Region</th>
                <th className="font-mono text-[8px] font-bold uppercase tracking-widest py-2.5 pr-3">Status</th>
                <th className="font-mono text-[8px] font-bold uppercase tracking-widest py-2.5">Core Focus</th>
              </tr>
            </thead>
            <tbody>
              {REGIONS.map((row, i) => (
                <tr key={i} className="border-b border-ton-black/5">
                  <td className="font-serif text-sm py-2.5 pr-3 text-ton-black font-semibold">{row.name}</td>
                  <td className="font-mono text-[10px] py-2.5 pr-3">
                    <span className={
                      row.status === "Active" ? "text-ton-red font-bold" :
                      row.status === "Staging" ? "text-ton-black/30" :
                      "text-ton-black/15"
                    }>
                      {row.status}
                    </span>
                  </td>
                  <td className="font-sans text-[11px] py-2.5 text-ton-black/40">{row.focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Section V // Regional Coverage</span>
          <span>&copy; GemsWeb Digital</span>
        </div>
      </section>

      {/* Section VI: GemsWeb Digital */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-2">
          VI. GemsWeb Digital — The Company Behind TON
        </h2>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <div className="ton-dropcap">
              <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
                GemsWeb Digital is the publishing and technology company behind Times of Namibia. Founded with a singular conviction: that Namibian readers deserve a news infrastructure as rigorous and precise as the country they inhabit. The company operates at the intersection of editorial judgment and systems engineering, building tools that scrape, verify, and deliver information with the stoic precision of a well-run machine.
              </p>
            </div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
              GemsWeb Digital does not publish opinion. It publishes data, verified and timestamped. It does not optimise for engagement. It optimises for understanding. The company&rsquo;s products — Times OS, TumaOS, The Broadside — are all expressions of a single philosophy: information density over engagement metrics.
            </p>
          </div>
          <div className="bg-ton-black text-ton-cream p-5">
            <h3 className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-wider mb-3">
              GemsWeb Digital
            </h3>
            <div className="space-y-2 font-mono text-[10px]">
              {[
                { label: "Website", value: "gemsweb.xyz" },
                { label: "Location", value: "Windhoek, Namibia" },
                { label: "Publication", value: "Times of Namibia" },
                { label: "Engine", value: "Times OS" },
                { label: "Distribution", value: "TumaOS + The Broadside" },
                { label: "Philosophy", value: "Broadsheet Digital" },
              ].map((spec, i) => (
                <div key={i} className="flex items-center justify-between border-b border-ton-cream/8 pb-1.5">
                  <span className="text-ton-cream/40">{spec.label}</span>
                  <span className="text-ton-cream font-bold">{spec.value}</span>
                </div>
              ))}
            </div>
            <a
              href="https://gemsweb.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-red text-white px-4 py-2 hover:bg-ton-red/90 transition-colors"
            >
              Visit gemsweb.xyz
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Section VI // GemsWeb Digital</span>
          <span>&copy; GemsWeb Digital</span>
        </div>
      </section>

      {/* Section VII: The Broadside */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <Printer className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            VII. The Broadside — Physical Print at Transport Hubs
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
              The Broadside is a single-page physical printout designed for high-density reading environments: regional transport hubs, taxi ranks, municipal notice boards, and government building entrances. It is designed to be read standing up, in transit, in under 90 seconds. Every word earns its place on the page.
            </p>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
              Printed on 120gsm cream stock with sharp corners and a baseline grid, The Broadside carries the same editorial DNA as the digital platform — Playfair Display headlines, monospaced data, grayscale imagery with GPS overlays. It is the physical manifestation of the Broadsheet Digital philosophy, placed where digital cannot reach.
            </p>
          </div>
          <div className="bg-ton-black text-ton-cream p-5">
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
        </div>

        {/* Imagery */}
        <div className="mt-6 pt-5 border-t border-ton-black/8">
          <div className="bg-ton-black/[0.02] p-5">
            <span className="font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">Print Material Visual</span>
            <div className="h-32 sm:h-40 bg-ton-black/[0.04] mt-2.5 flex items-center justify-center border border-ton-black/6">
              <div className="text-center px-6">
                <p className="font-serif text-xs text-ton-black/20 italic max-w-md mx-auto leading-relaxed">
                  Flat-lay photograph of a printed Broadside on a concrete surface. Grayscale. The A3 sheet shows sharp black typography on cream stock, with column rules and editorial borders clearly visible. A hand holds the top corner. GPS overlay: 22.57 S, 17.08 E. The image conveys tactility, authority, and the physical reality of print in a digital age.
                </p>
              </div>
            </div>
            <div className="bg-ton-black text-ton-cream px-2.5 py-1 inline-block mt-2">
              <span className="font-mono text-[8px]">Print Specification: The Broadside // A3 on 120gsm Cream</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Section VII // The Broadside</span>
          <span>&copy; GemsWeb Digital</span>
        </div>
      </section>

      {/* Final: Mission Restatement */}
      <section className="border-t-4 border-ton-black pt-6">
        <div className="py-10 sm:py-14 text-center border-t border-b border-ton-black">
          <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">The Mission</span>
          <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-ton-black leading-tight mt-5">
            Namibia. Informed. Instantly.
          </blockquote>
          <p className="font-mono text-[10px] text-ton-black/20 mt-4 tracking-wider">
            — GemsWeb Digital Editorial Board
          </p>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>About Times of Namibia // End</span>
          <span>&copy; GemsWeb Digital</span>
        </div>
      </section>
    </div>
  );
}
