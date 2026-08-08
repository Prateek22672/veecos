import { NextResponse } from "next/server";
import { getSearchItems } from "@/lib/api";

export const runtime = "nodejs";
// Caching disabled — always reflect the live catalogue.
export const dynamic = "force-dynamic";

// Lightweight catalogue index (categories + products) for the quote wizard.
export async function GET() {
  const items = await getSearchItems();
  return NextResponse.json({ items });
}
