"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Mail, MapPin, Phone } from "lucide-react";

const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
  mass: 1,
};

const CATEGORIES = [
  "News", "Advertising", "Editorial", "Technical", "Careers", "Partnership", "Other",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", category: "", message: "",
  });

  const canSubmit = form.name && form.email && form.category && form.message.length >= 10 && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
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
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={springTransition}>
          <CheckCircle className="w-16 h-16 text-ton-red mx-auto mb-6" />
          <h1 className="font-serif text-3xl font-bold text-ton-black mb-4">Message Received</h1>
          <p className="text-ton-black/50 text-lg leading-relaxed mb-8">
            Thank you for reaching out. Our editorial team will respond within 24 hours.
          </p>
          <a href="/" className="inline-flex items-center gap-2 bg-ton-black text-white px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-ton-red transition-colors">
            Return to Homepage
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={springTransition}>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ton-black leading-tight">
          Contact the Newsroom
        </h1>
        <p className="font-serif italic text-ton-black/50 text-lg mt-3 leading-relaxed">
          Editorial tips, technical support, business partnerships, and contributor enquiries.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-ton-red" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40">Email</span>
              </div>
              <p className="font-serif text-sm text-ton-black/70">editorial@timesofnamibia.com</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-ton-red" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40">Location</span>
              </div>
              <p className="font-serif text-sm text-ton-black/70">Windhoek, Namibia</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-ton-red" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40">Response</span>
              </div>
              <p className="font-serif text-sm text-ton-black/70">Within 24 hours</p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40 block mb-2">Name</label>
                  <input
                    id="contact-name" name="name"
                    type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-transparent border border-ton-black/15 px-4 py-3 font-sans text-sm text-ton-black focus:border-ton-red outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40 block mb-2">Email</label>
                  <input
                    id="contact-email" name="email"
                    type="email" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent border border-ton-black/15 px-4 py-3 font-sans text-sm text-ton-black focus:border-ton-red outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-category" className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40 block mb-2">Department</label>
                <select
                  id="contact-category" name="category"
                  required value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-transparent border border-ton-black/15 px-4 py-3 font-sans text-sm text-ton-black focus:border-ton-red outline-none"
                >
                  <option value="">Select department...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="font-mono text-[10px] uppercase tracking-widest text-ton-black/40 block mb-2">Message</label>
                <textarea
                  id="contact-message" name="message"
                  required rows={5} value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-transparent border border-ton-black/15 px-4 py-3 font-serif text-base text-ton-black focus:border-ton-red outline-none resize-y"
                  placeholder="Your message..."
                />
              </div>
              {error && <p className="text-ton-red text-sm font-sans">{error}</p>}
              <button
                type="submit" disabled={!canSubmit}
                className="w-full bg-ton-black text-white font-mono text-xs uppercase tracking-widest py-4 hover:bg-ton-red transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={16} />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
