import TonLayout from "@/components/ton/TonLayout";

function SkeletonPulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-ton-black/[0.06] ${className}`} />;
}

export default function ArticleLoading() {
  return (
    <TonLayout activePage="national">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <SkeletonPulse className="h-3 w-12 rounded-none" />
          <SkeletonPulse className="h-3 w-4 rounded-none" />
          <SkeletonPulse className="h-3 w-20 rounded-none" />
          <SkeletonPulse className="h-3 w-4 rounded-none" />
          <SkeletonPulse className="h-3 w-32 rounded-none" />
        </div>

        {/* Category badge */}
        <SkeletonPulse className="h-5 w-16 rounded-none mb-4" />

        {/* Headline */}
        <SkeletonPulse className="h-10 w-full rounded-none mb-2" />
        <SkeletonPulse className="h-10 w-3/4 rounded-none mb-4" />

        {/* Subheadline */}
        <SkeletonPulse className="h-5 w-2/3 rounded-none mb-6" />

        {/* Byline bar */}
        <div className="flex items-center justify-between pb-3 border-b border-ton-black/8 mb-6">
          <SkeletonPulse className="h-4 w-32 rounded-none" />
          <SkeletonPulse className="h-4 w-24 rounded-none" />
        </div>

        {/* Content paragraphs */}
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <SkeletonPulse className="h-4 w-full rounded-none mb-1" />
              <SkeletonPulse className="h-4 w-full rounded-none mb-1" />
              <SkeletonPulse
                className="h-4 rounded-none mb-1"
                style={{ width: `${60 + Math.random() * 35}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </TonLayout>
  );
}
