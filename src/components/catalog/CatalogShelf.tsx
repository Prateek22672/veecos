"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Amazon/Flipkart-style horizontal "shelf": cards scroll sideways on every
 * screen size (swipe on touch, arrow buttons on desktop). Children are rendered
 * server-side and stay crawlable; only the scroll chrome is client-side.
 */
export function CatalogShelf({
  children,
  itemClass,
}: {
  children: React.ReactNode;
  /** Width of each item track. Defaults to a responsive ~1.3–5 cards in view. */
  itemClass?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="group/shelf relative">
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {React.Children.map(children, (child) => (
          <div
            className={cn(
              "shrink-0 snap-start [&>*]:h-full",
              itemClass ??
                "w-[66%] sm:w-[44%] md:w-[31%] lg:w-[23.5%] xl:w-[18.5rem]",
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Desktop arrows — appear on hover, sit just inside the edges */}
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute -left-3 top-[42%] hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-ink/10 bg-white text-ink opacity-0 shadow-card transition-opacity duration-300 hover:bg-ink hover:text-white group-hover/shelf:opacity-100 lg:grid"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute -right-3 top-[42%] hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-ink/10 bg-white text-ink opacity-0 shadow-card transition-opacity duration-300 hover:bg-ink hover:text-white group-hover/shelf:opacity-100 lg:grid"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
