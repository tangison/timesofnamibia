"use client";

import React, { useState } from "react";
import { ArrowLeft, Send, Mail, Cpu, Briefcase, Users, Globe, MapPin } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "Editorial Desk — Tips & Story Submissions",
  "Times OS Technical Support",
  "Business & Partnerships",
  "Contributor Programme",
  "General Enquiry",
];

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: "Editorial Desk",
    desc: "Tips, story submissions, and editorial enquiries. Include source attribution where possible.",
    detail: "editorial@timesofnamibia.com",
  },
  {
    icon: Cpu,
    label: "Times OS Technical Support",
    desc: "Data pipeline inquiries, scraping issues, and API access requests.",
    detail: "timesos@timesofnamibia.com",
  },
  {
    icon: Briefcase,
    label: "Business & Partnerships",
    desc: "Sponsorships, data licensing, Broadside distribution, and commercial partnerships.",
    detail: "business@timesofnamibia.com",
  },
  {
    icon: Users,
    label: "Contributor Programme",
    desc: "How to become a verified correspondent. Include your region and areas of expertise.",
    detail: "contributors@timesofnamibia.com",
  },
  {
    icon: Globe,
    label: "GemsWeb Digital",
    desc: "The company behind Times of Namibia. Corporate enquiries and press.",
    detail: "gemsweb.xyz",
  },
];

export default function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !category || !message) {
      toast.error("All fields are required.", {
        description: "Please complete the form before submitting.",
      });
      return;
    }
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setName("");
      setEmail("");
      setCategory("");
      setMessage("");
      toast.success("Message submitted.", {
        description: "Your enquiry has been received. We respond within 24 hours.",
      });
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div>
          <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
            Contact // The Desk
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
            Contact
          </h1>
          <p className="font-serif italic text-ton-black/50 text-sm sm:text-base mt-2 max-w-xl">
            Reach the desk. Every channel, every department. No automated responses — just the editorial floor.
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

      {/* Two-Column Layout: Channels + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 mb-10 sm:mb-14">
        {/* Left: Contact Channels */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-6 h-[2px] bg-ton-black" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
              Departments
            </h2>
          </div>

          <div className="space-y-4">
            {CONTACT_CHANNELS.map((channel, i) => {
              const Icon = channel.icon;
              return (
                <div key={i} className="pt-4 border-t border-ton-black/8">
                  <div className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-ton-red flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
                        {channel.label}
                      </span>
                      <p className="font-sans text-xs text-ton-black/50 leading-relaxed mt-1">
                        {channel.desc}
                      </p>
                      <p className="font-mono text-[11px] text-ton-black font-bold mt-1.5">
                        {channel.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Physical Address */}
          <div className="mt-6 pt-5 border-t-2 border-ton-black">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-ton-red flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[9px] text-ton-red font-bold tracking-widest uppercase">
                  Physical Address
                </span>
                <p className="font-serif text-sm text-ton-black/60 leading-relaxed mt-1">
                  Windhoek, Namibia
                </p>
                <p className="font-mono text-[10px] text-ton-black/30 mt-1">
                  22.57 S, 17.08 E
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-6 h-[2px] bg-ton-black" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black">
              Submit Enquiry
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="contact-name" className="block font-mono text-[9px] text-ton-black/40 font-bold tracking-widest uppercase mb-1.5">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-ton-cream border border-ton-black/15 px-3 py-2.5 font-sans text-sm text-ton-black placeholder:text-ton-black/20 focus:outline-none focus:border-ton-black/40 transition-colors"
                placeholder="Full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="contact-email" className="block font-mono text-[9px] text-ton-black/40 font-bold tracking-widest uppercase mb-1.5">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ton-cream border border-ton-black/15 px-3 py-2.5 font-sans text-sm text-ton-black placeholder:text-ton-black/20 focus:outline-none focus:border-ton-black/40 transition-colors"
                placeholder="email@example.com"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="contact-category" className="block font-mono text-[9px] text-ton-black/40 font-bold tracking-widest uppercase mb-1.5">
                Department
              </label>
              <select
                id="contact-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-ton-cream border border-ton-black/15 px-3 py-2.5 font-sans text-sm text-ton-black focus:outline-none focus:border-ton-black/40 transition-colors appearance-none"
              >
                <option value="">Select department...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="contact-message" className="block font-mono text-[9px] text-ton-black/40 font-bold tracking-widest uppercase mb-1.5">
                Message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full bg-ton-cream border border-ton-black/15 px-3 py-2.5 font-sans text-sm text-ton-black placeholder:text-ton-black/20 focus:outline-none focus:border-ton-black/40 transition-colors resize-y"
                placeholder="Include source attribution where applicable..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-3 bg-ton-black text-ton-cream hover:bg-ton-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>

          <p className="font-mono text-[8px] text-ton-black/20 uppercase tracking-wider mt-3">
            All enquiries are reviewed by the editorial desk. Response within 24 hours.
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="py-6 text-center border-t border-ton-black/8">
        <p className="font-serif italic text-ton-black/30 text-sm">
          Times of Namibia is a GemsWeb Digital publication.
        </p>
        <a
          href="https://gemsweb.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-widest mt-2 inline-block hover:text-ton-red/80 transition-colors"
        >
          gemsweb.xyz
        </a>
      </div>
    </div>
  );
}
