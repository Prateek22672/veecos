import { NextResponse } from "next/server";
import { debugCatalog } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Full catalogue debug dump — open /api/debug/catalog in a browser.
 *
 * Returns every backend call the site makes (endpoint, URL, HTTP status,
 * response time and the RAW response body), plus a summary of which
 * CategoryIds are unreachable and exactly which products they hide.
 *
 * Add ?compact=1 to omit the raw bodies and get only the summary.
 */
export async function GET(req: Request) {
  const compact = new URL(req.url).searchParams.get("compact") === "1";
  const dump = await debugCatalog();

  const body = compact
    ? {
        apiBase: dump.apiBase,
        calls: dump.calls.map(({ endpoint, url, status, ms }) => ({
          endpoint,
          url,
          status,
          ms,
        })),
        summary: dump.summary,
      }
    : dump;

  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store" },
  });
}
