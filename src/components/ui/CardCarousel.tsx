"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Horizontal swipe carousel on mobile (snap + arrow buttons); a normal grid on
 * desktop. Pass the desktop grid classes via `gridClass`.
 */
export function CardCarousel({
  children,
  gridClass,
  trailing,
}: {
  children: React.ReactNode;
  gridClass: string;
  /** Extra card shown only as the last item of the mobile carousel. */
  trailing?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={ref}
        className={cn(
          "flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:overflow-x-visible lg:pb-0 [&::-webkit-scrollbar]:hidden",
          gridClass,
        )}
      >
        {React.Children.map(children, (child) => (
          <div className="w-[72%] shrink-0 snap-start sm:w-[46%] lg:w-auto lg:shrink [&>*]:h-full">
            {child}
          </div>
        ))}
        {trailing && (
          <div className="w-[72%] shrink-0 snap-start sm:w-[46%] lg:hidden [&>*]:h-full">
            {trailing}
          </div>
        )}
      </div>

      {/* Mobile-only nav arrows */}
      <div className="mt-6 flex justify-center gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Previous"
          className="grid size-11 place-items-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:bg-ink hover:text-white"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Next"
          className="grid size-11 place-items-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:bg-ink hover:text-white"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
