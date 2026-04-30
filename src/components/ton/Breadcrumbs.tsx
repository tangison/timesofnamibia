import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-0 mb-4 sm:mb-6">
      <a
        href="/"
        className="inline-flex items-center gap-1 font-mono text-[9px] sm:text-[10px] text-ton-black/30 hover:text-ton-black uppercase tracking-wider transition-colors"
      >
        <Home className="w-3 h-3" />
        <span>Front Page</span>
      </a>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-0">
          <ChevronRight className="w-3 h-3 text-ton-black/15 mx-1.5" />
          {item.href ? (
            <a
              href={item.href}
              className="font-mono text-[9px] sm:text-[10px] text-ton-black/30 hover:text-ton-black uppercase tracking-wider transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="font-mono text-[9px] sm:text-[10px] text-ton-black/50 uppercase tracking-wider font-semibold">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
