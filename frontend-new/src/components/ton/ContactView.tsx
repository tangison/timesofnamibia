"use client";

import React, { useState } from "react";
import { ArrowLeft, Send, Mail, Cpu, Briefcase, Users, Globe, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Breadcrumbs from "./Breadcrumbs";

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
    label: "TANGISON",
    desc: "The company behind Times of Namibia. Corporate enquiries and press.",
    detail: "tangison.com",
  },
];

export default function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !category || !message) {
      toast.error("All fields are required.", {
        description: "Please complete the form before submitting.",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address.", {
        description: "Please check your email and try again.",
      });
      return;
    }

    if (message.trim().length < 10) {
      toast.error("Message too short.", {
        description: "Please provide at least 10 characters.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), category, message: message.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Submission failed.", {
          description: data.error || "Please try again.",
        });
        return;
      }

      setName("");
      setEmail("");
      setCategory("");
      setMessage("");
      setSubmitted(true);
      toast.success("Message submitted.", {
        description: data.message || "Your enquiry has been received. We respond within 24 hours.",
      });

      // Reset success state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      toast.error("Network error.", {
        description: "Could not reach the server. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Contact" }]} />

      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div>
          <span className="font-mono text-[9px] tracking-widest uppercase text-ton-red font-semibold">
            Contact // The Desk
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight mt-2">
            Contact
          </h1>
          <p className="font-serif italic text-ton-black/65 text-sm sm:text-base mt-2 max-w-xl">
            Reach the desk. Every channel, every department. No automated responses — just the editorial floor.
          </p>
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
                      <p className="font-sans text-xs text-ton-black/65 leading-relaxed mt-1">
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

          {submitted ? (
            <div className="py-12 text-center border border-ton-black/8">
              <CheckCircle className="w-12 h-12 text-ton-red mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-ton-black">
                Enquiry Received
              </h3>
              <p className="font-sans text-sm text-ton-black/65 mt-2 max-w-sm mx-auto">
                Thank you for reaching out. Our editorial desk will review your message and respond within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 font-mono text-[9px] text-ton-red font-bold uppercase tracking-widest hover:underline"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="contact-name" className="block font-mono text-[9px] text-ton-black/55 font-bold tracking-widest uppercase mb-1.5">
                  Name <span className="text-ton-red">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-ton-cream border border-ton-black/15 px-3 py-2.5 font-sans text-sm text-ton-black placeholder:text-ton-black/20 focus:outline-none focus:border-ton-black/40 transition-colors"
                  placeholder="Full name"
                  required
                  minLength={2}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contact-email" className="block font-mono text-[9px] text-ton-black/55 font-bold tracking-widest uppercase mb-1.5">
                  Email <span className="text-ton-red">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ton-cream border border-ton-black/15 px-3 py-2.5 font-sans text-sm text-ton-black placeholder:text-ton-black/20 focus:outline-none focus:border-ton-black/40 transition-colors"
                  placeholder="email@example.com"
                  required
                />
                {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                  <p className="font-mono text-[9px] text-ton-red mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Please enter a valid email address
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="contact-category" className="block font-mono text-[9px] text-ton-black/55 font-bold tracking-widest uppercase mb-1.5">
                  Department <span className="text-ton-red">*</span>
                </label>
                <select
                  id="contact-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-ton-cream border border-ton-black/15 px-3 py-2.5 font-sans text-sm text-ton-black focus:outline-none focus:border-ton-black/40 transition-colors appearance-none"
                  required
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
                <label htmlFor="contact-message" className="block font-mono text-[9px] text-ton-black/55 font-bold tracking-widest uppercase mb-1.5">
                  Message <span className="text-ton-red">*</span>
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full bg-ton-cream border border-ton-black/15 px-3 py-2.5 font-sans text-sm text-ton-black placeholder:text-ton-black/20 focus:outline-none focus:border-ton-black/40 transition-colors resize-y"
                  placeholder="Include source attribution where applicable..."
                  required
                  minLength={10}
                />
                <p className="font-mono text-[8px] text-ton-black/15 mt-1">
                  {message.length} characters (minimum 10)
                </p>
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
          )}

          <p className="font-mono text-[8px] text-ton-black/20 uppercase tracking-wider mt-3">
            All enquiries are reviewed by the editorial desk. Response within 24 hours.
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="py-6 text-center border-t border-ton-black/8">
        <p className="font-serif italic text-ton-black/30 text-sm">
          Times of Namibia is a TANGISON publication.
        </p>
        <a
          href="https://tangison.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-ton-red font-bold uppercase tracking-widest mt-2 inline-block hover:text-ton-red/80 transition-colors"
        >
          tangison.com
        </a>
      </div>
    </div>
  );
}
