import { Skeleton } from "@/components/ui/skeleton";

export default function StudiosLoading() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <div className="rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/[0.08] to-indigo-500/[0.06] px-5 py-8 sm:px-9 sm:py-11">
          <Skeleton className="mb-4 h-6 w-48 rounded-full" />
          <Skeleton className="h-10 w-72 max-w-full sm:h-12 sm:w-96" />
          <Skeleton className="mt-4 h-5 w-80 max-w-full" />
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-11 w-full rounded-xl sm:max-w-md" />
          <Skeleton className="h-10 w-48 rounded-xl" />
        </div>
        <div className="mt-6 flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-9 w-28 shrink-0 rounded-full" />
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-xl border bg-card">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
