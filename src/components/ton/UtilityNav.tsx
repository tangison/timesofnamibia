export default function UtilityNav() {
  return (
    <div className="ton-utility-nav bg-ton-cream border-b border-ton-black/5 px-4 sm:px-6 py-1">
      <div className="max-w-6xl mx-auto flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-ton-black/30 tracking-wider uppercase">
        <span>
          Windhoek 24°C &middot; Times OS Active
        </span>
        <span className="hidden sm:inline">
          {new Date().toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
