export default function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3 py-4">
      <div className="h-3 w-16 bg-ton-black/8" />
      <div className="h-5 w-3/4 bg-ton-black/8" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-ton-black/8"
            style={{ width: i === lines - 1 ? "40%" : "100%" }}
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-20 bg-ton-black/5" />
        <div className="h-2.5 w-12 bg-ton-black/5" />
      </div>
    </div>
  );
}
