"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Headphones, Square, Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url?: string;
  /** Full article text to read aloud via TTS. If not provided, only the title is read. */
  articleContent?: string;
}

/**
 * Share buttons with working TTS via the Web Speech API.
 *
 * The Listen button reads the article aloud using the browser's built-in
 * speech synthesis. On the article page, pass the full article content
 * via `articleContent` prop for a complete reading experience.
 */
export default function ShareButtons({ title, url, articleContent }: ShareButtonsProps) {
  const [ttsState, setTtsState] = useState<"idle" | "playing">("idle");
  const [copied, setCopied] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Resolve the URL on the client (avoids hydration mismatch)
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

  // Check if Web Speech API is available
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
    }
  }, []);

  // Cleanup on unmount
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

    // If already playing, stop
    if (ttsState === "playing") {
      window.speechSynthesis.cancel();
      setTtsState("idle");
      return;
    }

    // Build the text to read: title + content (if available)
    const fullText = articleContent
      ? `${title}. ${articleContent}`
      : title;

    // Clean up the text - remove HTML tags, extra whitespace, etc.
    const cleanText = fullText
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "and")
      .replace(/&lt;/g, "less than")
      .replace(/&gt;/g, "greater than")
      .replace(/&quot;/g, "")
      .replace(/&#39;/g, "'")
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Split into chunks if very long (Web Speech API has limits ~32k chars)
    const maxChunkSize = 3000;
    const chunks: string[] = [];
    let remaining = cleanText;
    while (remaining.length > maxChunkSize) {
      // Find a good break point (end of sentence)
      let breakPoint = remaining.lastIndexOf(". ", maxChunkSize);
      if (breakPoint === -1) breakPoint = maxChunkSize;
      chunks.push(remaining.slice(0, breakPoint + 1));
      remaining = remaining.slice(breakPoint + 1);
    }
    chunks.push(remaining);

    // Cancel any existing speech
    window.speechSynthesis.cancel();

    setTtsState("playing");

    // Speak each chunk sequentially
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

      // Try to find a good English voice
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
        alert("Copy failed. Please copy the URL from your browser's address bar.");
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="flex items-center gap-2">
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
        className="ton-share-btn flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-black text-ton-cream px-3 py-1.5 hover:bg-ton-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        className="ton-share-btn flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest bg-ton-cream text-ton-black border border-ton-black px-3 py-1.5 hover:bg-ton-black hover:text-ton-cream transition-colors"
      >
        {copied ? <Check className="w-3 h-3" aria-hidden="true" /> : <Link2 className="w-3 h-3" aria-hidden="true" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
