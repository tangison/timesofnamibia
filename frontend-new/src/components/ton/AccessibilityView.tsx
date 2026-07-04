
import React from "react";
import { ArrowLeft, FileText, Accessibility, Eye, Keyboard, Volume2, Type, Contrast, Minimize, MousePointer, Image } from "lucide-react";

export default function AccessibilityView() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div>
          <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
            Legal // Accessibility Statement
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
            Accessibility
          </h1>
          <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
            Our commitment to making Times of Namibia accessible to all readers. Last updated: 2026-04-28.
          </p>
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

      {/* Commitment Statement */}
      <div className="mb-8 sm:mb-10 py-8 sm:py-10 text-center border-t border-b border-ton-black">
        <Accessibility className="w-6 h-6 text-ton-red mx-auto mb-3" />
        <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
          Commitment
        </span>
        <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-ton-black leading-tight mt-3 max-w-3xl mx-auto">
          Information is a right. Access to that information is non-negotiable.
        </blockquote>
        <p className="font-mono text-[10px] text-ton-black/30 mt-4 tracking-wider">
          WCAG 2.1 Level AA - TANGISON
        </p>
      </div>

      {/* Section 1: WCAG Commitment */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] text-ton-red font-bold tracking-widest">01</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            WCAG 2.1 Level AA Commitment
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="ton-dropcap">
          <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-4">
            Times of Namibia is committed to ensuring digital accessibility for people with
            disabilities. We continually improve the user experience for everyone and apply relevant
            accessibility standards to achieve substantial conformance with the Web Content
            Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web
            content more accessible to people with a wide array of disabilities.
          </p>
        </div>

        <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-4">
          Conformance with WCAG 2.1 Level AA is not a destination - it is a process. We audit our
          platform regularly, implement improvements, and welcome feedback from readers who encounter
          barriers. Accessibility is not an afterthought at TON; it is a design principle embedded in
          the Broadsheet Digital philosophy from the first line of code.
        </p>

        <div className="bg-ton-black text-ton-cream p-5">
          <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-3">
            Accessibility Specifications
          </h3>
          <div className="space-y-2 font-mono text-[10px]">
            {[
              { label: "Standard", value: "WCAG 2.1 Level AA" },
              { label: "Audit Frequency", value: "Quarterly" },
              { label: "Typography", value: "Playfair Display + Inter + JetBrains Mono" },
              { label: "Minimum Text Size", value: "11px body / 14px leading" },
              { label: "Colour Contrast", value: "High-contrast cream & black palette" },
              { label: "Screen Reader", value: "Full semantic HTML5 support" },
              { label: "Keyboard", value: "100% navigable without mouse" },
            ].map((spec, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-ton-cream/8 pb-1.5"
              >
                <span className="text-ton-cream/40">{spec.label}</span>
                <span className="text-ton-cream font-bold">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Section 01 // WCAG Commitment</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Section 2: Accessibility Features */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] text-ton-red font-bold tracking-widest">02</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Accessibility Features
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-5">
          The Times of Namibia platform incorporates the following accessibility features. Each
          feature is designed, tested, and maintained to ensure that every reader can access
          verified information regardless of ability.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              icon: Keyboard,
              title: "Keyboard Navigation",
              desc: "Every interactive element on the platform is reachable and operable via keyboard alone. Tab order follows logical reading sequence. Focus indicators are visible and high-contrast.",
            },
            {
              icon: Volume2,
              title: "Screen Reader Support",
              desc: "Full semantic HTML5 markup with ARIA landmarks, labels, and roles. Headings follow a logical hierarchy. Dynamic content updates are announced. All form fields have associated labels.",
            },
            {
              icon: Type,
              title: "Adjustable Text",
              desc: "Body text renders at a minimum of 11px with 14px leading. Readers can scale text using browser zoom without loss of content or functionality. The layout responds to text scaling up to 200%.",
            },
            {
              icon: Contrast,
              title: "High Contrast",
              desc: "The TON palette - cream (#F9F8F6) on black (#111111) - exceeds WCAG AAA contrast ratios. Text is always rendered against backgrounds that provide sufficient contrast for readability.",
            },
            {
              icon: Minimize,
              title: "Reduced Motion",
              desc: "The ticker animation and any motion-based features respect the prefers-reduced-motion media query. When reduced motion is enabled, animations pause or are replaced with static alternatives.",
            },
            {
              icon: MousePointer,
              title: "Focus Indicators",
              desc: "All focusable elements display a visible, high-contrast focus indicator. Focus order follows the natural reading flow. No element traps keyboard focus. Skip-to-content link is available.",
            },
            {
              icon: Image,
              title: "Alt Text",
              desc: "All imagery carries descriptive alt text. Image descriptions provide context for screen reader users. GPS overlays and timestamp data are included in alt text for editorial images.",
            },
          ].map((feature, i) => (
            <div key={i} className="pt-4 border-t border-ton-black/8">
              <div className="flex items-center gap-2 mb-2">
                <feature.icon className="w-3.5 h-3.5 text-ton-red flex-shrink-0" />
                <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
                  {String(i + 1).padStart(2, "0")} {"//"} {feature.title}
                </span>
              </div>
              <p className="font-serif text-sm text-ton-black/50 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Section 02 // Accessibility Features</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Section 3: Contact */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] text-ton-red font-bold tracking-widest">03</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Contact &amp; Feedback
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-4">
              We welcome your feedback on the accessibility of the Times of Namibia platform. If you
              encounter any barriers, experience difficulty accessing content, or have suggestions
              for improvement, please contact us. Every report is investigated and every improvement
              is tracked.
            </p>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-4">
              Accessibility is not compliance - it is respect. We treat every reader&rsquo;s access
              need as a design requirement, not an edge case.
            </p>
            <div className="bg-ton-black/[0.02] p-4 border border-ton-black/8">
              <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-2">
                Accessibility Contact
              </h3>
              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="flex items-center justify-between border-b border-ton-black/5 pb-1.5">
                  <span className="text-ton-black/30">Email</span>
                  <span className="text-ton-black font-semibold">
                    accessibility@timesofnamibia.com
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-ton-black/5 pb-1.5">
                  <span className="text-ton-black/30">Response Time</span>
                  <span className="text-ton-black font-semibold">Within 5 business days</span>
                </div>
                <div className="flex items-center justify-between pb-1.5">
                  <span className="text-ton-black/30">Publisher</span>
                  <span className="text-ton-black font-semibold">TANGISON</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-ton-black text-ton-cream p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-3.5 h-3.5 text-ton-red" />
                <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
                  Document Details
                </h3>
              </div>
              <div className="space-y-2 font-mono text-[10px]">
                {[
                  { label: "Document", value: "Accessibility Statement" },
                  { label: "Version", value: "1.0" },
                  { label: "Last Updated", value: "2026-04-28" },
                  { label: "Conformance Target", value: "WCAG 2.1 Level AA" },
                  { label: "Publisher", value: "TANGISON" },
                  { label: "Audit Cycle", value: "Quarterly" },
                ].map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-ton-cream/8 pb-1.5"
                  >
                    <span className="text-ton-cream/40">{spec.label}</span>
                    <span className="text-ton-cream font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Section 03 // Contact & Feedback</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>
    </div>
  );
}
