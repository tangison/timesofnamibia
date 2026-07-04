"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Clock } from "lucide-react";
import Image from "next/image";

interface OffCanvasMenuProps {
  open: boolean;
  onClose: () => void;
}

const NAV_SECTIONS = [
  { label: "National", href: "/section/national", desc: "Governance, policy, civic life" },
  { label: "Economy", href: "/section/economy", desc: "Finance, trade, markets" },
  { label: "Mining", href: "/section/mining", desc: "Diamonds, uranium, lithium" },
  { label: "Energy", href: "/section/energy", desc: "Green hydrogen, solar, oil" },
  { label: "Politics", href: "/section/politics", desc: "Elections, parliament, policy" },
  { label: "Sport", href: "/section/sport", desc: "Brave Warriors, NPL, rugby" },
  { label: "Africa", href: "/africa", desc: "Continental affairs" },
  { label: "World", href: "/world", desc: "International coverage" },
];

const TOOLS = [
  { label: "Jobs", href: "/jobs", desc: "Employment intelligence" },
  { label: "Tenders", href: "/tender", desc: "Procurement analysis" },
  { label: "Market Data", href: "/", desc: "Forex, crypto, commodities" },
  { label: "About", href: "/about", desc: "Our mission" },
  { label: "Contact", href: "/contact", desc: "Reach the newsroom" },
];

export default function OffCanvasMenu({ open, onClose }: OffCanvasMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-ton-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-ton-cream z-[70] overflow-y-auto"
          >
            {/* Header with Skeleton Coast background */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/skeleton-coast-bg.webp"
                alt=""
                fill
                className="object-cover"
                sizes="480px"
                priority
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/60" />

              {/* Wordmark overlay */}
              <div className="absolute bottom-4 left-6">
                <div
                  className="text-3xl text-white leading-none"
                  style={{ fontFamily: "var(--font-unifraktur), 'UnifrakturMaguntia', serif" }}
                >
                  Times of Namibia
                </div>
                <div className="text-[0.55rem] font-bold tracking-[0.2em] uppercase mt-1 text-white/60">
                  Est. 2026 • Windhoek
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation sections */}
            <div className="p-6 space-y-8">
              <div>
                <h3 className="font-mono text-[9px] font-bold tracking-[0.3em] uppercase text-ton-red mb-4 pb-2 border-b border-ton-black/10">
                  Sections
                </h3>
                <div className="space-y-1">
                  {NAV_SECTIONS.map((section, i) => (
                    <motion.a
                      key={section.href}
                      href={section.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 100, damping: 15 }}
                      className="group flex items-center justify-between py-3 border-b border-ton-black/5 hover:border-ton-red/20 transition-colors"
                    >
                      <div>
                        <div className="font-serif font-bold text-lg text-ton-black group-hover:text-ton-red transition-colors">
                          {section.label}
                        </div>
                        <div className="text-xs text-ton-black/40 font-sans">
                          {section.desc}
                        </div>
                      </div>
                      <ArrowRight
                        size={18}
                        className="text-ton-black/20 group-hover:text-ton-red group-hover:translate-x-1 transition-all duration-300"
                      />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h3 className="font-mono text-[9px] font-bold tracking-[0.3em] uppercase text-ton-red mb-4 pb-2 border-b border-ton-black/10">
                  Intelligence
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {TOOLS.map((tool, i) => (
                    <motion.a
                      key={tool.href}
                      href={tool.href}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 100, damping: 15 }}
                      className="group p-3 border border-ton-black/8 hover:border-ton-red/30 hover:bg-ton-black/[0.02] transition-all"
                    >
                      <div className="font-bold text-sm text-ton-black group-hover:text-ton-red transition-colors">
                        {tool.label}
                      </div>
                      <div className="text-[10px] text-ton-black/40 mt-1">
                        {tool.desc}
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-ton-black/10">
                <div className="flex items-center gap-2 text-ton-black/40 text-xs font-mono uppercase tracking-widest mb-3">
                  <Clock size={12} />
                  Updated continuously
                </div>
                <div className="text-[10px] text-ton-black/30 font-mono uppercase tracking-widest">
                  Powered by TANGISON Applied AI
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
