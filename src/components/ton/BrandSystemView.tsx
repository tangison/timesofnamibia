"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

export default function BrandSystemView() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight">
          Brand System
        </h1>
        <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
          The visual identity of Times of Namibia. Every color, every typeface,
          every pixel carries intent.
        </p>
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
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-[2px] bg-ton-black" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Core Palette
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {PALETTE.map((color) => (
            <div key={color.hex}>
              <div
                className="h-24 sm:h-32 flex items-end p-3"
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
