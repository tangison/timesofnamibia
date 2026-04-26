"use client";

export default function Masthead() {
  return (
    <header className="ton-masthead bg-ton-cream ton-border-bottom-editorial px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* TON Badge + LIVE Badge Row */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2">
          <div className="bg-ton-black text-ton-cream font-mono text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 tracking-widest rounded-none">
            TON
          </div>
          <div className="h-px flex-1 max-w-8 sm:max-w-16 bg-ton-black/30" />
          <span className="font-mono text-[9px] sm:text-xs text-ton-black/80 tracking-wider uppercase hidden sm:inline">
            Est. 2026
          </span>
          <div className="h-px flex-1 max-w-8 sm:max-w-16 bg-ton-black/30 hidden sm:block" />
          <div className="bg-ton-red text-white font-mono text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 tracking-widest flex items-center gap-1 sm:gap-1.5 rounded-none">
            <span className="ton-live-dot" style={{ width: 5, height: 5 }} />
            LIVE
          </div>
        </div>

        {/* Main Title - scales from text-3xl on mobile to text-7xl on desktop */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-ton-black leading-none">
          TIMES OF NAMIBIA
        </h1>

        {/* Tagline */}
        <p className="font-serif italic text-ton-black/80 text-xs sm:text-base mt-1.5 sm:mt-2 tracking-wide">
          Namibia. Informed. Instantly.
        </p>

        {/* Edition info - hides on smallest screens */}
        <div className="hidden sm:flex items-center justify-center gap-3 mt-2 sm:mt-3 font-mono text-[10px] sm:text-xs text-ton-black/80">
          <span>Vol. I</span>
          <span>•</span>
          <span>No. {Math.floor(Math.random() * 300) + 100}</span>
          <span>•</span>
          <span>
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
