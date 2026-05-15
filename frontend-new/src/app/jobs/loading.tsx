import TonLayout from "@/components/ton/TonLayout";
import SkeletonCard from "@/components/ton/SkeletonCard";

export default function JobsLoading() {
  return (
    <TonLayout activePage="jobs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-8 animate-pulse">
          <div className="h-10 w-1/2 bg-ton-black/8 mb-2" />
          <div className="h-4 w-2/3 bg-ton-black/5" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-t border-ton-black/5">
            <SkeletonCard lines={2} />
          </div>
        ))}
      </div>
    </TonLayout>
  );
}
