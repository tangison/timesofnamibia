import type { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import { FileQuestion, ArrowLeft, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist, has been moved, or is no longer available.",
  robots: { index: false, follow: true }, // 404 page - never index
};

export default function NotFound() {
  return (
    <TonLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        {/* 404 Label */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-12 h-[1px] bg-ton-red" />
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-ton-red font-bold">
            404 - Not Found
          </span>
          <span className="w-12 h-[1px] bg-ton-red" />
        </div>

        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 border-2 border-ton-black/10 flex items-center justify-center">
            <FileQuestion className="w-10 h-10 text-ton-black/40" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ton-black leading-tight">
          Page Not Found
        </h1>

        {/* Subtext */}
        <p className="font-serif italic text-ton-black/40 text-base sm:text-lg mt-4 max-w-md mx-auto leading-relaxed">
          The page you are looking for does not exist, has been moved, or is no longer available.
        </p>

        {/* Editorial detail */}
        <p className="font-mono text-[9px] text-ton-black/40 uppercase tracking-wider mt-3">
          If you believe this is an error, contact editorial@timesofnamibia.com
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <a
            href="/"
            className="flex items-center gap-2 bg-ton-black text-ton-cream font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-3 hover:bg-ton-black/90 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Front Page
          </a>
          <a
            href="/contact"
            className="flex items-center gap-2 border border-ton-black/20 text-ton-black font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-3 hover:bg-ton-black/5 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            Contact the Desk
          </a>
        </div>

        {/* Thin rule */}
        <div className="mt-12 pt-6 border-t border-ton-black/8">
          <p className="font-serif italic text-ton-black/40 text-sm">
            Times of Namibia - Namibia. Informed. Instantly.
          </p>
        </div>
      </div>
    </TonLayout>
  );
}
