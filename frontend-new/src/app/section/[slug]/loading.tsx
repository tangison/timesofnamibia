import TonLayout from "@/components/ton/TonLayout";
import SkeletonCard from "@/components/ton/SkeletonCard";

export default function SectionLoading() {
  return (
    <TonLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        {/* Header skeleton */}
        <div className="mb-8 sm:mb-10 animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-4 w-20 bg-ton-black/8" />
            <div className="h-3 w-12 bg-ton-black/5" />
          </div>
          <div className="h-10 w-2/3 bg-ton-black/8 mb-2" />
          <div className="h-4 w-1/2 bg-ton-black/5" />
        </div>
        {/* Featured article skeleton */}
        <div className="pb-6 mb-6 border-b border-ton-black/10">
          <SkeletonCard lines={4} />
        </div>
        {/* Article list skeletons */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-t border-ton-black/5">
            <SkeletonCard lines={2} />
          </div>
        ))}
      </div>
    </TonLayout>
  );
}
