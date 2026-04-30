import TonLayout from "@/components/ton/TonLayout";

function SkeletonPulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-ton-black/[0.06] ${className}`} />;
}

export default function AfricaLoading() {
  return (
    <TonLayout activePage="africa">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        <SkeletonPulse className="h-3 w-32 rounded-none mb-2" />
        <SkeletonPulse className="h-10 w-64 rounded-none mb-2" />
        <SkeletonPulse className="h-5 w-96 rounded-none mb-4" />
        <div className="bg-ton-black h-32 rounded-none mb-6" />
        <div className="border-t-4 border-ton-red pt-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            <div className="md:col-span-7 pr-0 md:pr-5">
              <SkeletonPulse className="aspect-[16/9] w-full rounded-none mb-4" />
              <SkeletonPulse className="h-4 w-full rounded-none mb-2" />
              <SkeletonPulse className="h-4 w-3/4 rounded-none" />
            </div>
            <div className="md:col-span-5 pl-0 md:pl-5 mt-5 md:mt-0">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-3 border-t border-ton-black/5">
                  <SkeletonPulse className="h-4 w-full rounded-none mb-1" />
                  <SkeletonPulse className="h-3 w-20 rounded-none" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TonLayout>
  );
}
