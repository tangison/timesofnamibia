"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Globe,
  Globe2,
  TrendingUp,
  Briefcase,
  Scale,
  FileText,
  Map,
  BookOpen,
  Building2,
  Phone,
  Palette,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

/* ─── Navigation data ─── */

const NEWS_ITEMS = [
  { label: "National", href: "/", icon: Home, key: "national" },
  { label: "World", href: "/world", icon: Globe, key: "world" },
  { label: "Africa", href: "/africa", icon: Globe2, key: "africa" },
  { label: "Tender Edge", href: "/tender", icon: TrendingUp, key: "tender" },
  { label: "Job Scraper", href: "/jobs", icon: Briefcase, key: "jobs" },
  { label: "Legal Desk", href: "/#legal", icon: Scale, key: "legal" },
];

const TON_ITEMS = [
  { label: "Contributors", href: "/contributor", icon: FileText, key: "contributor" },
];

const DOCUMENT_ITEMS = [
  { label: "Business Plan", href: "/business-plan", icon: FileText, key: "business-plan" },
  { label: "The Plan", href: "/plan", icon: Map, key: "plan" },
  { label: "Brand System", href: "/brand", icon: Palette, key: "brand" },
];

const COMPANY_ITEMS = [
  { label: "About TON", href: "/about", icon: Building2, key: "about" },
  { label: "Editorial Standards", href: "/editorial-standards", icon: BookOpen, key: "editorial-standards" },
  { label: "Contact", href: "/contact", icon: Phone, key: "contact" },
];

const TANGISON_ITEMS = [
  { label: "About TANGISON", href: "/tangison", icon: ExternalLink, key: "tangison" },
];

/* ─── Section Component ─── */

