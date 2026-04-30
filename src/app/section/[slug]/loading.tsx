import TonLayout from "@/components/ton/TonLayout";

function SkeletonPulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-ton-black/[0.06] ${className}`} />;
}

export default function SectionLoading() {
  return (
    <TonLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        {/* Header skeleton */}
        <div className="mb-8 sm:mb-10">
          <SkeletonPulse className="h-3 w-20 rounded-none mb-3" />
          <SkeletonPulse className="h-10 w-3/4 rounded-none mb-2" />
          <SkeletonPulse className="h-5 w-1/2 rounded-none" />
          <div className="flex items-center gap-4 mt-4">
            <SkeletonPulse className="h-3 w-32 rounded-none" />
            <SkeletonPulse className="h-3 w-20 rounded-none" />
          </div>
        </div>

        {/* Featured article skeleton */}
        <div className="pb-6 mb-6 border-b border-ton-black/10">
          <SkeletonPulse className="h-3 w-24 rounded-none mb-3" />
          <SkeletonPulse className="h-8 w-full rounded-none mb-2" />
          <SkeletonPulse className="h-5 w-3/4 rounded-none mb-3" />
          <SkeletonPulse className="h-3 w-40 rounded-none" />
        </div>

        {/* Article list skeleton */}
        <div className="divide-y divide-ton-black/5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="py-4">
              <SkeletonPulse className="h-3 w-20 rounded-none mb-2" />
              <SkeletonPulse className="h-5 w-full rounded-none mb-1" />
              <SkeletonPulse className="h-3 w-3/4 rounded-none mb-2" />
              <SkeletonPulse className="h-3 w-32 rounded-none" />
            </div>
          ))}
        </div>
      </div>
    </TonLayout>
  );
}
