import TonLayout from "@/components/ton/TonLayout";

function SkeletonPulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-ton-black/[0.06] ${className}`} />;
}

function HeadlineSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonPulse className="h-4 w-20 rounded-none" />
      <SkeletonPulse className="h-10 w-full rounded-none" />
      <SkeletonPulse className="h-10 w-3/4 rounded-none" />
      <SkeletonPulse className="h-5 w-1/2 rounded-none" />
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div className="py-2.5 border-t border-ton-black/5">
      <SkeletonPulse className="h-4 w-full rounded-none mb-2" />
      <SkeletonPulse className="h-3 w-24 rounded-none" />
    </div>
  );
}

function MarketRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-1.5 border-t border-ton-black/[0.03]">
      <SkeletonPulse className="h-3 w-14 rounded-none" />
      <SkeletonPulse className="h-3 w-12 rounded-none" />
      <SkeletonPulse className="h-3 w-10 rounded-none" />
    </div>
  );
}

export default function Loading() {
  return (
    <TonLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Above the Fold label */}
        <div className="flex items-center gap-3 pt-5 sm:pt-6 md:pt-8 pb-0">
          <div className="flex-1 border-t border-ton-black/10" />
          <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-ton-black/20">
            Above the Fold
          </span>
          <div className="flex-1 border-t border-ton-black/10" />
        </div>

        {/* 3-column skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 py-4 sm:py-5 md:py-6">
          {/* Left sidebar */}
          <div className="md:col-span-3 pr-0 md:pr-5 space-y-5">
            <div>
              <SkeletonPulse className="h-3 w-24 rounded-none mb-3" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="py-2.5 border-t border-ton-black/5">
                  <SkeletonPulse className="h-4 w-full rounded-none mb-1" />
                  <SkeletonPulse className="h-3 w-20 rounded-none" />
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-ton-black/8">
              <SkeletonPulse className="h-3 w-28 rounded-none mb-3" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-2.5 border-t border-ton-black/5">
                  <SkeletonPulse className="h-3 w-16 rounded-none mb-1" />
                  <SkeletonPulse className="h-4 w-full rounded-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Center main */}
          <div className="md:col-span-6 px-0 md:px-5 mt-5 md:mt-0">
            <HeadlineSkeleton />
            <SkeletonPulse className="mt-5 aspect-[16/9] w-full rounded-none" />
            <div className="mt-4 space-y-3">
              <SkeletonPulse className="h-3 w-full rounded-none" />
              <SkeletonPulse className="h-3 w-full rounded-none" />
              <SkeletonPulse className="h-3 w-2/3 rounded-none" />
              <SkeletonPulse className="h-3 w-full rounded-none" />
              <SkeletonPulse className="h-3 w-4/5 rounded-none" />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="md:col-span-3 pl-0 md:pl-5 mt-5 md:mt-0 space-y-5">
            <div>
              <SkeletonPulse className="h-3 w-24 rounded-none mb-3" />
              {Array.from({ length: 5 }).map((_, i) => (
                <ArticleSkeleton key={i} />
              ))}
            </div>
            <div className="pt-4 border-t border-ton-black/8">
              <SkeletonPulse className="h-3 w-16 rounded-none mb-3" />
              {Array.from({ length: 6 }).map((_, i) => (
                <MarketRowSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </TonLayout>
  );
}
