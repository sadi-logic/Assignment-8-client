"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownWideNarrowIcon,
  ArrowRightIcon,
  MapPinIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Studio } from "@/lib/studios";

type SortOption = "rating" | "price-low" | "price-high";

function StudioCover({ studio }: { studio: Studio }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-violet-200 via-indigo-100 to-sky-100 dark:from-violet-950 dark:via-indigo-950 dark:to-slate-900"
      role={studio.imageUrl && !imageFailed ? "img" : undefined}
      aria-label={studio.imageUrl && !imageFailed ? `${studio.title} studio` : undefined}
    >
      {studio.imageUrl && !imageFailed ? (
        <Image
          src={studio.imageUrl}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
          onError={() => setImageFailed(true)}
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-primary/35">
          <SparklesIcon className="size-14" aria-hidden="true" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />
      <Badge className="absolute left-4 top-4 border-white/30 bg-background/90 text-foreground shadow-sm backdrop-blur">
        {studio.category}
      </Badge>
    </div>
  );
}

function StudioCard({ studio }: { studio: Studio }) {
  const detailsHref = `/studios/${encodeURIComponent(studio.id)}`;

  return (
    <Card className="group/card gap-0 border-0 shadow-sm ring-1 ring-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:ring-primary/25">
      <StudioCover studio={studio} />
      <CardHeader className="gap-2.5 px-5 pb-0 pt-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-1 text-lg font-semibold tracking-tight">
            {studio.title}
          </CardTitle>
          <div className="flex shrink-0 items-center gap-1 text-sm font-semibold">
            <StarIcon className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span>{studio.rating === null ? "New" : studio.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPinIcon className="size-4 shrink-0 text-primary/70" aria-hidden="true" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>
      </CardHeader>
      <CardContent className="flex-1 px-5 pb-5 pt-4">
        <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
          {studio.description || "A thoughtfully designed space for your next creative project."}
        </p>
      </CardContent>
      <CardFooter className="justify-between gap-3 border-t border-border/60 bg-muted/25 px-5 py-4">
        <p className="min-w-0">
          {studio.hourlyRate === null ? (
            <span className="text-sm font-medium text-muted-foreground">Rate on request</span>
          ) : (
            <>
              <span className="text-xl font-bold tracking-tight">
                ${studio.hourlyRate.toLocaleString("en-US")}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">/ hour</span>
            </>
          )}
        </p>
        <Button
          render={<Link href={`/studios/${encodeURIComponent(studio.id)}`} />}
          nativeButton={false}
          className="shrink-0 gap-2 rounded-full px-4"
        >
          View Details
          <ArrowRightIcon className="size-4" aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function StudioExplorer({
  studios,
  initialCategory,
}: {
  studios: Studio[];
  initialCategory?: string;
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    initialCategory ?? "All spaces"
  );
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const categories = useMemo(
    () => ["All spaces", ...new Set(studios.map((studio) => studio.category))],
    [studios]
  );

  const visibleStudios = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const filtered = studios.filter((studio) => {
      const matchesQuery =
        !query ||
        studio.title.toLocaleLowerCase().includes(query) ||
        studio.location.toLocaleLowerCase().includes(query);
      const matchesCategory =
        activeCategory === "All spaces" || studio.category === activeCategory;
      return matchesQuery && matchesCategory;
    });


    return filtered.sort((a, b) => {
      if (sortBy === "price-low") {
        if (a.rating === null) return b.rating === null ? 0 : 1;
        if (b.rating === null) return -1;
        return a.rating - b.rating;
      }
      if (sortBy === "price-high") {
        if (a.rating === null) return b.rating === null ? 0 : 1;
        if (b.rating === null) return -1;
        return b.rating - a.rating;
      }
      if (a.rating === null) return b.rating === null ? 0 : 1;
      if (b.rating === null) return -1;
      return b.rating - a.rating;
    });
  }, [studios, search, activeCategory, sortBy]);



  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/[0.08] via-background to-indigo-500/[0.06] px-5 py-8 sm:px-9 sm:py-11">
          <div className="pointer-events-none absolute -right-10 -top-20 -z-10 size-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 gap-1.5 rounded-full bg-background/70 px-3 py-1">
              <SparklesIcon className="size-3.5 text-primary" aria-hidden="true" />
              Made for your next big idea
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Explore <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">Studios</span>
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Discover the perfect space for your next creative project.
            </p>
          </div>
        </section>

        <section className="mt-8" aria-label="Find a studio">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <SearchIcon
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by studio or location..."
                aria-label="Search studios by name or location"
                className="h-11 rounded-xl bg-card pl-10 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 self-start text-sm text-muted-foreground lg:self-auto">
              <ArrowDownWideNarrowIcon className="size-4" aria-hidden="true" />
              <label htmlFor="studio-sort" className="whitespace-nowrap">Sort by</label>
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  if (value === "rating" || value === "price-low" || value === "price-high") {
                    setSortBy(value);
                  }
                }}
              >
                <SelectTrigger id="studio-sort" className="h-10 w-48 rounded-xl bg-card text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <SlidersHorizontalIcon className="size-4 text-primary" aria-hidden="true" />
              <span>Browse by type</span>
            </div>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" aria-label="Filter by workspace category">
              {categories.map((category) => {
                const selected = activeCategory === category;
                return (
                  <Button
                    key={category}
                    type="button"
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    aria-pressed={selected}
                    onClick={() => setActiveCategory(category)}
                    className="h-9 shrink-0 rounded-full px-4"
                  >
                    {category}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-7" aria-live="polite">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Spaces to inspire</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {visibleStudios.length} {visibleStudios.length === 1 ? "space" : "spaces"} to explore
              </p>
            </div>
          </div>

          {visibleStudios.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {visibleStudios.map((studio) => (
                <StudioCard key={studio.id} studio={studio} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-card/60 px-6 py-12 text-center">
              <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <SearchIcon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold">No studios found</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Try another search or choose a different category to find your perfect space.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-5 rounded-full"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All spaces");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
