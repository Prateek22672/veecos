import type { LeadPayload } from "./catalog-types";

export type { LeadPayload };

/**
 * Submit a lead from the browser. This posts to our OWN server route
 * (`/api/leads`), which forwards to the backend — the client never talks to the
 * backend API directly, so the endpoint is never exposed in the bundle.
 */
export async function submitLead(
  payload: LeadPayload,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => null);
    return {
      ok: res.ok && json?.ok !== false,
      message: json?.message,
    };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
