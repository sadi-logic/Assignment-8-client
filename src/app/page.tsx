import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import {
  ArrowRightIcon,
  AudioLinesIcon,
  BadgeCheckIcon,
  CameraIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClapperboardIcon,
  CompassIcon,
  CreditCardIcon,
  HeadphonesIcon,
  LightbulbIcon,
  MapPinIcon,
  Mic2Icon,
  Music2Icon,
  PaletteIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersRoundIcon,
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
import { Skeleton } from "@/components/ui/skeleton";
import HomeHero from "@/app/_components/home-hero";
import { getStudios, type Studio } from "@/lib/studios";

const studioCategories = [
  {
    title: "Photo Studios",
    category: "Photo Studio",
    description: "Find the light, backdrops, and gear to frame your next shot.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80",
    icon: CameraIcon,
  },
  {
    title: "Sound Stages",
    category: "Film Stage",
    description: "Production-ready stages for stories big and small.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=80",
    icon: ClapperboardIcon,
  },
  {
    title: "Podcast Rooms",
    category: "Podcast Lounge",
    description: "Quiet, equipped rooms for conversations worth hearing.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80",
    icon: Mic2Icon,
  },
  {
    title: "Music Suites",
    category: "Music Suite",
    description: "Make the most of your next session in a space built for sound.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80",
    icon: Music2Icon,
  },
  {
    title: "Art Workshops",
    category: "Art Studio",
    description: "Room to experiment, get your hands messy, and make something new.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80",
    icon: PaletteIcon,
  },
];

const bookingSteps = [
  {
    number: "01",
    title: "Discover Spaces",
    description: "Explore a wide range of creative studios and workspaces.",
    icon: CompassIcon,
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description: "Choose your preferred date, time, and booking duration.",
    icon: CalendarDaysIcon,
  },
  {
    number: "03",
    title: "Book Instantly",
    description: "Reserve your workspace with a simple and convenient process.",
    icon: CreditCardIcon,
  },
  {
    number: "04",
    title: "Create & Produce",
    description: "Arrive at your studio and bring your creative vision to life.",
    icon: AudioLinesIcon,
  },
];

const assurances = [
  {
    title: "Liability Protection",
    description:
      "Eligible bookings include liability protection, so you can focus on the work ahead.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Verified Profiles",
    description:
      "Verified host profiles help you make informed choices and book with confidence.",
    icon: BadgeCheckIcon,
  },
  {
    title: "Equipment Safety",
    description:
      "Clear space details and safety-minded hosts help keep your people and gear in good hands.",
    icon: CheckCircle2Icon,
  },
  {
    title: "24/7 Host Support",
    description:
      "Get help when you need it, with support for hosts and creators around the clock.",
    icon: HeadphonesIcon,
  },
];

const aboutHighlights = [
  {
    title: "Discover unique spaces",
    description: "Find inspiring studios with the details you need to choose well.",
    icon: CompassIcon,
  },
  {
    title: "Book with ease",
    description: "Choose a space and reserve the time that works for your project.",
    icon: CalendarDaysIcon,
  },
  {
    title: "Meet your creative match",
    description: "Bring workspace hosts and makers together in one place.",
    icon: UsersRoundIcon,
  },
  {
    title: "Make more together",
    description: "Give collaboration and fresh ideas room to take shape.",
    icon: LightbulbIcon,
  },
];

function StudioImage({ studio }: { studio: Studio }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-violet-200 via-indigo-100 to-sky-100">
      {studio.imageUrl ? (
        <Image
          src={studio.imageUrl}
          alt={studio.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-primary/40">
          <CameraIcon className="size-12" aria-hidden="true" />
        </div>
      )}
      <Badge className="absolute left-4 top-4 border-white/50 bg-white/90 text-slate-900 shadow-sm">
        {studio.category}
      </Badge>
    </div>
  );
}

function FeaturedStudioCard({ studio }: { studio: Studio }) {
  const detailsHref = `/studios/${encodeURIComponent(studio.id)}`;

  return (
    <Card className="group/card gap-0 border-0 shadow-sm ring-1 ring-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:ring-primary/25">
      <Link
        href={detailsHref}
        aria-label={`View ${studio.title} details`}
        className="block"
      >
        <StudioImage studio={studio} />
      </Link>
      <CardHeader className="gap-3 px-5 pb-0 pt-5">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-1 text-lg font-semibold tracking-tight">
            {studio.title}
          </CardTitle>
          <Badge
            variant="secondary"
            className="shrink-0 gap-1 bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300"
          >
            <StarIcon className="size-3.5 fill-current" aria-hidden="true" />
            {studio.rating === null ? "New" : studio.rating.toFixed(1)}
          </Badge>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPinIcon className="size-4 shrink-0 text-primary/75" aria-hidden="true" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>
      </CardHeader>
      <CardContent className="flex-1 px-5 pb-5 pt-4">
        <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
          {studio.description ||
            "A thoughtfully designed space for your next creative project."}
        </p>
      </CardContent>
      <CardFooter className="justify-between gap-3 border-t border-border/60 bg-muted/25 px-5 py-4">
        <p className="min-w-0">
          {studio.hourlyRate === null ? (
            <span className="text-sm font-medium text-muted-foreground">
              Rate on request
            </span>
          ) : (
            <>
              <span className="text-xl font-bold tracking-tight">
                ${studio.hourlyRate.toLocaleString("en-US")}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">/ hr</span>
            </>
          )}
        </p>
        <Button
          render={<Link href={detailsHref} />}
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

function FeaturedStudiosSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Card key={index} className="gap-0 overflow-hidden">
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="space-y-4 p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-9 w-28" />
          </div>
        </Card>
      ))}
    </div>
  );
}

