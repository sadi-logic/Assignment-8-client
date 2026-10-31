import { Skeleton } from "@/components/ui/skeleton";

export default function StudioDetailsLoading() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-5 w-56" />
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-10 w-80 max-w-full sm:h-12" />
            <Skeleton className="h-5 w-64 max-w-full" />
          </div>
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
        <div className="grid auto-rows-[112px] grid-cols-2 gap-2 overflow-hidden rounded-3xl sm:auto-rows-[170px] sm:grid-cols-4 sm:gap-3">
          <Skeleton className="col-span-2 row-span-2" />
          <Skeleton className="hidden sm:block" />
          <Skeleton className="hidden sm:block" />
          <Skeleton className="hidden sm:block" />
          <Skeleton className="hidden sm:block" />
        </div>
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <div className="space-y-8">
            <Skeleton className="h-16 w-full max-w-2xl rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-56 w-full rounded-2xl" />
          </div>
          <Skeleton className="hidden h-72 rounded-2xl lg:block" />
        </div>
      </div>
    </main>
  );
}
