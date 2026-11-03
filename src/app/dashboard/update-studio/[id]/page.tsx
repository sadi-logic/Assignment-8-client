"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, LoaderCircleIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type StudioRecord = Record<string, unknown>;

function isRecord(value: unknown): value is StudioRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapStudio(payload: unknown): StudioRecord {
  if (!isRecord(payload)) {
    throw new Error("The studio response has an unexpected format.");
  }
  if (isRecord(payload.studio)) return payload.studio;
  if (isRecord(payload.data)) return payload.data;
  return payload;
}

function getField(record: StudioRecord, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
  }
  return "";
}

async function getErrorMessage(response: Response): Promise<string> {
  const responseText = await response.text();
  if (responseText) {
    try {
      const payload: unknown = JSON.parse(responseText);
      if (
        isRecord(payload) &&
        typeof payload.message === "string" &&
        payload.message
      ) {
        return payload.message;
      }
    } catch {
      return responseText;
    }
    return responseText;
  }
  return `Request failed (HTTP ${response.status}).`;
}

export default function UpdateStudioPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const [studio, setStudio] = useState<StudioRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadStudio() {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      if (!serverUrl) {
        setError("NEXT_PUBLIC_SERVER_URL is not configured.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${serverUrl.replace(/\/$/, "")}/studios/${encodeURIComponent(id)}`,
          { cache: "no-store" }
        );
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "This studio listing could not be found."
              : await getErrorMessage(response)
          );
        }
        const payload: unknown = await response.json();
        const listing = unwrapStudio(payload);
        if (active) {
          setStudio(listing);
          setError(null);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load this studio listing."
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadStudio();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!studio) return;

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) {
      toast.error("NEXT_PUBLIC_SERVER_URL is not configured.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const listingUpdates = Object.fromEntries(formData.entries());
    const rawHourlyRate = String(listingUpdates.hourlyRate ?? "").trim();
    const updatedListing: StudioRecord = {
      ...studio,
      ...listingUpdates,
      hourlyRate: rawHourlyRate === "" ? null : Number(rawHourlyRate),
      imageUrl: String(listingUpdates.imageUrl ?? "").trim() || null,
    };
    delete updatedListing._id;

    setIsSaving(true);
    try {
      const response = await fetch(
        `${serverUrl.replace(/\/$/, "")}/studios/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedListing),
        }
      );
      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      toast.success("Studio listing updated.");
      router.push("/dashboard/my-studio-listing");
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update studio listing."
      );
    } finally {
      setIsSaving(false);
    }
  }

  const title = studio ? getField(studio, "title", "name") : "";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        render={<Link href="/dashboard/my-studio-listing" />}
        nativeButton={false}
        className="mb-5 gap-2"
      >
        <ArrowLeftIcon aria-hidden="true" />
        Back to my listings
      </Button>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Update studio</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Edit the details for {title || "your studio listing"}.
        </p>
      </header>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
            <LoaderCircleIcon className="size-5 animate-spin" aria-hidden="true" />
            Loading studio details...
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="font-medium">Unable to open this studio listing.</p>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      ) : studio ? (
        <Card>
          <CardHeader>
            <CardTitle>Studio details</CardTitle>
            <CardDescription>
              Update the information guests see when browsing your listing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={getField(studio, "title", "name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  required
                  defaultValue={getField(studio, "category", "type")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  defaultValue={getField(studio, "location", "city", "address")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly rate</Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={getField(studio, "hourlyRate", "pricePerHour")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  defaultValue={getField(studio, "imageUrl", "coverImageUrl", "image")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overview">Description</Label>
                <Textarea
                  id="overview"
                  name="overview"
                  rows={5}
                  defaultValue={getField(studio, "overview", "description")}
                />
              </div>
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/my-studio-listing")}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gap-2" disabled={isSaving}>
                  {isSaving ? (
                    <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
                  ) : (
                    <SaveIcon aria-hidden="true" />
                  )}
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
