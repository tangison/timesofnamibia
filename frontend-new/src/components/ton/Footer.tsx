export default function Footer() {
  return (
    <footer className="bg-ton-black text-ton-cream mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-6">
          {/* Brand — TANGISON logo mark (white variant for dark bg) */}
          <div>
            <div className="mb-3">
              <img
                src="/logo-mark-white.png"
                alt="TANGISON — Applied AI. Built in Africa."
                width={36}
                height={36}
                loading="lazy"
                className="w-9 h-9 opacity-80"
              />
            </div>
            <p className="font-mono text-[10px] text-ton-cream/40 tracking-[0.15em] uppercase leading-relaxed">
              Applied AI.<br />Built in Africa.
            </p>
          </div>

          {/* TON */}
          <div>
            <h4 className="font-mono text-[9px] font-bold tracking-widest uppercase text-ton-cream/30 mb-3">
              TON
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

          {/* Company */}
          <div>
            <h4 className="font-mono text-[9px] font-bold tracking-widest uppercase text-ton-cream/30 mb-3">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  About Times of Namibia
                </a>
              </li>
              <li>
                <a href="/editorial-standards" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  Editorial Standards
                </a>
              </li>
              <li>
                <a href="/contact" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/accessibility" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>

          {/* TANGISON */}
          <div>
            <h4 className="font-mono text-[9px] font-bold tracking-widest uppercase text-ton-cream/30 mb-3">
              TANGISON
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://tangison.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors"
                >
                  tangison.com
                </a>
              </li>
              <li>
                <a href="/about" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  About TANGISON
                </a>
              </li>
            </ul>
            <p className="font-sans text-[11px] text-ton-cream/25 mt-3 leading-relaxed">
              Enterprise data pipelines powering TON&apos;s real-time intelligence.
            </p>
          </div>
        </div>

        {/* Identity */}
        <div className="mt-8 pt-5 border-t border-ton-cream/10">
          <h4 className="font-mono text-[9px] font-bold tracking-widest uppercase text-ton-cream/30 mb-2">
            Identity
          </h4>
          <p className="font-sans text-xs text-ton-cream/30 leading-relaxed">
            Built with Times OS v2.1. All data sourced from public government portals
            and verified channels.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <a href="/feed.xml" className="font-mono text-[9px] text-ton-cream/25 hover:text-ton-cream/50 uppercase tracking-wider transition-colors">
              RSS Feed
            </a>
            <span className="text-ton-cream/10">|</span>
            <a href="/sitemap.xml" className="font-mono text-[9px] text-ton-cream/25 hover:text-ton-cream/50 uppercase tracking-wider transition-colors">
              Sitemap
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-5 pt-5 border-t border-ton-cream/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[9px] text-ton-cream/25 text-center sm:text-left">
            &copy; 2026 Times of Namibia. All rights reserved.
          </p>
          <p className="font-mono text-[9px] text-ton-cream/25">
            A TANGISON Publication
          </p>
        </div>
      </div>
    </footer>
  );
}
