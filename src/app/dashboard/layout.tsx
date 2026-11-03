import { Suspense } from "react";
import Sidebar from "./_components/Sidebar";
import { RequireAuth } from "@/components/auth/require-auth";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-[50vh] items-center justify-center"
          role="status"
          aria-label="Loading dashboard"
        >
          <span className="size-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        </div>
      }
    >
      <RequireAuth>
        <div className="flex gap-6">
          <Sidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </RequireAuth>
    </Suspense>
  );
};

export default layout;
