import { NextResponse } from "next/server";
import { forwardLead } from "@/lib/api";
import type { LeadPayload } from "@/lib/catalog-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clamp = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : undefined;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  const raw = body as Partial<LeadPayload>;
  const contact = raw?.ContactData ?? ({} as LeadPayload["ContactData"]);

  const name = clamp(contact.Name, 120);
  const email = clamp(contact.Email, 200);

  // Server-side validation — never trust the client.
  if (!name || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please provide a valid name and email." },
      { status: 422 },
    );
  }

  const payload: LeadPayload = {
    LeadType: raw.LeadType === "PRODUCT_SPECIFIC" ? "PRODUCT_SPECIFIC" : "GENERAL",
    ProductId: clamp(raw.ProductId, 100),
    ContactData: {
      Name: name,
      Email: email,
      Phone: clamp(contact.Phone, 40),
      CompanyName: clamp(contact.CompanyName, 160),
      Message: clamp(contact.Message, 2000),
    },
  };

  const result = await forwardLead(payload);
  return NextResponse.json(
    { ok: result.ok, message: result.message },
    { status: result.ok ? 200 : result.status || 502 },
  );
}
