export default function Masthead() {
  const editionNumber = 127;

  return (
    <header className="bg-ton-cream py-5 sm:py-6 md:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Edition info — top line */}
        <div className="font-mono text-[9px] sm:text-[10px] text-ton-black/35 tracking-widest uppercase mb-3 sm:mb-4">
          Vol. I &middot; No. {editionNumber} &middot; {new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>

        {/* Title — pure typographic authority */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-ton-black leading-[0.9]">
          TIMES OF NAMIBIA
        </h1>

        {/* Thin rule + tagline */}
        <div className="mt-2 sm:mt-3">
          <span className="font-serif italic text-ton-black/40 text-xs sm:text-sm tracking-wide">
            Namibia. Informed. Instantly.
          </span>
        </div>

        {/* Bottom rule — heavy, like a real newspaper */}
        <div className="mt-3 sm:mt-4 border-t-2 sm:border-t-[3px] border-ton-black" />
      </div>
    </header>
  );
}
