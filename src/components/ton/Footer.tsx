import { Cpu, FileText, Briefcase, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="ton-footer bg-ton-black text-ton-cream mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-ton-cream text-ton-black font-mono text-xs font-bold px-2.5 py-1">
                TON
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-ton-red" />
                <span className="font-mono text-xs text-ton-cream/70">
                  GemsWeb Digital
                </span>
              </div>
            </div>
            <p className="font-serif italic text-ton-cream/60 text-sm leading-relaxed">
              Namibia. Informed. Instantly.
            </p>
          </div>

          {/* Data Pipelines */}
          <div>
            <h4 className="font-mono text-[10px] font-bold tracking-widest uppercase text-ton-cream/50 mb-4">
              Data Pipelines
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/jobs"
                  className="font-sans text-sm text-ton-cream/70 hover:text-ton-cream transition-colors flex items-center gap-2"
                >
                  <Briefcase className="w-3.5 h-3.5 text-ton-red" />
                  Job Scraper
                </a>
              </li>
              <li>
                <a
                  href="/tender"
                  className="font-sans text-sm text-ton-cream/70 hover:text-ton-cream transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-ton-red" />
                  Tender Analysis
                </a>
              </li>
              <li>
                <a
                  href="/contributor"
                  className="font-sans text-sm text-ton-cream/70 hover:text-ton-cream transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contributors
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-[10px] font-bold tracking-widest uppercase text-ton-cream/50 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="font-sans text-sm text-ton-cream/60">
                  About Times of Namibia
                </span>
              </li>
              <li>
                <span className="font-sans text-sm text-ton-cream/60">
                  Editorial Standards
                </span>
              </li>
              <li>
                <span className="font-sans text-sm text-ton-cream/60">
                  Contact
                </span>
              </li>
              <li>
                <span className="font-sans text-sm text-ton-cream/60">
                  Careers
                </span>
              </li>
            </ul>
          </div>

          {/* Brand */}
          <div>
            <h4 className="font-mono text-[10px] font-bold tracking-widest uppercase text-ton-cream/50 mb-4">
              Identity
            </h4>
            <a
              href="/brand"
              className="font-sans text-sm text-ton-cream/70 hover:text-ton-cream transition-colors"
            >
              Brand System
            </a>
            <p className="font-sans text-xs text-ton-cream/40 mt-5 leading-relaxed">
              Built with Times OS v2.1. All data sourced from public government portals
              and verified channels.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-ton-cream/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[10px] text-ton-cream/40 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Times of Namibia. All rights reserved.
          </p>
          <p className="font-mono text-[10px] text-ton-cream/40">
            A GemsWeb Digital Publication
          </p>
        </div>
      </div>
    </footer>
  );
}
