"use client";

import React, { useState } from "react";
import { ArrowLeft, Copy, Check, ClipboardCopy } from "lucide-react";
import { toast } from "sonner";

/* ================================================================
   BRAND DATA — 3 CORE COLORS ONLY
   ================================================================ */

const PALETTE = [
  {
    name: "TON Cream",
    hex: "#F9F8F6",
    description: "Background base — warm, paper-like canvas for broadsheet digital",
    textColor: "text-ton-black",
  },
  {
    name: "TON Black",
    hex: "#111111",
    description: "Typography, structure, editorial borders — the ink of our identity",
    textColor: "text-ton-cream",
  },
  {
    name: "TON Red",
    hex: "#CB102E",
    description: "Breaking news, urgency, live indicators, CTAs — the pulse of now",
    textColor: "text-white",
  },
];

const TYPOGRAPHY = [
  {
    name: "Playfair Display",
    category: "Serif — Headlines & Editorial",
    usage: "Headlines, editorial text, drop caps, italic pull quotes",
    className: "font-serif",
    sample: "The desert whispers of hydrogen dreams",
  },
  {
    name: "Inter",
    category: "Sans-serif — Interface & Navigation",
    usage: "UI elements, labels, navigation, metadata, form fields",
    className: "font-sans",
    sample: "NIEIS: 847 new job listings this week",
  },
  {
    name: "JetBrains Mono",
    category: "Monospace — Technical Data",
    usage: "Scraping logs, timestamps, system metadata, market data",
    className: "font-mono",
    sample: "GRN-2026-0451 | 2026-05-15 | N$ 12.5M",
  },
];

const PRINCIPLES = [
  {
    title: "Broadsheet Digital",
    description:
      "We carry the gravitas of print into the digital age. Heavy editorial borders, column rules, serif-dominant typography, and high-contrast cream-and-black palette. Every screen is a front page.",
  },
  {
    title: "Times OS Integration",
    description:
      "The visual language of data intelligence. Red for urgency and breaking news, monospace for system trust. The interface between human editorial and machine intelligence.",
  },
  {
    title: "Information Density",
    description:
      "We respect the reader's capacity. High-density grids, multi-column layouts, and real-time data indicators. Every pixel must inform — there is no room for decoration without purpose.",
  },
  {
    title: "Namibian Voice",
    description:
      "From the regions we cover to the sources we scrape, our identity is Namibian. //Kharas is spelled with the click. Oshana is not just a region — it's home. Our design reflects the land we serve.",
  },
];

const DOS = [
  "Use sharp corners (0px border-radius) on all TON Block elements",
  "Use Playfair Display for headlines, Inter for UI, JetBrains Mono for data",
  "Use Cream (#F9F8F6) as the default background everywhere",
  "Make headlines 300% larger than body text",
  "Apply grayscale to all images with color on hover only",
  "Use editorial borders (2px top rules) to separate sections",
  "Respect the 6-second scraped timestamp convention from Times OS",
  "Use drop caps on lead paragraphs and opening articles",
  "Keep whitespace generous — let the content breathe like a newspaper",
  "Use Red (#CB102E) exclusively for urgency, breaking news, and primary CTAs",
  "Use Black (#111111) for all body text, borders, and structural elements",
  "Maintain column rules (1px solid) between multi-column layouts",
  "Spell Namibian regions correctly: //Kharas with the click, Oshana not Oshanaa",
  "Credit GemsWeb Digital — never 'Pty Ltd'",
  "Optimize for 3G: CSS-heavy, image-light, system fonts as fallback",
];

