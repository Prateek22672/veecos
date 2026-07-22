import { Skeleton } from "@/components/ui/Skeleton";
import { PageBackground } from "@/components/providers/PageBackground";

export default function Loading() {
  return (
    <>
      <PageBackground color="#ffffff" />
      <div className="bg-white pt-28 sm:pt-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <section className="bg-white pb-12 pt-6 sm:pb-16">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="mt-6 h-40 w-full rounded-2xl" />
            <div className="mt-6 flex gap-3">
              <Skeleton className="h-13 w-44 rounded-full" />
              <Skeleton className="h-13 w-44 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
