import { NextResponse, type NextRequest } from "next/server";

/**
 * HTTP Basic Auth for the SEO dashboard (/seo).
 *
 * The page is already `noindex` and disallowed in robots.txt, but that only
 * keeps it out of search results — the URL is still reachable by anyone who
 * knows it. This gates it on a username/password held in environment
 * variables, checked at the edge before the page renders.
 *
 * Set SEO_USER and SEO_PASSWORD in the host environment. If either is missing
 * the route is closed rather than left open, so a misconfiguration can never
 * silently publish the dashboard.
 */

const REALM = 'Basic realm="Veecos SEO", charset="UTF-8"';

function unauthorized(message = "Authentication required") {
  return new NextResponse(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": REALM,
      "Cache-Control": "no-store",
    },
  });
}

/** Constant-time-ish compare so a wrong password can't be guessed by timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function middleware(req: NextRequest) {
  const user = process.env.SEO_USER;
  const password = process.env.SEO_PASSWORD;

  // Fail closed: never serve the dashboard if credentials aren't configured.
  if (!user || !password) {
    return new NextResponse(
      "SEO dashboard is not configured. Set SEO_USER and SEO_PASSWORD in the environment.",
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const header = req.headers.get("authorization") ?? "";
  if (!header.toLowerCase().startsWith("basic ")) return unauthorized();

  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return unauthorized("Malformed credentials");
  }

  // Only split on the FIRST colon — passwords may contain colons.
  const sep = decoded.indexOf(":");
  if (sep === -1) return unauthorized("Malformed credentials");

  const okUser = safeEqual(decoded.slice(0, sep), user);
  const okPass = safeEqual(decoded.slice(sep + 1), password);
  if (!okUser || !okPass) return unauthorized("Invalid credentials");

  return NextResponse.next();
}

export const config = {
  matcher: ["/seo", "/seo/:path*"],
};