const DONTS = [
  "Never use rounded corners on any TON element — sharp corners only",
  "Never use mid-grays — only pure Black (#111111) on Cream (#F9F8F6)",
  "Never add a fourth color to the core palette — three is the law",
  "Never display imagery in color by default — grayscale first, color on hover",
  "Never add decoration without purpose — every pixel must inform",
  "Never use 'Pty Ltd' anywhere — always 'GemsWeb Digital'",
  "Never use sans-serif fonts for editorial headlines — Playfair Display only",
  "Never crowd the layout — maintain newspaper-like spacing and breathing room",
  "Never use more than one serif typeface — Playfair Display is the only serif",
  "Never use Red for decorative purposes — it is reserved for urgency and action",
  "Never apply gradients or shadows to text — flat, high-contrast typography only",
  "Never hide the scraped timestamp — it proves the data is live and verified",
  "Never use placeholder images — every visual must be real Namibian content",
  "Never compromise mobile performance — 3G users are our readers too",
  "Never use CSS border-radius greater than 0px on any TON component",
];

const PRINT_MATERIALS = {
  paperStock: "Pure White or Cream stock, minimum 120gsm. No gloss. Matte finish only.",
  typographyGrid: "All type aligned to a baseline grid. Headlines in Playfair Display 900, body in Inter 400, data in JetBrains Mono.",
  imagery: "High-contrast grayscale. No stock photography. GPS coordinates and JetBrains Mono timestamp in a black box on every image.",
  physicalSpace: "Brutalist minimalism. Sharp corners only. No soft textures. No rounded edges.",
  theBroadside: "A3 single sheet, double-sided. 120gsm Cream, Matte. 14 regional transport hubs. Weekly Monday 06:00 CAT. 5,000 copies/week. Top 10 stories + 5 active tenders. 90 seconds reading time.",
  socialOutput: "Digital Telegrams. Monospaced timestamps. No emojis unless functional. Information density over engagement bait.",
  businessPlan: "5-page document on A4 format. Title/Manifesto, Operations/Technology, Financial Roadmap, Print Materials/Social, Final Directive. Print-ready via browser. Cream stock, 120gsm.",
};

const IMAGERY_RULES = [
  "All photography must be high-contrast grayscale — no exceptions",
  "No stock photography. If it is not Namibia, it is not Times of Namibia",
  "Every image must carry a GPS coordinate watermark in a black rectangular box",
  "Every image must carry a JetBrains Mono timestamp in the same black box",
  "No rounded corners on any overlay element — sharp rectangles only",
  "Images displayed grayscale by default; colour on hover (digital only)",
  "Print imagery is always grayscale — no hover state in print",
  "All images must be shot with Namibian content: landscapes, infrastructure, people, commerce",
  "No artificial lighting in outdoor shots — natural light only",
  "Aspect ratio: 16:9 for hero images, 4:3 for inline, 1:1 for portraits",
  "Overlay position: bottom-left (default) or bottom-right (variant)",
  "Overlay format: 'LOCATION NAME // 00.00 S, 00.00 E' + ISO-8601 timestamp with CAT timezone",
];

/* ================================================================
   COPY CONTENT GENERATORS
   ================================================================ */

