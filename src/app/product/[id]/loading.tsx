import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      <div className="bg-ink pt-28 pb-6 sm:pt-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <Skeleton className="h-4 w-40 bg-white/10" />
        </div>
      </div>
      <section className="bg-paper py-12 sm:py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
          <Skeleton className="aspect-square w-full rounded-[1.75rem]" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="mt-6 h-24 w-full rounded-2xl" />
            <Skeleton className="mt-6 h-12 w-48 rounded-full" />
          </div>
        </div>
      </section>
    </>
  );
}
