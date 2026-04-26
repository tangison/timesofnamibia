"use client";

import React from "react";
import { useTonStore } from "@/lib/ton-store";
import { Cpu, FileText, Briefcase, Mail } from "lucide-react";

export default function Footer() {
  const { setView } = useTonStore();

  return (
    <footer className="ton-footer bg-ton-black text-ton-cream mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-ton-cream text-ton-black font-mono text-xs font-bold px-2 py-0.5">
                TON
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-ton-gold" />
                <span className="font-mono text-xs text-ton-cream/50">
                  GemsWeb Digital
                </span>
              </div>
            </div>
            <p className="font-serif italic text-ton-cream/40 text-sm">
              Namibia. Informed. Instantly.
            </p>
          </div>

          {/* Data Pipelines */}
          <div>
            <h4 className="font-mono text-xs font-bold tracking-widest uppercase text-ton-cream/60 mb-3">
              Data Pipelines
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setView("jobs")}
                  className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors flex items-center gap-1.5"
                >
                  <Briefcase className="w-3 h-3" />
                  Job Scraper
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("tender")}
                  className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3" />
                  Tender Analysis
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("contributor")}
                  className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3 h-3" />
                  Contributors
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-xs font-bold tracking-widest uppercase text-ton-cream/60 mb-3">
              Company
            </h4>
            <ul className="space-y-1.5">
              <li>
                <span className="font-sans text-sm text-ton-cream/50">
                  About Times of Namibia
                </span>
              </li>
              <li>
                <span className="font-sans text-sm text-ton-cream/50">
                  Editorial Standards
                </span>
              </li>
              <li>
                <span className="font-sans text-sm text-ton-cream/50">
                  Contact
                </span>
              </li>
              <li>
                <span className="font-sans text-sm text-ton-cream/50">
                  Careers
                </span>
              </li>
            </ul>
          </div>

          {/* Brand */}
          <div>
            <h4 className="font-mono text-xs font-bold tracking-widest uppercase text-ton-cream/60 mb-3">
              Identity
            </h4>
            <button
              onClick={() => setView("brand")}
              className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors"
            >
              Brand System
            </button>
            <p className="font-sans text-xs text-ton-cream/30 mt-4 leading-relaxed">
              Built with Times OS v2.1. All data sourced from public government portals
              and verified channels.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-ton-cream/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-xs text-ton-cream/30">
            © {new Date().getFullYear()} Times of Namibia. All rights reserved.
          </p>
          <p className="font-mono text-xs text-ton-cream/20">
            A GemsWeb Digital Publication
          </p>
        </div>
      </div>
    </footer>
  );
}
