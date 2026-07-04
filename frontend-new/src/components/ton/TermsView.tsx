
import React from "react";
import { ArrowLeft, FileText, Scale } from "lucide-react";

export default function TermsView() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div>
          <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
            Legal // Terms of Service
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
            Terms of Service
          </h1>
          <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
            The terms governing your use of the Times of Namibia platform. Last updated: 2026-04-28.
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

      {/* Governing Notice */}
      <div className="mb-8 sm:mb-10 bg-ton-black text-ton-cream p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <Scale className="w-4 h-4 text-ton-red" />
          <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
            Governing Law
          </span>
        </div>
        <p className="font-serif text-sm text-ton-cream/70 leading-relaxed">
          These Terms of Service are governed by and construed in accordance with the laws of the
          Republic of Namibia. Any disputes arising from these terms shall be subject to the
          exclusive jurisdiction of the courts of Namibia. Times of Namibia is a publication of
          TANGISON.
        </p>
      </div>

      {/* Section 1: Acceptance of Terms */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] text-ton-red font-bold tracking-widest">01</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Acceptance of Terms
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="ton-dropcap">
          <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-4">
            By accessing or using the Times of Namibia platform (the &ldquo;Service&rdquo;), you
            agree to be bound by these Terms of Service. If you do not agree with any part of these
            terms, you must discontinue use of the Service immediately. Continued use constitutes
            acceptance.
          </p>
        </div>

        <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-4">
          These terms apply to all visitors, readers, contributors, and any other persons accessing
          the Service. TANGISON reserves the right to modify these terms at any time. Material
          changes will be communicated through a notice on the platform. Your continued use after
          such notice constitutes acceptance of the modified terms.
        </p>

        <div className="bg-ton-black/[0.02] p-5 border border-ton-black/6">
          <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
            Principle
          </span>
          <p className="font-serif text-base sm:text-lg font-bold text-ton-black mt-2">
            Access is acceptance. If you disagree, close the tab.
          </p>
          <p className="font-sans text-xs text-ton-black/40 mt-1">
            There is no ambiguity. Reading this platform means accepting these terms.
          </p>
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/40 uppercase tracking-widest">
          <span>Section 01 // Acceptance of Terms</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Section 2: Use License */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] text-ton-red font-bold tracking-widest">02</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Use License
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
              Permission is granted to temporarily access and read the materials on the Times of
              Namibia platform for personal, non-commercial, non-automated use. This is the
              license granted to you - it is limited, revocable, and non-exclusive.
            </p>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
              You may share links to individual articles via the TumaOS WhatsApp pipeline or other
              standard sharing mechanisms. You may not reproduce, distribute, modify, create
              derivative works from, or commercially exploit any content from the Service without
              explicit written permission from TANGISON.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-3">
              Prohibited Uses
            </h3>
            <ul className="space-y-2.5">
              {[
                "Automated scraping, crawling, or data extraction beyond our public APIs",
                "Commercial redistribution of content without written licence",
                "Modifying or creating derivative works from published content",
                "Using the platform for any unlawful purpose under Namibian law",
                "Circumventing access restrictions or security measures",
                "Impersonating contributors, staff, or affiliated persons",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-ton-red font-bold mt-0.5 flex-shrink-0 text-sm">✗</span>
                  <span className="font-sans text-xs sm:text-sm text-ton-black/50 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/40 uppercase tracking-widest">
          <span>Section 02 // Use License</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Section 3: Content Accuracy */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] text-ton-red font-bold tracking-widest">03</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Content Accuracy
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-4">
          Times of Namibia strives for accuracy in all published content. Our 3-point verification
          matrix ensures that every datum is validated against three independent sources before
          publication. Scraped timestamps serve as proof of verification. Corrections are issued
          transparently and appended to the original content.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-5">
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
              Our Commitment
            </span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              We verify before we publish. Every datum carries its source, timestamp, and
              verification status. When errors occur, they are corrected transparently - never
              silently.
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
              Your Responsibility
            </span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              Readers should verify critical information independently before making decisions based
              on published content. No news platform is infallible. Independent verification is the
              mark of an informed citizen.
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
              Disclaimer
            </span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              The materials on the Service are provided on an &ldquo;as is&rdquo; basis. TANGISON
              Digital makes no warranties, expressed or implied, and hereby disclaims all warranties
              including without limitation implied warranties of merchantability or fitness for a
              particular purpose.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/40 uppercase tracking-widest">
          <span>Section 03 // Content Accuracy</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Section 4: Limitation of Liability */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] text-ton-red font-bold tracking-widest">04</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Limitation of Liability
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="ton-dropcap">
          <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-4">
            In no event shall TANGISON, its directors, employees, partners, agents,
            suppliers, or affiliates be liable for any indirect, incidental, special, consequential,
            or punitive damages, including without limitation loss of profits, data, use, goodwill,
            or other intangible losses, resulting from your access to or use of (or inability to
            access or use) the Service.
          </p>
        </div>

        <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-4">
          This limitation applies regardless of the legal theory under which such damages are
          sought, whether based on warranty, contract, tort (including negligence), strict liability,
          or any other legal theory, and whether or not TANGISON has been advised of the
          possibility of such damages. In jurisdictions that do not allow the exclusion or limitation
          of liability for consequential or incidental damages, our liability shall be limited to the
          maximum extent permitted by Namibian law.
        </p>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/40 uppercase tracking-widest">
          <span>Section 04 // Limitation of Liability</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Section 5: Contact & Governance */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] text-ton-red font-bold tracking-widest">05</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Contact &amp; Governance
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-4">
              For all legal enquiries, licensing requests, and terms-related communications, please
              contact our Legal Desk using the details below. We aim to respond to all enquiries
              within 14 business days.
            </p>
            <div className="bg-ton-black/[0.02] p-4 border border-ton-black/8">
              <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-2">
                Legal Desk
              </h3>
              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="flex items-center justify-between border-b border-ton-black/5 pb-1.5">
                  <span className="text-ton-black/45">Email</span>
                  <span className="text-ton-black font-semibold">legal@timesofnamibia.com</span>
                </div>
                <div className="flex items-center justify-between border-b border-ton-black/5 pb-1.5">
                  <span className="text-ton-black/45">Publisher</span>
                  <span className="text-ton-black font-semibold">TANGISON</span>
                </div>
                <div className="flex items-center justify-between pb-1.5">
                  <span className="text-ton-black/45">Jurisdiction</span>
                  <span className="text-ton-black font-semibold">Republic of Namibia</span>
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
                  { label: "Document", value: "Terms of Service" },
                  { label: "Version", value: "1.0" },
                  { label: "Last Updated", value: "2026-04-28" },
                  { label: "Publisher", value: "TANGISON" },
                  { label: "Governing Law", value: "Republic of Namibia" },
                  { label: "Review Cycle", value: "Annual" },
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

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/40 uppercase tracking-widest">
          <span>Section 05 // Contact & Governance</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>
    </div>
  );
}
