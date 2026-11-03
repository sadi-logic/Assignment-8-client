"use client";

import { useState, type FormEvent } from "react";
import { CalendarDaysIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";



import { establishServerSession, useSession } from "@/lib/auth-client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Studio } from "@/lib/studios";
import { toast } from "@/components/ui/toast";

function formatPrice(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BookingForm({ studio }: { studio: Studio }) {

  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const minimumHours = studio.minimumBookingHours ?? 1;
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(minimumHours);
  const [email, setEmail] = useState("");
  const today = localDateString(new Date());
  const total = studio.hourlyRate === null ? null : studio.hourlyRate * hours;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const bookingRequest = {
      studioId: studio.id,
      date,
      startTime,
      hours,
      email,
    };
    console.log("Booking form submitted:", bookingRequest);

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) {
      const message = "Booking request was not sent: NEXT_PUBLIC_SERVER_URL is not configured.";
      console.error(message);
      toast.add({
        title: "Booking request failed",
        description: "The server URL is not configured.",
        type: "error",
      });
      return;
    }

    try {
      await establishServerSession();
      const result = await fetch(`${serverUrl.replace(/\/$/, "")}/studios/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookingRequest),
      });

      if (!result.ok) {
        throw new Error(`Booking request failed (HTTP ${result.status}).`);
      }

      const data: unknown = await result.json();
      console.log("Booking request sent:", data);
      toast.add({
        title: "Booking request sent",
        description: "Your booking request was submitted successfully.",
        type: "success",
      });
    } catch (error) {
      console.error("Unable to send booking request:", error);
      toast.add({
        title: "Booking request failed",
        description: error instanceof Error ? error.message : "Unable to send your booking request.",
        type: "error",
      });
    }
  }

  return (
    <>
      <Button
        type="button"
        size="lg"
        onClick={() => {
          console.log("Book Workspace Now clicked:", { studioId: studio.id });
          setOpen(true);
        }}
        className="h-12 w-full gap-2 rounded-xl text-base font-semibold shadow-md shadow-primary/20"
      >
        <CalendarDaysIcon className="size-5" aria-hidden="true" />
        Book Workspace Now
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Request a booking</DialogTitle>
            <DialogDescription>
              Choose a date and time for {studio.title}. Your request will be sent to the host for confirmation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                Date
                <Input
                  type="date"
                  required
                  min={today}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="h-10 bg-background"
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Start time
                <Input
                  type="time"
                  required
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="h-10 bg-background"
                />
              </label>
            </div>
            <label className="block space-y-2 text-sm font-medium">
              Booking duration (hours)
              <Input
                type="number"
                required
                min={minimumHours}
                step="1"
                value={hours}
                onChange={(event) =>
                  setHours(Math.max(minimumHours, Number(event.target.value)))
                }
                className="h-10 bg-background"
              />
              {minimumHours > 1 && (
                <span className="block text-xs font-normal text-muted-foreground">
                  This workspace requires a minimum booking of {minimumHours} hours.
                </span>
              )}
            </label>
            <div className="space-y-2">
              <p className="text-sm font-medium">Contact email</p>
              <p className="text-xs text-muted-foreground">
                We&apos;ll send booking updates and the host&apos;s confirmation to this address.
              </p>
              <Input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-10 bg-background"
              />
            </div>
            <div className="rounded-xl bg-muted/60 p-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">
                  {studio.hourlyRate === null
                    ? "Hourly rate"
                    : `$${formatPrice(studio.hourlyRate)} × ${hours} ${hours === 1 ? "hour" : "hours"}`}
                </span>
                <span className="font-semibold">
                  {total === null ? "Rate on request" : `$${formatPrice(total)}`}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                This is a booking request, not a confirmed reservation. The host will confirm availability and pricing.
              </p>
            </div>

            {/* <Button type="submit" size="lg" className="h-11 w-full gap-2 rounded-xl">
                <MailIcon className="size-4" aria-hidden="true" />
                Send booking request
              </Button> */}
            {isLoggedIn ? (
              <Button type="submit" size="lg" className="h-11 w-full gap-2 rounded-xl">
                <MailIcon className="size-4" aria-hidden="true" />
                Send booking request
              </Button>
            ) : (
              <p className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                Please log in to send a booking request.
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
