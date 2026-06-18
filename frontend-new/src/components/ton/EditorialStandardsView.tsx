import React from "react";
import { ArrowLeft, Shield, Clock, MapPin, Tag, Ban, Eye, Users, RotateCcw, Camera, Printer } from "lucide-react";

export default function EditorialStandardsView() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div>
          <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
            Standards // The Protocol
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
            Editorial Standards
          </h1>
          <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
            The rules that govern every datum, every headline, every pixel. Non-negotiable.
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

      {/* Opening Statement */}
      <div className="py-8 sm:py-10 text-center border-t border-b border-ton-black mb-8 sm:mb-10">
        <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl text-ton-black/50 leading-relaxed max-w-3xl mx-auto">
          &ldquo;The standard is the standard. There are no exceptions, no shortcuts, no editorial conveniences that override the protocol.&rdquo;
        </blockquote>
        <p className="font-mono text-[10px] text-ton-black/30 mt-4 tracking-widest uppercase">
          TANGISON Editorial Board
        </p>
      </div>

      {/* Standard 1: Verification Protocol */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <Shield className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            I. Verification Protocol
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <div className="ton-dropcap">
              <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
                Every datum published by Times of Namibia undergoes a mandatory 3-point source verification before it reaches the reader. This is not aspirational — it is structural. The Times OS engine validates each data point against three independent sources: the primary government portal, a secondary official record, and a tertiary cross-reference. If any point in the triangle fails, the datum is flagged as unverified, never buried or silently corrected.
              </p>
            </div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
              Scraped timestamps serve as proof of verification. When a reader sees a timestamp reading &ldquo;Scraped 6s ago,&rdquo; they are witnessing the output of a verification chain that began at the source portal and ended on their screen in under six seconds. The timestamp is the receipt. The verification badge is the seal.
            </p>
          </div>
          <div>
            <div className="bg-ton-black text-ton-cream p-5">
              <h3 className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-wider mb-3">
                3-Point Verification Matrix
              </h3>
              <div className="space-y-3 font-mono text-[10px]">
                {[
                  { point: "Source A", desc: "Primary government portal (NIEIS, Gazette, CRAN)" },
                  { point: "Source B", desc: "Secondary official record or agency confirmation" },
                  { point: "Source C", desc: "Tertiary cross-reference or verified wire service" },
                ].map((item, i) => (
                  <div key={i} className="border-b border-ton-cream/8 pb-2">
                    <span className="text-ton-red font-bold">{item.point}</span>
                    <p className="text-ton-cream/50 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-ton-cream/8">
                <p className="font-mono text-[9px] text-ton-cream/30 uppercase tracking-wider">
                  If any point fails → Flagged as Unverified. Never buried.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Standard I // Verification Protocol</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Standard 2: The 6-Second Rule */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <Clock className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            II. The 6-Second Rule
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-5">
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Data Refresh</span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              All technical data is refreshed within 6-second cycles. The scraping engine operates continuously, ensuring that no figure displayed to the reader is older than six seconds unless explicitly marked as archival.
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Page Load</span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              If a feature cannot load on a 3G connection in Oshakati within 6 seconds, it does not ship. The platform is CSS-heavy and image-light by design. Every byte must earn its place on the page.
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Broadside Reading</span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              The physical Broadside is designed to be read in 90 seconds. Every story on the sheet must be graspable in under 6 seconds of scanning. Headlines, timestamps, and source badges do the heavy lifting.
            </p>
          </div>
        </div>

        <div className="bg-ton-black/[0.02] p-5 border border-ton-black/6">
          <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">The Rule</span>
          <p className="font-serif text-lg sm:text-xl font-bold text-ton-black mt-2">
            6 seconds. No exceptions. No excuses.
          </p>
          <p className="font-sans text-xs text-ton-black/40 mt-1">
            If the reader cannot verify that the data is current within 6 seconds of looking at the screen, the system has failed.
          </p>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Standard II // The 6-Second Rule</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Standard 3: Regional Accuracy */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <MapPin className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            III. Regional Accuracy
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-5">
          The spelling of Namibian regions is non-negotiable. We do not anglicise, simplify, or approximate. The click consonant in //Kharas is not decorative — it is the name. Our editorial system enforces correct spelling programmatically, with a regional name validator built into the Times OS pipeline.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          {[
            { region: "//Kharas", note: "Includes the click consonant. Never 'Kharas' without the //." },
            { region: "!Karas", note: "Used in specific anthropological and historical contexts. Not interchangeable." },
            { region: "Oshana", note: "Not 'Oshanaa'. The double-a is incorrect." },
            { region: "Otjozondjupa", note: "Full spelling required. No abbreviations in editorial copy." },
            { region: "Kavango East / West", note: "Always with directional suffix. 'Kavango' alone is insufficient." },
            { region: "Zambezi", note: "Not 'Caprivi'. The region was renamed in 2013. This is enforced." },
          ].map((item, i) => (
            <div key={i} className="pt-4 border-t border-ton-black/8">
              <span className="font-serif text-sm font-bold text-ton-black">{item.region}</span>
              <p className="font-sans text-[11px] text-ton-black/40 mt-1 leading-relaxed">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Standard III // Regional Accuracy</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Standard 4: Source Attribution */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <Tag className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            IV. Source Attribution
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-5">
          Every datum carries its source, its timestamp, and its verification status. This is not optional metadata — it is the structural integrity of the publication. A datum without a source is not information; it is noise. A timestamp that is not visible is not proof; it is decoration.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          <div className="bg-ton-black text-ton-cream p-5">
            <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-2">Source</h3>
            <p className="font-sans text-xs text-ton-cream/50 leading-relaxed">
              The primary portal, agency, or wire from which the datum was scraped. Displayed in JetBrains Mono. Example: <span className="text-ton-cream font-bold">NIEIS</span> or <span className="text-ton-cream font-bold">Gov. Gazette</span>
            </p>
          </div>
          <div className="bg-ton-black text-ton-cream p-5">
            <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-2">Timestamp</h3>
            <p className="font-sans text-xs text-ton-cream/50 leading-relaxed">
              ISO-8601 format with CAT timezone. The exact moment the data was scraped. Displayed as &ldquo;Scraped Xs ago&rdquo; for reader-facing copy, and full timestamp in metadata view. Example: <span className="text-ton-cream font-bold">2026-05-15T14:32:07+02:00</span>
            </p>
          </div>
          <div className="bg-ton-black text-ton-cream p-5">
            <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-2">Verification</h3>
            <p className="font-sans text-xs text-ton-cream/50 leading-relaxed">
              The verification badge indicates whether the 3-point matrix has been satisfied. Statuses: <span className="text-ton-cream font-bold">Verified</span> (3/3), <span className="text-ton-red font-bold">Partial</span> (2/3), <span className="text-ton-red font-bold">Unverified</span> (&lt;2/3).
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Standard IV // Source Attribution</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Standard 5: No Engagement Bait */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <Ban className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            V. No Engagement Bait
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
              We do not optimise for engagement. We optimise for understanding. There are no clickbait headlines, no inflated urgency, no artificial scarcity. A headline is a summary of fact, not a promise of revelation. If the reader must click to discover what the headline should have told them, the headline has failed.
            </p>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
              Information density is the metric. Every headline must convey the essential truth. Every data point must serve the reader, not the analytics dashboard. We measure success by comprehension, not by clicks.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-3">Prohibited Practices</h3>
            <ul className="space-y-2.5">
              {[
                "Clickbait headlines that withhold essential information",
                "Artificial urgency or countdown-based framing",
                "Engagement metrics as editorial KPIs",
                "Emojis in headlines or push notifications",
                "Infinite scroll designed to maximise session duration",
                "Pop-ups, interstitials, or attention-capture mechanisms",
                "A/B tested headlines optimised for clicks over accuracy",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-ton-red font-bold mt-0.5 flex-shrink-0 text-sm">✗</span>
                  <span className="font-sans text-xs sm:text-sm text-ton-black/50 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Standard V // No Engagement Bait</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Standard 6: The Stoic Observer */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <Eye className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            VI. The Stoic Observer — Editorial Voice
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <div className="ton-dropcap">
              <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
                The editorial voice of Times of Namibia is the Stoic Observer: intellectual, precise, and deeply rooted in Namibian soil. It does not emote. It does not speculate. It observes, verifies, and presents. The voice is the same whether reporting a tender award in Windhoek or a community development initiative in Kavango West — measured, factual, and stripped of performative urgency.
              </p>
            </div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
              The Stoic Observer does not tell the reader how to feel. It tells the reader what is. Opinion is clearly separated from fact. When editorial judgment is exercised, it is disclosed. When a story requires context, it is provided — not as commentary, but as the scaffolding of understanding.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase mb-3">Voice Attributes</h3>
            <ul className="space-y-3">
              {[
                { attr: "Intellectual", desc: "Assumes the reader's capacity. Does not simplify. Provides depth." },
                { attr: "Precise", desc: "Every word is deliberate. No hedging, no vagueness, no filler." },
                { attr: "Rooted", desc: "Namibian context is not added — it is foundational. //Kharas is spelled with the click." },
                { attr: "Stoic", desc: "No emotive language. No performative urgency. The fact is sufficient." },
              ].map((item, i) => (
                <li key={i}>
                  <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">{item.attr}</span>
                  <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-1">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Standard VI // The Stoic Observer</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Standard 7: Contributor Standards */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <Users className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            VII. Contributor Standards
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
              Every contributor to Times of Namibia operates within the same verification framework as the core editorial pipeline. There are no exceptions for external wires, freelance correspondents, or partner publications. If the datum appears on TON, it carries the same source attribution, the same timestamp, and the same verification badge.
            </p>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
              Verified correspondents receive a verification badge that is displayed alongside their bylines. This badge is not decorative — it indicates that the contributor has passed the TON verification protocol and their submissions flow through the same 3-point validation as scraped data.
            </p>
          </div>
          <div>
            <ul style={{ listStyle: "none", padding: 0 }} className="space-y-3">
              {[
                { label: "Verified Wires Only", desc: "Only wire services that pass the TON verification matrix are integrated. Unverified wires are excluded." },
                { label: "Source Attribution", desc: "Every contributor submission must include primary source, timestamp, and verification chain." },
                { label: "Verification Badges", desc: "Contributors who pass the protocol receive a visible badge. No badge, no byline." },
                { label: "Regional Expertise", desc: "Contributors are assigned to regions they have verified knowledge of. No generalists." },
              ].map((item, i) => (
                <li key={i}>
                  <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">{item.label}</span>
                  <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-1">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Standard VII // Contributor Standards</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Standard 8: Correction Policy */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <RotateCcw className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            VIII. Correction Policy
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-5">
          Errors are corrected transparently. There are no silent edits. When a correction is issued, it is appended to the original article with a JetBrains Mono timestamp, the nature of the error, and the corrected datum. The original text remains visible, struck through, with the correction immediately below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Transparency</span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              Every correction is visible. The original error is preserved, struck through, and the correction is appended with a monospaced timestamp. The reader sees both the error and the fix.
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Timeliness</span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              Corrections are issued within the same 6-second cycle when possible. System-detected errors trigger automatic flags. Editorial corrections are appended within one scraping cycle of confirmation.
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Accountability</span>
            <p className="font-serif text-sm text-ton-black/50 leading-relaxed mt-2">
              A public correction log is maintained. The frequency and nature of corrections are themselves data points, visible to any reader who wishes to assess the reliability of the system.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Standard VIII // Correction Policy</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Standard 9: Imagery Standards */}
      <section className="border-t-4 border-ton-black pt-6 mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-5">
          <Camera className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            IX. Imagery Standards
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8] mb-3">
              All photography must be high-contrast grayscale. No stock photography. If it is not Namibia, it is not Times of Namibia. Every image must carry a GPS coordinate watermark and a JetBrains Mono timestamp in a black rectangular box. No rounded corners on overlay elements. Images displayed grayscale by default; colour on hover (digital only).
            </p>
            <p className="font-serif text-sm text-ton-black/60 leading-[1.8]">
              Print imagery is always grayscale — no hover state in print. All images must be shot with Namibian content: landscapes, infrastructure, people, commerce. No artificial lighting in outdoor shots. Natural light only.
            </p>
          </div>
          <div>
            <ul className="space-y-2.5">
              {[
                "High-contrast grayscale — no exceptions",
                "No stock photography. Namibian content only",
                "GPS coordinate watermark in black rectangular box",
                "JetBrains Mono timestamp in the same black box",
                "Sharp corners on all overlay elements",
                "Grayscale default; colour on hover (digital only)",
                "16:9 for hero images, 4:3 for inline, 1:1 for portraits",
                "Natural light only for outdoor shots",
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-ton-red flex-shrink-0 mt-1.5" />
                  <span className="font-sans text-xs sm:text-sm text-ton-black/50 leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Overlay example */}
        <div className="mt-6 bg-ton-black/3 p-4">
          <div className="bg-ton-black/5 h-32 flex items-center justify-center border border-ton-black/8 relative">
            <p className="font-mono text-[10px] text-ton-black/20 uppercase tracking-widest">[ Image Area ]</p>
            <div className="absolute bottom-2 left-2 bg-ton-black text-ton-cream px-2 py-1">
              <p className="font-mono text-[7px] leading-tight">
                WINDHOEK CBD // 22.57 S, 17.08 E<br/>
                2026-04-28 14:32:07 CAT
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Standard IX // Imagery Standards</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>

      {/* Standard 10: Print Standards */}
      <section className="border-t-4 border-ton-black pt-6">
        <div className="flex items-center gap-3 mb-5">
          <Printer className="w-4 h-4 text-ton-red" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
            X. Print Standards
          </h2>
        </div>
        <div className="h-px bg-ton-black/8 mb-5" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Paper Stock</span>
            <p className="font-sans text-xs text-ton-black/50 mt-2 leading-relaxed">
              Pure White or Cream stock, minimum 120gsm. No gloss. Matte finish only. The texture must feel like authority — thick, unyielding, and archival.
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Baseline Grid</span>
            <p className="font-sans text-xs text-ton-black/50 mt-2 leading-relaxed">
              All type aligned to a baseline grid. Headlines in Playfair Display 900, body in Inter 400, data in JetBrains Mono. The grid is non-negotiable.
            </p>
          </div>
          <div className="pt-5 border-t border-ton-black/8">
            <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">Physical Form</span>
            <p className="font-sans text-xs text-ton-black/50 mt-2 leading-relaxed">
              Brutalist minimalism. Sharp corners only. No soft textures. No rounded edges. The physical form must convey the same authority as the editorial content it carries.
            </p>
          </div>
        </div>

        <div className="bg-ton-black text-ton-cream p-5">
          <h3 className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-wider mb-3">
            Print Typography Hierarchy
          </h3>
          <div className="space-y-2 font-mono text-[10px]">
            {[
              { label: "Headlines", value: "Playfair Display 900, 48–72pt" },
              { label: "Subheadings", value: "Playfair Display 700, 24–36pt" },
              { label: "Body Text", value: "Inter 400, 11pt / 14pt leading" },
              { label: "Data & Timestamps", value: "JetBrains Mono 400, 8–10pt" },
              { label: "Labels & Metadata", value: "JetBrains Mono 700, 7–9pt, uppercase" },
              { label: "Paper", value: "120gsm Cream, Matte, Acid-free" },
            ].map((spec, i) => (
              <div key={i} className="flex items-center justify-between border-b border-ton-cream/8 pb-1.5">
                <span className="text-ton-cream/40">{spec.label}</span>
                <span className="text-ton-cream font-bold">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-ton-black/8 font-mono text-[8px] text-ton-black/20 uppercase tracking-widest">
          <span>Standard X // Print Standards</span>
          <span>&copy; TANGISON</span>
        </div>
      </section>
    </div>
  );
}
