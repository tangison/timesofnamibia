"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  IconClose,
  IconArrowRight,
  IconArrowUpRight,
  IconClock,
  IconSparkles,
  IconNewspaper,
  IconBriefcase,
  IconFileText,
  IconTrendingUp,
  IconMail,
  IconCompass,
} from "./BrandIcons";

interface OffCanvasMenuProps {
  open: boolean;
  onClose: () => void;
}

// ── NAVIGATION DATA ──────────────────────────────────────────

const NAV_SECTIONS = [
  { label: "National", href: "/section/national", desc: "Governance, policy, civic life", icon: IconNewspaper },
  { label: "Economy", href: "/section/economy", desc: "Finance, trade, markets", icon: IconTrendingUp },
  { label: "Mining", href: "/section/mining", desc: "Diamonds, uranium, lithium", icon: IconBriefcase },
  { label: "Energy", href: "/section/energy", desc: "Green hydrogen, solar, oil", icon: IconSparkles },
  { label: "Politics", href: "/section/politics", desc: "Elections, parliament, policy", icon: IconNewspaper },
  { label: "Sport", href: "/section/sport", desc: "Brave Warriors, NPL, rugby", icon: IconTrendingUp },
  { label: "Africa", href: "/africa", desc: "Continental affairs", icon: IconCompass },
  { label: "World", href: "/world", desc: "International coverage", icon: IconCompass },
];

const TOOLS = [
  { label: "Know Namibia", href: "/know-namibia", desc: "Places & landmarks", icon: IconCompass },
  { label: "Jobs", href: "/jobs", desc: "Employment intel", icon: IconBriefcase },
  { label: "Tenders", href: "/tender", desc: "Procurement", icon: IconFileText },
  { label: "Market Data", href: "/", desc: "Forex & crypto", icon: IconTrendingUp },
  { label: "About", href: "/about", desc: "Our mission", icon: IconSparkles },
  { label: "Contact", href: "/contact", desc: "Newsroom", icon: IconMail },
];

// ── PREMIUM MOTION VARIANTS ──────────────────────────────────
// Archetype: Premium (350-600ms, cubic-bezier(0.4,0,0.2,1), 0% overshoot)
// Three motion layers: primary (panel slide), secondary (staggered items),
// ambient (backdrop blur + grain).

const PREMIUM_EASE = [0.4, 0, 0.2, 1] as const;

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: PREMIUM_EASE },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: PREMIUM_EASE },
  },
};

const panelVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: 0.5, ease: PREMIUM_EASE },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.4, ease: PREMIUM_EASE },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: PREMIUM_EASE, delay: 0.15 },
  },
};

// Staggered section items — 50ms cascade, total budget < 500ms
const sectionItemVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: PREMIUM_EASE,
      delay: 0.2 + i * 0.05,
    },
  }),
};

const toolItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: PREMIUM_EASE,
      delay: 0.4 + i * 0.04,
    },
  }),
};

const footerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: PREMIUM_EASE, delay: 0.6 },
  },
};

// ── COMPONENT ────────────────────────────────────────────────

