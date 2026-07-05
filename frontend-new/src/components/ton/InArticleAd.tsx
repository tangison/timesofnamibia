
import { ExternalLink } from "lucide-react";

interface InArticleAdProps {
  imageUrl?: string;
  targetUrl?: string;
  altText?: string;
}

/**
 * Phase 8: InArticleAd component.
 * Mid-article advertisement placement.
 */
export default function InArticleAd({ imageUrl, targetUrl, altText }: InArticleAdProps) {
  const adImage = imageUrl || "/brand-card.png";
  const adUrl = targetUrl || "https://tangison.com";
  const adAlt = altText || "Tangison - Unbiased News. Global Reach.";

  return (
    <div className="my-8 py-4 border-y border-ton-black/10">
      <p className="font-mono text-[8px] uppercase tracking-widest text-ton-black/40 text-center mb-3">
        Advertisement
      </p>
      <a
        href={adUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block group max-w-md mx-auto"
      >
        <div className="flex gap-4 items-center">
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-ton-navy">
            <img
              src={adImage}
              alt={adAlt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex-1">
            <p className="font-serif text-lg font-bold text-ton-black mb-1">Tangison</p>
            <p className="font-sans text-xs text-ton-black/50 mb-2">
              Unbiased News. Global Reach. Building the future of African media.
            </p>
            <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-ton-red">
              Learn More <ExternalLink size={10} />
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
