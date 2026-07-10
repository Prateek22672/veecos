import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} />;
}

/** One product-card placeholder — mirrors ProductCard (square image + text). */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2.5 p-4">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
        <Skeleton className="mt-4 h-3.5 w-24" />
      </div>
    </div>
  );
}

/** Catalogue category page skeleton — mirrors header + nav bar + browser. */
export function CatalogSkeleton() {
  return (
    <>
      {/* Compact header */}
      <section className="bg-paper pb-6 pt-28 sm:pb-8 sm:pt-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <Skeleton className="h-3 w-40" />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Skeleton className="h-9 w-[min(70%,20rem)] sm:h-11" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-4 w-[min(90%,26rem)]" />
        </div>
      </section>

      {/* Category nav bar */}
      <div className="border-y border-ink/10 bg-paper">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2.5 overflow-hidden px-5 py-3 sm:px-8 lg:px-12">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-32 shrink-0 rounded-full" />
          ))}
        </div>
      </div>

      {/* Browser: sidebar + results */}
      <section className="bg-paper py-10 sm:py-12">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[16rem_1fr] lg:gap-12 lg:px-12">
          {/* sidebar */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-ink/10 bg-white p-4">
              <Skeleton className="h-3 w-24" />
              <div className="mt-4 space-y-3 border-t border-ink/10 pt-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* results */}
          <div>
            {/* results bar — count left, search + controls right */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
              <Skeleton className="h-4 w-44" />
              <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
                <Skeleton className="h-10 w-full rounded-full sm:w-56" />
                <Skeleton className="hidden h-8 w-28 rounded-full sm:block" />
                <Skeleton className="hidden h-9 w-36 rounded-full sm:block" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
