"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
  CheckIcon,
  Clock3Icon,
  MailIcon,
  MapPinIcon,
  Maximize2Icon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BookingForm from "./_components/booking-form";
import type { Studio } from "@/lib/studios";

function formatPrice(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function formatReviewDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function StudioGallery({ studio }: { studio: Studio }) {
  const images = Array.from(new Set([studio.imageUrl, ...studio.images].filter(
    (image): image is string => Boolean(image)
  )));
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const activeImage = images[activeIndex];
  const activeImageFailed = activeImage ? failedImages.includes(activeImage) : true;

  function moveImage(direction: -1 | 1) {
    setActiveIndex((index) => (index + direction + images.length) % images.length);
  }

  return (
    <section aria-label="Workspace gallery">
      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-gradient-to-br from-violet-200 via-indigo-100 to-sky-100 dark:from-violet-950 dark:via-indigo-950 dark:to-slate-900 sm:aspect-[2/1]">
        {activeImage && !activeImageFailed ? (
          <Image
            src={activeImage}
            alt={`${studio.title} workspace, photo ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            unoptimized
            onError={() =>
              setFailedImages((imagesWithErrors) =>
                imagesWithErrors.includes(activeImage)
                  ? imagesWithErrors
                  : [...imagesWithErrors, activeImage]
              )
            }
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-primary/35">
            <SparklesIcon className="size-20" aria-hidden="true" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
        <Badge className="absolute left-4 top-4 border-white/30 bg-background/90 text-foreground shadow-sm backdrop-blur sm:left-6 sm:top-6">
          {studio.category}
        </Badge>
        {images.length > 1 && (
          <>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              aria-label="Previous workspace photo"
              onClick={() => moveImage(-1)}
              className="absolute left-3 top-1/2 size-10 -translate-y-1/2 rounded-full bg-background/90 shadow-md sm:left-5"
            >
              <ArrowLeftIcon aria-hidden="true" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              aria-label="Next workspace photo"
              onClick={() => moveImage(1)}
              className="absolute right-3 top-1/2 size-10 -translate-y-1/2 rounded-full bg-background/90 shadow-md sm:right-5"
            >
              <ArrowRightIcon aria-hidden="true" />
            </Button>
            <span className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Choose a photo">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show workspace photo ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`relative size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-muted transition sm:size-20 ${
                activeIndex === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {!failedImages.includes(image) ? (
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="80px"
                  unoptimized
                  onError={() =>
                    setFailedImages((imagesWithErrors) =>
                      imagesWithErrors.includes(image)
                        ? imagesWithErrors
                        : [...imagesWithErrors, image]
                    )
                  }
                  className="object-cover"
                />
              ) : (
                <span className="grid size-full place-items-center text-primary/50">
                  <SparklesIcon className="size-5" aria-hidden="true" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function StudioDetailsContent({ studio }: { studio: Studio }) {
  const hostName = studio.host.name ?? "Studio host";
  const ratingEntries = Object.entries(studio.ratingBreakdown)
    .map(([stars, count]) => [Number(stars), count] as const)
    .filter(([stars, count]) => stars >= 1 && stars <= 5 && count > 0);
  const reviewCounts = ratingEntries.length > 0
    ? ratingEntries
    : [1, 2, 3, 4, 5].flatMap((stars) => {
        const count = studio.reviews.filter((review) => Math.round(review.rating) === stars).length;
        return count > 0 ? [[stars, count] as const] : [];
      });
  const reviewCountTotal = reviewCounts.reduce((total, [, count]) => total + count, 0);

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-9 lg:px-8">
        <Link
          href="/studios"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          All workspaces
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <Badge variant="outline" className="mb-3 rounded-full bg-card px-3 py-1">
              {studio.category}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{studio.title}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground sm:text-base">
              <MapPinIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{studio.location}</span>
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
            <div className="flex items-center gap-2 text-sm">
              <StarIcon className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              <span className="font-semibold">
                {studio.rating === null ? "New workspace" : studio.rating.toFixed(1)}
              </span>
              {studio.reviewCount > 0 && (
                <a href="#reviews" className="text-muted-foreground underline-offset-4 hover:underline">
                  ({studio.reviewCount} {studio.reviewCount === 1 ? "review" : "reviews"})
                </a>
              )}
            </div>
            <BookingForm studio={studio} />
          </div>
        </div>

        <StudioGallery studio={studio} />

        <div className="mt-9 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
          <div className="min-w-0 space-y-10">
            <section className="border-b border-border/70 pb-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Entire {studio.category.toLocaleLowerCase()}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Hosted by {hostName}
                  </p>
                </div>
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <SparklesIcon className="size-5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {studio.maxCapacity !== null && (
                  <div className="flex items-center gap-3 rounded-xl bg-muted/45 p-3.5">
                    <UsersIcon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-sm">Up to {studio.maxCapacity} guests</span>
                  </div>
                )}
                {studio.size && (
                  <div className="flex items-center gap-3 rounded-xl bg-muted/45 p-3.5">
                    <Maximize2Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-sm">{studio.size} workspace</span>
                  </div>
                )}
                {studio.openingHours && (
                  <div className="flex items-center gap-3 rounded-xl bg-muted/45 p-3.5 sm:col-span-2">
                    <Clock3Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-sm">Opening hours: {studio.openingHours}</span>
                  </div>
                )}
              </div>
              {studio.description && (
                <p className="mt-6 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
                  {studio.description}
                </p>
              )}
              {(studio.address || studio.location) && (
                <div className="mt-5 flex items-start gap-3 text-sm">
                  <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="mt-1 text-muted-foreground">{studio.address ?? studio.location}</p>
                  </div>
                </div>
              )}
            </section>

            <section className="border-b border-border/70 pb-8">
              <h2 className="text-xl font-semibold tracking-tight">What this space offers</h2>
              {studio.amenities.length > 0 ? (
                <ul className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {studio.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-center gap-3 text-sm">
                      <CheckIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  Amenity details haven&apos;t been added yet.
                </p>
              )}
            </section>

            <section className="border-b border-border/70 pb-8">
              <h2 className="text-xl font-semibold tracking-tight">Meet your host</h2>
              <div className="mt-5 flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5">
                {studio.host.imageUrl ? (
                  <Image
                    src={studio.host.imageUrl}
                    alt={hostName}
                    width={64}
                    height={64}
                    unoptimized
                    className="size-16 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="grid size-16 shrink-0 place-items-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                    {hostName.charAt(0).toLocaleUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h3 className="font-semibold">{hostName}</h3>
                    {studio.host.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                        <BadgeCheckIcon className="size-4" aria-hidden="true" />
                        Verified host
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {studio.host.rating !== null && (
                      <span className="inline-flex items-center gap-1">
                        <StarIcon className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                        {studio.host.rating.toFixed(1)} host rating
                      </span>
                    )}
                    {studio.host.studioCount !== null && (
                      <span>
                        {studio.host.studioCount} {studio.host.studioCount === 1 ? "workspace" : "workspaces"}
                      </span>
                    )}
                  </div>
                  {studio.host.bio && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{studio.host.bio}</p>
                  )}
                  {studio.host.email && (
                    <a
                      href={`mailto:${studio.host.email}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <MailIcon className="size-4" aria-hidden="true" />
                      Contact host
                    </a>
                  )}
                </div>
              </div>
            </section>

            <section id="reviews" className="scroll-mt-24">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-tight">Guest reviews</h2>
                {studio.rating !== null && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <StarIcon className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    <span className="font-semibold">{studio.rating.toFixed(1)}</span>
                    {studio.reviewCount > 0 && (
                      <span className="text-muted-foreground">· {studio.reviewCount} reviews</span>
                    )}
                  </div>
                )}
              </div>
              {reviewCountTotal > 0 && (
                <div className="mt-5 grid max-w-md grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviewCounts.find(([rating]) => rating === stars)?.[1] ?? 0;
                    const percent = (count / reviewCountTotal) * 100;
                    return (
                      <div key={stars} className="contents">
                        <span className="text-xs text-muted-foreground">{stars} star</span>
                        <div
                          className="h-1.5 overflow-hidden rounded-full bg-muted"
                          role="progressbar"
                          aria-label={`${stars} star reviews`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(percent)}
                        >
                          <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="w-6 text-right text-xs text-muted-foreground">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {studio.reviews.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {studio.reviews.map((review) => (
                    <article key={review.id} className="rounded-2xl border border-border/70 bg-card p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold">{review.name}</h3>
                          {formatReviewDate(review.date) && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatReviewDate(review.date)}
                            </p>
                          )}
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium">
                          <StarIcon className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-muted/45 p-4 text-sm text-muted-foreground">
                  This workspace hasn&apos;t received any reviews yet.
                </p>
              )}
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
              <div className="mb-5 flex items-baseline gap-1">
                {studio.hourlyRate === null ? (
                  <span className="text-lg font-semibold">Rate on request</span>
                ) : (
                  <>
                    <span className="text-2xl font-bold tracking-tight">
                      ${formatPrice(studio.hourlyRate)}
                    </span>
                    <span className="text-sm text-muted-foreground">/ hour</span>
                  </>
                )}
              </div>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                {studio.minimumBookingHours !== null && (
                  <p className="flex items-center gap-2">
                    <Clock3Icon className="size-4 text-primary" aria-hidden="true" />
                    {studio.minimumBookingHours}-hour minimum booking
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-primary" aria-hidden="true" />
                  No payment is taken until the host confirms
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function StudioDetails({ studio }: { studio: Studio }) {
  return <StudioDetailsContent key={studio.id} studio={studio} />;
}
