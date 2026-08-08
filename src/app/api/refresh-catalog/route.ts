import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Backs the "Refresh" button on the products page.
 *
 * Catalogue reads are no longer cached (every render fetches live data), so
 * there is nothing left to purge — the button's `router.refresh()` is what
 * actually re-renders with fresh data. This endpoint is kept so that call
 * still resolves, and as the place to re-add a purge if caching ever returns.
 */
export async function POST() {
  return NextResponse.json({ ok: true, cached: false });
}
