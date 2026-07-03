"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, Headphones, Square, Link2, Check } from "lucide-react";

interface ShareToolbarProps {
  title: string;
  url?: string;
  articleContent?: string;
}

/**
 * Phase 2: Sticky ShareToolbar
 *
 * Placed at the top and bottom of the article body. Sticks to the top
 * of the viewport when scrolling through the article.
 *
 * Includes:
 *   - Copy Link button (navigator.clipboard, shows "Copied!" state)
 *   - Listen button (Web Speech API TTS)
 *   - WhatsApp share link
 */
export default function ShareToolbar({ title, url, articleContent }: ShareToolbarProps) {
  const [ttsState, setTtsState] = useState<"idle" | "playing">("idle");
  const [copied, setCopied] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [shareUrl, setShareUrl] = useState<string | undefined>(url);
  useEffect(() => {
    if (typeof window === "undefined") return;
    // If url is a relative path like /article/slug, convert to absolute
    if (url && url.startsWith("/")) {
      setShareUrl(`${window.location.origin}${url}`);
    } else if (!url) {
      setShareUrl(window.location.href);
    }
  }, [url]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleWhatsApp = () => {
    const text = shareUrl
      ? `${title} - ${shareUrl}`
      : `${title} - Times of Namibia`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const handleTTS = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (ttsState === "playing") {
      window.speechSynthesis.cancel();
      setTtsState("idle");
      return;
    }

    const fullText = articleContent
      ? `${title}. ${articleContent}`
      : title;

    const cleanText = fullText
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "and")
      .replace(/&lt;/g, "less than")
      .replace(/&gt;/g, "greater than")
      .replace(/&quot;/g, "")
      .replace(/&#39;/g, "'")
      .replace(/&[a-z]+;/g, "")
      .replace(/&#\d+;/g, "")
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const maxChunkSize = 3000;
    const chunks: string[] = [];
    let remaining = cleanText;
    while (remaining.length > maxChunkSize) {
      let breakPoint = remaining.lastIndexOf(". ", maxChunkSize);
      if (breakPoint === -1) breakPoint = maxChunkSize;
      chunks.push(remaining.slice(0, breakPoint + 1));
      remaining = remaining.slice(breakPoint + 1);
    }
    chunks.push(remaining);

    window.speechSynthesis.cancel();
    setTtsState("playing");

    let chunkIndex = 0;
    const speakNext = () => {
      if (chunkIndex >= chunks.length) {
        setTtsState("idle");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) ||
        voices.find((v) => v.lang.startsWith("en-NA")) ||
        voices.find((v) => v.lang.startsWith("en-GB")) ||
        voices.find((v) => v.lang.startsWith("en-US")) ||
        voices.find((v) => v.lang.startsWith("en"));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        chunkIndex++;
        speakNext();
      };
      utterance.onerror = () => {
        setTtsState("idle");
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        alert("Copy failed. Please copy the URL from your browser address bar.");
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={handleWhatsApp}
        aria-label="Share on WhatsApp"
        className="ton-share-btn flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest bg-emerald-600 text-white px-3 py-1.5 hover:bg-emerald-700 transition-colors"
      >
        <Share2 className="w-3 h-3" aria-hidden="true" />
        WhatsApp
      </button>
      <button
        onClick={handleTTS}
        disabled={!supported}
        aria-label={ttsState === "playing" ? "Stop listening" : "Listen to article"}
        aria-pressed={ttsState === "playing"}
        className="ton-share-btn flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-navy text-white px-3 py-1.5 hover:bg-ton-navy/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {ttsState === "playing" ? (
          <Square className="w-3 h-3" aria-hidden="true" />
        ) : (
          <Headphones className="w-3 h-3" aria-hidden="true" />
        )}
        {ttsState === "playing" ? "Stop" : "Listen"}
      </button>
      <button
        onClick={handleCopyLink}
        aria-label={copied ? "Link copied" : "Copy article link"}
        className="ton-share-btn flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest bg-transparent text-ton-black border border-ton-black/30 px-3 py-1.5 hover:bg-ton-black hover:text-white transition-colors"
      >
        {copied ? <Check className="w-3 h-3" aria-hidden="true" /> : <Link2 className="w-3 h-3" aria-hidden="true" />}
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
