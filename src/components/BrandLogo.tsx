import Link from "next/link";
import { ApertureIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  /** Override the wordmark size, e.g. `text-2xl` on the home hero. */
  textClassName?: string;
  iconClassName?: string;
}

/**
 * StudioSpace brand: aperture (studio lens) tile + wordmark.
 * Used in the navbar, footer, and 404 page so the logo style
 * stays identical across the site (assignment requirement).
 */
export function BrandLogo({
  className,
  textClassName,
  iconClassName,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="StudioSpace — go to home"
      className={cn(
        "group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-sm shadow-orange-500/25 transition-transform duration-200 group-hover:scale-105",
          iconClassName
        )}
      >
        <ApertureIcon className="size-5" aria-hidden="true" />
      </span>
      <span
        className={cn(
          "text-xl font-extrabold tracking-tight text-foreground",
          textClassName
        )}
      >
        Studio
        <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
          Space
        </span>
      </span>
    </Link>
  );
}
