"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, MapPin, Tag, User, Mail, FileText } from "lucide-react";

const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
  mass: 1,
};

const NAMIBIA_REGIONS = [
  "Khomas", "Erongo", "Otjozondjupa", "Kunene", "Oshana", "Hardap",
  "//Kharas", "Zambezi", "Ohangwena", "Omusati", "Oshikoto",
  "Kavango East", "Kavango West",
];

const CATEGORIES = [
  "landscape", "wildlife", "coastal", "culture", "history",
];

export default function ContributePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    body: "",
    region: "",
    category: "",
    submitterName: "",
    submitterEmail: "",
  });

  const wordCount = form.body.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit = form.title && wordCount >= 50 && form.submitterName && form.submitterEmail && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springTransition}
        >
          <CheckCircle className="w-16 h-16 text-ton-red mx-auto mb-6" />
          <h1 className="font-serif text-3xl font-bold text-ton-black mb-4">
            Thank You for Your Contribution
          </h1>
          <p className="text-ton-black/50 text-lg leading-relaxed mb-8">
            Your submission has been received and is now awaiting editorial review.
            We moderate all community contributions before publishing to ensure quality
            and accuracy. You'll hear from us if we have questions.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-ton-black text-white px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-ton-red transition-colors"
          >
            Return to Homepage
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={springTransition}>
        <h1 className="font-serif text-4xl font-bold text-ton-black mb-3">
          Contribute to the Namibia Guide
        </h1>
        <p className="text-ton-black/50 text-lg leading-relaxed mb-8">
          Share your knowledge of Namibian places, culture, and history.
          All submissions are reviewed by our editorial team before publishing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ton-black/50 mb-2">
              <FileText size={14} /> Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-transparent border border-ton-black/15 px-4 py-3 font-serif text-lg text-ton-black focus:border-ton-red outline-none"
              placeholder="e.g. The Hidden Gems of Damaraland"
            />
          </div>

          {/* Body */}
          <div>
            <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ton-black/50 mb-2">
              <FileText size={14} /> Your Story (minimum 50 words)
            </label>
            <textarea
              required
              rows={8}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="w-full bg-transparent border border-ton-black/15 px-4 py-3 font-serif text-base text-ton-black focus:border-ton-red outline-none resize-y"
              placeholder="Write your contribution here..."
            />
            <p className="font-mono text-xs text-ton-black/45 mt-1">
              {wordCount} words {wordCount < 50 && `(need ${50 - wordCount} more)`}
            </p>
          </div>

          {/* Region + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ton-black/50 mb-2">
                <MapPin size={14} /> Region
              </label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full bg-transparent border border-ton-black/15 px-4 py-3 font-sans text-sm text-ton-black focus:border-ton-red outline-none"
              >
                <option value="">Select region...</option>
                {NAMIBIA_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ton-black/50 mb-2">
                <Tag size={14} /> Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-transparent border border-ton-black/15 px-4 py-3 font-sans text-sm text-ton-black focus:border-ton-red outline-none"
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ton-black/50 mb-2">
                <User size={14} /> Your Name
              </label>
              <input
                type="text"
                required
                value={form.submitterName}
                onChange={(e) => setForm({ ...form, submitterName: e.target.value })}
                className="w-full bg-transparent border border-ton-black/15 px-4 py-3 font-sans text-sm text-ton-black focus:border-ton-red outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ton-black/50 mb-2">
                <Mail size={14} /> Email (not published)
              </label>
              <input
                type="email"
                required
                value={form.submitterEmail}
                onChange={(e) => setForm({ ...form, submitterEmail: e.target.value })}
                className="w-full bg-transparent border border-ton-black/15 px-4 py-3 font-sans text-sm text-ton-black focus:border-ton-red outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-ton-red text-sm font-sans">{error}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-ton-black text-white font-mono text-xs uppercase tracking-widest py-4 hover:bg-ton-red transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send size={16} />
            {loading ? "Submitting..." : "Submit for Review"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
