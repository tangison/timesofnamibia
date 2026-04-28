export default function Masthead() {
  const editionNumber = 127;

  return (
    <header className="ton-masthead bg-ton-cream py-6 sm:py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* TON Badge + LIVE Badge Row */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-3">
          <div className="bg-ton-black text-ton-cream font-mono text-[10px] sm:text-xs font-bold px-2.5 py-1 tracking-widest">
            TON
          </div>
          <div className="h-px flex-1 max-w-12 sm:max-w-20 bg-ton-black/20" />
          <span className="font-mono text-[10px] sm:text-xs text-ton-black/60 tracking-wider uppercase">
            Est. 2026
          </span>
          <div className="h-px flex-1 max-w-12 sm:max-w-20 bg-ton-black/20" />
          <div className="bg-ton-red text-white font-mono text-[10px] sm:text-xs font-bold px-2.5 py-1 tracking-widest flex items-center gap-1.5">
            <span className="ton-live-dot" style={{ width: 5, height: 5 }} />
            LIVE
          </div>
        </div>

        {/* Main Title — 300% larger than body */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-ton-black leading-none">
          TIMES OF NAMIBIA
        </h1>

        {/* Tagline */}
        <p className="font-serif italic text-ton-black/70 text-sm sm:text-lg mt-2 tracking-wide">
          Namibia. Informed. Instantly.
        </p>

        {/* Edition info */}
        <div className="flex items-center justify-center gap-3 mt-3 font-mono text-[10px] sm:text-xs text-ton-black/50">
          <span>Vol. I</span>
          <span className="text-ton-black/20">|</span>
          <span>No. {editionNumber}</span>
          <span className="text-ton-black/20">|</span>
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
