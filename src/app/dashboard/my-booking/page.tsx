"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BanIcon,
  CalendarDaysIcon,
  CalendarX2Icon,
  CircleAlertIcon,
  ClockIcon,
  Loader2Icon,
  MapPinIcon,
  ReceiptIcon,
  UsersIcon,
  type LucideIcon,
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { getAuthToken } from "@/lib/auth-client";
import { getStudios, type Studio } from "@/lib/studios";
import { cn } from "@/lib/utils";

const BOOKING_STATUSES = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

type BookingStatus = (typeof BOOKING_STATUSES)[number];

type Booking = {
  id: string;
  studioId: string | null;
  studioName: string | null;
  imageUrl: string | null;
  location: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  hours: number | null;
  guests: number | null;
  totalPrice: number | null;
  status: BookingStatus;
};

const statusBadgeStyles: Record<BookingStatus, string> = {
  Pending:
    "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  Confirmed:
    "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  Completed:
    "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  Cancelled: "bg-destructive/10 text-destructive dark:bg-destructive/20",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return null;
}

function getNumber(...values: unknown[]): number | null {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const number = typeof value === "number" ? value : Number(value);
    if (Number.isFinite(number) && number >= 0) return number;
  }
  return null;
}

function normalizeStatus(value: unknown): BookingStatus {
  if (typeof value !== "string") return "Pending";
  const normalized = value.trim().toLowerCase();
  const match = BOOKING_STATUSES.find(
    (status) => status.toLowerCase() === normalized
  );
  // Bookings are created as requests, so anything unrecognised stays pending.
  return match ?? "Pending";
}

