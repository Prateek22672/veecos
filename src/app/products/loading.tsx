import { Skeleton } from "@/components/ui/Skeleton";
import { Container } from "@/components/ui/Container";

/** Skeleton mirroring the products landing: hero → search card → categories. */
export default function Loading() {
  return (
    <>
      {/* Hero */}
      <Skeleton className="h-[54vh] min-h-[28rem] w-full rounded-none sm:h-[58vh] lg:h-[62vh]" />

      {/* Overlapping search card */}
      <div className="relative z-20 -mt-9 sm:-mt-12">
        <Container>
          <Skeleton className="mx-auto h-16 max-w-2xl rounded-full border border-ink/10 bg-white" />
        </Container>
      </div>

      {/* Category bar */}
      <div className="mt-10 border-y border-ink/10 bg-paper py-2.5">
        <Container>
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-40 shrink-0 rounded-full" />
            ))}
          </div>
        </Container>
      </div>

      {/* Category cards */}
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <Skeleton className="h-3 w-44" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-line bg-white"
              >
                <Skeleton className="aspect-[16/10] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-1.5 pt-1">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
