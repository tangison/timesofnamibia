import TonLayout from "@/components/ton/TonLayout";
import SkeletonCard from "@/components/ton/SkeletonCard";

export default function HomeLoading() {
  return (
    <TonLayout activePage="national">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Above the fold label */}
        <div className="flex items-center gap-3 pt-5 sm:pt-6 md:pt-8 pb-0">
          <div className="flex-1 border-t border-ton-black/10" />
          <div className="font-mono text-[8px] tracking-[0.3em] uppercase text-ton-black/20 font-normal animate-pulse">
            Loading...
          </div>
          <div className="flex-1 border-t border-ton-black/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 py-4 sm:py-5 md:py-6">
          {/* Left column skeleton */}
          <div className="md:col-span-3 pr-0 md:pr-5 space-y-5">
            <div className="border-t-2 border-ton-black/10 pt-2 mb-3">
              <div className="h-3 w-20 bg-ton-black/8 animate-pulse" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`py-2.5 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                <div className="h-4 w-full bg-ton-black/8 animate-pulse mb-1" />
                <div className="h-2.5 w-2/3 bg-ton-black/5 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Center column skeleton */}
          <div className="md:col-span-6 px-0 md:px-5 mt-5 md:mt-0">
            <SkeletonCard lines={6} />
          </div>

          {/* Right column skeleton */}
          <div className="md:col-span-3 pl-0 md:pl-5 mt-5 md:mt-0 space-y-5">
            <div className="border-t-2 border-ton-black/10 pt-2 mb-3">
              <div className="h-3 w-24 bg-ton-black/8 animate-pulse" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`py-2.5 ${i > 0 ? "border-t border-ton-black/5" : ""}`}>
                <div className="h-4 w-full bg-ton-black/8 animate-pulse mb-1" />
                <div className="h-2.5 w-1/2 bg-ton-black/5 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </TonLayout>
  );
}
