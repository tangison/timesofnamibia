
import React from "react";
import { ArrowLeft, Shield, FileText } from "lucide-react";

export default function PrivacyView() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div>
          <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
            Legal // Privacy Policy
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
            Privacy Policy
          </h1>
          <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
            How we collect, use, and protect your information. Last updated: 2026-04-28.
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
          <Shield className="w-4 h-4 text-ton-red" />
          <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
            Governance
          </span>
        </div>
        <p className="font-serif text-sm text-ton-cream/70 leading-relaxed">
          This privacy policy is governed by the laws of the Republic of Namibia. Times of Namibia
          is a publication of TANGISON, operating from Windhoek, Namibia. All data processing
          activities comply with Namibian data protection legislation.
        </p>
      </div>

      {/* Section 1: Information We Collect */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] text-ton-red font-bold tracking-widest">01</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Information We Collect
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-5">
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
              Direct Information
            </span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              Information you provide directly: contact details submitted through forms, email
              addresses for newsletter subscriptions, feedback and correspondence, and contributor
              application materials.
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
              Automatic Information
            </span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              Information collected automatically when you visit the platform: IP address, browser
              type and version, pages visited, time spent on pages, referring URL, device type, and
              screen resolution. This data is collected via standard HTTP protocols and analytics
              tools.
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
              Third-Party Information
            </span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              Information received from third-party sources: publicly available government databases
              (NIEIS, Government Gazette), verified wire services, and partner publications. All
              third-party data is subject to our 3-point verification matrix before publication.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/40 uppercase tracking-widest">
          <span>Section 01 // Information We Collect</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Section 2: How We Use Your Information */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] text-ton-red font-bold tracking-widest">02</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            How We Use Your Information
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="ton-dropcap">
          <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-4">
            We use collected information for the following purposes: delivering and improving our
            news services, processing contributor applications and correspondence, sending verified
            alerts and updates when explicitly opted in, analysing platform usage to optimise
            performance and accessibility, complying with legal obligations under Namibian law, and
            maintaining the security and integrity of the platform.
          </p>
        </div>

        <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-4">
          We do not sell personal information to third parties. We do not use personal data for
          targeted advertising. We do not profile readers for commercial purposes. The information
          we collect serves the reader, not the advertiser.
        </p>

        <div className="bg-ton-black/[0.02] p-5 border border-ton-black/6">
          <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-3">
            Principle
          </h3>
          <p className="font-serif text-base sm:text-lg font-bold text-ton-black">
            Data serves the reader. Not the advertiser. Not the algorithm.
          </p>
          <p className="font-sans text-xs text-ton-black/40 mt-1">
            Every data collection decision is measured against this principle. If it does not serve
            the reader, it is not collected.
          </p>
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/40 uppercase tracking-widest">
          <span>Section 02 // How We Use Your Information</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Section 3: Data Protection Rights */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] text-ton-red font-bold tracking-widest">03</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Data Protection Rights
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-5">
          Under Namibian data protection legislation, you have the following rights regarding your
          personal information. These rights are non-negotiable and we are committed to facilitating
          their exercise promptly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              right: "Access",
              desc: "You have the right to request a copy of the personal data we hold about you. We will provide this within 30 days of a verified request.",
            },
            {
              right: "Rectification",
              desc: "You have the right to request correction of inaccurate personal data. If data is incomplete, you may request completion.",
            },
            {
              right: "Erasure",
              desc: "You have the right to request deletion of your personal data, subject to legal retention obligations. Where erasure is not possible, we will explain why.",
            },
            {
              right: "Restriction",
              desc: "You have the right to request restriction of processing while accuracy or lawfulness is being verified. During restriction, data is stored but not processed.",
            },
            {
              right: "Objection",
              desc: "You have the right to object to processing based on legitimate interests. We will cease processing unless we demonstrate compelling grounds.",
            },
            {
              right: "Portability",
              desc: "You have the right to receive your personal data in a structured, commonly used, machine-readable format, and to transmit it to another controller.",
            },
          ].map((item, i) => (
            <div key={i} className="pt-4 border-t border-ton-black/8">
              <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
                {String(i + 1).padStart(2, "0")} {"//"} {item.right}
              </span>
              <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/40 uppercase tracking-widest">
          <span>Section 03 // Data Protection Rights</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Section 4: Cookies */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] text-ton-red font-bold tracking-widest">04</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            Cookies
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-5">
          <div className="bg-ton-black text-ton-cream p-5">
            <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-2">
              Essential Cookies
            </h3>
            <p className="font-sans text-xs text-ton-cream/50 leading-relaxed">
              Required for platform functionality. These cookies enable core features such as page
              navigation, access to secure areas, and load balancing. The platform cannot function
              without them. No consent is required.
            </p>
            <p className="font-mono text-[8px] text-ton-cream/40 mt-3">
              Duration: Session / 1 year
            </p>
          </div>
          <div className="bg-ton-black text-ton-cream p-5">
            <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-2">
              Analytics Cookies
            </h3>
            <p className="font-sans text-xs text-ton-cream/50 leading-relaxed">
              Used to understand how the platform is used. These cookies collect information about
              pages visited, time spent, and error occurrences. All analytics data is anonymised and
              aggregated. No individual reader is tracked.
            </p>
            <p className="font-mono text-[8px] text-ton-cream/40 mt-3">
              Duration: 2 years / Opt-out available
            </p>
          </div>
          <div className="bg-ton-black text-ton-cream p-5">
            <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-2">
              Preference Cookies
            </h3>
            <p className="font-sans text-xs text-ton-cream/50 leading-relaxed">
              Used to remember reader preferences such as text size, contrast mode, and regional
              settings. These cookies enhance the reading experience but are not essential for
              platform operation. Consent is required.
            </p>
            <p className="font-mono text-[8px] text-ton-cream/40 mt-3">
              Duration: 1 year / Consent required
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/40 uppercase tracking-widest">
          <span>Section 04 // Cookies</span>
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
              For all privacy-related enquiries, data subject requests, and complaints regarding
              data processing, please contact our Data Protection Officer using the details below.
              We aim to respond to all requests within 30 days of receipt.
            </p>
            <div className="bg-ton-black/[0.02] p-4 border border-ton-black/8">
              <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-2">
                Data Protection Officer
              </h3>
              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="flex items-center justify-between border-b border-ton-black/5 pb-1.5">
                  <span className="text-ton-black/45">Email</span>
                  <span className="text-ton-black font-semibold">privacy@timesofnamibia.com</span>
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
                  { label: "Document", value: "Privacy Policy" },
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
