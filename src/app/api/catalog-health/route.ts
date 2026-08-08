import { NextResponse } from "next/server";
import { getCatalogHealth } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Live catalogue diagnostics — open /api/catalog-health in a browser.
 *
 * Reports how many products the site can actually reach by browsing, and lists
 * any CategoryId that products reference but the backend never returns from
 * GET /categories or GET /categories/{root}/subcategories. A non-empty
 * `unreachableCategoryIds` means those categories' parent links are broken in
 * the backend and their products can't be browsed by category.
 */
export async function GET() {
  const health = await getCatalogHealth();
  return NextResponse.json(health, {
    headers: { "Cache-Control": "no-store" },
  });
}
