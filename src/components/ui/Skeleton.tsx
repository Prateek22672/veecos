import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-xl bg-ink/6", className)} />
  );
}

/** Catalogue page skeleton — mirrors the sidebar + content layout. */
export function CatalogSkeleton() {
  return (
    <>
      <section className="bg-paper pt-28 sm:pt-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-5 h-12 w-[min(90%,30rem)]" />
          <Skeleton className="mt-5 h-4 w-[min(90%,22rem)]" />
        </div>
      </section>
      <section className="bg-paper py-12 sm:py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[15rem_1fr] lg:gap-14 lg:px-12">
          {/* sidebar panel */}
          <div className="hidden rounded-[1.5rem] border border-ink/10 bg-white p-4 lg:block">
            <Skeleton className="h-3 w-20" />
            <div className="mt-4 space-y-3 border-t border-ink/10 pt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          </div>
          {/* content */}
          <div>
            <Skeleton className="h-[340px] w-full rounded-[1.75rem] sm:h-[430px]" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-line bg-white"
                >
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="space-y-3 p-6">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
