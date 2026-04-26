"use client";

import React from "react";

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
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-ton-black text-ton-cream p-6 sm:p-8 ton-border-editorial mb-6">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Brand System
        </h1>
        <p className="font-serif italic text-ton-cream/60 text-sm sm:text-base mt-3 max-w-2xl">
          The visual identity of Times of Namibia. Every color, every typeface,
          every pixel carries intent.
        </p>
      </div>

      {/* Quote */}
      <div className="bg-white ton-border-editorial p-6 sm:p-8 mb-6 text-center">
        <blockquote className="font-serif italic text-2xl sm:text-3xl text-ton-black/80 leading-relaxed">
          &ldquo;Every pixel must inform.&rdquo;
        </blockquote>
        <p className="font-mono text-xs text-ton-black/30 mt-3 tracking-widest uppercase">
          Times of Namibia Design Philosophy
        </p>
      </div>

      {/* Color Palette */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-ton-black mb-4 flex items-center gap-3">
          <span className="w-8 h-1 bg-ton-black" />
          Core Palette
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PALETTE.map((color) => (
            <div
              key={color.hex}
              className={`bg-white border ${color.border} overflow-hidden`}
            >
              <div
                className="h-28 flex items-end p-3"
                style={{ backgroundColor: color.hex }}
              >
                <span className={`font-mono text-xs font-bold ${color.textColor}`}>
                  {color.hex}
                </span>
              </div>
              <div className="p-3">
                <h3 className="font-serif text-sm font-bold text-ton-black">
                  {color.name}
                </h3>
                <p className="font-sans text-xs text-ton-black/50 mt-1 leading-relaxed">
                  {color.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-ton-black mb-4 flex items-center gap-3">
          <span className="w-8 h-1 bg-ton-black" />
          Typography
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TYPOGRAPHY.map((type) => (
            <div
              key={type.name}
              className="bg-white ton-border-editorial p-6"
            >
              <h3 className="font-serif text-lg font-bold text-ton-black">
                {type.name}
              </h3>
              <p className="font-mono text-xs text-ton-gold mt-1">
                {type.category}
              </p>
              <p className="font-sans text-xs text-ton-black/50 mt-2">
                {type.usage}
              </p>
              <div className="mt-4 pt-4 border-t border-ton-black/10">
                <p
                  className={`${type.className} text-lg text-ton-black leading-relaxed`}
                >
                  {type.sample}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Design Philosophy */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-ton-black mb-4 flex items-center gap-3">
          <span className="w-8 h-1 bg-ton-black" />
          Design Philosophy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="bg-white ton-border-editorial p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-3 h-3 bg-ton-red flex-shrink-0" />
                <h3 className="font-serif text-lg font-bold text-ton-black">
                  {principle.title}
                </h3>
              </div>
              <p className="font-sans text-sm text-ton-black/60 leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Masthead Preview */}
      <div className="bg-ton-black text-ton-cream p-8 ton-border-editorial text-center">
        <div className="bg-ton-cream/10 inline-block px-3 py-1 font-mono text-xs text-ton-cream/60 tracking-widest uppercase mb-4">
          Masthead
        </div>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ton-cream">
          TIMES OF NAMIBIA
        </h1>
        <p className="font-serif italic text-ton-cream/50 mt-2">
          Namibia. Informed. Instantly.
        </p>
      </div>
    </div>
  );
}
