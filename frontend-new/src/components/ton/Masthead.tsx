export default function Masthead() {
  const editionNumber = 127;

  return (
    <header className="bg-ton-cream py-4 sm:py-5 md:py-6 ton-masthead">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Top thin rule — broadsheet tradition */}
        <div className="border-t border-ton-black/20 mb-3 sm:mb-4" />

        {/* Top info line — EST. WINDHOEK + edition box */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
          <span className="font-mono text-[8px] sm:text-[9px] text-ton-black/25 tracking-[0.25em] uppercase">
            Est. Windhoek
          </span>
          <span className="bg-ton-black text-ton-cream font-mono text-[8px] sm:text-[9px] font-bold tracking-wider px-2 py-0.5 leading-none">
            No. {editionNumber}
          </span>
          <span className="font-mono text-[8px] sm:text-[9px] text-ton-black/25 tracking-[0.25em] uppercase">
            Vol. I
          </span>
        </div>

        {/* Thin decorative rule above title */}
        <div className="border-t border-ton-black/30 mb-2 sm:mb-3" />

        {/* Title — pure typographic authority (not a heading — page H1 is in content area) */}
        <div className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-ton-black leading-[0.9]">
          TIMES OF NAMIBIA
        </div>

        {/* Short red accent rule — newspaper signature */}
        <div className="flex justify-center mt-2 sm:mt-3">
          <div className="w-12 sm:w-16 border-t border-ton-red" />
        </div>

        {/* Tagline — more confident, slightly larger */}
        <div className="mt-2 sm:mt-2.5">
          <span className="font-serif italic text-ton-black/45 text-xs sm:text-sm md:text-[15px] tracking-wide">
            Namibia. Informed. Instantly.
          </span>
        </div>

        {/* Date line */}
        <div className="font-mono text-[8px] sm:text-[9px] text-ton-black/25 tracking-[0.2em] uppercase mt-1.5 sm:mt-2">
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>

        {/* Bottom heavy rule — like a real newspaper */}
        <div className="mt-3 sm:mt-4 border-t-2 sm:border-t-[3px] border-ton-black" />
        {/* Secondary thin rule — broadsheet double-rule */}
        <div className="border-t border-ton-black/20 mt-1" />
      </div>
    </header>
  );
}
