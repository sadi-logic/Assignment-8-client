import Link from "next/link";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudioNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <SearchIcon className="size-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">Studio not found</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This workspace may have been removed or the link may be incorrect.
        </p>
        <Button
          render={<Link href="/studios" />}
          nativeButton={false}
          className="mt-6 gap-2 rounded-full"
        >
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          Explore studios
        </Button>
      </div>
    </main>
  );
}