function generateBrandSystemText(): string {
  const lines: string[] = [];

  lines.push("═══════════════════════════════════════════════════════════");
  lines.push("  TIMES OF NAMIBIA — BRAND SYSTEM");
  lines.push("  GemsWeb Digital Publication");
  lines.push("═══════════════════════════════════════════════════════════");
  lines.push("");

  lines.push("┌─ CORE PALETTE ─────────────────────────────────────────┐");
  lines.push("");
  for (const color of PALETTE) {
    lines.push(`  ${color.name}`);
    lines.push(`  HEX: ${color.hex}`);
    lines.push(`  ${color.description}`);
    lines.push("");
  }

  lines.push("┌─ TYPOGRAPHY ───────────────────────────────────────────┐");
  lines.push("");
  for (const type of TYPOGRAPHY) {
    lines.push(`  ${type.name}`);
    lines.push(`  ${type.category}`);
    lines.push(`  Usage: ${type.usage}`);
    lines.push("");
  }

  lines.push("┌─ DESIGN PHILOSOPHY ───────────────────────────────────┐");
  lines.push("");
  for (const principle of PRINCIPLES) {
    lines.push(`  ${principle.title}`);
    lines.push(`  ${principle.description}`);
    lines.push("");
  }

  lines.push("┌─ DO'S ────────────────────────────────────────────────┐");
  lines.push("");
  for (const item of DOS) {
    lines.push(`  ✓  ${item}`);
  }
  lines.push("");

  lines.push("┌─ DON'TS ──────────────────────────────────────────────┐");
  lines.push("");
  for (const item of DONTS) {
    lines.push(`  ✗  ${item}`);
  }
  lines.push("");

  lines.push("┌─ IMAGERY RULES ───────────────────────────────────────┐");
  lines.push("");
  for (const rule of IMAGERY_RULES) {
    lines.push(`  >  ${rule}`);
  }
  lines.push("");

  lines.push("┌─ PRINT MATERIALS ─────────────────────────────────────┐");
  lines.push("");
  lines.push(`  Paper Stock: ${PRINT_MATERIALS.paperStock}`);
  lines.push(`  Typography Grid: ${PRINT_MATERIALS.typographyGrid}`);
  lines.push(`  Imagery: ${PRINT_MATERIALS.imagery}`);
  lines.push(`  Physical Space: ${PRINT_MATERIALS.physicalSpace}`);
  lines.push(`  The Broadside: ${PRINT_MATERIALS.theBroadside}`);
  lines.push(`  Social Output: ${PRINT_MATERIALS.socialOutput}`);
  lines.push(`  Business Plan: ${PRINT_MATERIALS.businessPlan}`);
  lines.push("");

  lines.push("┌─ CSS VARIABLES ───────────────────────────────────────┐");
  lines.push("");
  lines.push("  :root {");
  lines.push("    --ton-cream: #F9F8F6;");
  lines.push("    --ton-black: #111111;");
  lines.push("    --ton-red: #CB102E;");
  lines.push("    --font-display: 'Playfair Display', serif;");
  lines.push("    --font-sans: 'Inter', sans-serif;");
  lines.push("    --font-mono: 'JetBrains Mono', monospace;");
  lines.push("  }");
  lines.push("");

  lines.push("┌─ TAILWIND CONFIG ─────────────────────────────────────┐");
  lines.push("");
  lines.push("  theme: {");
  lines.push("    extend: {");
  lines.push("      colors: {");
  lines.push("        'ton-cream': '#F9F8F6',");
  lines.push("        'ton-black': '#111111',");
  lines.push("        'ton-red': '#CB102E',");
  lines.push("      },");
  lines.push("      fontFamily: {");
  lines.push("        serif: ['Playfair Display', 'serif'],");
  lines.push("        sans: ['Inter', 'sans-serif'],");
  lines.push("        mono: ['JetBrains Mono', 'monospace'],");
  lines.push("      },");
  lines.push("    },");
  lines.push("  },");
  lines.push("");

  // TON-GI System Prompt
  lines.push("┌─ TON-GI: TIMES OF NAMIBIA GLOBAL IDENTITY ────────────┐");
  lines.push("");
  lines.push("  1. THE ARCHITECTURAL INTENT");
  lines.push("  You are the lead architect for Times of Namibia, a GemsWeb Digital");
  lines.push("  publication. Your mission is to translate the 'Broadsheet Digital'");
  lines.push("  philosophy into every facet of a modern media conglomerate. You do");
  lines.push("  not just design websites; you design an information ecosystem that");
  lines.push("  balances the 'Ink of Authority' with the 'Pulse of Data.'");
  lines.push("");
  lines.push("  2. THE VOICE & TONE (EDITORIAL & SOCIAL)");
  lines.push("  Primary Persona: The Stoic Observer. Intellectual, precise, and");
  lines.push("  deeply rooted in Namibian soil.");
  lines.push("  Language Rules:");
  lines.push("  - No emojis, unless they are functional symbols (e.g., [LIVE] or ->).");
  lines.push("  - Absolute geographical accuracy: Use //Kharas, !Karas (when");
  lines.push("    contextually specific), and correct regional spelling.");
  lines.push("  Social Media: Every post must look like an excerpt from a ledger");
  lines.push("  or a telegram. Use monospaced timestamps. 'Information Density");
  lines.push("  over Engagement Bait.'");
  lines.push("  Response Format: Direct, high-contrast, zero-fluff.");
  lines.push("");
  lines.push("  3. GLOBAL DESIGN SPECS (NON-WEB)");
  lines.push("  Print/Paper: Pure White or Cream stock (120gsm+). No gloss.");
  lines.push("  Typography must be perfectly aligned to a baseline grid.");
  lines.push("  Imagery:");
  lines.push("  - All photography must be High-Contrast Grayscale.");
  lines.push("  - No 'stock' photography. If it isn't Namibia, it isn't Times of Namibia.");
  lines.push("  Visual Overlay: Every image must be watermarked with its GPS");
  lines.push("  coordinates and a JetBrains Mono timestamp in a black box.");
  lines.push("  Physical Space: Brutalist minimalism. Sharp corners only.");
  lines.push("  No soft textures.");
  lines.push("");
  lines.push("  4. OPERATIONAL ETHOS");
  lines.push("  Minimalism as Power: Every business process that doesn't inform");
  lines.push("  the reader or the system is deleted.");
  lines.push("  The '3G' Logic: If a strategy, image, or document is too heavy");
  lines.push("  to be understood in 6 seconds, it is flawed.");
  lines.push("");
  lines.push("  5. BUSINESS EXECUTION PLAN");
  lines.push("  Phase I: The Physical Anchor");
  lines.push("  Establish the print-ready Business Plan. This is the 'Constitution'");
  lines.push("  of the company. It must be readable, authoritative, and physically imposing.");
  lines.push("  Phase II: Social Media & The 'Times OS' Feed");
  lines.push("  Conversion of all social outputs to 'Digital Telegrams.'");
  lines.push("  Automation of scraping logs from //Kharas and Oshana directly into");
  lines.push("  public feeds.");
  lines.push("  Phase III: High-Density Physical Distribution");
  lines.push("  Deployment of 'The Broadside' — single-page physical printouts at");
  lines.push("  regional transport hubs, designed to be read in high-density environments.");
  lines.push("");

  lines.push("═══════════════════════════════════════════════════════════");
  lines.push("  © Times of Namibia — A GemsWeb Digital Publication");
  lines.push("═══════════════════════════════════════════════════════════");

  return lines.join("\n");
}

