import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";

export const metadata: Metadata = {
  title: "About — Times of Namibia",
  description:
    "About Times of Namibia — a TANGISON publication. Applied AI built in Africa, delivering real-time verified news for Namibia and the continent.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <TonLayout>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Title */}
        <span className="font-mono text-[10px] tracking-widest uppercase text-ton-red/70 font-semibold border border-ton-red/20 px-2 py-0.5">
          About
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-4">
          Times of Namibia
        </h1>
        <p
          className="font-serif text-xl text-ton-black/50 italic mt-3 leading-relaxed"
        >
          Applied AI. Built in Africa.
        </p>

        {/* Content */}
        <div className="mt-10 space-y-6">
          <p className="font-serif text-base md:text-lg text-ton-black/70 leading-relaxed">
            Times of Namibia is a digital-first news outlet publishing real-time verified news,
            tender analysis, job market intelligence, and market data for Namibia and the African continent.
            We are a TANGISON publication — built on applied AI infrastructure designed for African operating conditions.
          </p>

          <p className="font-serif text-base md:text-lg text-ton-black/70 leading-relaxed">
            Our editorial pipeline combines 13 RSS feeds from Namibian and international outlets,
            AI-powered summarization and classification, and a content sanity check that quarantines
            broken articles before they reach readers. Every article is processed through a multi-source
            AI pipeline that generates original summaries, classifies them into editorial sections,
            and produces feature images.
          </p>

          <h2 className="font-serif text-2xl font-bold text-ton-black pt-6 border-t border-ton-black/10">
            What We Cover
          </h2>
          <ul className="space-y-3 font-serif text-base text-ton-black/60 leading-relaxed">
            <li><strong className="text-ton-black">National News</strong> — Governance, policy, and civic life from 9 Namibian outlets</li>
            <li><strong className="text-ton-black">Economy & Mining</strong> — Financial news, diamonds, uranium, and extractive industries</li>
            <li><strong className="text-ton-black">Energy</strong> — Green hydrogen, solar, oil, and Namibia's energy transition</li>
            <li><strong className="text-ton-black">Africa Desk</strong> — Continental affairs from five regions</li>
            <li><strong className="text-ton-black">World</strong> — International coverage from SCMP, Telegraph, and Euronews</li>
            <li><strong className="text-ton-black">Jobs & Tenders</strong> — Employment intelligence and government procurement</li>
          </ul>

          <h2 className="font-serif text-2xl font-bold text-ton-black pt-6 border-t border-ton-black/10">
            Our Technology
          </h2>
          <p className="font-serif text-base md:text-lg text-ton-black/70 leading-relaxed">
            The platform runs on Next.js 16, Convex (real-time reactive database), and an AI pipeline
            powered by OpenRouter and Groq. RSS feeds are ingested every 15 minutes via a Convex cron job,
            with a backup trigger via cron-job.org. Article images are generated using a two-step process:
            an AI picks a symbolic physical object, then Pollinations.ai generates a studio photograph of it.
          </p>

          <h2 className="font-serif text-2xl font-bold text-ton-black pt-6 border-t border-ton-black/10">
            Editorial Standards
          </h2>
          <p className="font-serif text-base md:text-lg text-ton-black/70 leading-relaxed">
            We do not auto-publish user-generated content. All community contributions go through
            editorial review before publishing. AI-generated content is marked as such, with visible
            source attribution for synthesized articles. We do not hotlink stock photos — every image
            is either from the publisher's own CDN or AI-generated with our brand palette.
          </p>

          <h2 className="font-serif text-2xl font-bold text-ton-black pt-6 border-t border-ton-black/10">
            Published by TANGISON
          </h2>
          <p className="font-serif text-base md:text-lg text-ton-black/70 leading-relaxed">
            TANGISON is an applied AI laboratory based in Windhoek, Namibia. We build AI systems
            for African operating conditions — systems that work where AI has never worked before.
            Times of Namibia is one of those systems.
          </p>

          <div className="pt-8">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-ton-black text-white font-mono text-xs uppercase tracking-widest px-6 py-3 hover:bg-ton-red transition-colors"
            >
              Contact the Newsroom
            </a>
          </div>
        </div>
      </div>
    </TonLayout>
  );
}
