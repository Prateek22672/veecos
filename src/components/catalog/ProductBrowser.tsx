"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Grid3x3,
} from "lucide-react";
import { ProductCard } from "./ProductCard";
import { bareId, type Product, type CatalogNode } from "@/lib/catalog-types";
import { cn } from "@/lib/cn";

type Sort = "default" | "az" | "za" | "available";
const PAGE_SIZES = [9, 12, 18, 24];

export function ProductBrowser({
  products,
  tree,
  initialCat = null,
}: {
  products: Product[];
  tree: CatalogNode[];
  initialCat?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("default");
  const [perPage, setPerPage] = useState(12);
  const [page, setPage] = useState(1);
  const [cols, setCols] = useState<3 | 4>(4);
  const [avail, setAvail] = useState<"all" | "in" | "out">("all");
  const [open, setOpen] = useState(false);

  // id → name + main → sub ids
  const { catName, subIdsByMain } = useMemo(() => {
    const catName = new Map<string, string>();
    const subIdsByMain = new Map<string, string[]>();
    tree.forEach((n) => {
      const rid = bareId(n.category.PK);
      catName.set(rid, n.category.Name);
      subIdsByMain.set(
        rid,
        n.subcategories.map((s) => {
          const sid = bareId(s.PK);
          catName.set(sid, s.Name);
          return sid;
        }),
      );
    });
    return { catName, subIdsByMain };
  }, [tree]);

  // The parent main category + its ranges (sub-categories) for the sidebar nav.
  const { parentId, parentName, ranges } = useMemo(() => {
    if (!initialCat) return { parentId: undefined, parentName: undefined, ranges: [] };
    const asMain = tree.find((n) => bareId(n.category.PK) === initialCat);
    const main = asMain ?? tree.find((n) =>
      n.subcategories.some((s) => bareId(s.PK) === initialCat),
    );
    return {
      parentId: main ? bareId(main.category.PK) : undefined,
      parentName: main?.category.Name,
      ranges: main?.subcategories ?? [],
    };
  }, [tree, initialCat]);

  const countFor = (catId: string) =>
    products.filter((p) => p.CategoryId === catId).length;

  // Products scoped to the current category (main → its subs too).
  const scoped = useMemo(() => {
    if (!initialCat) return products;
    const set = new Set([initialCat, ...(subIdsByMain.get(initialCat) ?? [])]);
    return products.filter((p) => p.CategoryId && set.has(p.CategoryId));
  }, [products, initialCat, subIdsByMain]);

  const showAvail = useMemo(() => {
    let inStock = false;
    let outStock = false;
    scoped.forEach((p) => {
      if (p.IsAvailable === false) outStock = true;
      else inStock = true;
    });
    return inStock && outStock;
  }, [scoped]);

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let list = scoped.filter((p) => {
      if (terms.length) {
        const hay = [
          p.Name,
          p.Description ?? "",
          p.CategoryId ? catName.get(p.CategoryId) ?? "" : "",
          p.Specs ? Object.keys(p.Specs).join(" ") : "",
          p.Specs ? Object.values(p.Specs).join(" ") : "",
        ]
          .join(" ")
          .toLowerCase();
        if (!terms.every((t) => hay.includes(t))) return false;
      }
      if (avail === "in" && p.IsAvailable === false) return false;
      if (avail === "out" && p.IsAvailable !== false) return false;
      return true;
    });
    if (sort === "az") list = [...list].sort((a, b) => a.Name.localeCompare(b.Name));
    else if (sort === "za")
      list = [...list].sort((a, b) => b.Name.localeCompare(a.Name));
    else if (sort === "available")
      list = [...list].sort(
        (a, b) => Number(b.IsAvailable !== false) - Number(a.IsAvailable !== false),
      );
    return list;
  }, [scoped, query, sort, catName, avail]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  const activeExtras = (query.trim() ? 1 : 0) + (avail !== "all" ? 1 : 0);

  const clearAll = () => {
    setQuery("");
    setAvail("all");
    setPage(1);
  };

  const Sidebar = (
    <div className="space-y-6 rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(20,20,15,0.35)]">
      {/* Search */}
      <div className="flex items-center gap-2.5 rounded-full border border-ink/15 bg-white px-4 py-2.5 focus-within:border-ink/40">
        <Search className="size-4 shrink-0 text-ink/40" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search products…"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
          aria-label="Search products"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear">
            <X className="size-4 text-ink/40 hover:text-ink" />
          </button>
        )}
      </div>

      {/* Ranges (sibling sub-categories) */}
      {ranges.length > 0 && parentId && (
        <div>
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
            {parentName ? `Ranges in ${parentName}` : "Ranges"}
          </p>
          <ul className="space-y-0.5">
            {ranges.map((s) => {
              const sid = bareId(s.PK);
              const active = sid === initialCat;
              const n = countFor(sid);
              return (
                <li key={sid}>
                  <Link
                    href={`/products/${sid}?p=${parentId}`}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-ink text-paper"
                        : "text-ink/70 hover:bg-ink/5 hover:text-ink",
                    )}
                  >
                    <span className="truncate">{s.Name}</span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[11px] tabular-nums",
                        active ? "bg-white/20 text-paper" : "bg-ink/5 text-ink/45",
                      )}
                    >
                      {n}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Availability — only when there's a mix */}
      {showAvail && (
        <div>
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
            Availability
          </p>
          <div className="flex rounded-full border border-ink/12 p-0.5">
            {(
              [
                ["all", "All"],
                ["in", "Available"],
                ["out", "Out of stock"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  setAvail(val);
                  setPage(1);
                }}
                className={cn(
                  "flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-colors",
                  avail === val
                    ? "bg-ink text-paper"
                    : "text-ink/55 hover:text-ink",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeExtras > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 transition-colors hover:text-ink"
        >
          <X className="size-3.5" /> Clear
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-12">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mb-3 flex w-full items-center justify-between rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-medium text-ink lg:hidden"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-ink/50" />
            Browse &amp; search
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-ink/40 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
        <div className={cn(open ? "block" : "hidden lg:block")}>{Sidebar}</div>
      </aside>

      {/* Main */}
      <div>
        {/* Results bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
          <p className="text-sm text-ink/55">
            {total === 0 ? (
              "No products"
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-ink">
                  {start + 1}–{Math.min(start + perPage, total)}
                </span>{" "}
                of <span className="font-semibold text-ink">{total}</span> products
              </>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-ink/55">
              <span className="font-medium text-ink">Show</span>
              {PAGE_SIZES.map((n, i) => (
                <span key={n} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-ink/20">/</span>}
                  <button
                    type="button"
                    onClick={() => {
                      setPerPage(n);
                      setPage(1);
                    }}
                    className={cn(
                      "tabular-nums transition-colors",
                      perPage === n
                        ? "font-semibold text-ink"
                        : "text-ink/45 hover:text-ink",
                    )}
                  >
                    {n}
                  </button>
                </span>
              ))}
            </div>

            <div className="hidden items-center gap-1 lg:flex">
              <ViewBtn active={cols === 3} onClick={() => setCols(3)} label="3 columns">
                <LayoutGrid className="size-4" />
              </ViewBtn>
              <ViewBtn active={cols === 4} onClick={() => setCols(4)} label="4 columns">
                <Grid3x3 className="size-4" />
              </ViewBtn>
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as Sort);
                  setPage(1);
                }}
                className="appearance-none rounded-full border border-ink/15 bg-white py-2 pl-4 pr-9 text-sm font-medium text-ink outline-none focus:border-ink/40"
              >
                <option value="default">Default sorting</option>
                <option value="az">Name: A–Z</option>
                <option value="za">Name: Z–A</option>
                <option value="available">Availability</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
            </div>
          </div>
        </div>

        {pageItems.length > 0 ? (
          <>
            <div
              className={cn(
                "grid grid-cols-2 gap-4 sm:gap-5",
                cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-3 2xl:grid-cols-4",
              )}
            >
              {pageItems.map((p, i) => (
                <ProductCard
                  key={p.PK}
                  product={p}
                  priority={i < 4}
                  eyebrow={p.CategoryId ? catName.get(p.CategoryId) : undefined}
                />
              ))}
            </div>

            {pageCount > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1.5">
                <PageBtn
                  disabled={current === 1}
                  onClick={() => setPage(current - 1)}
                  label="Previous page"
                >
                  <ChevronLeft className="size-4" />
                </PageBtn>
                {Array.from({ length: pageCount }, (_, i) => i + 1)
                  .filter(
                    (n) => n === 1 || n === pageCount || Math.abs(n - current) <= 1,
                  )
                  .map((n, idx, arr) => (
                    <span key={n} className="flex items-center">
                      {idx > 0 && n - arr[idx - 1] > 1 && (
                        <span className="px-1 text-ink/30">…</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setPage(n)}
                        className={cn(
                          "grid size-10 place-items-center rounded-full text-sm font-medium tabular-nums transition-colors",
                          n === current
                            ? "bg-ink text-paper"
                            : "border border-ink/15 text-ink hover:bg-ink/5",
                        )}
                      >
                        {n}
                      </button>
                    </span>
                  ))}
                <PageBtn
                  disabled={current === pageCount}
                  onClick={() => setPage(current + 1)}
                  label="Next page"
                >
                  <ChevronRight className="size-4" />
                </PageBtn>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-3xl border border-ink/10 bg-paper-2 p-12 text-center">
            <p className="text-ink/60">
              No products match your search{query ? ` “${query.trim()}”` : ""}.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-5 inline-flex h-11 items-center rounded-full border border-ink/20 px-6 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ViewBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "grid size-9 place-items-center rounded-lg transition-colors",
        active ? "bg-ink text-paper" : "text-ink/45 hover:bg-ink/5 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function PageBtn({
  disabled,
  onClick,
  label,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
