"use client";

import { useEffect } from "react";

export interface CatalogDebugInfo {
  page: string;
  categoriesDiscoverable: number;
  productsTotal: number;
  productsBrowsable: number;
  unreachableCategoryIds: Record<string, number>;
  endpoints: string[];
}

/**
 * Logs what the server actually fetched for this page into the BROWSER
 * console, so the catalogue can be debugged from a normal browser session
 * without server log access.
 *
 * Always logs a one-line summary; expands to a full table when anything is
 * unreachable. `window.__veecos` exposes the same data for poking at.
 */
export function CatalogDebug({ info }: { info: CatalogDebugInfo }) {
  useEffect(() => {
    const hidden = info.productsTotal - info.productsBrowsable;
    const style = hidden > 0 ? "color:#c0392b;font-weight:600" : "color:#1e8449;font-weight:600";

    console.groupCollapsed(
      `%c[veecos] ${info.page}: ${info.productsBrowsable}/${info.productsTotal} products browsable by category`,
      style,
    );
    console.log("API endpoints called for this page:");
    info.endpoints.forEach((e) => console.log("   " + e));
    console.log(`categories discoverable: ${info.categoriesDiscoverable}`);

    const entries = Object.entries(info.unreachableCategoryIds);
    if (entries.length) {
      console.warn(
        `${hidden} product(s) reference ${entries.length} CategoryId(s) the backend never returns ` +
          `from GET /categories or GET /categories/{root}/subcategories — they cannot be browsed by category:`,
      );
      console.table(
        entries.map(([id, count]) => ({ unreachableCategoryId: id, products: count })),
      );
      console.log(
        "Full raw API responses → /api/debug/catalog   (summary only → /api/debug/catalog?compact=1)",
      );
    } else {
      console.log("All products are reachable by category.");
    }
    console.groupEnd();

    (window as unknown as { __veecos?: CatalogDebugInfo }).__veecos = info;
  }, [info]);

  return null;
}
