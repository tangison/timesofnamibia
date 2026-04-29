"use client";

import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    toast.success("Subscribed to the TON Daily Dispatch.", {
      description: "Your first briefing arrives tomorrow at 06:00 CAT.",
    });
    setTimeout(() => {
      setEmail("");
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="bg-ton-black text-ton-cream p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-4 h-4 text-ton-red" />
        <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
          The Daily Dispatch
        </span>
      </div>
      <p className="font-serif text-sm text-ton-cream/60 leading-relaxed mb-4">
        Namibia&apos;s essential briefing. Delivered daily at 06:00 CAT. No engagement
        bait. No emojis. Just the verified data.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-0">
        <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 bg-ton-cream/10 border border-ton-cream/15 px-3 py-2.5 font-mono text-xs text-ton-cream placeholder:text-ton-cream/20 focus:outline-none focus:border-ton-red/50 transition-colors"
        />
        <button
          type="submit"
          disabled={submitted}
          className="flex items-center gap-1.5 bg-ton-red text-white font-mono text-[9px] font-bold uppercase tracking-widest px-4 py-2.5 hover:bg-ton-red/90 transition-colors disabled:opacity-50"
        >
          {submitted ? (
            <>
              <Check className="w-3 h-3" />
              Subscribed
            </>
          ) : (
            <>
              Subscribe <ArrowRight className="w-3 h-3" />
            </>
          )}
        </button>
      </form>
      <p className="font-mono text-[7px] text-ton-cream/20 mt-2 uppercase tracking-wider">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}
