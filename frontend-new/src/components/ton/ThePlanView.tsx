"use client";

import React from "react";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { toast } from "sonner";

export default function ThePlanView() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHTML = () => {
    const htmlContent = generateStandalonePlanHTML();
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TON-The-Plan-2026-2028.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("The Plan downloaded as HTML");
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
      layout: {
        title: "The Broadside — A3 Layout",
        description: "Single A3 sheet, double-sided. Front page: three-column grid with the TON masthead spanning the full width at top. Below the masthead, a 2pt black rule. Column 1: lead story with drop cap, 40% of page height. Column 2: two shorter stories stacked vertically, each with a 1pt column rule separator. Column 3: market data table (6 rows), followed by the Tender Edge — 3 active tenders with doc IDs and values. Bottom strip: 20mm black band with GPS coordinates and publication date in JetBrains Mono on cream. No images wider than one column. Back page: contributor guidelines, submission wire format, and the next edition preview. All text in Playfair Display (headlines), Inter (body), JetBrains Mono (data). No colour. Grayscale only.",
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
      layout: {
        title: "Digital Telegram — Social Template",
        description: "Each social media post follows an identical template: monospaced timestamp at top (JetBrains Mono, 8pt equivalent), followed by a 1pt horizontal rule, then the source attribution in uppercase red (#CB102E on digital, black on print). Below: the headline in Playfair Display bold, maximum 12 words. Below: a single data point — one number, one fact, one verified datum. No hashtags. No emojis. No call-to-action. Footer: a black band with 'Times of Namibia // TANGISON' in JetBrains Mono. All posts are single-frame images, not threads. The format is rigid because the format IS the brand.",
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
      layout: {
        title: "Display Stand — Physical Specification",
        description: "The Broadside display stand is fabricated from 3mm black steel plate. Dimensions: 450mm wide x 300mm deep x 1200mm tall. The literature holder is angled at 15 degrees for easy removal. No paint — raw black steel with clear coat only. A laser-cut 'TON' badge on the front panel in JetBrains Mono, 20mm height. The base plate is 400mm x 300mm, bolted to the floor with 4 masonry anchors. Total weight: approximately 18kg. The stand must look permanent, institutional, and unyielding. It is not a promotional item — it is infrastructure.",
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
      layout: {
        title: "Times OS API Documentation — Print Format",
        description: "The API documentation is printed as a saddle-stitched A5 booklet on 120gsm cream stock. Cover: black background with 'Times OS API' in Playfair Display 24pt, version number in JetBrains Mono. Interior: two-column layout with endpoint descriptions on the left and JSON response examples on the right (JetBrains Mono, 8pt). Each endpoint is separated by a 2pt black rule. Authentication section uses a black background with cream text for visual distinction. The booklet must be shelf-stable and reference-grade. It is not a brochure — it is a technical manual.",
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
      layout: {
        title: "Premium Archive — Annual Compilation",
        description: "The Annual Compilation is a perfect-bound A4 book, 200-300 pages, on 120gsm cream stock. Cover: full-bleed grayscale photograph of a Namibian landscape with the GPS overlay box. Title in Playfair Display 900, subtitle in Inter 400. Interior: single-column layout with generous margins (25mm top, 20mm sides, 15mm bottom). Each section opens with a 2pt black rule and section title in Playfair Display bold. Entries are chronological, with JetBrains Mono timestamps and source attributions. Index at the back: by region, by sector, by date. The book must feel archival — something a law firm would shelve alongside regulatory codes.",
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Screen-only header */}
      <div className="mb-8 sm:mb-10 ton-no-print">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
              Strategic Execution Plan
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
              The Plan
            </h1>
            <p className="font-serif italic text-ton-black/55 text-sm sm:text-base mt-2 max-w-xl">
              Five phases. From physical anchor to editorial citadel. Every phase
              produces working, testable output.
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
        </div>
      </div>

      {/* Guiding Principle */}
      <div className="py-6 sm:py-8 text-center border-t border-ton-black/8 mb-6 sm:mb-8">
        <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl text-ton-black/65 leading-relaxed">
          &ldquo;Minimalism as Power. Every process that doesn&apos;t inform the reader or the system is deleted.&rdquo;
        </blockquote>
        <p className="font-mono text-[9px] text-ton-black/20 mt-3 tracking-widest uppercase">
          Operational Ethos — Times of Namibia
        </p>
      </div>

      {/* 3G Logic */}
      <div className="bg-ton-black text-ton-cream p-5 sm:p-6 mb-8 sm:mb-10">
        <h3 className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-wider mb-2">
          The &ldquo;3G&rdquo; Logic
        </h3>
        <p className="font-serif text-base sm:text-lg text-ton-cream/70 leading-relaxed">
          If a strategy, image, or document is too heavy to be understood in 6 seconds, it is flawed.
        </p>
        <p className="font-sans text-sm text-ton-cream/55 mt-2 leading-relaxed">
          This principle governs every decision in The Plan. Every phase, every task, every deliverable must
          pass the 6-second comprehension test. The 3G Logic is not a metaphor — it is a measurement standard.
        </p>
      </div>

      {/* Phases */}
      {phases.map((phase) => (
        <section key={phase.number} className="mb-8 sm:mb-10 ton-bp-page">
          <div className="flex items-start gap-3 mb-3">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-ton-red leading-none flex-shrink-0">
              {phase.number}
            </span>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black leading-tight">
                {phase.title}
              </h2>
              <span className="font-mono text-[9px] text-ton-red font-bold uppercase tracking-widest mt-0.5 block">
                {phase.period}
              </span>
            </div>
          </div>

          <div className="h-px bg-ton-black/8 mb-4" />

          <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-5">
            {phase.description}
          </p>

          {/* Tasks */}
          <div className="mb-5">
            <h3 className="font-mono text-[9px] font-bold text-ton-black uppercase tracking-widest mb-3">
              Execution Tasks
            </h3>
            <div className="space-y-0">
              {phase.tasks.map((task, i) => (
                <div key={i} className={`py-2 flex items-start gap-2.5 ${i > 0 ? "border-t border-ton-black/4" : ""}`}>
                  <span className="font-mono text-[9px] text-ton-red font-bold flex-shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-sm text-ton-black/65 leading-relaxed">
                    {task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Imagery Description */}
          <div className="bg-ton-black/[0.02] p-4 sm:p-5 mb-4">
            <span className="font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
              Phase {phase.number} Imagery
            </span>
            <div className="h-28 sm:h-36 bg-ton-black/[0.04] mt-2 flex items-center justify-center border border-ton-black/6 mb-2.5">
              <div className="text-center px-5">
                <p className="font-serif text-xs text-ton-black/15 italic line-clamp-3">
                  {phase.imagery.description.substring(0, 100)}...
                </p>
              </div>
            </div>
            <p className="font-serif text-xs sm:text-sm text-ton-black/55 leading-relaxed mb-2.5">
              {phase.imagery.description}
            </p>
            <div className="pt-2.5 border-t border-ton-black/4">
              <span className="font-mono text-[8px] text-ton-red font-bold uppercase tracking-widest">
                Overlay Specification
              </span>
              <p className="font-sans text-xs text-ton-black/30 leading-relaxed mt-1">
                {phase.imagery.overlay}
              </p>
            </div>
          </div>

          {/* Layout Description */}
          <div className="border-l-[3px] border-ton-red pl-4 mb-5">
            <span className="font-mono text-[9px] text-ton-red font-bold uppercase tracking-widest">
              {phase.layout.title}
            </span>
            <p className="font-serif text-sm text-ton-black/65 leading-relaxed mt-1.5">
              {phase.layout.description}
            </p>
          </div>
        </section>
      ))}

      {/* Imagery Rules Summary */}
      <section className="mb-8 sm:mb-10 pt-6 border-t-4 border-ton-black ton-bp-page">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-2">
          Imagery Rules — All Phases
        </h2>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h3 className="font-mono text-[9px] font-bold text-ton-red uppercase tracking-widest mb-3">
              Universal Rules
            </h3>
            <div className="space-y-2">
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
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-ton-red flex-shrink-0 mt-1.5" />
                  <span className="font-sans text-xs text-ton-black/65 leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[9px] font-bold text-ton-red uppercase tracking-widest mb-3">
              Overlay Template
            </h3>
            <div className="bg-ton-black/[0.02] p-4">
              <div className="bg-ton-black/[0.04] h-36 flex items-center justify-center border border-ton-black/6 mb-2.5 relative">
                <p className="font-mono text-[9px] text-ton-black/15 uppercase tracking-widest">[ Image Area ]</p>
                <div className="absolute bottom-2 left-2 bg-ton-black text-ton-cream px-2 py-1">
                  <p className="font-mono text-[7px] leading-tight">
                    LOCATION NAME // 00.00 S, 00.00 E<br/>
                    2026-04-28 14:32:07 CAT
                  </p>
                </div>
              </div>
              <p className="font-sans text-xs text-ton-black/30 leading-relaxed">
                The overlay sits at bottom-left (default) or bottom-right (variant). Black rectangular box.
                JetBrains Mono 8pt. GPS coordinates in uppercase. Timestamp in ISO-8601 with CAT timezone.
                Sharp corners. No border-radius. The overlay is mandatory on every published image.
              </p>
            </div>

            <h3 className="font-mono text-[9px] font-bold text-ton-red uppercase tracking-widest mb-3 mt-6">
              Layout Grid
            </h3>
            <div className="space-y-2">
              {[
                "Homepage: 3-column broadsheet grid (3-6-3 ratio at 12-column)",
                "Article pages: single column with 620px content width maximum",
                "Data pages (Jobs, Tenders): full-width with inline filters",
                "Business Plan: 2-column grid with column rules for A4 print",
                "The Broadside: single A3 sheet, 3-column grid, no images wider than 1 column",
                "Mobile: single column, all column rules removed, editorial borders retained",
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-ton-red flex-shrink-0 mt-1.5" />
                  <span className="font-sans text-xs text-ton-black/65 leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-6 text-center border-t border-ton-black/8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="bg-ton-black text-ton-cream font-mono text-[9px] font-bold px-2 py-0.5 tracking-widest">TON</div>
          <div className="bg-ton-red text-white font-mono text-[9px] font-bold px-2 py-0.5 tracking-widest">PLAN</div>
        </div>
        <p className="font-mono text-[9px] text-ton-black/20 tracking-widest uppercase">
          A TANGISON Publication // {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

function generateStandalonePlanHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Plan - Times of Namibia</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root { --ton-cream: #F9F8F6; --ton-black: #111111; --ton-red: #CB102E; --font-display: 'Playfair Display', serif; --font-sans: 'Inter', sans-serif; --font-mono: 'JetBrains Mono', monospace; }
        * { box-sizing: border-box; border-radius: 0 !important; }
        body { background: var(--ton-cream); color: var(--ton-black); margin: 0; padding: 40px; font-family: var(--font-sans); }
        .page { max-width: 800px; margin: 0 auto 40px; padding: 20mm; border-top: 4px solid var(--ton-black); }
        @media print { body { padding: 0; } .page { page-break-after: always; margin: 0; } }
        h1, h2 { font-family: var(--font-display); margin: 0; }
        h3 { font-family: var(--font-mono); font-size: 9pt; text-transform: uppercase; letter-spacing: 0.05em; }
        p { font-size: 11pt; line-height: 1.6; color: #444; }
        .mono { font-family: var(--font-mono); font-size: 8pt; text-transform: uppercase; letter-spacing: 0.05em; }
        .red { color: var(--ton-red); font-weight: bold; }
        .rule { border-top: 1px solid #ddd; margin: 15px 0; }
        .black-box { background: var(--ton-black); color: var(--ton-cream); padding: 15px; margin: 15px 0; }
        .img-desc { background: #f5f5f3; padding: 15px; border: 1px solid #ddd; margin: 15px 0; font-style: italic; font-size: 10pt; }
    </style>
</head>
<body>
    <div class="page">
        <h1 style="font-size: 36pt;">THE PLAN</h1>
        <p class="mono red" style="margin-top: 5px;">Strategic Execution Plan // Times of Namibia</p>
        <p class="mono" style="margin-top: 3px;">A TANGISON Publication</p>
        <div class="rule"></div>
        <p style="font-style: italic; font-family: var(--font-display); font-size: 14pt;">"Minimalism as Power. Every process that doesn't inform the reader or the system is deleted."</p>
        <div class="black-box">
            <h3 style="color: var(--ton-red);">The "3G" Logic</h3>
            <p style="color: #ccc; font-size: 12pt; font-family: var(--font-display);">If a strategy, image, or document is too heavy to be understood in 6 seconds, it is flawed.</p>
        </div>
    </div>
    <div class="page">
        <h2 style="font-size: 24pt;"><span class="red">I.</span> The Physical Anchor <span class="mono red">Q1-Q2 2026</span></h2>
        <div class="rule"></div>
        <p>Establish the print-ready Business Plan and the Broadside distribution network. This is the constitution of the company — readable, authoritative, and physically imposing.</p>
        <div class="img-desc">Wide-angle photograph of a printing press in operation. Grayscale. GPS overlay: 22.57 S, 17.08 E. JetBrains Mono timestamp in black box at bottom-left.</div>
        <h3>Layout: The Broadside</h3>
        <p>Single A3 sheet, double-sided. Three-column grid with TON masthead spanning full width. No images wider than one column. All text in Playfair Display (headlines), Inter (body), JetBrains Mono (data).</p>
    </div>
    <div class="page">
        <h2 style="font-size: 24pt;"><span class="red">II.</span> Social Media & The Times OS Feed <span class="mono red">Q2-Q3 2026</span></h2>
        <div class="rule"></div>
        <p>Conversion of all social outputs to 'Digital Telegrams.' Automation of scraping logs from //Kharas and Oshana directly into public feeds.</p>
        <div class="img-desc">Overhead photograph of a smartphone screen displaying a Digital Telegram. Grayscale. GPS overlay: 22.56 S, 17.08 E.</div>
        <h3>Layout: Digital Telegram Template</h3>
        <p>Each post: monospaced timestamp, 1pt rule, source in red, headline in Playfair Display bold (max 12 words), single data point, black footer band.</p>
    </div>
    <div class="page">
        <h2 style="font-size: 24pt;"><span class="red">III.</span> High-Density Physical Distribution <span class="mono red">Q3-Q4 2026</span></h2>
        <div class="rule"></div>
        <p>Deployment of The Broadside at regional transport hubs. Designed to be read standing up, in transit, in under 90 seconds.</p>
        <div class="img-desc">Photograph of a Broadside display stand at the Windhoek Intercape bus terminal. Grayscale. GPS overlay: 22.57 S, 17.08 E.</div>
        <h3>Layout: Display Stand Specification</h3>
        <p>3mm black steel plate. 450mm x 300mm x 1200mm. Literature holder at 15 degrees. Laser-cut 'TON' badge. Bolted to floor.</p>
    </div>
    <div class="page">
        <h2 style="font-size: 24pt;"><span class="red">IV.</span> Data Sovereignty & Expansion <span class="mono red">Q1-Q4 2027</span></h2>
        <div class="rule"></div>
        <p>Full deployment of Times OS data licensing. Transition from media company to data intelligence company with an editorial front.</p>
        <div class="img-desc">Aerial photograph of Walvis Bay port at dawn. Grayscale. GPS overlay: 22.96 S, 14.51 E.</div>
        <h3>Layout: API Documentation Booklet</h3>
        <p>Saddle-stitched A5 on 120gsm cream. Two-column layout. Endpoints left, JSON right. JetBrains Mono 8pt for code.</p>
    </div>
    <div class="page">
        <h2 style="font-size: 24pt;"><span class="red">V.</span> The Editorial Citadel <span class="mono red">Q1 2028+</span></h2>
        <div class="rule"></div>
        <p>Consolidation. Self-sustaining editorial operation. 50 verified correspondents. The definitive source of Namibian business intelligence.</p>
        <div class="img-desc">Photograph of Brandberg Mountain at sunset. Grayscale. GPS overlay: 21.07 S, 14.28 E.</div>
        <h3>Layout: Premium Archive — Annual Compilation</h3>
        <p>Perfect-bound A4, 200-300 pages, 120gsm cream. Full-bleed grayscale cover with GPS overlay. Single-column interior with generous margins. Indexed by region, sector, date.</p>
    </div>
</body>
</html>`;
}
