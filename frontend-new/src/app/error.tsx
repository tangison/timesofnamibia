"use client";

import { useEffect } from "react";
import TonLayout from "@/components/ton/TonLayout";
import { AlertTriangle, RotateCw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("TON Error Boundary:", error);
  }, [error]);

  return (
    <TonLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        {/* Error Label */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-12 h-[1px] bg-ton-red" />
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-ton-red font-bold">
            Error - Something Went Wrong
          </span>
          <span className="w-12 h-[1px] bg-ton-red" />
        </div>

        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 border-2 border-ton-red/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-ton-red/40" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ton-black leading-tight">
          We Hit a Snag
        </h1>

        {/* Subtext */}
        <p className="font-serif italic text-ton-black/40 text-base sm:text-lg mt-4 max-w-md mx-auto leading-relaxed">
          An unexpected error occurred while loading this page. Our editorial desk has been notified.
        </p>

        {/* Error detail (dev only) */}
        {error.message && (
          <div className="mt-4 p-3 bg-ton-black/[0.03] border border-ton-black/10 max-w-md mx-auto">
            <p className="font-mono text-[10px] text-ton-red/60 break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-ton-black text-ton-cream font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-3 hover:bg-ton-black/90 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <a
            href="/"
            className="flex items-center gap-2 border border-ton-black/20 text-ton-black font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-3 hover:bg-ton-black/5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Front Page
          </a>
        </div>
      </div>
    </TonLayout>
  );
}
