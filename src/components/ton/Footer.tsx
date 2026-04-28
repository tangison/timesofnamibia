export default function Footer() {
  return (
    <footer className="bg-ton-black text-ton-cream mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-6">
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

          {/* GemsWeb Digital */}
          <div>
            <h4 className="font-mono text-[9px] font-bold tracking-widest uppercase text-ton-cream/30 mb-3">
              GemsWeb Digital
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://gemsweb.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors"
                >
                  gemsweb.xyz
                </a>
              </li>
              <li>
                <a href="/about" className="font-sans text-sm text-ton-cream/50 hover:text-ton-cream transition-colors">
                  About GemsWeb Digital
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
        </div>

        {/* Copyright */}
        <div className="mt-5 pt-5 border-t border-ton-cream/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[9px] text-ton-cream/25 text-center sm:text-left">
            &copy; 2026 Times of Namibia. All rights reserved.
          </p>
          <p className="font-mono text-[9px] text-ton-cream/25">
            A GemsWeb Digital Publication
          </p>
        </div>
      </div>
    </footer>
  );
}
