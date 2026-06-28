export const metadata = {
  robots: { index: false, follow: true }, // internal page — not for public indexing
  title: "Maintenance — Times of Namibia",
  description: "Times of Namibia is currently undergoing scheduled maintenance.",
};

export default function MaintenancePage() {
  return (
    <html lang="en">
      <body className="bg-ton-cream min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          {/* Logo */}
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="bg-ton-black text-ton-cream font-mono text-sm font-bold px-3 py-1.5">
              TON
            </div>
          </div>

          {/* Label */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-ton-red" />
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-ton-red font-bold">
              Scheduled Maintenance
            </span>
            <span className="w-8 h-[1px] bg-ton-red" />
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ton-black leading-tight">
            Back Shortly
          </h1>

          {/* Subtext */}
          <p className="font-serif italic text-ton-black/40 text-base mt-4 leading-relaxed">
            Times of Namibia is undergoing scheduled maintenance to improve our data pipelines and editorial tools. We will be back shortly.
          </p>

          {/* Timestamp */}
          <p className="font-mono text-[9px] text-ton-black/15 uppercase tracking-wider mt-6">
            Times OS v2.1 &middot; Windhoek, Namibia
          </p>
        </div>
      </body>
    </html>
  );
}