function SidebarSection({
  title,
  items,
  activePage,
  defaultCollapsed = false,
  redAccent = false,
}: {
  title: string;
  items: { label: string; href: string; icon: React.ComponentType<{ className?: string }>; key: string }[];
  activePage?: string;
  defaultCollapsed?: boolean;
  redAccent?: boolean;
}) {
  const hasActive = items.some((item) => item.key === activePage);
  const [collapsed, setCollapsed] = useState(defaultCollapsed && !hasActive);
  const isExpanded = !collapsed;

  return (
    <div className="mb-1">
      {/* Section header - collapsible */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-ton-black/[0.03] dark:hover:bg-white/[0.03] transition-colors ${
          redAccent ? "text-ton-red" : "text-ton-black/35 dark:text-white/35"
        }`}
      >
        <span className="font-mono text-[8px] font-bold tracking-[0.2em] uppercase">
          {title}
        </span>
        {isExpanded ? (
          <ChevronDown className="w-2.5 h-2.5" />
        ) : (
          <ChevronRight className="w-2.5 h-2.5" />
        )}
      </button>

      {/* Section items */}
      {isExpanded && (
        <div className="pb-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activePage;

            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-[7px] transition-colors group ${
                  isActive
                    ? redAccent
                      ? "bg-ton-red/[0.06] dark:bg-ton-red/[0.10] text-ton-red"
                      : "bg-ton-black/[0.05] dark:bg-white/[0.05] text-ton-black dark:text-ton-cream font-semibold"
                    : "text-ton-black/45 dark:text-white/45 hover:text-ton-black dark:hover:text-ton-cream hover:bg-ton-black/[0.03] dark:hover:bg-white/[0.03]"
                }`}
              >
                <Icon
                  className={`w-3 h-3 flex-shrink-0 ${
                    isActive
                      ? redAccent
                        ? "text-ton-red"
                        : "text-ton-black dark:text-ton-cream"
                      : "text-ton-black/40 dark:text-white/20 group-hover:text-ton-black/50 dark:group-hover:text-white/50"
                  }`}
                />
                <span className="font-sans text-[11px] leading-none">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1 h-1 bg-ton-red rounded-full flex-shrink-0" />
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Hamburger Trigger - rendered inside UtilityNav ─── */

export function SidebarTrigger() {
  const handleOpen = () => {
    window.dispatchEvent(new CustomEvent("ton-sidebar-open"));
  };

  return (
    <button
      onClick={handleOpen}
      className="inline-flex items-center gap-1.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-ton-black/45 dark:text-white/30 hover:text-ton-red dark:hover:text-ton-red transition-colors duration-300 px-1 py-0.5"
      aria-label="Open menu"
    >
      <Menu className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Menu</span>
    </button>
  );
}

/* ─── Main Sidebar Panel - rendered once in TonLayout ─── */

export default function Sidebar({ activePage }: { activePage?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);

  // Listen for custom event from SidebarTrigger
  useEffect(() => {
    const handleOpen = () => openSidebar();
    window.addEventListener("ton-sidebar-open", handleOpen);
    return () => window.removeEventListener("ton-sidebar-open", handleOpen);
  }, [openSidebar]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeSidebar();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, closeSidebar]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ═══ OVERLAY ═══ */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />

      {/* ═══ SIDEBAR PANEL ═══ */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] sm:w-[300px] bg-ton-cream dark:bg-[#0a0a0a] border-r border-ton-black/10 dark:border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ton-black/8 dark:border-white/8 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-ton-black text-ton-cream font-mono text-[9px] font-bold px-2 py-0.5">
              TON
            </div>
            <span className="font-mono text-[8px] text-ton-black/40 dark:text-white/25 tracking-wider uppercase">
              Navigation
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="text-ton-black/40 dark:text-white/25 hover:text-ton-red dark:hover:text-ton-red transition-colors p-1"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar masthead mini */}
        <div className="px-4 py-3 border-b border-ton-black/8 dark:border-white/8 flex-shrink-0">
          <h2 className="font-serif text-lg font-bold text-ton-black dark:text-ton-cream leading-tight">
            Times of Namibia
          </h2>
          <p className="font-serif italic text-ton-black/45 dark:text-white/30 text-[11px] mt-0.5">
            Namibia. Informed. Instantly.
          </p>
        </div>

        {/* Scrollable navigation */}
        <nav className="flex-1 overflow-y-auto ton-scrollbar py-2">
          {/* NEWS section */}
          <SidebarSection
            title="News"
            items={NEWS_ITEMS}
            activePage={activePage}
            redAccent
          />

          {/* Thin divider */}
          <div className="mx-3 my-1 border-t border-ton-black/6 dark:border-white/6" />

          {/* TON section */}
          <SidebarSection
            title="TON"
            items={TON_ITEMS}
            activePage={activePage}
          />

          {/* Thin divider */}
          <div className="mx-3 my-1 border-t border-ton-black/6 dark:border-white/6" />

          {/* Documents section */}
          <SidebarSection
            title="Documents"
            items={DOCUMENT_ITEMS}
            activePage={activePage}
            defaultCollapsed
          />

          {/* Thin divider */}
          <div className="mx-3 my-1 border-t border-ton-black/6 dark:border-white/6" />

          {/* Company section */}
          <SidebarSection
            title="Company"
            items={COMPANY_ITEMS}
            activePage={activePage}
            defaultCollapsed
          />

          {/* Thin divider */}
          <div className="mx-3 my-1 border-t border-ton-black/6 dark:border-white/6" />

          {/* TANGISON section */}
          <SidebarSection
            title="TANGISON"
            items={TANGISON_ITEMS}
            activePage={activePage}
            defaultCollapsed
          />
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-ton-black/8 dark:border-white/8 px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[7px] text-ton-black/40 dark:text-white/15 uppercase tracking-widest">
              Times OS v2.1
            </span>
            <span className="font-mono text-[7px] text-ton-black/40 dark:text-white/15 uppercase tracking-widest">
              &copy; 2026
            </span>
          </div>
          <p className="font-mono text-[7px] text-ton-black/10 dark:text-white/10 uppercase tracking-widest mt-0.5">
            A TANGISON Publication
          </p>
        </div>
      </aside>
    </>
  );
}
