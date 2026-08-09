import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Backs the "Refresh" button on the products page — purges the catalogue
 * cache so the next render pulls straight from the backend.
 *
 * Unlike /api/revalidate (the admin webhook, secret-gated) this is safe to
 * expose unauthenticated: it only expires our own cache, has no side effects
 * on the backend, and the worst case is one extra upstream fetch.
 */
export async function POST() {
  revalidateTag(CATALOG_TAG, { expire: 0 });
  return NextResponse.json({ ok: true, revalidated: CATALOG_TAG });
}
