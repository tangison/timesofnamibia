"use client";

import Link from "next/link";
import { Cpu, FileText, Briefcase, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="ton-footer bg-ton-black text-ton-cream mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-ton-cream text-ton-black font-mono text-xs font-bold px-2 py-0.5 rounded-none">
                TON
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-ton-gold" />
                <span className="font-mono text-xs text-ton-cream/80">
                  GemsWeb Digital
                </span>
              </div>
            </div>
            <p className="font-serif italic text-ton-cream/80 text-sm">
              Namibia. Informed. Instantly.
            </p>
          </div>

          {/* Data Pipelines */}
          <div>
            <h4 className="font-mono text-xs font-bold tracking-widest uppercase text-ton-cream/80 mb-3">
              Data Pipelines
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/jobs"
                  className="font-sans text-sm text-ton-cream/80 hover:text-ton-cream transition-colors flex items-center gap-1.5"
                >
                  <Briefcase className="w-3 h-3" />
                  Job Scraper
                </Link>
              </li>
              <li>
                <Link
                  href="/tender"
                  className="font-sans text-sm text-ton-cream/80 hover:text-ton-cream transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3" />
                  Tender Analysis
                </Link>
              </li>
              <li>
                <Link
                  href="/contributor"
                  className="font-sans text-sm text-ton-cream/80 hover:text-ton-cream transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3 h-3" />
                  Contributors
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-xs font-bold tracking-widest uppercase text-ton-cream/80 mb-3">
              Company
            </h4>
            <ul className="space-y-1.5">
              <li>
                <span className="font-sans text-sm text-ton-cream/80">
                  About Times of Namibia
                </span>
              </li>
              <li>
                <span className="font-sans text-sm text-ton-cream/80">
                  Editorial Standards
                </span>
              </li>
              <li>
                <span className="font-sans text-sm text-ton-cream/80">
                  Contact
                </span>
              </li>
              <li>
                <span className="font-sans text-sm text-ton-cream/80">
                  Careers
                </span>
              </li>
            </ul>
          </div>

          {/* Brand */}
          <div>
            <h4 className="font-mono text-xs font-bold tracking-widest uppercase text-ton-cream/80 mb-3">
              Identity
            </h4>
            <Link
              href="/brand"
              className="font-sans text-sm text-ton-cream/80 hover:text-ton-cream transition-colors"
            >
              Brand System
            </Link>
            <p className="font-sans text-xs text-ton-cream/60 mt-4 leading-relaxed">
              Built with Times OS v2.1. All data sourced from public government portals
              and verified channels.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-ton-cream/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-xs text-ton-cream/60 text-center sm:text-left">
            © {new Date().getFullYear()} Times of Namibia. All rights reserved.
          </p>
          <p className="font-mono text-xs text-ton-cream/60">
            A GemsWeb Digital Publication
          </p>
        </div>
      </div>
    </footer>
  );
}
