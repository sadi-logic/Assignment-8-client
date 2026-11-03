"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRightIcon,
  Building2Icon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { establishServerSession } from "@/lib/auth-client";
import { useAuth } from "@/lib/auth-context";
import { normalizeStudio, type Studio } from "@/lib/studios";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getListings(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (isRecord(payload) && Array.isArray(payload.studios)) return payload.studios;
  if (isRecord(payload) && Array.isArray(payload.data)) return payload.data;
  throw new Error("The studios response has an unexpected format.");
}

async function fetchOwnedStudios(email: string): Promise<Studio[]> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is not configured.");
  }

  await establishServerSession();
  const response = await fetch(`${serverUrl.replace(/\/$/, "")}/studios`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Unable to load studios (HTTP ${response.status}).`);
  }

  const payload: unknown = await response.json();
  const ownedListings = getListings(payload).filter(
    (listing): listing is Record<string, unknown> => {
      if (!isRecord(listing)) return false;
      const ownerEmail = listing.ownerEmail ?? listing.CreatorEmail;
      return (
        typeof ownerEmail === "string" &&
        ownerEmail.trim().toLowerCase() === email.trim().toLowerCase()
      );
    }
  );
  return ownedListings.map((listing, index) => normalizeStudio(listing, index));
}

function ListingSkeleton() {
  return (
    <Card className="sm:flex-row">
      <Skeleton className="aspect-[16/10] w-full shrink-0 rounded-none sm:aspect-auto sm:w-56" />
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 p-5">
        <div className="space-y-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </Card>
  );
}

export default function MyStudioListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const email = user?.email;
    if (!email) return;

    let active = true;
    fetchOwnedStudios(email)
      .then((listings) => {
        if (active) {
          setStudios(listings);
          setError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Unable to load your studios.";
        setError(message);
        setStudios([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey, user?.email]);

  function handleUpdate(studio: Studio) {
    router.push(
      `/dashboard/update-studio/${encodeURIComponent(studio.id)}`
    );
  }

  async function handleDeleteConfirm() {
    if (!selectedStudio) return;

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) {
      toast.error("NEXT_PUBLIC_SERVER_URL is not configured.");
      return;
    }

    setIsDeleting(true);
    try {
      await establishServerSession();
      const response = await fetch(
        `${serverUrl.replace(/\/$/, "")}/studios/${encodeURIComponent(selectedStudio.id)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        const responseText = await response.text();
        let message = responseText;
        try {
          const payload: unknown = JSON.parse(responseText);
          if (
            typeof payload === "object" &&
            payload !== null &&
            "message" in payload &&
            typeof payload.message === "string"
          ) {
            message = payload.message;
          }
        } catch {
          // The server may return a plain-text error.
        }
        throw new Error(
          message || `Unable to delete studio (HTTP ${response.status}).`
        );
      }

      setStudios((current) =>
        current.filter((studio) => studio.id !== selectedStudio.id)
      );
      toast.success("Studio listing deleted.");
      setSelectedStudio(null);
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete studio."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">Studio owner</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My studio listings
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Manage the creative spaces you share with the StudioSpace community.
          </p>
        </div>
        <Button
          render={<Link href="/dashboard/add-new-studio" />}
           nativeButton = {false}
          className="w-full gap-2 sm:w-auto"
        >
          <PlusIcon aria-hidden="true" />
          Add a studio
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4" aria-label="Loading your studio listings">
          {Array.from({ length: 3 }, (_, index) => (
            <ListingSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="font-medium">We couldn&apos;t load your listings.</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              onClick={() => {
                setIsLoading(true);
                setError(null);
                setReloadKey((key) => key + 1);
              }}
              variant="outline"
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : studios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2Icon className="size-7" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold">No studios listed yet</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Once you publish a workspace, it will appear here so you can manage
              its details.
            </p>
            <Button
              render={<Link href="/dashboard/add-new-studio" />}
              nativeButton = {false}
              className="mt-6 gap-2"
            >
              <PlusIcon aria-hidden="true" />
              List your first studio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {studios.length} {studios.length === 1 ? "listing" : "listings"}
            </p>
          </div>
          <div className="space-y-4">
            {studios.map((studio) => (
              <Card
                key={studio.id}
                className="sm:flex-row"
                data-studio-id={studio.id}
              >
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-muted sm:aspect-auto sm:min-h-52 sm:w-56">
                  {studio.imageUrl ? (
                    <Image
                      src={studio.imageUrl}
                      alt={studio.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 224px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full min-h-40 items-center justify-center text-muted-foreground">
                      <Building2Icon className="size-10" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 p-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <CardHeader className="min-w-0 flex-1 p-0">
                        <CardTitle className="truncate text-lg font-semibold">
                          {studio.title}
                        </CardTitle>
                      </CardHeader>
                      <Badge variant="secondary">{studio.category}</Badge>
                    </div>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPinIcon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{studio.location}</span>
                    </p>
                    <p className="text-base font-semibold">
                      {studio.hourlyRate === null
                        ? "Rate not listed"
                        : `$${studio.hourlyRate.toLocaleString()} / hour`}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                      variant="outline"
                      className="gap-2"
                      data-listing-id={studio.id}
                      data-update-href={`/dashboard/update-studio/${encodeURIComponent(studio.id)}`}
                      onClick={() => handleUpdate(studio)}
                    >
                      <PencilIcon aria-hidden="true" />
                      Update
                      <ArrowUpRightIcon className="size-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="destructive"
                      className="gap-2"
                      onClick={() => setSelectedStudio(studio)}
                    >
                      <Trash2Icon aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <AlertDialog
        open={selectedStudio !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedStudio(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this studio listing?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {selectedStudio?.title}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedStudio(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
            >
              {isDeleting ? "Deleting..." : "Confirm delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
