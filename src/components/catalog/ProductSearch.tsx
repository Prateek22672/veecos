"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, Box, FolderTree } from "lucide-react";
import { cn } from "@/lib/cn";

export type SearchItem = {
  kind: "category" | "product";
  id: string;
  name: string;
  href: string;
  context?: string;
};

/**
 * Basic catalogue search with live suggestions drawn ONLY from the real
 * categories + products mapped from the API.
 */
export function ProductSearch({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const matches = items.filter((i) => i.name.toLowerCase().includes(query));
    // categories first, then products
    return matches
      .sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "category" ? -1 : 1))
      .slice(0, 8);
  }, [q, items]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div ref={boxRef} className="relative">
      <div className="flex items-center gap-2.5 rounded-full border border-ink/15 bg-white px-4 py-2.5 transition-colors focus-within:border-ink/40">
        <Search className="size-4 shrink-0 text-ink/40" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products & categories…"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
          aria-label="Search the catalogue"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setOpen(false);
            }}
            aria-label="Clear search"
            className="shrink-0 text-ink/40 transition-colors hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {open && q.trim() && (
        <div className="absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_24px_60px_-28px_rgba(20,20,15,0.4)]">
          {results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((r) => (
                <li key={`${r.kind}-${r.id}`}>
                  <Link
                    href={r.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-ink/4"
                  >
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-lg",
                        r.kind === "category"
                          ? "bg-ink/6 text-ink"
                          : "bg-ink text-paper",
                      )}
                    >
                      {r.kind === "category" ? (
                        <FolderTree className="size-4" />
                      ) : (
                        <Box className="size-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">
                        {r.name}
                      </span>
                      <span className="block truncate text-[11px] uppercase tracking-[0.12em] text-ink/40">
                        {r.kind === "category"
                          ? r.context
                            ? `Sub-category · ${r.context}`
                            : "Category"
                          : r.context
                            ? `Product · ${r.context}`
                            : "Product"}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-ink/50">
              No matches for “{q.trim()}”.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
