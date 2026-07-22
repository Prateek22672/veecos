"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Purges the server-side catalogue cache and re-fetches this page, so newly
 * added products/categories or updated cover images show up immediately
 * instead of waiting out the ISR window.
 */
export function RefreshCatalogButton({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/refresh-catalog", { method: "POST" });
    } catch {
      // Best-effort — router.refresh() still re-renders with whatever is cached.
    }
    router.refresh();
    // Give the re-render a moment to land before releasing the spin state.
    setTimeout(() => setBusy(false), 600);
  };

  return (
    <button
      type="button"
      onClick={refresh}
      disabled={busy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3.5 py-2 text-xs font-medium text-ink/70 transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-60",
        className,
      )}
    >
      <RefreshCw className={cn("size-3.5", busy && "animate-spin")} />
      {busy ? "Refreshing…" : "Refresh"}
    </button>
  );
}