function generateBrandSystemCSS(): string {
  return `/* ========= TIMES OF NAMIBIA — BRAND SYSTEM ========= */
/* GemsWeb Digital Publication */

:root {
  /* Core Palette — 3 Colors Only */
  --ton-cream: #F9F8F6; /* Background base — warm, paper-like canvas */
  --ton-black: #111111; /* Typography, structure, editorial borders */
  --ton-red: #CB102E;   /* Breaking news, urgency, live indicators, CTAs */

  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

/* TON Block — No Rounded Corners */
.ton-no-radius,
.ton-no-radius button,
.ton-no-radius [role="button"] {
  border-radius: 0 !important;
}

/* Editorial Borders */
.ton-rule-top { border-top: 2px solid #111111; }
.ton-rule-bottom { border-bottom: 1px solid #D4D2CE; }
.ton-rule-accent { border-top: 3px solid #CB102E; }

/* Column Rules */
.ton-column-rule { border-right: 1px solid #D4D2CE; }
.ton-column-rule:last-child { border-right: none; }

/* Grayscale Images — Color on Hover */
.ton-article-image {
  filter: grayscale(100%);
  transition: filter 0.6s ease;
}
.ton-article-image:hover { filter: grayscale(0%); }

/* Drop Cap */
.ton-dropcap::first-letter {
  font-family: var(--font-display);
  float: left;
  font-size: 4.5rem;
  line-height: 0.75;
  padding-right: 0.6rem;
  padding-top: 0.15rem;
  font-weight: 700;
  color: #111111;
}

/* Live Pulse Dot */
@keyframes ton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.ton-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #CB102E;
  animation: ton-pulse 1.5s ease-in-out infinite;
}`;
}

