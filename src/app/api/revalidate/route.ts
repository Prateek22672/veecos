import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * On-demand cache busting. The admin panel calls this after creating/editing a
 * product or category so changes appear on the site instantly — without making
 * every visitor re-fetch the backend on every request.
 *
 * Auth: send the shared secret as `x-revalidate-secret` header or `?secret=`.
 * Set REVALIDATE_SECRET in the environment; if unset the endpoint is disabled.
 *
 *   curl -X POST https://www.vce.co.in/api/revalidate \
 *        -H "x-revalidate-secret: <SECRET>"
 */
function authorize(req: NextRequest): boolean {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) return false; // disabled until a secret is configured
  const provided =
    req.headers.get("x-revalidate-secret") ??
    new URL(req.url).searchParams.get("secret");
  return provided === expected;
}

function handle(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 },
    );
  }
  // Webhook-style instant purge: expire now so the next request gets fresh data
  // (the recommended form for external callers in Next 16).
  revalidateTag(CATALOG_TAG, { expire: 0 });
  return NextResponse.json({ ok: true, revalidated: CATALOG_TAG });
}

export async function POST(req: NextRequest) {
  return handle(req);
}

// GET allowed too, so a simple admin "Refresh site" link/button works.
export async function GET(req: NextRequest) {
  return handle(req);
}