function formatTime(value: string | null): string | null {
  if (!value) return null;
  const match = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!match) return value;
  const hour = Number(match[1]);
  if (!Number.isFinite(hour) || hour > 23) return value;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${match[2]} ${period}`;
}

function deriveEndTime(startTime: string | null, hours: number | null) {
  const match = startTime ? /^(\d{1,2}):(\d{2})/.exec(startTime) : null;
  if (!match || !hours || hours <= 0) return null;
  const totalMinutes =
    Number(match[1]) * 60 + Number(match[2]) + Math.round(hours * 60);
  const normalized = totalMinutes % (24 * 60);
  const endHour = String(Math.floor(normalized / 60)).padStart(2, "0");
  const endMinute = String(normalized % 60).padStart(2, "0");
  return `${endHour}:${endMinute}`;
}

function formatDate(value: string | null): string | null {
  if (!value) return null;
  // Parse date-only values locally so the day never shifts across time zones.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const parsed = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPrice(value: number) {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function normalizeBooking(value: unknown, index: number): Booking {
  if (!isRecord(value)) {
    throw new Error("The bookings response contains an invalid booking.");
  }

  const rawStudio = isRecord(value.studio) ? value.studio : null;
  const startTime = getString(value.startTime, value.start, value.startingTime);
  const hours = getNumber(value.hours, value.duration, value.totalHours);
  const endTime = getString(value.endTime, value.end, value.endingTime);

  return {
    id: getString(value._id, value.id) ?? `booking-${index + 1}`,
    studioId: getString(
      value.studioId,
      value.studioID,
      rawStudio?._id,
      rawStudio?.id
    ),
    studioName: getString(
      value.studioName,
      value.studioTitle,
      rawStudio?.title,
      rawStudio?.name
    ),
    imageUrl: getString(value.imageUrl, value.image, rawStudio?.imageUrl),
    location: getString(value.location, rawStudio?.location),
    date: getString(value.date, value.bookingDate),
    startTime,
    endTime: endTime ?? deriveEndTime(startTime, hours),
    hours,
    guests: getNumber(
      value.guests,
      value.guestCount,
      value.numberOfGuests,
      value.people
    ),
    totalPrice: getNumber(value.totalPrice, value.total, value.price, value.amount),
    status: normalizeStatus(value.status),
  };
}

function getBookingItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (isRecord(payload) && Array.isArray(payload.bookings)) return payload.bookings;
  if (isRecord(payload) && Array.isArray(payload.data)) return payload.data;
  throw new Error("The bookings response has an unexpected format.");
}

async function fetchBookings(email: string, token: string): Promise<Booking[]> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is not configured.");
  }

  const response = await fetch(
    `${serverUrl.replace(/\/$/, "")}/studios/booking/${encodeURIComponent(email)}`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) {
    throw new Error(`Unable to load your bookings (HTTP ${response.status}).`);
  }

  const payload: unknown = await response.json();
  return getBookingItems(payload).map(normalizeBooking);
}

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const text = await response.text();
    if (!text) return fallback;
    try {
      const payload: unknown = JSON.parse(text);
      if (isRecord(payload)) {
        const message = getString(payload.message, payload.error);
        if (message) return message;
      }
    } catch {
      // The server may return a plain-text error.
    }
    return text;
  } catch {
    return fallback;
  }
}

function BookingSkeleton() {
  return (
    <Card className="sm:flex-row">
      <Skeleton className="aspect-[16/10] w-full shrink-0 rounded-none sm:aspect-auto sm:w-64" />
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 p-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/3" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 border-transparent", statusBadgeStyles[status])}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </Badge>
  );
}

function BookingDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | null;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const email = user?.email;
    if (!email) return;

    let active = true;
    getAuthToken()
      .then((token) => fetchBookings(email, token))
      .then((list) => {
        if (active) {
          setBookings(list);
          setError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load your bookings."
        );
        setBookings([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    // Studio details enrich the cards but are not required to render them.
    getStudios()
      .then((list) => {
        if (active) setStudios(list);
      })
      .catch((studioError: unknown) => {
        console.warn("Unable to load studio details for bookings:", studioError);
      });

    return () => {
      active = false;
    };
  }, [reloadKey, user?.email]);

  const studioById = useMemo(
    () => new Map(studios.map((studio) => [studio.id, studio])),
    [studios]
  );

  const displayBookings = useMemo(() => {
    const sorted = [...bookings].sort((a, b) =>
      (a.date ?? "9999-99-99").localeCompare(b.date ?? "9999-99-99")
    );

    return sorted.map((booking) => {
      const studio = booking.studioId
        ? studioById.get(booking.studioId)
        : undefined;
      const totalPrice =
        booking.totalPrice ??
        (studio?.hourlyRate !== null &&
          studio?.hourlyRate !== undefined &&
          booking.hours !== null
          ? studio.hourlyRate * booking.hours
          : null);

      return {
        ...booking,
        studioName: booking.studioName ?? studio?.title ?? null,
        imageUrl: booking.imageUrl ?? studio?.imageUrl ?? null,
        location: booking.location ?? studio?.location ?? null,
        totalPrice,
      };
    });
  }, [bookings, studioById]);

  async function handleCancelConfirm() {
    const booking = selectedBooking;
    if (!booking) return;

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) {
      toast.error("Unable to cancel booking", {
        description: "NEXT_PUBLIC_SERVER_URL is not configured.",
      });
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch(
        `${serverUrl.replace(/\/$/, "")}/studios/booking/${encodeURIComponent(booking.id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${await getAuthToken()}` },
        }
      );


      if (!response.ok) {
        throw new Error(
          await readErrorMessage(
            response,
            `Unable to cancel this booking (HTTP ${response.status}).`
          )
        );
      }

      setBookings((current) =>
        current.filter((item) =>
          item.id !== booking.id)
      );
      setSelectedBooking(null);
      toast.success("Booking cancelled", {
        description: `Your booking for ${booking.studioName ?? "this workspace"} has been cancelled.`,
      });
    } catch (cancelError) {
      console.error("Unable to cancel booking:", cancelError);
      toast.error("Unable to cancel booking", {
        description:
          cancelError instanceof Error
            ? cancelError.message
            : "Something went wrong while cancelling your booking.",
      });
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-medium text-primary">Your reservations</p>
        <h1 className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          My Bookings
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
          Keep track of your studio reservations, review their status and cancel
          bookings that are still pending.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4" aria-label="Loading your bookings">
          {Array.from({ length: 3 }, (_, index) => (
            <BookingSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <CircleAlertIcon className="size-7" aria-hidden="true" />
            </span>
            <p className="font-medium">We couldn&apos;t load your bookings.</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              onClick={() => {
                setIsLoading(true);
                setError(null);
                setReloadKey((key) => key + 1);
              }}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : displayBookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CalendarX2Icon className="size-7" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold">No bookings yet</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              When you reserve a workspace on StudioSpace, your bookings appear
              here with their dates, times and status.
            </p>
            <Button
              render={<Link href="/studios" />}
              nativeButton={false}
              className="mt-6 gap-2"
            >
              <CalendarDaysIcon aria-hidden="true" />
              Explore studios
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {displayBookings.length}{" "}
            {displayBookings.length === 1 ? "booking" : "bookings"}
          </p>
          <div className="space-y-4">
            {displayBookings.map((booking) => {
              const timeValue = booking.startTime
                ? `${formatTime(booking.startTime)}${booking.endTime ? ` – ${formatTime(booking.endTime)}` : ""}`
                : null;

              return (
                <Card key={booking.id} data-booking-id={booking.id}>
                  <div className="sm:flex">
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-muted sm:aspect-auto sm:min-h-56 sm:w-64">
                      {booking.imageUrl ? (
                        <Image
                          src={booking.imageUrl}
                          alt={booking.studioName ?? "Booked workspace"}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, 256px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-40 items-center justify-center text-muted-foreground">
                          <CalendarDaysIcon className="size-10" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-5 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <CardHeader className="p-0">
                            <CardTitle className="truncate text-lg font-semibold">
                              {booking.studioName ?? "Booked workspace"}
                            </CardTitle>
                          </CardHeader>
                          {booking.location && (
                            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPinIcon
                                className="size-4 shrink-0"
                                aria-hidden="true"
                              />
                              <span className="truncate">{booking.location}</span>
                            </p>
                          )}
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
                        <BookingDetail
                          icon={CalendarDaysIcon}
                          label="Booking date"
                          value={formatDate(booking.date)}
                        />
                        <BookingDetail
                          icon={ClockIcon}
                          label="Time"
                          value={timeValue}
                        />
                        {booking.guests !== null && (
                          <BookingDetail
                            icon={UsersIcon}
                            label="Guests"
                            value={
                              booking.guests === 1
                                ? "1 guest"
                                : `${booking.guests} guests`
                            }
                          />
                        )}
                        <BookingDetail
                          icon={ReceiptIcon}
                          label="Total price"
                          value={
                            booking.totalPrice === null
                              ? null
                              : formatPrice(booking.totalPrice)
                          }
                        />
                      </div>

                      {booking.status === "Pending" && (
                        <div className="mt-auto flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-xs text-muted-foreground">
                            This booking is waiting for the host&apos;s confirmation.
                          </p>
                          <Button
                            variant="destructive"
                            className="gap-2 sm:self-end"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <BanIcon aria-hidden="true" />
                            Cancel booking
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <AlertDialog
        open={selectedBooking !== null}
        onOpenChange={(open) => {
          if (!open && !isCancelling) setSelectedBooking(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;re about to cancel your booking for{" "}
              <span className="font-medium text-foreground">
                {selectedBooking?.studioName ?? "this workspace"}
              </span>
              {selectedBooking?.date && (
                <>
                  {" "}
                  on{" "}
                  <span className="font-medium text-foreground">
                    {formatDate(selectedBooking.date)}
                  </span>
                </>
              )}
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Keep booking
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="gap-2"
              disabled={isCancelling}
              onClick={handleCancelConfirm}
            >
              {isCancelling ? (
                <Loader2Icon className="animate-spin" aria-hidden="true" />
              ) : (
                <BanIcon aria-hidden="true" />
              )}
              {isCancelling ? "Cancelling..." : "Confirm cancellation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
