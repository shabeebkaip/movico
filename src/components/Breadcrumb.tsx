import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="inline-flex items-center gap-1.5 mb-10">
      <Link
        href="/"
        className="text-white/25 hover:text-primary transition-colors duration-300"
        aria-label="Home"
      >
        <Home size={11} />
      </Link>

      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <ChevronRight size={10} className="text-white/15" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-[10px] uppercase tracking-[0.25em] text-white/30 hover:text-primary transition-colors duration-300"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/60">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
