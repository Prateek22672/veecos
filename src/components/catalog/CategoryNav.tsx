"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bareId, type CatalogNode } from "@/lib/catalog-types";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

/**
 * Secondary category bar for the products area — a horizontally scrollable row
 * of main categories with arrow buttons. Stays in the page flow (not fixed) and
 * is contained, so it never causes horizontal page overflow.
 */
export function CategoryNav({
  tree,
  activeId,
}: {
  tree: CatalogNode[];
  activeId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  if (tree.length === 0) return null;

  const activeMain = tree.find(
    (n) =>
      bareId(n.category.PK) === activeId ||
      n.subcategories.some((s) => bareId(s.PK) === activeId),
  );

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <div className="border-y border-ink/10 bg-paper">
      <Container>
        <div className="flex items-center gap-2 py-2.5">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll categories left"
            className="grid size-8 shrink-0 place-items-center rounded-full border border-ink/12 bg-white text-ink/70 transition-colors hover:bg-ink hover:text-white sm:size-9"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div
            ref={ref}
            className="flex flex-1 items-center gap-1.5 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tree.map((n) => {
              const rid = bareId(n.category.PK);
              const isActive =
                activeMain && bareId(activeMain.category.PK) === rid;
              return (
                <Link
                  key={rid}
                  href={`/products/${rid}`}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-ink text-paper"
                      : "text-ink/65 hover:bg-ink/5 hover:text-ink",
                  )}
                >
                  {n.category.Name}
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll categories right"
            className="grid size-8 shrink-0 place-items-center rounded-full border border-ink/12 bg-white text-ink/70 transition-colors hover:bg-ink hover:text-white sm:size-9"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </Container>
    </div>
  );
}
