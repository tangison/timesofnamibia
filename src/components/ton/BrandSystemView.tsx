"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, ClipboardCopy } from "lucide-react";
import { toast } from "sonner";

const PALETTE = [
  {
    name: "TON Cream",
    hex: "#F9F8F6",
    description: "Background base — warm, paper-like canvas for broadsheet digital",
    textColor: "text-ton-black",
    border: "border-ton-black/10",
  },
  {
    name: "TON Black",
    hex: "#111111",
    description: "Typography, structure, editorial borders — the ink of our identity",
    textColor: "text-ton-cream",
    border: "border-ton-black",
  },
  {
    name: "TON Red",
    hex: "#CB102E",
    description: "Breaking news, urgency, live indicators — the pulse of now",
    textColor: "text-white",
    border: "border-ton-red/30",
  },
  {
    name: "TON Gold",
    hex: "#B8860B",
    description: "Financial data, tenders, premium insights — the value of intelligence",
    textColor: "text-white",
    border: "border-ton-gold/30",
  },
  {
    name: "TON Navy",
    hex: "#000080",
    description: "Accent — rarely used, reserved for institutional authority",
    textColor: "text-white",
    border: "border-ton-navy/30",
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
      "The visual language of data intelligence. Gold for financial insights, red for breaking urgency, monospace for system trust. The interface between human editorial and machine intelligence.",
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

  lines.push("┌─ CSS VARIABLES ───────────────────────────────────────┐");
  lines.push("");
  lines.push("  :root {");
  for (const color of PALETTE) {
    const varName = color.name.toLowerCase().replace(/\s+/g, "-").replace("ton-", "");
    lines.push(`    --ton-${varName}: ${color.hex};`);
  }
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
  for (const color of PALETTE) {
    const key = color.name.toLowerCase().replace(/\s+/g, "-");
    lines.push(`        '${key}': '${color.hex}',`);
  }
  lines.push("      },");
  lines.push("      fontFamily: {");
  lines.push("        serif: ['Playfair Display', 'serif'],");
  lines.push("        sans: ['Inter', 'sans-serif'],");
  lines.push("        mono: ['JetBrains Mono', 'monospace'],");
  lines.push("      },");
  lines.push("    },");
  lines.push("  },");
  lines.push("");

  lines.push("═══════════════════════════════════════════════════════════");
  lines.push("  © Times of Namibia — A GemsWeb Digital Publication");
  lines.push("═══════════════════════════════════════════════════════════");

  return lines.join("\n");
}

export default function BrandSystemView() {
  const [copied, setCopied] = useState(false);
  const [copyFormat, setCopyFormat] = useState<"text" | "css" | "tailwind">("text");

  function getCopyContent(format: "text" | "css" | "tailwind"): string {
    if (format === "text") {
      return generateBrandSystemText();
    }

    if (format === "css") {
      return `/* ========= TIMES OF NAMIBIA — BRAND SYSTEM ========= */
/* GemsWeb Digital Publication */

:root {
  /* Core Palette */
${PALETTE.map(c => {
  const varName = c.name.toLowerCase().replace(/\s+/g, "-").replace("ton-", "");
  return `  --ton-${varName}: ${c.hex}; /* ${c.description} */`;
}).join("\n")}

  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}`;
    }

    // tailwind
    return `// ========= TIMES OF NAMIBIA — TAILWIND CONFIG =========
// GemsWeb Digital Publication

module.exports = {
  theme: {
    extend: {
      colors: {
${PALETTE.map(c => {
  const key = c.name.toLowerCase().replace(/\s+/g, "-");
  return `        '${key}': '${c.hex}',`;
}).join("\n")}
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};`;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCopyContent(copyFormat));
      setCopied(true);
      toast.success("Brand system copied to clipboard!", {
        description: `Copied as ${copyFormat.toUpperCase()} format.`,
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = getCopyContent(copyFormat);
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      toast.success("Brand system copied to clipboard!", {
        description: `Copied as ${copyFormat.toUpperCase()} format.`,
      });
      setTimeout(() => setCopied(false), 2500);
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
          <Link
            href="/"
            className="font-mono text-[10px] text-ton-black/40 hover:text-ton-black transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3 h-3" />
            Newsroom
          </Link>
        </div>
      </div>

      {/* Philosophy Quote */}
      <div className="py-8 sm:py-10 text-center border-t border-ton-black/10 mb-8 sm:mb-10">
        <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ton-black/60 leading-relaxed">
          &ldquo;Every pixel must inform.&rdquo;
        </blockquote>
        <p className="font-mono text-[10px] text-ton-black/30 mt-4 tracking-widest uppercase">
          Times of Namibia Design Philosophy — GemsWeb Digital
        </p>
      </div>

      {/* Color Palette */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-6 h-[2px] bg-ton-black" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
              Core Palette
            </h2>
          </div>
          <button
            onClick={() => {
              const css = PALETTE.map(c => `${c.name}: ${c.hex}`).join("\n");
              navigator.clipboard.writeText(css);
              toast.success("Palette colors copied!");
            }}
            className="flex items-center gap-1.5 font-mono text-[9px] text-ton-black/30 hover:text-ton-black/60 uppercase tracking-wider transition-colors"
          >
            <Copy className="w-3 h-3" />
            Copy Colors
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {PALETTE.map((color) => (
            <div
              key={color.hex}
              className="group cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(color.hex);
                toast.success(`${color.name} (${color.hex}) copied!`);
              }}
              title="Click to copy hex value"
            >
              <div
                className="h-24 sm:h-32 flex items-end p-3 transition-opacity group-hover:opacity-90"
                style={{ backgroundColor: color.hex }}
              >
                <span className={`font-mono text-[10px] sm:text-xs font-bold ${color.textColor}`}>
                  {color.hex}
                </span>
              </div>
              <div className="pt-3">
                <h3 className="font-serif text-xs sm:text-sm font-bold text-ton-black">
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
            <div key={type.name} className="pt-5 border-t border-ton-black/10">
              <h3 className="font-serif text-base sm:text-lg font-bold text-ton-black">
                {type.name}
              </h3>
              <p className="font-mono text-[10px] text-ton-gold mt-1">
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
            <div key={principle.title} className="pt-5 border-t border-ton-black/10">
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

      {/* Masthead Preview */}
      <div className="py-10 sm:py-14 text-center border-t border-ton-black/10">
        <span className="font-mono text-[10px] text-ton-black/30 tracking-widest uppercase">
          Masthead
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight text-ton-black mt-4">
          TIMES OF NAMIBIA
        </h1>
        <p className="font-serif italic text-ton-black/50 mt-3 text-sm sm:text-lg">
          Namibia. Informed. Instantly.
        </p>
      </div>
    </div>
  );
}
