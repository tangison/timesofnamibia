import { Cpu, FileText, Briefcase, Mail, BookOpen, Map, Home, TrendingUp } from "lucide-react";

const NAV_ITEMS = [
  { label: "National", href: "/", key: "national", icon: Home },
  { label: "The Tender Edge", href: "/tender", key: "tender", icon: TrendingUp },
  { label: "Job Scraper", href: "/jobs", key: "jobs", icon: Briefcase },
  { label: "Contributors", href: "/contributor", key: "contributor", icon: Mail },
  { label: "Business Plan", href: "/business-plan", key: "business-plan", icon: BookOpen },
  { label: "The Plan", href: "/plan", key: "plan", icon: Map },
  { label: "Brand", href: "/brand", key: "brand", icon: Cpu },
];

export default function Footer({ activePage }: { activePage?: string }) {
  return (
    <footer className="bg-ton-black text-ton-cream mt-auto">
      {/* Navigation Section */}
      <div className="border-b border-ton-cream/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[9px] text-ton-cream/30 uppercase tracking-widest font-bold">
              Sections
            </span>
            <span className="flex-1 h-px bg-ton-cream/10" />
          </div>
          <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-x-4 gap-y-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === activePage;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 font-mono text-xs uppercase tracking-wider transition-colors py-1.5 ${
                    isActive
                      ? "text-ton-red font-bold"
                      : "text-ton-cream/50 hover:text-ton-cream"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="bg-ton-cream text-ton-black font-mono text-xs font-bold px-2.5 py-1">
                TON
              </div>
              <span className="font-mono text-[10px] text-ton-cream/50">
                GemsWeb Digital
              </span>
            </div>
            <p className="font-serif italic text-ton-cream/40 text-sm leading-relaxed">
              Namibia. Informed. Instantly.
            </p>
          </div>

          {/* Data Pipelines */}
          <div>
            <h4 className="font-mono text-[9px] font-bold tracking-widest uppercase text-ton-cream/30 mb-3">
              Data Pipelines
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/jobs" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  Job Scraper
                </a>
              </li>
              <li>
                <a href="/tender" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  Tender Analysis
                </a>
              </li>
              <li>
                <a href="/contributor" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  Contributors
                </a>
              </li>
            </ul>
          </div>

          {/* Documents */}
          <div>
            <h4 className="font-mono text-[9px] font-bold tracking-widest uppercase text-ton-cream/30 mb-3">
              Documents
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/business-plan" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  Business Plan
                </a>
              </li>
              <li>
                <a href="/plan" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  The Plan
                </a>
              </li>
              <li>
                <a href="/brand" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  Brand System
                </a>
              </li>
            </ul>
          </div>

          {/* Identity */}
          <div>
            <h4 className="font-mono text-[9px] font-bold tracking-widest uppercase text-ton-cream/30 mb-3">
              Identity
            </h4>
            <p className="font-sans text-xs text-ton-cream/30 leading-relaxed">
              Built with Times OS v2.1. All data sourced from public government portals
              and verified channels.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-5 border-t border-ton-cream/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[9px] text-ton-cream/25 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Times of Namibia. All rights reserved.
          </p>
          <p className="font-mono text-[9px] text-ton-cream/25">
            A GemsWeb Digital Publication
          </p>
        </div>
      </div>
    </footer>
  );
}
