"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { bareId, type CatalogNode } from "@/lib/catalog-types";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

/**
 * Secondary "category header" for the products area — a horizontal bar of main
 * categories, each revealing its sub-categories on hover (desktop). Sticks just
 * below the main site header; scrolls horizontally on mobile.
 */
export function CategoryNav({
  tree,
  activeId,
}: {
  tree: CatalogNode[];
  activeId?: string;
}) {
  if (tree.length === 0) return null;

  // Which main category is active (directly, or via one of its sub-categories)?
  const activeMain = tree.find(
    (n) =>
      bareId(n.category.PK) === activeId ||
      n.subcategories.some((s) => bareId(s.PK) === activeId),
  );

  return (
    <div className="sticky top-[4.75rem] z-30 border-b border-ink/10 bg-paper/90 backdrop-blur-md sm:top-20">
      <Container>
        <ul className="flex items-center gap-1 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:overflow-x-visible [&::-webkit-scrollbar]:hidden">
          {tree.map((n) => {
            const rid = bareId(n.category.PK);
            const hasSubs = n.subcategories.length > 0;
            const isActive = activeMain && bareId(activeMain.category.PK) === rid;
            return (
              <li key={rid} className="group/cat relative shrink-0">
                <Link
                  href={`/products/${rid}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-ink text-paper"
                      : "text-ink/70 hover:bg-ink/5 hover:text-ink",
                  )}
                >
                  {n.category.Name}
                  {hasSubs && (
                    <ChevronDown className="size-3.5 transition-transform duration-300 group-hover/cat:rotate-180" />
                  )}
                </Link>

                {hasSubs && (
                  <div className="invisible absolute left-0 top-full z-40 pt-2 opacity-0 transition-all duration-200 group-hover/cat:visible group-hover/cat:opacity-100">
                    <ul className="min-w-[14rem] overflow-hidden rounded-2xl border border-ink/10 bg-white p-1.5 shadow-[0_24px_60px_-28px_rgba(20,20,15,0.4)]">
                      {n.subcategories.map((s) => {
                        const sid = bareId(s.PK);
                        const subActive = sid === activeId;
                        return (
                          <li key={sid}>
                            <Link
                              href={`/products/${sid}?p=${rid}`}
                              className={cn(
                                "block rounded-xl px-3.5 py-2 text-sm transition-colors",
                                subActive
                                  ? "bg-ink/6 font-medium text-ink"
                                  : "text-ink/65 hover:bg-ink/4 hover:text-ink",
                              )}
                            >
                              {s.Name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </div>
  );
}
