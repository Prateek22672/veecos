"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type RailItem = {
  id: string;
  name: string;
  href: string;
  count?: number;
};

/**
 * Horizontally-scrolling category pill bar (like Amazon's department row).
 * Scales cleanly to 100+ categories — users swipe / arrow through them and jump
 * straight to any category without hunting a long vertical list.
 */
export function CategoryRail({
  items,
  activeId,
}: {
  items: RailItem[];
  activeId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Scroll categories left"
        className="hidden size-9 shrink-0 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition-colors hover:bg-ink hover:text-white sm:grid"
      >
        <ChevronLeft className="size-4" />
      </button>

      <div
        ref={ref}
        className="flex flex-1 gap-2 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/12 bg-white text-ink/75 hover:border-ink/40 hover:text-ink",
              )}
            >
              {item.name}
              {typeof item.count === "number" && item.count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
                    active ? "bg-white/20 text-paper" : "bg-ink/6 text-ink/50",
                  )}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Scroll categories right"
        className="hidden size-9 shrink-0 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition-colors hover:bg-ink hover:text-white sm:grid"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
