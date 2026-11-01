import { Suspense } from "react";
import { AuthPage } from "@/components/auth/auth-page";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100svh-4rem)] flex-1 items-center justify-center">
          <span
            className="size-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary"
            role="status"
            aria-label="Loading registration page"
          />
        </main>
      }
    >
      <AuthPage mode="register" />
    </Suspense>
  );
}
