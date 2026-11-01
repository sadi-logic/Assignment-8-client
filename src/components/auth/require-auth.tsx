"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !user) {
      const returnTo = `${pathname}${window.location.search}`;
      router.replace(`/login?callbackUrl=${encodeURIComponent(returnTo)}`);
    }
  }, [isPending, pathname, router, user]);

  if (isPending || !user) {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center"
        role="status"
        aria-label="Checking your session"
      >
        <span className="size-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
      </div>
    );
  }

  return children;
}
