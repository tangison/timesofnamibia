import TonLayout from "@/components/ton/TonLayout";

/**
 * Loading state for the homepage.
 *
 * IMPORTANT: No visible "Loading..." text - this HTML is also served
 * to crawlers during ISR revalidation. Use only silent visual skeleton
 * elements (animate-pulse blocks) so it doesn't hurt SEO or perceived
 * load speed.
 */
export default function HomeLoading() {
  return (
    <TonLayout activePage="national">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Hero skeleton */}
        <div className="mb-16 border-b border-ton-black/10 pb-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="h-6 w-32 bg-ton-black/8 animate-pulse" />
              <div className="h-12 w-full bg-ton-black/8 animate-pulse" />
              <div className="h-12 w-3/4 bg-ton-black/8 animate-pulse" />
              <div className="h-6 w-full bg-ton-black/5 animate-pulse" />
              <div className="h-6 w-5/6 bg-ton-black/5 animate-pulse" />
            </div>
            <div className="w-full md:w-5/12 h-64 md:h-96 bg-ton-black/5 animate-pulse" />
          </div>
        </div>

        {/* Article grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-ton-cream/50 p-6">
              <div className="h-3 w-20 bg-ton-black/8 animate-pulse mb-4" />
              <div className="h-5 w-full bg-ton-black/8 animate-pulse mb-2" />
              <div className="h-5 w-3/4 bg-ton-black/8 animate-pulse mb-4" />
              <div className="h-3 w-full bg-ton-black/5 animate-pulse mb-2" />
              <div className="h-3 w-5/6 bg-ton-black/5 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </TonLayout>
  );
}
