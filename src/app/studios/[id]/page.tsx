import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, MapPinIcon, StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudios } from "@/lib/studios";

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studios = await getStudios();
  const studio = studios.find((listing) => listing.id === id);

  if (!studio) notFound();

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <Button
          render={<Link href="/studios" />}
          variant="ghost"
          className="-ml-2 mb-5 gap-2 text-muted-foreground"
        >
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          All studios
        </Button>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="min-w-0">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-gradient-to-br from-violet-200 via-indigo-100 to-sky-100 dark:from-violet-950 dark:via-indigo-950 dark:to-slate-900">
              {studio.imageUrl ? (
                <Image
                  src={studio.imageUrl}
                  alt={studio.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-5xl font-bold text-primary/35">
                  StudioSpace
                </div>
              )}
            </div>

            <div className="mt-7">
              <Badge variant="secondary" className="mb-3 rounded-full px-3 py-1">
                {studio.category}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{studio.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="size-4 text-primary" aria-hidden="true" />
                  {studio.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <StarIcon className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {studio.rating === null ? "New listing" : `${studio.rating.toFixed(1)} rating`}
                </span>
              </div>
            </div>

            {studio.description ? (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>About this space</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                    {studio.description}
                  </p>
                </CardContent>
              </Card>
            ) : null}

            {studio.amenities.length > 0 ? (
              <Card className="mt-5">
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {studio.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="rounded-full px-3 py-1">
                      {amenity}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </div>

          <Card className="lg:sticky lg:top-24">
            <CardContent className="space-y-5 pt-5">
              <div>
                {studio.hourlyRate === null ? (
                  <p className="text-lg font-semibold">Rate on request</p>
                ) : (
                  <p className="text-3xl font-bold tracking-tight">
                    ${studio.hourlyRate.toLocaleString("en-US")}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">/ hour</span>
                  </p>
                )}
              </div>
              {studio.maxCapacity !== null ? (
                <p className="border-t pt-4 text-sm text-muted-foreground">
                  Fits up to <span className="font-semibold text-foreground">{studio.maxCapacity}</span> guests
                </p>
              ) : null}
              <Button className="w-full rounded-xl" disabled>
                Booking coming soon
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Contact the host to discuss availability and details.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
