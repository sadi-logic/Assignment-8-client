"use client";

import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudiosError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircleIcon className="size-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">We couldn’t load the studios</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Something went wrong while loading available spaces. Please try again in a moment.
        </p>
        <Button type="button" onClick={reset} className="mt-6 gap-2 rounded-full">
          <RefreshCwIcon className="size-4" aria-hidden="true" />
          Try again
        </Button>
      </div>
    </main>
  );
}
