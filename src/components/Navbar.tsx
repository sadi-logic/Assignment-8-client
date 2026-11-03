"use client";

import { type ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2Icon,
  CalendarDaysIcon,
  ChevronDownIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  PlusCircleIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth, type AuthUser } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

/** Main navigation — Home is kept separate so it renders first. */
const NAV_LINKS = [
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about-us", label: "About Us" },
] as const;

/** Authenticated dropdown/dashboard routes. */
const DASHBOARD_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  {
    href: "/dashboard/add-new-studio",
    label: "Add New Studio",
    icon: PlusCircleIcon,
  },
  {
    href: "/dashboard/my-studio-listing",
    label: "My Studio Listings",
    icon: Building2Icon,
  },
  { href: "/dashboard/my-booking", label: "My Bookings", icon: CalendarDaysIcon },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
  return initials || "?";
}

function ThemeToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
      onClick={onToggle}
    >
      <SunIcon className="dark:hidden" aria-hidden="true" />
      <MoonIcon className="hidden dark:block" aria-hidden="true" />
    </Button>
  );
}

/**
 * Nav link with an active-route indicator (gradient underline + darker text).
 * Accepts Link props so Base UI can clone it (e.g. inside <SheetClose render>).
 */
function NavLink({
  isActive,
  className,
  ...props
}: ComponentProps<typeof Link> & { isActive: boolean }) {
  return (
    <Link
      {...props}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 after:transition-transform after:content-[''] hover:text-foreground hover:after:scale-x-100 focus-visible:ring-3 focus-visible:ring-ring/50",
        isActive && "text-foreground after:scale-x-100",
        className
      )}
    />
  );
}

/** Avatar + name + chevron, opening the user dropdown menu. */
function UserMenu({ user }: { user: AuthUser }) {
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="gap-2 data-[popup-open]:bg-accent"
          />
        }
      >
        <Avatar size="sm">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name} />
          ) : null}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-36 truncate text-sm font-medium lg:inline">
          {user.name}
        </span>
        <ChevronDownIcon
          className="size-3.5 text-muted-foreground"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5">
            <span className="text-sm font-semibold text-foreground">
              {user.name}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {DASHBOARD_LINKS.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} render={<Link href={href} />}>
            <Icon aria-hidden="true" />
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={logout}>
          <LogOutIcon aria-hidden="true" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  function toggleTheme() {
    const nextIsDarkMode = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDarkMode);
    document.documentElement.dataset.theme = nextIsDarkMode ? "dark" : "light";
    localStorage.setItem(
      "studiospace-theme",
      nextIsDarkMode ? "dark" : "light"
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <BrandLogo />

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          <NavLink href="/" isActive={isActivePath(pathname, "/")}>
            Home
          </NavLink>
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              isActive={isActivePath(pathname, href)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop auth actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle onToggle={toggleTheme} />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost" })}
              >
                Login
              </Link>
              <Link href="/register" className={buttonVariants()}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile: avatar menu (when logged in) + sheet trigger */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle onToggle={toggleTheme} />
          {user && <UserMenu user={user} />}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu" />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 gap-0 p-0 sm:max-w-sm"
            >
              <SheetHeader className="border-b border-border">
                <SheetTitle>
                  <BrandLogo textClassName="text-lg" />
                </SheetTitle>
              </SheetHeader>

              <nav
                className="flex flex-col gap-1 px-3 py-4"
                aria-label="Mobile navigation"
              >
                <SheetClose
                  render={
                    <NavLink
                      href="/"
                      isActive={isActivePath(pathname, "/")}
                      className="py-2.5"
                    />
                  }
                >
                  Home
                </SheetClose>
                {NAV_LINKS.map(({ href, label }) => (
                  <SheetClose
                    key={href}
                    render={
                      <NavLink
                        href={href}
                        isActive={isActivePath(pathname, href)}
                        className="py-2.5"
                      />
                    }
                  >
                    {label}
                  </SheetClose>
                ))}
              </nav>

              {/* Auth actions pinned to the bottom of the sheet */}
              <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
                      <Avatar>
                        {user.image ? (
                          <AvatarImage src={user.image} alt={user.name} />
                        ) : null}
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {DASHBOARD_LINKS.map(({ href, label, icon: Icon }) => (
                      <SheetClose
                        key={href}
                        render={
                          <NavLink
                            href={href}
                            isActive={isActivePath(pathname, href)}
                            className="py-2.5"
                          />
                        }
                      >
                        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                        {label}
                      </SheetClose>
                    ))}
                    <SheetClose
                      render={
                        <Button
                          variant="destructive"
                          className="w-full justify-start"
                          onClick={logout}
                        />
                      }
                    >
                      <LogOutIcon aria-hidden="true" />
                      Logout
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose
                      render={
                        <Link
                          href="/login"
                          className={buttonVariants({
                            variant: "outline",
                            className: "w-full",
                          })}
                        />
                      }
                    >
                      Login
                    </SheetClose>
                    <SheetClose
                      render={
                        <Link
                          href="/register"
                          className={buttonVariants({
                            className: "w-full",
                          })}
                        />
                      }
                    >
                      Register
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