export default function OffCanvasMenu({ open, onClose }: OffCanvasMenuProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── BACKDROP (ambient layer) ──────────────────────── */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-ton-black/70 backdrop-blur-md z-[60]"
            onClick={onClose}
          />

          {/* ── PANEL (primary layer) ────────────────────────── */}
          <motion.aside
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[520px] bg-ton-cream z-[70] overflow-y-auto flex flex-col"
          >
            {/* ── Header with Skeleton Coast hero ─────────────── */}
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              className="relative h-56 overflow-hidden flex-shrink-0"
            >
              <Image
                src="/skeleton-coast-bg.webp"
                alt=""
                fill
                className="object-cover"
                sizes="520px"
                priority
              />
              {/* Premium gradient overlay — tinted, not flat black */}
              <div className="absolute inset-0 bg-gradient-to-br from-ton-black/85 via-ton-black/60 to-ton-ocean/40" />

              {/* Subtle grain texture overlay */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Wordmark */}
              <div className="absolute bottom-6 left-7 right-7">
                <div
                  className="text-4xl text-white leading-none tracking-tight"
                  style={{ fontFamily: "var(--font-unifraktur), 'UnifrakturMaguntia', serif" }}
                >
                  Times of Namibia
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-6 h-px bg-ton-red" />
                  <div className="text-[0.55rem] font-bold tracking-[0.25em] uppercase text-white/70">
                    Est. 2026 • Windhoek
                  </div>
                </div>
              </div>

              {/* Close button — premium: larger hit target, tinted bg */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-ton-red hover:border-ton-red transition-all duration-300"
                aria-label="Close menu"
              >
                <IconClose size={18} />
              </button>
            </motion.div>

            {/* ── Body ─────────────────────────────────────────── */}
            <div className="flex-1 px-7 py-8 space-y-10">
              {/* Sections */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-ton-red">
                    Sections
                  </h3>
                  <div className="flex-1 h-px bg-ton-black/10" />
                </div>
                <div className="space-y-px">
                  {NAV_SECTIONS.map((section, i) => {
                    const Icon = section.icon;
                    const isActive = pathname === section.href;
                    return (
                      <motion.a
                        key={section.href}
                        href={section.href}
                        custom={i}
                        variants={sectionItemVariants}
                        initial="hidden"
                        animate="visible"
                        className="group flex items-center gap-4 py-3.5 border-b border-ton-black/5 hover:border-ton-red/30 transition-all duration-300 relative overflow-hidden"
                      >
                        {/* Hover gradient sweep — premium surface effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-ton-red/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Icon */}
                        <div className="relative flex-shrink-0 w-9 h-9 flex items-center justify-center border border-ton-black/10 group-hover:border-ton-red/40 group-hover:bg-ton-red/[0.06] transition-all duration-300">
                          <Icon size={15} className="text-ton-black/50 group-hover:text-ton-red transition-colors duration-300" />
                        </div>

                        {/* Text */}
                        <div className="relative flex-1 min-w-0">
                          <div className={`font-serif font-bold text-lg leading-tight transition-colors duration-300 ${isActive ? "text-ton-red" : "text-ton-black group-hover:text-ton-red"}`}>
                            {section.label}
                          </div>
                          <div className="text-xs text-ton-black/40 font-sans mt-0.5">
                            {section.desc}
                          </div>
                        </div>

                        {/* Arrow */}
                        <IconArrowRight
                          size={16}
                          className="relative text-ton-black/20 group-hover:text-ton-red group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                        />
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Intelligence tools */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-ton-red">
                    Intelligence
                  </h3>
                  <div className="flex-1 h-px bg-ton-black/10" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {TOOLS.map((tool, i) => {
                    const Icon = tool.icon;
                    const isActive = pathname === tool.href;
                    return (
                      <motion.a
                        key={tool.href}
                        href={tool.href}
                        custom={i}
                        variants={toolItemVariants}
                        initial="hidden"
                        animate="visible"
                        className="group relative p-4 border border-ton-black/8 hover:border-ton-red/40 transition-all duration-300 overflow-hidden"
                      >
                        {/* Premium: spotlight border effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-ton-red/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative flex items-start justify-between mb-3">
                          <div className="w-8 h-8 flex items-center justify-center bg-ton-black/[0.03] group-hover:bg-ton-red group-hover:text-white text-ton-black/60 transition-all duration-300">
                            <Icon size={14} />
                          </div>
                          <IconArrowUpRight
                            size={12}
                            className="text-ton-black/20 group-hover:text-ton-red transition-colors duration-300"
                          />
                        </div>
                        <div className={`relative font-bold text-sm leading-tight transition-colors duration-300 ${isActive ? "text-ton-red" : "text-ton-black group-hover:text-ton-red"}`}>
                          {tool.label}
                        </div>
                        <div className="relative text-[10px] text-ton-black/40 mt-1 font-sans">
                          {tool.desc}
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Footer ───────────────────────────────────────── */}
            <motion.footer
              variants={footerVariants}
              initial="hidden"
              animate="visible"
              className="flex-shrink-0 px-7 py-6 border-t border-ton-black/10 bg-ton-black/[0.02]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ton-black/50 text-xs font-mono uppercase tracking-widest">
                  <IconClock size={12} />
                  Updated continuously
                </div>
                <div className="text-[10px] text-ton-black/45 font-mono uppercase tracking-widest">
                  Powered by TANGISON
                </div>
              </div>
            </motion.footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
