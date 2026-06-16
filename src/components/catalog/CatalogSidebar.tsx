"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Minus, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { bareId, type CatalogNode } from "@/lib/catalog-types";
import { ProductSearch, type SearchItem } from "./ProductSearch";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CatalogSidebar({
  tree,
  activeId,
  branch,
  searchItems,
}: {
  tree: CatalogNode[];
  activeId?: string;
  /** Fallback single branch used when the global root tree is unavailable. */
  branch?: CatalogNode;
  searchItems?: SearchItem[];
}) {
  // Use the global tree when available, otherwise the current branch.
  const effectiveTree = tree.length > 0 ? tree : branch ? [branch] : [];

  // Which root branch contains the active category (so it opens by default).
  const activeRoot = effectiveTree.find(
    (n) =>
      bareId(n.category.PK) === activeId ||
      n.subcategories.some((s) => bareId(s.PK) === activeId),
  );

  const [openId, setOpenId] = useState<string | null>(
    activeRoot
      ? bareId(activeRoot.category.PK)
      : effectiveTree[0]
        ? bareId(effectiveTree[0].category.PK)
        : null,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  if (effectiveTree.length === 0) return null;

  const activeLabel =
    effectiveTree
      .flatMap((n) => [n.category, ...n.subcategories])
      .find((c) => bareId(c.PK) === activeId)?.Name ?? "All categories";

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      {/* Search — always visible, suggests real products & categories */}
      {searchItems && searchItems.length > 0 && (
        <div className="mb-3">
          <ProductSearch items={searchItems} />
        </div>
      )}

      {/* Mobile disclosure trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="mb-3 flex w-full items-center justify-between rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-medium text-ink lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-ink/50" />
          {activeLabel}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-ink/40 transition-transform duration-300",
            mobileOpen && "rotate-180",
          )}
        />
      </button>

      <nav
        className={cn(
          "rounded-[1.5rem] border border-ink/10 bg-white p-4 shadow-[0_18px_50px_-32px_rgba(20,20,15,0.35)]",
          mobileOpen ? "block" : "hidden lg:block",
        )}
      >
        <p className="px-1.5 pb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
          Catalogue
        </p>

        <ul className="border-t border-ink/10">
          {effectiveTree.map(({ category, subcategories }) => {
            const rid = bareId(category.PK);
            const hasSubs = subcategories.length > 0;
            const isOpen = openId === rid;
            const rootActive = activeId === rid;

            return (
              <li key={rid} className="border-b border-ink/10">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/products/${rid}`}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex flex-1 items-center gap-2.5 py-3 text-sm tracking-tight transition-colors",
                      rootActive
                        ? "font-medium text-ink"
                        : "text-ink/70 hover:text-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "h-4 w-0.5 shrink-0 rounded-full transition-colors",
                        rootActive ? "bg-ink" : "bg-transparent",
                      )}
                    />
                    <span className="flex-1">{category.Name}</span>
                    {hasSubs && (
                      <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-medium tabular-nums text-ink/45">
                        {subcategories.length}
                      </span>
                    )}
                  </Link>
                  {hasSubs && (
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : rid)}
                      aria-label={isOpen ? "Collapse" : "Expand"}
                      aria-expanded={isOpen}
                      className="grid size-8 shrink-0 place-items-center text-ink/50 transition-colors hover:text-ink"
                    >
                      {isOpen ? (
                        <Minus className="size-4" />
                      ) : (
                        <Plus className="size-4" />
                      )}
                    </button>
                  )}
                </div>

                {hasSubs && (
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 pb-3">
                          {subcategories.map((sub) => {
                            const sid = bareId(sub.PK);
                            const subActive = activeId === sid;
                            return (
                              <li key={sid}>
                                <Link
                                  href={`/products/${sid}?p=${rid}`}
                                  onClick={() => setMobileOpen(false)}
                                  className={cn(
                                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                                    subActive
                                      ? "bg-ink/6 font-medium text-ink"
                                      : "text-ink/60 hover:bg-ink/4 hover:text-ink",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "size-1.5 shrink-0 rounded-full transition-colors",
                                      subActive ? "bg-ink" : "bg-ink/25",
                                    )}
                                  />
                                  {sub.Name}
                                </Link>
                              </li>
                            );
                          })}
                        </div>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
