import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  /** Override the wordmark size, e.g. `text-2xl` on the home hero. */
  textClassName?: string;
  iconClassName?: string;
  /** Hide the wordmark to show only the mark (favicon, mobile, etc.). */
  iconOnly?: boolean;
}

/**
 * StudioSpace brand: custom "S" monogram with a spotlight dot + wordmark.
 * Used in the navbar, footer, and 404 page so the logo style
 * stays identical across the site (assignment requirement).
 */
export function BrandLogo({
  className,
  textClassName,
  iconClassName,
  iconOnly = false,
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
      {/* Mark */}
      <span
        className={cn(
          "relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-[11px]",
          "bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500",
          "shadow-lg shadow-violet-500/30 ring-1 ring-inset ring-white/25",
          "transition-all duration-300 group-hover:-rotate-3 group-hover:scale-105",
          iconClassName
        )}
      >
        {/* soft highlight for depth */}
        <span
          aria-hidden="true"
          className="absolute -top-3 -left-3 size-8 rounded-full bg-white/25 blur-md"
        />

        <svg
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
          className="relative size-[22px]"
        >
          {/* "S" monogram */}
          <path
            d="M22 10.5C22 8.2 19.6 7 16 7c-3.8 0-6 1.7-6 4.3 0 5.4 12 2.9 12 9.2 0 2.7-2.4 4.5-6 4.5-3.7 0-6-1.5-6-3.9"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* spotlight dot */}
          <circle cx="25.5" cy="6.5" r="2.2" fill="#FDE68A" />
        </svg>
      </span>

      {/* Wordmark */}
      {!iconOnly && (
        <span
          className={cn(
            "text-xl leading-none tracking-tight text-foreground",
            textClassName
          )}
        >
          <span className="font-extrabold">Studio</span>
          <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text font-medium text-transparent">
            Space
          </span>
        </span>
      )}
    </Link>
  );
}