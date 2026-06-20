import Image from "next/image";

/**
 * TANGISON Masthead — intentionally minimalistic.
 *
 * The wordmark "TIMES OF NAMIBIA" has been removed per brand direction.
 * The TANGISON logo mark is now the sole brand identifier.
 *
 * Design principles applied:
 * - Siegel+Gale: removed everything that does not add meaning
 * - Pentagram: every element traces back to a strategic principle
 * - Zero border-radius (TANGISON brand rule)
 * - Generous whitespace
 * - Monospace metadata (JetBrains Mono) for editorial authority
 */
export default function Masthead() {
  return (
    <header className="bg-ton-cream py-6 sm:py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo mark — sole brand identifier */}
        <a href="/" aria-label="Times of Namibia — home" className="flex-shrink-0">
          <Image
            src="/logo-mark.png"
            alt="Times of Namibia"
            width={40}
            height={40}
            priority
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11"
          />
        </a>

        {/* Edition metadata — right-aligned, monospace */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="font-mono text-[8px] sm:text-[9px] text-ton-black/40 tracking-[0.25em] uppercase">
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="font-mono text-[8px] sm:text-[9px] text-ton-black/40 tracking-[0.25em] uppercase hidden sm:inline">
            Windhoek
          </span>
        </div>
      </div>

      {/* Single thin rule — minimal broadsheet nod */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4 sm:mt-5">
        <div className="border-t border-ton-black/15" />
      </div>
    </header>
  );
}
