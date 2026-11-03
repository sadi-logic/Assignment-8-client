"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRightIcon, LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "About Us", href: "/#about-us" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "My Bookings", href: "/dashboard/my-booking" },
  { label: "Contact Us", href: "/#about-us" },
];

const categories = [
  { label: "Photography Studios", category: "Photo Studio" },
  { label: "Sound Stages", category: "Film Stage" },
  { label: "Podcast Rooms", category: "Podcast Lounge" },
  { label: "Music Suites", category: "Music Suite" },
  { label: "Art Workshops", category: "Art Studio" },
];

const socials = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/StudioSpace/",
    path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.023 4.388 11.022 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.976h-1.513c-1.49 0-1.956.93-1.956 1.884v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.095 24 18.096 24 12.073",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/studiospace/",
    path: "M7 2C4.239 2 2 4.239 2 7v10c0 2.761 2.239 5 5 5h10c2.761 0 5-2.239 5-5V7c0-2.761-2.239-5-5-5H7zm0 2h10c1.657 0 3 1.343 3 3v10c0 1.657-1.343 3-3 3H7c-1.657 0-3-1.343-3-3V7c0-1.657 1.343-3 3-3zm11.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/studiospace/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.85-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.353V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    name: "X",
    href: "https://x.com/StudioSpace",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.473l8.6-9.83L0 1.153h7.594l5.243 6.932zm-1.292 19.557h2.039L6.486 3.178H4.298z",
  },
];

const newsletterEndpoint = process.env.NEXT_PUBLIC_NEWSLETTER_API_URL;

export default function Footer() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get("email");

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      toast.error("Enter a valid email address to subscribe.");
      return;
    }

    if (!newsletterEndpoint) {
      toast.info("Newsletter signup is coming soon. Please check back later.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(newsletterEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Newsletter signup failed (HTTP ${response.status}).`);
      }

      toast.success("You’re subscribed. Stay inspired!");
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to subscribe right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <footer className="mt-auto border-t border-border/70 bg-muted/25">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          <section className="lg:col-span-3" aria-label="About StudioSpace">
            <BrandLogo />
            <p className="mt-5 max-w-sm text-sm font-medium leading-6 text-foreground/85">
              A little more room for your next big idea.
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              StudioSpace connects creators with inspiring workspaces. Discover
              and book a studio, or host your own space for creative projects.
            </p>

            <div className="mt-7">
              <h2 className="text-sm font-semibold">Follow Us</h2>
              <ul className="mt-3 flex items-center gap-2">
                {socials.map(({ name, href, path }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`StudioSpace on ${name} (opens in a new tab)`}
                      className="grid size-10 place-items-center rounded-full border border-border/70 bg-background text-muted-foreground transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="size-[18px]"
                        aria-hidden="true"
                      >
                        <path d={path} fill="currentColor" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <nav className="lg:col-span-2" aria-label="Quick links">
            <h2 className="text-sm font-semibold">Quick Links</h2>
            <ul className="mt-4 space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-2" aria-label="Explore categories">
            <h2 className="text-sm font-semibold">Explore Categories</h2>
            <ul className="mt-4 space-y-3">
              {categories.map(({ label, category }) => (
                <li key={category}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category)}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="sm:col-span-2 lg:col-span-5">
            <h2 className="text-sm font-semibold">Stay Inspired</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Get fresh studio listings, creative inspiration, and updates
              delivered to your inbox.
            </p>
            <form
              className="mt-5 flex flex-col gap-2.5 min-[420px]:flex-row"
              onSubmit={handleSubscribe}
            >
              <label className="sr-only" htmlFor="footer-newsletter-email">
                Email address
              </label>
              <Input
                id="footer-newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                disabled={isSubmitting}
                className="h-10 min-w-0 flex-1 bg-background"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full gap-2 min-[420px]:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
                    Subscribing
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowUpRightIcon className="size-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              By subscribing, you agree to receive occasional StudioSpace
              updates. Unsubscribe anytime.
            </p>
          </section>
        </div>

        <Separator className="my-9" />

        <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 StudioSpace. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>Made for the people who make things.</p>
            <Link
              href="/terms-of-service"
              className="transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
