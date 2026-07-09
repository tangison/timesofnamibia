import SkeletonCard from "@/components/ton/SkeletonCard";

export default function WorldLoading() {
  return (
    <div className="min-h-screen bg-ton-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        <div className="mb-8 animate-pulse">
          <div className="h-10 w-1/3 bg-ton-black/8 mb-2" />
          <div className="h-4 w-1/2 bg-ton-black/5" />
        </div>
        <div className="pb-6 mb-6 border-b border-ton-black/10">
          <SkeletonCard lines={4} />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-t border-ton-black/5">
            <SkeletonCard lines={2} />
          </div>
        ))}
      </div>
    </div>
  );
}
