import { NextResponse } from "next/server";
import { getSearchItems } from "@/lib/api";

export const runtime = "nodejs";
// Cached for speed (the wizard opens instantly); refreshed in the background and
// purged on demand alongside the rest of the catalogue.
export const revalidate = 60;

// Lightweight catalogue index (categories + products) for the quote wizard.
export async function GET() {
  const items = await getSearchItems();
  return NextResponse.json({ items });
}
