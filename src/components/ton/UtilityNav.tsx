export default function UtilityNav() {
  return (
    <div className="ton-utility-nav bg-ton-cream border-b border-ton-black/8 px-4 sm:px-6 py-1.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between font-mono text-[8px] sm:text-[9px] text-ton-black/30 tracking-wider uppercase">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-ton-black/20">
            Vol. I &middot; No. 127
          </span>
          <span className="text-ton-black/10">|</span>
          <span>
            Windhoek 24°C
          </span>
          <span className="hidden sm:inline text-ton-black/10">|</span>
          <span className="hidden sm:inline">
            Times OS Active
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="text-ton-black/10">|</span>
          <span className="text-ton-red/40 font-semibold">
            Late City Ed.
          </span>
        </div>
      </div>
    </div>
  );
}
