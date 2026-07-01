import React from "react";
import { ArrowLeft, Cpu, Radio, MapPin, ExternalLink } from "lucide-react";

export default function TANGISONView() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
          About // The Company
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
          TANGISON
        </h1>
        <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
          Enterprise data pipelines and publishing infrastructure for the African information landscape.
        </p>

        <div className="flex items-center gap-4 mt-4">
          <a
            href="/"
            className="font-mono text-[10px] text-ton-black/40 hover:text-ton-black transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3 h-3" />
            Newsroom
          </a>
          <span className="text-ton-black/10">|</span>
          <a
            href="https://tangison.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-ton-red hover:text-ton-red/80 transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            tangison.com
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Mission Statement - hero block */}
      <div className="py-8 sm:py-10 text-center border-t border-b border-ton-black mb-8 sm:mb-10">
        <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Principle</span>
        <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-ton-black leading-tight mt-4">
          Information Density Over Engagement Metrics
        </blockquote>
        <p className="font-mono text-[10px] text-ton-black/30 mt-4 tracking-widest uppercase">
          TANGISON - Windhoek, Namibia
        </p>
      </div>

      {/* Section I: Who We Are */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-2">
          I. Who We Are
        </h2>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="ton-dropcap">
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
              TANGISON is a Windhoek-based publishing and technology company that builds information infrastructure for the African continent. Founded on the conviction that Namibian readers deserve a news platform as rigorous and precise as the country they inhabit, the company operates at the intersection of editorial judgment and systems engineering.
            </p>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
              We do not publish opinion. We publish data - verified, timestamped, and sourced. We do not optimise for engagement. We optimise for understanding. Every product we build, from Times OS to TumaOS to The Broadside, is an expression of a single philosophy: that information density and editorial integrity are not just compatible, but inseparable.
            </p>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
              The company&rsquo;s flagship publication, Times of Namibia, is the living proof of this conviction. Built on the Broadsheet Digital philosophy, TON treats every screen as a front page and every reader as a citizen who demands the truth delivered with precision at the speed of data.
            </p>
          </div>

          <div className="bg-ton-black text-ton-cream p-5">
            <h3 className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-wider mb-3">
              Company At a Glance
            </h3>
            <div className="space-y-2 font-mono text-[10px]">
              {[
                { label: "Company", value: "TANGISON" },
                { label: "Website", value: "tangison.com" },
                { label: "Founded", value: "Windhoek, Namibia" },
                { label: "Publication", value: "Times of Namibia" },
                { label: "Philosophy", value: "Broadsheet Digital" },
                { label: "Core Engine", value: "Times OS v2.1" },
                { label: "Distribution", value: "TumaOS + The Broadside" },
                { label: "Coverage", value: "14 Namibian Regions" },
                { label: "Principle", value: "Density Over Metrics" },
              ].map((spec, i) => (
                <div key={i} className="flex items-center justify-between border-b border-ton-cream/8 pb-1.5">
                  <span className="text-ton-cream/40">{spec.label}</span>
                  <span className="text-ton-cream font-bold">{spec.value}</span>
                </div>
              ))}
            </div>
            <a
              href="https://tangison.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-red text-white px-4 py-2 hover:bg-ton-red/90 transition-colors"
            >
              Visit tangison.com
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Section I // Who We Are</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Section II: Products */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-2">
          II. Products &amp; Systems
        </h2>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-6">
          {/* Times OS */}
          <div className="pt-5 border-t border-ton-black/8">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-ton-red" />
              <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Times OS v2.1</span>
            </div>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed">
              The proprietary scraping and verification engine that powers every data point on the TON platform. Built on microservices architecture, aggregating from NIEIS, Government Gazette, LinkedIn, CareerPortal, and NamibiaJobs on an independent 6-second cycle with 3-point source validation.
            </p>
          </div>

          {/* TumaOS */}
          <div className="pt-5 border-t border-ton-black/8">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4 text-ton-red" />
              <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">TumaOS</span>
            </div>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed">
              The WhatsApp-native distribution pipeline. In a country where WhatsApp is the primary internet interface for millions, TumaOS ensures verified stories, tender alerts, and job listings reach the reader where they already are. Share mode formats articles with attribution; Listen mode converts verified content into audio dispatches.
            </p>
          </div>

          {/* The Broadside */}
          <div className="pt-5 border-t border-ton-black/8">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-ton-red" />
              <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">The Broadside</span>
            </div>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed">
              A3 single-sheet physical printouts at regional transport hubs, taxi ranks, and municipal notice boards. 14 regional editions, 5,000 copies per week, designed to be read standing up in under 90 seconds. 120gsm cream stock, sharp corners, Playfair Display headlines, and monospaced data columns.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Section II // Products & Systems</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Section III: Philosophy */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-2">
          III. The Broadsheet Digital Philosophy
        </h2>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
              Broadsheet Digital is the design and engineering philosophy that governs every decision at TANGISON. It dictates that every screen must carry the gravitas of a printed front page - heavy editorial borders, column rules, serif-dominant typography, and a high-contrast cream-and-black palette. The reader should feel the weight of information before they read a single word.
            </p>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
              We reject the shallow scroll. We reject infinite feeds. We design for density, not duration. If a reader can grasp the essential truth of a story from the layout alone - headline, timestamp, source, verification status - then the design has succeeded.
            </p>
          </div>
          <div>
            <ul style={{ listStyle: "none", padding: 0 }} className="space-y-4">
              {[
                { label: "Authority of Print", desc: "Heavy borders, column rules, serif headlines. Every screen is a front page, not a social media feed." },
                { label: "Precision of Data", desc: "Monospaced timestamps, verification badges, source attribution. The interface between human editorial and machine intelligence is visible and honest." },
                { label: "Density over Decoration", desc: "Every pixel must inform. Whitespace is generous but purposeful - it separates, not adorns." },
                { label: "3G-First Engineering", desc: "CSS-heavy, image-light. If it cannot load on a Nokia browsing through MTC in Oshakati within 6 seconds, it does not ship." },
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
          <span>Section III // Broadsheet Digital</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Final: Contact */}
      <section className="border-t-4 border-ton-black pt-6">
        <div className="py-10 sm:py-14 text-center border-t border-b border-ton-black">
          <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Contact</span>
          <blockquote className="font-serif text-2xl sm:text-3xl font-bold text-ton-black leading-tight mt-5">
            tangison.com
          </blockquote>
          <p className="font-mono text-[10px] text-ton-black/20 mt-4 tracking-wider">
            Windhoek, Namibia &middot; A TANGISON Publication
          </p>
          <a
            href="https://tangison.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-black text-ton-cream px-6 py-2.5 hover:bg-ton-black/90 transition-colors"
          >
            Visit tangison.com
          </a>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>About TANGISON // End</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>
    </div>
  );
}
