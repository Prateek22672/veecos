"use client";

import { useEffect } from "react";

export interface ApiCallEntry {
  method: string;
  endpoint: string;
  url: string;
  status: number | "ERROR";
  ms: number;
  attempts: number;
  response: unknown;
  error?: string;
}

/**
 * Prints every backend call made while rendering this page — endpoint, URL,
 * HTTP status, timing and the full response body — into the BROWSER console,
 * so the API can be inspected from a normal browser session with no server
 * log access.
 *
 * Also exposed as `window.__veecosApi` for poking at in the console.
 */
export function ApiConsoleLog({
  page,
  calls,
}: {
  page: string;
  calls: ApiCallEntry[];
}) {
  useEffect(() => {
    const failed = calls.filter(
      (c) => c.status === "ERROR" || (typeof c.status === "number" && c.status >= 400),
    );
    const totalMs = calls.reduce((sum, c) => sum + c.ms, 0);

    console.groupCollapsed(
      `%c[veecos-api]%c ${page} — ${calls.length} call${calls.length === 1 ? "" : "s"}, ${totalMs}ms${failed.length ? `, ${failed.length} failed` : ""}`,
      failed.length ? "color:#c0392b;font-weight:700" : "color:#1e8449;font-weight:700",
      "color:inherit;font-weight:400",
    );

    console.table(
      calls.map((c) => ({
        method: c.method,
        endpoint: c.endpoint,
        status: c.status,
        ms: c.ms,
        attempts: c.attempts,
      })),
    );

    calls.forEach((c, i) => {
      const bad =
        c.status === "ERROR" || (typeof c.status === "number" && c.status >= 400);
      console.groupCollapsed(
        `%c${i + 1}. ${c.method} ${c.endpoint} → ${c.status} (${c.ms}ms)`,
        bad ? "color:#c0392b" : "color:#555",
      );
      console.log("URL:", c.url);
      if (c.error) console.warn("error:", c.error);
      console.log("response:", c.response);
      console.groupEnd();
    });

    console.log(
      "%cTip:%c window.__veecosApi holds this data. Full raw bodies: /api/debug/catalog",
      "font-weight:700",
      "color:inherit",
    );
    console.groupEnd();

    (window as unknown as { __veecosApi?: ApiCallEntry[] }).__veecosApi = calls;
  }, [page, calls]);

  return null;
}
