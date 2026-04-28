"use client";

import React from "react";
import { ArrowLeft, Printer } from "lucide-react";

export default function ThePlanView() {
  const handlePrint = () => {
    window.print();
  };

  const phases = [
    {
      number: "I",
      title: "The Physical Anchor",
      period: "Q1 — Q2 2026",
      description: "Establish the print-ready Business Plan and the Broadside distribution network. This is the constitution of the company — readable, authoritative, and physically imposing. No digital-only strategy survives without a physical manifestation of intent.",
      tasks: [
        "Finalise and print the Business Plan document on 120gsm cream stock",
        "Deploy Broadside print runs at 5 pilot transport hubs in Khomas and Erongo",
        "Establish GPS-tagged photography workflow for all editorial imagery",
        "Set up the print-on-demand pipeline for premium archive products",
        "Train 3 regional distribution coordinators in Windhoek, Swakopmund, and Luderitz",
      ],
      imagery: {
        description: "Wide-angle photograph of a printing press in operation. Grayscale. The mechanical arms of the press feeding cream-stock paper through ink rollers. Shot from a low angle to emphasise the industrial scale. Steam rising from the drying section. GPS overlay: 22.57 S, 17.08 E. Timestamp in JetBrains Mono within a black box at bottom-left. No colour. The image must convey the physical weight and mechanical precision of print production.",
        overlay: "Black rectangular box at bottom-left containing GPS coordinates in JetBrains Mono 8pt. White text on black. Sharp corners only. Position: 20px from left edge, 20px from bottom edge.",
      },
    },
    {
      number: "II",
      title: "Social Media & The Times OS Feed",
      period: "Q2 — Q3 2026",
      description: "Conversion of all social outputs to 'Digital Telegrams.' Automation of scraping logs from //Kharas and Oshana directly into public feeds. The social media presence is not a marketing channel — it is a data dissemination channel. Every post carries the same verification metadata as the platform itself.",
      tasks: [
        "Design the Digital Telegram template for all social platforms",
        "Automate scraping log output to X (Twitter), WhatsApp Channels, and Facebook",
        "Implement monospaced timestamp format across all social templates",
        "Deploy TumaOS integration for WhatsApp Listen (TTS) on all articles",
        "Create the verification badge system for social media posts",
      ],
      imagery: {
        description: "Overhead photograph of a smartphone screen displaying a Digital Telegram post, lying on a concrete desk surface. Grayscale. The screen shows monospaced text on a cream background with a red LIVE indicator. Next to the phone: a closed notebook, a fountain pen, and a half-filled coffee cup. The composition suggests the intersection of digital precision and analogue discipline. GPS overlay: 22.56 S, 17.08 E.",
        overlay: "Black rectangular box at bottom-right containing the post timestamp in JetBrains Mono 8pt. The timestamp reads the exact moment of capture, not publication. Sharp corners. Position: 20px from right edge, 20px from bottom edge.",
      },
    },
    {
      number: "III",
      title: "High-Density Physical Distribution",
      period: "Q3 — Q4 2026",
      description: "Deployment of 'The Broadside' — single-page physical printouts at regional transport hubs, designed to be read in high-density environments. The Broadside is not a newsletter. It is a tactical information deployment, positioned where people are stationary and attentive: taxi ranks, hospital waiting rooms, municipal queues.",
      tasks: [
        "Scale Broadside distribution from 5 to 14 regional hubs",
        "Implement weekly editorial selection process for Broadside content",
        "Establish feedback loop from regional coordinators to editorial desk",
        "Design and print the Broadside display stand (sharp corners, black steel)",
        "Deploy the 'Reading in 90 Seconds' editorial standard for all Broadside content",
      ],
      imagery: {
        description: "Photograph of a Broadside display stand at the Windhoek Intercape bus terminal. Grayscale. The black steel stand holds a stack of A3 cream-stock printouts. A commuter in the background reads one while waiting. The stand is bolted to the concrete floor. Shot from 3 metres distance at eye level. GPS overlay: 22.57 S, 17.08 E. The image conveys information access in transit — the Broadside doing its job.",
        overlay: "Black rectangular box at bottom-left containing the hub name and GPS coordinates in JetBrains Mono 8pt. Format: 'WINDHOEK INTERCAPE // 22.57 S, 17.08 E'. Sharp corners only.",
      },
    },
    {
      number: "IV",
      title: "Data Sovereignty & Expansion",
      period: "Q1 — Q4 2027",
      description: "Full deployment of Times OS data licensing. Establish the B2B revenue stream by packaging real-time tender, job, and regulatory data for legal firms, procurement consultants, and logistics companies. This phase transitions Times of Namibia from a media company to a data intelligence company with an editorial front.",
      tasks: [
        "Launch Times OS API with tiered pricing (Free, Professional, Enterprise)",
        "Onboard 10 B2B pilot clients in legal, logistics, and procurement sectors",
        "Deploy regional data nodes in remaining 6 regions (Kunene, Hardap, Omusati, Oshikoto, Ohangwena, Kavango West)",
        "Establish the Times OS compliance reporting module for tender tracking",
        "Create the Annual Tender Compilation print product for institutional subscribers",
      ],
      imagery: {
        description: "Aerial photograph of the Walvis Bay port at dawn. Grayscale. Container ships docked at the quay, cranes silhouetted against the horizon. The salt works visible to the south. Shot from 400m altitude looking east toward the harbour. The image represents trade, logistics, and the data infrastructure that underpins Namibian commerce. GPS overlay: 22.96 S, 14.51 E.",
        overlay: "Black rectangular box at bottom-centre containing the port name and coordinates in JetBrains Mono 8pt. Format: 'WALVIS BAY PORT // 22.96 S, 14.51 E'. Sharp corners only. Thin 1px white border inside the black box for visual separation.",
      },
    },
    {
      number: "V",
      title: "The Editorial Citadel",
      period: "Q1 2028 onwards",
      description: "Consolidation. The editorial operation becomes self-sustaining through diversified revenue. The Contributor Dashboard scales to support verified regional correspondents. The platform becomes the definitive source of Namibian business intelligence, not merely a news website, but the information infrastructure that the country's commercial and institutional ecosystem depends upon.",
      tasks: [
        "Achieve profitability target of N$ 6.5M annual revenue",
        "Scale Contributor Dashboard to 50 verified regional correspondents",
        "Launch the Premium Archive with 10,000+ indexed documents",
        "Establish the Times of Namibia Editorial Fellowship programme",
        "Begin Phase 2 infrastructure: satellite data integration for agricultural and environmental reporting",
      ],
      imagery: {
        description: "Photograph of the Brandberg Mountain at sunset. Grayscale. The monolith dominates the frame, its shadow stretching across the gravel plains. A single acacia tree in the foreground provides scale. Shot from 2km distance with a 200mm lens. The image represents permanence, authority, and the enduring landscape that Times of Namibia serves. GPS overlay: 21.07 S, 14.28 E.",
        overlay: "Black rectangular box at bottom-left containing the mountain name and coordinates in JetBrains Mono 8pt. Format: 'BRANDBERG // 21.07 S, 14.28 E'. Sharp corners only. The box sits partially overlaid on the shadow area for visual grounding.",
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Screen-only header */}
      <div className="mb-8 sm:mb-10 ton-no-print">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-ton-red font-semibold">
              Strategic Execution Plan
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
              The Plan
            </h1>
            <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
              Five phases. From physical anchor to editorial citadel. Every phase
              produces working, testable output. No phase depends on the next for viability.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 bg-ton-black text-ton-cream hover:bg-ton-black/90 transition-colors flex-shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <a
            href="/"
            className="font-mono text-[10px] text-ton-black/40 hover:text-ton-black transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3 h-3" />
            Newsroom
          </a>
          <span className="font-mono text-[10px] text-ton-black/30">GemsWeb Digital</span>
        </div>
      </div>

      {/* Guiding Principle */}
      <div className="py-8 sm:py-10 text-center border-t border-ton-black/10 mb-8 sm:mb-10">
        <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ton-black/60 leading-relaxed">
          &ldquo;Minimalism as Power. Every process that doesn&apos;t inform the reader or the system is deleted.&rdquo;
        </blockquote>
        <p className="font-mono text-[10px] text-ton-black/30 mt-4 tracking-widest uppercase">
          Operational Ethos — Times of Namibia
        </p>
      </div>

      {/* 3G Logic */}
      <div className="bg-ton-black text-ton-cream p-6 sm:p-8 mb-10 sm:mb-12">
        <h3 className="font-mono text-xs text-ton-red font-bold uppercase tracking-wider mb-3">
          The &ldquo;3G&rdquo; Logic
        </h3>
        <p className="font-serif text-lg sm:text-xl text-ton-cream/80 leading-relaxed">
          If a strategy, image, or document is too heavy to be understood in 6 seconds, it is flawed.
        </p>
        <p className="font-sans text-sm text-ton-cream/40 mt-3 leading-relaxed">
          This principle governs every decision in The Plan. Every phase, every task, every deliverable must
          pass the 6-second comprehension test. If a reader cannot understand what they are looking at within
          6 seconds of encountering it, the design has failed. If a stakeholder cannot understand a phase&apos;s
          output within 6 seconds of reviewing it, the specification has failed. The 3G Logic is not a metaphor —
          it is a measurement standard.
        </p>
      </div>

      {/* Phases */}
      {phases.map((phase) => (
        <section key={phase.number} className="mb-10 sm:mb-12">
          <div className="flex items-start gap-4 mb-4">
            <span className="font-mono text-3xl sm:text-4xl font-bold text-ton-red leading-none flex-shrink-0">
              {phase.number}
            </span>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ton-black leading-tight">
                {phase.title}
              </h2>
              <span className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-widest mt-1 block">
                {phase.period}
              </span>
            </div>
          </div>

          <div className="h-px bg-ton-black/10 mb-6" />

          <p className="font-serif text-sm sm:text-base text-ton-black/70 leading-[1.8] mb-6">
            {phase.description}
          </p>

          {/* Tasks */}
          <div className="mb-6">
            <h3 className="font-mono text-[10px] font-bold text-ton-black uppercase tracking-widest mb-4">
              Execution Tasks
            </h3>
            <div className="space-y-0">
              {phase.tasks.map((task, i) => (
                <div key={i} className={`py-3 flex items-start gap-3 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                  <span className="font-mono text-[10px] text-ton-red font-bold flex-shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-sm text-ton-black/60 leading-relaxed">
                    {task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Imagery Description */}
          <div className="bg-ton-black/3 p-5 sm:p-6">
            <span className="font-mono text-[9px] text-ton-black/30 uppercase tracking-widest">
              Phase {phase.number} Imagery Specification
            </span>
            <div className="h-32 sm:h-44 bg-ton-black/5 mt-3 flex items-center justify-center border border-ton-black/10 mb-3">
              <div className="text-center px-6">
                <p className="font-mono text-[10px] text-ton-black/20 uppercase tracking-widest">[ Imagery Placeholder ]</p>
                <p className="font-serif text-xs text-ton-black/40 italic mt-1.5 max-w-sm mx-auto line-clamp-3">
                  {phase.imagery.description.substring(0, 120)}...
                </p>
              </div>
            </div>
            <p className="font-serif text-xs sm:text-sm text-ton-black/50 leading-relaxed mb-3">
              {phase.imagery.description}
            </p>
            <div className="pt-3 border-t border-ton-black/5">
              <span className="font-mono text-[9px] text-ton-red font-bold uppercase tracking-widest">
                Overlay Specification
              </span>
              <p className="font-sans text-xs text-ton-black/40 leading-relaxed mt-1.5">
                {phase.imagery.overlay}
              </p>
            </div>
          </div>
        </section>
      ))}

      {/* Imagery Rules Summary */}
      <section className="mb-10 sm:mb-12 pt-8 border-t-4 border-ton-black">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ton-black mb-2">
          Imagery Rules — All Phases
        </h2>
        <div className="h-px bg-ton-black/10 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div>
            <h3 className="font-mono text-[10px] font-bold text-ton-red uppercase tracking-widest mb-4">
              Universal Rules
            </h3>
            <div className="space-y-3">
              {[
                "All photography must be high-contrast grayscale — no exceptions",
                "No stock photography. If it is not Namibia, it is not Times of Namibia",
                "Every image must carry a GPS coordinate watermark in a black box",
                "Every image must carry a JetBrains Mono timestamp in the same black box",
                "No rounded corners on any overlay element — sharp rectangles only",
                "Images are displayed grayscale by default; colour appears on hover (digital only)",
                "Print imagery is always grayscale — no hover state in print",
                "All images must be shot with Namibian content: landscapes, infrastructure, people, commerce",
                "No artificial lighting in outdoor shots — natural light only",
                "Aspect ratio: 16:9 for hero images, 4:3 for inline, 1:1 for portraits",
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-ton-red flex-shrink-0 mt-1.5" />
                  <span className="font-sans text-xs sm:text-sm text-ton-black/60 leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[10px] font-bold text-ton-red uppercase tracking-widest mb-4">
              Overlay Template
            </h3>
            <div className="bg-ton-black/3 p-5">
              <div className="bg-ton-black/5 h-48 flex items-center justify-center border border-ton-black/10 mb-3 relative">
                <p className="font-mono text-[10px] text-ton-black/20 uppercase tracking-widest">[ Image Area ]</p>
                {/* Overlay simulation */}
                <div className="absolute bottom-3 left-3 bg-ton-black text-ton-cream px-2.5 py-1.5">
                  <p className="font-mono text-[8px] leading-tight">
                    LOCATION NAME // 00.00 S, 00.00 E<br/>
                    2026-04-28 14:32:07 CAT
                  </p>
                </div>
              </div>
              <p className="font-sans text-xs text-ton-black/40 leading-relaxed">
                The overlay sits at bottom-left (default) or bottom-right (variant). Black rectangular box.
                JetBrains Mono 8pt. GPS coordinates in uppercase. Timestamp in ISO-8601 with CAT timezone.
                Sharp corners. No border-radius. The overlay is mandatory on every published image.
              </p>
            </div>

            <h3 className="font-mono text-[10px] font-bold text-ton-red uppercase tracking-widest mb-4 mt-8">
              Layout Grid
            </h3>
            <div className="space-y-3">
              {[
                "Homepage: 3-column broadsheet grid (3-6-3 ratio at 12-column)",
                "Article pages: single column with 620px content width maximum",
                "Data pages (Jobs, Tenders): full-width with inline filters",
                "Business Plan: 2-column grid with column rules for A4 print",
                "The Broadside: single A3 sheet, 3-column grid, no images wider than 1 column",
                "Mobile: single column, all column rules removed, editorial borders retained",
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-ton-red flex-shrink-0 mt-1.5" />
                  <span className="font-sans text-xs sm:text-sm text-ton-black/60 leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-8 text-center border-t border-ton-black/10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="bg-ton-black text-ton-cream font-mono text-[10px] font-bold px-2.5 py-1 tracking-widest">TON</div>
          <div className="bg-ton-red text-white font-mono text-[10px] font-bold px-2.5 py-1 tracking-widest">PLAN</div>
        </div>
        <p className="font-mono text-[10px] text-ton-black/30 tracking-widest uppercase">
          A GemsWeb Digital Publication // {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