async function FeaturedStudios() {
  let studios: Studio[];

  try {
    studios = await getStudios(6);
  } catch (error) {
    unstable_rethrow(error);
    console.error("Unable to load featured studios.", error);

    return (
      <div
        className="rounded-3xl border border-dashed bg-card px-6 py-14 text-center"
        role="status"
      >
        <p className="text-lg font-semibold">Studios are taking a moment to load.</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Please try again shortly, or explore all spaces to find your next
          creative home.
        </p>
        <Button
          render={<Link href="/studios" />}
          nativeButton={false}
          variant="outline"
          className="mt-5 rounded-full"
        >
          Explore all studios
        </Button>
      </div>
    );
  }

  const featuredStudios = [...studios]
    .sort((a, b) => {
      if (a.rating === null) return b.rating === null ? 0 : 1;
      if (b.rating === null) return -1;
      return b.rating - a.rating;
    })
    .slice(0, 6);

  if (featuredStudios.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed bg-card px-6 py-14 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <CameraIcon className="size-5" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Your next space is on its way</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          There are no studios listed just yet. Check back soon for fresh spaces.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {featuredStudios.map((studio) => (
        <FeaturedStudioCard key={studio.id} studio={studio} />
      ))}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      <HomeHero />

      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Handpicked for you"
            title="Spaces that spark something."
            description="A few standout studios to get your next project moving."
          />
          <Button
            render={<Link href="/studios" />}
            nativeButton={false}
            variant="outline"
            className="w-fit shrink-0 gap-2 rounded-full px-5"
          >
            View All Studios
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <Suspense fallback={<FeaturedStudiosSkeleton />}>
          <FeaturedStudios />
        </Suspense>
      </section>

      <section className="bg-muted/45 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Find your kind of space"
            title="Explore Studios by Category"
            description="From the first take to the final edit, find a space that fits the way you create."
            centered
          />
          <div className="mt-11 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {studioCategories.map((category, index) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.category}
                  href={`/studios?category=${encodeURIComponent(category.category)}`}
                  className={`group relative isolate min-h-72 overflow-hidden rounded-3xl bg-slate-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
                    index < 2 ? "lg:col-span-3" : "lg:col-span-2"
                  }`}
                >
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-slate-950/5 transition-colors group-hover:from-slate-950/95" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <span className="mb-4 grid size-11 place-items-center rounded-2xl border border-white/25 bg-white/15 text-white backdrop-blur-md">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-xl font-semibold text-white sm:text-2xl">
                      {category.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-white/75">
                      {category.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white">
                      Browse category
                      <ArrowRightIcon
                        className="size-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-20 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
      >
        <SectionHeading
          eyebrow="Simple from start to finish"
          title="How Booking Works"
          description="Less time searching, more time doing what you love. Your next creative session is just a few steps away."
          centered
        />
        <div className="relative mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div
            className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-primary/10 via-primary/35 to-primary/10 lg:block"
            aria-hidden="true"
          />
          {bookingSteps.map((step) => {
            const Icon = step.icon;

            return (
              <article key={step.number} className="relative text-center">
                <div className="relative mx-auto grid size-16 place-items-center rounded-2xl border border-primary/10 bg-background text-primary shadow-sm">
                  <Icon className="size-6" aria-hidden="true" />
                  <span className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-4 ring-background">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Good work starts with trust"
            title="Create with Confidence"
            description="Thoughtful support and clear expectations make it easier for everyone to do their best work."
            centered
          />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {assurances.map((assurance) => {
              const Icon = assurance.icon;

              return (
                <Card
                  key={assurance.title}
                  className="gap-4 border-white/10 bg-white/[0.06] p-6 text-white ring-0 transition-colors hover:bg-white/[0.1]"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary/25 text-violet-200">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg font-semibold text-white">
                      {assurance.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm leading-6 text-white/65">
                      {assurance.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="about-us"
        aria-labelledby="about-us-heading"
        className="scroll-mt-20 bg-gradient-to-b from-muted/45 to-background py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Our story
              </p>
              <h2
                id="about-us-heading"
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                About StudioSpace
              </h2>
              <h3 className="mt-6 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Space to make your next big idea happen.
              </h3>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                StudioSpace helps photographers, filmmakers, podcasters,
                musicians, and all kinds of creators discover and book studios
                and workspaces that fit the way they work.
              </p>
              <div className="mt-8 rounded-2xl border border-primary/10 bg-card/80 p-5 shadow-sm sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                  Our mission
                </p>
                <p className="mt-2 leading-7 text-foreground/80">
                  Make inspiring creative spaces accessible, convenient, and
                  easy to book—while helping hosts connect their spaces with
                  the people ready to create in them.
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:mx-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl shadow-primary/10 ring-1 ring-border/60">
                <Image
                  src={studioCategories[2].image}
                  alt="A creator recording in a professionally equipped podcast studio"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <p className="absolute inset-x-6 bottom-6 text-lg font-medium text-white sm:text-xl">
                  Find the room. Make the thing.
                </p>
              </div>
              <div className="absolute -bottom-5 right-4 rounded-2xl border border-border/70 bg-background/95 px-5 py-3 shadow-lg backdrop-blur sm:right-8">
                <p className="text-sm font-semibold">For every kind of creator</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  One space to start your next project
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {aboutHighlights.map((highlight) => {
              const Icon = highlight.icon;

              return (
                <article
                  key={highlight.title}
                  className="group rounded-2xl border border-border/70 bg-card/75 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 sm:p-6"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold tracking-tight">
                    {highlight.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {highlight.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-br from-primary/[0.1] via-background to-indigo-500/[0.08] p-7 ring-1 ring-primary/10 sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Make space for creativity
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Your next favorite workspace is out there.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              Explore inspiring places to make, meet, record, and create.
            </p>
          </div>
          <Button
            render={<Link href="/studios" />}
            nativeButton={false}
            size="lg"
            className="h-11 shrink-0 gap-2 rounded-full px-6"
          >
            Explore Studios
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </section>
    </main>
  );
}
