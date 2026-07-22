import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Same-site "Refresh" button for the products page. Unlike /api/revalidate
 * (the admin-panel webhook, secret-gated), this is a cheap, idempotent cache
 * purge with no side effects — safe to expose without a secret so visitors
 * can pull the latest categories/products/images without waiting out the
 * ISR window.
 */
function handle() {
  revalidateTag(CATALOG_TAG, { expire: 0 });
  return NextResponse.json({ ok: true, revalidated: CATALOG_TAG });
}

export async function POST() {
  return handle();
}