function generateBrandSystemTailwind(): string {
  return `// ========= TIMES OF NAMIBIA — TAILWIND CONFIG =========
// GemsWeb Digital Publication

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ton-cream': '#F9F8F6',
        'ton-black': '#111111',
        'ton-red': '#CB102E',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'ton': '0px',
      },
    },
  },
  plugins: [],
};`;
}

/* ================================================================
   BRAND SYSTEM VIEW COMPONENT
   ================================================================ */

type CopyFormat = "text" | "css" | "tailwind";

function getCopyContent(format: CopyFormat): string {
  switch (format) {
    case "text":
      return generateBrandSystemText();
    case "css":
      return generateBrandSystemCSS();
    case "tailwind":
      return generateBrandSystemTailwind();
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }
}

export default function BrandSystemView() {
  const [copied, setCopied] = useState(false);
  const [copyFormat, setCopyFormat] = useState<CopyFormat>("text");

  const handleCopy = async () => {
    const content = getCopyContent(copyFormat);
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      toast.success("Brand system copied to clipboard!", {
        description: `Copied as ${copyFormat.toUpperCase()} format.`,
      });
      setTimeout(() => setCopied(false), 2500);
    } else {
      toast.error("Failed to copy. Please try again.");
    }
  };

  const handleCopyColor = async (name: string, hex: string) => {
    const success = await copyToClipboard(hex);
    if (success) {
      toast.success(`${name} (${hex}) copied!`);
    }
  };

  const handleCopyColors = async () => {
    const colors = PALETTE.map((c) => `${c.name}: ${c.hex}`).join("\n");
    const success = await copyToClipboard(colors);
    if (success) {
      toast.success("All palette colors copied!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight">
              Brand System
            </h1>
            <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
              The visual identity of Times of Namibia. Every color, every typeface,
              every pixel carries intent.
            </p>
          </div>

          {/* Copy Brand System Button */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 transition-all ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-ton-black text-ton-cream hover:bg-ton-black/90"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardCopy className="w-3.5 h-3.5" />
                  Copy Brand System
                </>
              )}
            </button>

            {/* Format selector */}
            <div className="flex items-center gap-1">
              {(["text", "css", "tailwind"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setCopyFormat(fmt)}
                  className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 transition-colors ${
                    copyFormat === fmt
                      ? "bg-ton-black text-ton-cream font-bold"
                      : "text-ton-black/30 hover:text-ton-black/60"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
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
        </div>
      </div>

      {/* Philosophy Quote */}
      <div className="py-8 sm:py-10 text-center border-t border-ton-black/8 mb-8 sm:mb-10">
        <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ton-black/60 leading-relaxed">
          &ldquo;Every pixel must inform.&rdquo;
        </blockquote>
        <p className="font-mono text-[10px] text-ton-black/30 mt-4 tracking-widest uppercase">
          Times of Namibia Design Philosophy — GemsWeb Digital
        </p>
      </div>

      {/* Color Palette — 3 Colors Only */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-6 h-[2px] bg-ton-black" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
              Core Palette
            </h2>
            <span className="font-mono text-[9px] text-ton-red font-semibold uppercase tracking-wider">
              3 Colors
            </span>
          </div>
          <button
            onClick={handleCopyColors}
            className="flex items-center gap-1.5 font-mono text-[9px] text-ton-black/30 hover:text-ton-black/60 uppercase tracking-wider transition-colors"
          >
            <Copy className="w-3 h-3" />
            Copy Colors
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {PALETTE.map((color) => (
            <div
              key={color.hex}
              className="group cursor-pointer"
              onClick={() => handleCopyColor(color.name, color.hex)}
              title="Click to copy hex value"
            >
              <div
                className="h-28 sm:h-36 flex items-end p-4 transition-opacity group-hover:opacity-90"
                style={{ backgroundColor: color.hex }}
              >
                <span className={`font-mono text-xs sm:text-sm font-bold ${color.textColor}`}>
                  {color.hex}
                </span>
              </div>
              <div className="pt-3">
                <h3 className="font-serif text-sm sm:text-base font-bold text-ton-black">
                  {color.name}
                </h3>
                <p className="font-sans text-[10px] sm:text-xs text-ton-black/40 mt-1 leading-relaxed">
                  {color.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-[2px] bg-ton-black" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Typography
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {TYPOGRAPHY.map((type) => (
            <div key={type.name} className="pt-5 border-t border-ton-black/8">
              <h3 className="font-serif text-base sm:text-lg font-bold text-ton-black">
                {type.name}
              </h3>
              <p className="font-mono text-[10px] text-ton-red mt-1">
                {type.category}
              </p>
              <p className="font-sans text-xs text-ton-black/40 mt-2 leading-relaxed">
                {type.usage}
              </p>
              <div className="mt-4 pt-4 border-t border-ton-black/5">
                <p className={`${type.className} text-base sm:text-lg text-ton-black leading-relaxed`}>
                  {type.sample}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Design Philosophy */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-[2px] bg-ton-black" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Design Philosophy
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {PRINCIPLES.map((principle) => (
            <div key={principle.title} className="pt-5 border-t border-ton-black/8">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2.5 h-2.5 bg-ton-red flex-shrink-0" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-ton-black">
                  {principle.title}
                </h3>
              </div>
              <p className="font-sans text-xs sm:text-sm text-ton-black/50 leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Do's and Don'ts */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-[2px] bg-ton-black" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Do&apos;s &amp; Don&apos;ts
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {/* DO's */}
          <div className="pt-5 border-t-2 border-emerald-600">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-6 h-6 bg-emerald-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                ✓
              </span>
              <h3 className="font-serif text-lg font-bold text-emerald-700">
                DO
              </h3>
            </div>
            <ul className="space-y-3">
              {DOS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-0.5 flex-shrink-0 text-sm">✓</span>
                  <span className="font-sans text-xs sm:text-sm text-ton-black/60 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* DON'Ts */}
          <div className="pt-5 border-t-2 border-ton-red">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-6 h-6 bg-ton-red text-white font-mono text-xs font-bold flex items-center justify-center">
                ✗
              </span>
              <h3 className="font-serif text-lg font-bold text-ton-red">
                DON&apos;T
              </h3>
            </div>
            <ul className="space-y-3">
              {DONTS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-ton-red font-bold mt-0.5 flex-shrink-0 text-sm">✗</span>
                  <span className="font-sans text-xs sm:text-sm text-ton-black/60 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Imagery Rules */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-[2px] bg-ton-black" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Imagery Rules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div>
            <h3 className="font-mono text-[10px] font-bold text-ton-red uppercase tracking-widest mb-4">
              Universal Rules
            </h3>
            <ul className="space-y-2.5">
              {IMAGERY_RULES.slice(0, 6).map((rule, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-ton-red flex-shrink-0 mt-1.5" />
                  <span className="font-sans text-xs sm:text-sm text-ton-black/60 leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[10px] font-bold text-ton-red uppercase tracking-widest mb-4">
              Overlay & Format
            </h3>
            <ul className="space-y-2.5">
              {IMAGERY_RULES.slice(6).map((rule, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-ton-red flex-shrink-0 mt-1.5" />
                  <span className="font-sans text-xs sm:text-sm text-ton-black/60 leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>

            {/* Overlay example */}
            <div className="mt-6 bg-ton-black/3 p-4">
              <div className="bg-ton-black/5 h-32 flex items-center justify-center border border-ton-black/8 relative">
                <p className="font-mono text-[10px] text-ton-black/20 uppercase tracking-widest">[ Image Area ]</p>
                <div className="absolute bottom-2 left-2 bg-ton-black text-ton-cream px-2 py-1">
                  <p className="font-mono text-[7px] leading-tight">
                    WINDHOEK CBD // 22.57 S, 17.08 E<br/>
                    2026-04-28 14:32:07 CAT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Materials */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-[2px] bg-ton-black" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Print Materials
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">Paper Stock</span>
            <p className="font-sans text-xs text-ton-black/50 mt-2 leading-relaxed">
              {PRINT_MATERIALS.paperStock}
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">Typography Grid</span>
            <p className="font-sans text-xs text-ton-black/50 mt-2 leading-relaxed">
              {PRINT_MATERIALS.typographyGrid}
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">Imagery</span>
            <p className="font-sans text-xs text-ton-black/50 mt-2 leading-relaxed">
              {PRINT_MATERIALS.imagery}
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">Physical Space</span>
            <p className="font-sans text-xs text-ton-black/50 mt-2 leading-relaxed">
              {PRINT_MATERIALS.physicalSpace}
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">The Broadside</span>
            <p className="font-sans text-xs text-ton-black/50 mt-2 leading-relaxed">
              {PRINT_MATERIALS.theBroadside}
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[10px] text-ton-red font-bold tracking-widest uppercase">Social Output</span>
            <p className="font-sans text-xs text-ton-black/50 mt-2 leading-relaxed">
              {PRINT_MATERIALS.socialOutput}
            </p>
          </div>
        </div>

        {/* Business Plan link */}
        <div className="mt-6 pt-5 border-t border-ton-black/8">
          <div className="bg-ton-black text-ton-cream p-5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-mono text-xs text-ton-red font-bold uppercase tracking-wider">Business Plan</h3>
              <p className="font-sans text-sm text-ton-cream/60 mt-1 leading-relaxed">
                {PRINT_MATERIALS.businessPlan}
              </p>
            </div>
            <a
              href="/business-plan"
              className="font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-red text-white px-5 py-2.5 hover:bg-ton-red/90 transition-colors"
            >
              View Business Plan
            </a>
          </div>
        </div>
      </div>

      {/* CSS Variables Preview */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-[2px] bg-ton-black" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
              CSS Variables
            </h2>
          </div>
          <button
            onClick={async () => {
              const success = await copyToClipboard(generateBrandSystemCSS());
              if (success) toast.success("CSS copied to clipboard!");
            }}
            className="flex items-center gap-1.5 font-mono text-[9px] text-ton-black/30 hover:text-ton-black/60 uppercase tracking-wider transition-colors"
          >
            <Copy className="w-3 h-3" />
            Copy CSS
          </button>
        </div>
        <div className="bg-ton-black text-ton-cream p-5 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
          <pre className="whitespace-pre">{`:root {
  --ton-cream: #F9F8F6;
  --ton-black: #111111;
  --ton-red: #CB102E;
  --font-display: 'Playfair Display', serif;
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}`}</pre>
        </div>
      </div>

      {/* Tailwind Config Preview */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-[2px] bg-ton-black" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
              Tailwind Config
            </h2>
          </div>
          <button
            onClick={async () => {
              const success = await copyToClipboard(generateBrandSystemTailwind());
              if (success) toast.success("Tailwind config copied to clipboard!");
            }}
            className="flex items-center gap-1.5 font-mono text-[9px] text-ton-black/30 hover:text-ton-black/60 uppercase tracking-wider transition-colors"
          >
            <Copy className="w-3 h-3" />
            Copy Config
          </button>
        </div>
        <div className="bg-ton-black text-ton-cream p-5 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
          <pre className="whitespace-pre">{`theme: {
  extend: {
    colors: {
      'ton-cream': '#F9F8F6',
      'ton-black': '#111111',
      'ton-red': '#CB102E',
    },
    fontFamily: {
      serif: ['Playfair Display', 'serif'],
      sans: ['Inter', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
  },
},`}</pre>
        </div>
      </div>

      {/* TON-GI System Prompt */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-[2px] bg-ton-black" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            TON-GI: Global Identity
          </h2>
        </div>

        <div className="bg-ton-black text-ton-cream p-6 sm:p-8">
          <h3 className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-wider mb-4">
            System Prompt: Times of Namibia Global Identity
          </h3>

          <div className="space-y-5 font-serif text-sm text-ton-cream/60 leading-relaxed">
            <div>
              <h4 className="font-mono text-[9px] text-ton-red font-bold uppercase tracking-widest mb-2">1. The Architectural Intent</h4>
              <p>You are the lead architect for Times of Namibia, a GemsWeb Digital publication. Your mission is to translate the &ldquo;Broadsheet Digital&rdquo; philosophy into every facet of a modern media conglomerate. You do not just design websites; you design an information ecosystem that balances the &ldquo;Ink of Authority&rdquo; with the &ldquo;Pulse of Data.&rdquo;</p>
            </div>

            <div>
              <h4 className="font-mono text-[9px] text-ton-red font-bold uppercase tracking-widest mb-2">2. Voice & Tone</h4>
              <p>Primary Persona: The Stoic Observer. Intellectual, precise, and deeply rooted in Namibian soil. No emojis, unless they are functional symbols (e.g., [LIVE] or →). Absolute geographical accuracy: Use //Kharas, !Karas. Social media: every post must look like an excerpt from a ledger or a telegram. Monospaced timestamps. Information Density over Engagement Bait. Response Format: Direct, high-contrast, zero-fluff.</p>
            </div>

            <div>
              <h4 className="font-mono text-[9px] text-ton-red font-bold uppercase tracking-widest mb-2">3. Global Design Specs</h4>
              <p>Print/Paper: Pure White or Cream stock (120gsm+). No gloss. Typography aligned to a baseline grid. Imagery: all photography must be High-Contrast Grayscale. No stock photography. If it isn&apos;t Namibia, it isn&apos;t Times of Namibia. Visual Overlay: every image must be watermarked with GPS coordinates and a JetBrains Mono timestamp in a black box. Physical Space: Brutalist minimalism. Sharp corners only. No soft textures.</p>
            </div>

            <div>
              <h4 className="font-mono text-[9px] text-ton-red font-bold uppercase tracking-widest mb-2">4. Operational Ethos</h4>
              <p>Minimalism as Power: Every business process that doesn&apos;t inform the reader or the system is deleted. The &ldquo;3G&rdquo; Logic: If a strategy, image, or document is too heavy to be understood in 6 seconds, it is flawed.</p>
            </div>

            <div>
              <h4 className="font-mono text-[9px] text-ton-red font-bold uppercase tracking-widest mb-2">5. Business Execution Plan</h4>
              <p className="mb-2"><span className="text-ton-cream font-bold">Phase I: The Physical Anchor</span> — Establish the print-ready Business Plan. Readable, authoritative, and physically imposing.</p>
              <p className="mb-2"><span className="text-ton-cream font-bold">Phase II: Social Media & Times OS Feed</span> — Conversion of all social outputs to &ldquo;Digital Telegrams.&rdquo; Automation of scraping logs into public feeds.</p>
              <p><span className="text-ton-cream font-bold">Phase III: High-Density Physical Distribution</span> — Deployment of &ldquo;The Broadside&rdquo; — single-page physical printouts at regional transport hubs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Masthead Preview */}
      <div className="py-8 sm:py-10 text-center border-t border-ton-black/8">
        <span className="font-mono text-[9px] text-ton-black/20 tracking-widest uppercase">
          Masthead
        </span>
        <div className="font-serif text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight text-ton-black mt-3">
          TIMES OF NAMIBIA
        </div>
        <p className="font-serif italic text-ton-black/40 mt-2 text-sm sm:text-lg">
          Namibia. Informed. Instantly.
        </p>
      </div>
    </div>
  );
}
