"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2Icon,
  CalendarDaysIcon,
  PlusCircleIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { cn } from "@/lib/utils";

const SIDEBAR_LINKS = [
  {
    href: "/dashboard/add-new-studio",
    label: "Add New Studio",
    icon: PlusCircleIcon,
  },
  {
    href: "/dashboard/my-studio-listing",
    label: "My Studio Listing",
    icon: Building2Icon,
  },
  {
    href: "/dashboard/my-booking",
    label: "My Bookings",
    icon: CalendarDaysIcon,
  },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar lg:flex">
      {/* Logo */}
      <div className="border-b border-sidebar-border/60 p-5">
        <BrandLogo textClassName="text-lg" />
      </div>

      <nav
        className="flex flex-col gap-1.5 p-4"
        aria-label="Dashboard navigation"
      >
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/50">
          Menu
        </p>

        {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/50",
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-purple-500/25"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
