"use client";

import { useState } from "react";
import { Share2, Headphones } from "lucide-react";

export default function ShareButtons({ title, url }: { title: string; url?: string }) {
  const [ttsState, setTtsState] = useState<"idle" | "synthesizing" | "playing">("idle");

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${title} — Times of Namibia`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleTTS = () => {
    setTtsState("synthesizing");
    setTimeout(() => setTtsState("playing"), 2000);
    setTimeout(() => setTtsState("idle"), 8000);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={handleWhatsApp}
        className="ton-share-btn flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest bg-emerald-600 text-white px-3 py-1.5 hover:bg-emerald-700 transition-colors"
      >
        <Share2 className="w-3 h-3" />
        WhatsApp
      </button>
      <button
        onClick={handleTTS}
        className="ton-share-btn flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-black text-ton-cream px-3 py-1.5 hover:bg-ton-black/80 transition-colors"
      >
        <Headphones className="w-3 h-3" />
        {ttsState === "idle" ? "Listen" : ttsState === "synthesizing" ? "Synthesizing..." : "Playing..."}
      </button>
    </div>
  );
}
