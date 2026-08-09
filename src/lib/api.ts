/**
 * Server-only client for the Veecos serverless API (API Gateway + Lambda + DynamoDB).
 *
 * `server-only` makes the build fail if this module is ever imported from a
 * client component — guaranteeing the backend base URL is never shipped to the
 * browser. Client components must use `@/lib/catalog-types` (pure helpers/types)
 * and `@/lib/leads` (submits through our own /api route) instead.
 */
import "server-only";
import { cache } from "react";
import {
  bareId,
  prettify,
  type ApiEnvelope,
  type Category,
  type Product,
  type CatalogNode,
  type LeadPayload,
} from "./catalog-types";

// Re-export so existing server imports (pages, sitemap) keep working.
export { bareId, prettify };
export type { ApiEnvelope, Category, Product, CatalogNode, LeadPayload };

/** Prefer a server-only env var; fall back to the public one, then the known URL. */
export const API_BASE =
  process.env.API_BASE ??
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://mbevr3vs87.execute-api.ap-south-1.amazonaws.com";

const REQUEST_TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 3;

/**
 * Max simultaneous upstream requests. The catalogue tree needs one
 * /subcategories call per root category; firing all of them at once made the
 * API Gateway/Lambda backend return sporadic 503s, which silently emptied that
 * category's sub-categories for the whole render. Batching keeps it stable.
 */
const MAX_CONCURRENCY = 4;

/** Promise.all with a concurrency cap, preserving input order. */
async function mapLimit<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

/**
 * Kept only so the existing /api/revalidate + /api/refresh-catalog routes still
 * compile. Catalogue reads are NO LONGER cached (see getJson below), so purging
 * is a no-op — every page render reads live data straight from the backend.
 */
export const CATALOG_TAG = "catalog";

/* ------------------------------------------------------------------ */
/*  ENDPOINT MAP — every backend URL this site calls, in one place.     */
/*  If catalogue data ever goes missing again, check these first:       */
/*                                                                      */
/*   GET /categories                       → root categories ONLY       */
/*                                           (ParentId === "ROOT")      */
/*   GET /categories/{id}/subcategories    → child categories AND       */
/*                                           direct products, mixed     */
/*   GET /categories/{id}/products         → products under a category  */
/*   GET /products                         → all products, PAGINATED    */
/*                                           10/page via ?lastKey=      */
/*   GET /products/{id}                    → one product (full detail)  */
/*   GET /testimonials                     → admin-managed testimonials */
/*   POST /leads                           → enquiry submission         */
/*                                                                      */
/*  Every call is logged: to the server console, and (via getApiCallLog)      */
/*  forwarded to the browser console by <ApiConsoleLog />.                    */
/*  Set VEECOS_API_DEBUG=1 to also dump full response bodies server-side.     */
/* ------------------------------------------------------------------ */

const API_DEBUG = process.env.VEECOS_API_DEBUG === "1";

/** 5xx and 429 are transient — the same request can succeed moments later. */
const isRetryableStatus = (status: number) => status >= 500 || status === 429;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/*  Per-request API call log — every request/response, for the console. */
/* ------------------------------------------------------------------ */

export interface ApiCallLog {
  method: string;
  endpoint: string;
  url: string;
  status: number | "ERROR";
  ms: number;
  attempts: number;
  /** Response body (long strings trimmed so the console stays readable). */
  response: unknown;
  error?: string;
}

/**
 * Request-scoped collector. React `cache()` returns the same array for the
 * whole render pass of one request, so every fetch made while building a page
 * lands in one list that the page can hand to the browser.
 */
const apiCallLog = cache((): ApiCallLog[] => []);

/** Every backend call made while rendering the current request, in order. */
export function getApiCallLog(): ApiCallLog[] {
  return apiCallLog();
}

/**
 * Trim very long strings (product descriptions are multi-KB HTML) so the log
 * stays readable and the payload sent to the browser stays small. Structure and
 * field names are preserved exactly — only long string VALUES are shortened.
 */
function trimForLog(value: unknown, depth = 0): unknown {
  if (typeof value === "string") {
    return value.length > 200
      ? `${value.slice(0, 200)}… [${value.length} chars total]`
      : value;
  }
  if (Array.isArray(value)) {
    if (depth > 6) return `[Array(${value.length})]`;
    return value.map((v) => trimForLog(v, depth + 1));
  }
  if (value && typeof value === "object") {
    if (depth > 6) return "[Object]";
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        trimForLog(v, depth + 1),
      ]),
    );
  }
  return value;
}

/**
 * Resilient JSON GET: per-attempt timeout, retries on network/timeout errors
 * AND on transient 5xx/429 responses (with backoff), graceful null only after
 * every attempt fails — so a flaky API can't crash a page or silently blank
 * out a section.
 *
 * CACHING IS DISABLED (`cache: "no-store"`). Every render fetches live data so
 * anything the admin panel adds or edits shows up immediately, with no stale
 * window. React `cache()` on the exported readers still de-dupes identical
 * calls *within a single request* — that is request-scoped memoisation, not a
 * cross-request cache, so it never serves stale data.
 */
async function getJson<T>(path: string): Promise<ApiEnvelope<T> | null> {
  const url = `${API_BASE}${path}`;
  const startedAll = Date.now();

  /** Record the call for the server console AND the browser console. */
  const record = (
    status: number | "ERROR",
    attempts: number,
    response: unknown,
    error?: string,
  ) => {
    const ms = Date.now() - startedAll;
    const entry: ApiCallLog = {
      method: "GET",
      endpoint: path,
      url,
      status,
      ms,
      attempts,
      response: trimForLog(response),
      ...(error ? { error } : {}),
    };
    apiCallLog().push(entry);

    const line = `[veecos-api] GET ${path} → ${status} (${ms}ms, ${attempts} attempt${attempts > 1 ? "s" : ""})`;
    if (status === "ERROR" || (typeof status === "number" && status >= 400)) {
      console.warn(line, error ?? "");
    } else {
      console.log(line);
    }
    if (API_DEBUG) console.dir(entry.response, { depth: null });
    return entry;
  };

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const json = (await res.json()) as ApiEnvelope<T>;
        record(res.status, attempt, json);
        return json;
      }

      // Transient upstream failure → back off and try again.
      if (isRetryableStatus(res.status) && attempt < MAX_ATTEMPTS) {
        console.warn(
          `[veecos-api] GET ${path} → ${res.status}, retrying (attempt ${attempt}/${MAX_ATTEMPTS})`,
        );
        await sleep(150 * attempt);
        continue;
      }

      const body = await res.text().catch(() => "");
      record(res.status, attempt, body, `HTTP ${res.status}`);
      return null;
    } catch (err) {
      clearTimeout(timer);
      const message = err instanceof Error ? err.message : String(err);
      if (attempt === MAX_ATTEMPTS) {
        record("ERROR", attempt, null, message);
        return null;
      }
      await sleep(150 * attempt);
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Reads — wrapped in React cache() so repeated calls within a single  */
/*  request (e.g. layout + page) share ONE fetch.                       */
/* ------------------------------------------------------------------ */

/** Top-level (root) categories. */
export const getRootCategories = cache(async (): Promise<Category[]> => {
  const json = await getJson<{ categories: Category[] }>("/categories");
  return json?.data?.categories ?? [];
});

/**
 * Is this mixed-children record a category?
 *
 * The `/subcategories` endpoint returns child categories AND direct products
 * together. `Type` is NOT reliable: only records written by the newest admin
 * code carry `Type: "Category"` — older rows omit it entirely. The `PK` prefix
 * (`CATEGORY#…` vs `PRODUCT#…`) is present on every record, so key off that and
 * treat `Type` as a fallback only.
 */
function isCategoryRecord(record: Category | Product): record is Category {
  if (typeof record?.PK === "string") {
    if (record.PK.startsWith("CATEGORY#")) return true;
    if (record.PK.startsWith("PRODUCT#")) return false;
  }
  return record?.Type === "Category";
}

/** Child categories of a category id (products in the same payload are dropped). */
export const getSubcategories = cache(
  async (id: string): Promise<Category[]> => {
    const json = await getJson<{ subcategories: Array<Category | Product> }>(
      `/categories/${encodeURIComponent(id)}/subcategories`,
    );
    const list = json?.data?.subcategories ?? [];
    return list.filter(isCategoryRecord);
  },
);

/** Products that live directly under a category id. */
export const getCategoryProducts = cache(
  async (id: string): Promise<Product[]> => {
    const json = await getJson<{ products: Product[] }>(
      `/categories/${encodeURIComponent(id)}/products`,
    );
    return json?.data?.products ?? [];
  },
);

/**
 * All globally-active products — the live catalogue.
 * The backend paginates (10/page, `lastKey` cursor), so we follow the cursor
 * until exhausted. This runs server-side once per cache window (not per user),
 * so even large catalogues cost a handful of upstream calls per minute.
 */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  const all: Product[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined;

  // Safety cap: 60 pages ≈ 600 products. Raise if the catalogue outgrows it.
  for (let i = 0; i < 60; i++) {
    const path = cursor
      ? `/products?lastKey=${encodeURIComponent(cursor)}`
      : "/products";
    const json = await getJson<{
      products: Product[];
      hasMore?: boolean;
      lastKey?: unknown;
    }>(path);
    const batch = json?.data?.products ?? [];
    for (const p of batch) {
      if (!seen.has(p.PK)) {
        seen.add(p.PK);
        all.push(p);
      }
    }
    const lk = json?.data?.lastKey;
    if (!json?.data?.hasMore || lk == null || batch.length === 0) break;
    cursor = typeof lk === "string" ? lk : JSON.stringify(lk);
  }
  return all;
});

/** Full detail for a single product id. */
export const getProduct = cache(
  async (id: string): Promise<Product | null> => {
    const json = await getJson<Product>(`/products/${encodeURIComponent(id)}`);
    return json?.data ?? null;
  },
);

/** Build the catalogue tree (root categories + their direct sub-categories). */
export const getCatalogTree = cache(async (): Promise<CatalogNode[]> => {
  const roots = await getRootCategories();
  const subs = await mapLimit(roots, MAX_CONCURRENCY, (r) =>
    getSubcategories(bareId(r.PK)),
  );
  return roots.map((category, i) => ({
    category,
    subcategories: subs[i] ?? [],
  }));
});

/* ------------------------------------------------------------------ */
/*  Debug — raw upstream responses, for /api/debug/catalog.             */
/* ------------------------------------------------------------------ */

export interface DebugCall {
  endpoint: string;
  url: string;
  status: number | "ERROR";
  ms: number;
  /** Raw response body exactly as the backend returned it. */
  response: unknown;
  error?: string;
}

/** One raw, uncached GET with timing — no parsing/filtering applied. */
async function rawGet(path: string): Promise<DebugCall> {
  const url = `${API_BASE}${path}`;
  const started = Date.now();
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const text = await res.text();
    let parsed: unknown = text;
    try {
      parsed = JSON.parse(text);
    } catch {
      /* keep raw text if it isn't JSON */
    }
    return {
      endpoint: `GET ${path}`,
      url,
      status: res.status,
      ms: Date.now() - started,
      response: parsed,
    };
  } catch (err) {
    return {
      endpoint: `GET ${path}`,
      url,
      status: "ERROR",
      ms: Date.now() - started,
      response: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Walks every catalogue endpoint the site uses and returns the raw responses,
 * so the exact upstream payloads can be inspected in one place.
 */
export async function debugCatalog(): Promise<{
  apiBase: string;
  calls: DebugCall[];
  summary: Record<string, unknown>;
}> {
  const calls: DebugCall[] = [];

  // 1) Root categories
  const rootsCall = await rawGet("/categories");
  calls.push(rootsCall);
  const roots =
    ((rootsCall.response as ApiEnvelope<{ categories: Category[] }> | null)
      ?.data?.categories ?? []);

  // 2) Children of each root
  const knownCats = new Set<string>();
  roots.forEach((r) => knownCats.add(bareId(r.PK)));
  for (const r of roots) {
    const call = await rawGet(
      `/categories/${encodeURIComponent(bareId(r.PK))}/subcategories`,
    );
    call.endpoint += `   (${r.Name})`;
    calls.push(call);
    const kids =
      ((call.response as ApiEnvelope<{
        subcategories: Array<Category | Product>;
      }> | null)?.data?.subcategories ?? []);
    kids.filter(isCategoryRecord).forEach((k) => knownCats.add(bareId(k.PK)));
  }

  // 3) Every page of /products (follows the lastKey cursor)
  const products: Product[] = [];
  let cursor: string | undefined;
  for (let i = 0; i < 60; i++) {
    const path = cursor
      ? `/products?lastKey=${encodeURIComponent(cursor)}`
      : "/products";
    const call = await rawGet(path);
    call.endpoint = `GET /products  (page ${i + 1})`;
    calls.push(call);
    const data = (call.response as ApiEnvelope<{
      products: Product[];
      hasMore?: boolean;
      lastKey?: unknown;
    }> | null)?.data;
    const batch = data?.products ?? [];
    products.push(...batch);
    const lk = data?.lastKey;
    if (!data?.hasMore || lk == null || batch.length === 0) break;
    cursor = typeof lk === "string" ? lk : JSON.stringify(lk);
  }

  const unreachable: Record<string, string[]> = {};
  for (const p of products) {
    const cid = p.CategoryId;
    if (!cid || !knownCats.has(cid)) {
      const key = cid ?? "(no CategoryId)";
      (unreachable[key] ??= []).push(p.Name);
    }
  }

  return {
    apiBase: API_BASE,
    calls,
    summary: {
      rootCategories: roots.length,
      categoriesDiscoverable: knownCats.size,
      productsTotal: products.length,
      productsBrowsable:
        products.length -
        Object.values(unreachable).reduce((a, b) => a + b.length, 0),
      unreachableCategories: Object.fromEntries(
        Object.entries(unreachable).map(([id, names]) => [
          id,
          { count: names.length, products: names },
        ]),
      ),
    },
  };
}

/**
 * Catalogue health check.
 *
 * A product is only browsable if its `CategoryId` matches a category the
 * backend actually returns — i.e. a root from GET /categories, or a child from
 * GET /categories/{root}/subcategories. If the admin panel writes a product
 * against a category that neither endpoint lists (e.g. the category row's
 * GSI1PK / ParentId link is missing), that product becomes unreachable by
 * browsing. This surfaces exactly that, so the gap is visible instead of silent.
 */
export const getCatalogHealth = cache(async () => {
  const [tree, products] = await Promise.all([
    getCatalogTree(),
    getAllProducts(),
  ]);

  const known = new Set<string>();
  tree.forEach((n) => {
    known.add(bareId(n.category.PK));
    n.subcategories.forEach((s) => known.add(bareId(s.PK)));
  });

  const unreachable = new Map<string, number>();
  for (const p of products) {
    const cid = p.CategoryId;
    if (!cid || !known.has(cid)) {
      const key = cid ?? "(no CategoryId)";
      unreachable.set(key, (unreachable.get(key) ?? 0) + 1);
    }
  }

  const hiddenCount = [...unreachable.values()].reduce((a, b) => a + b, 0);
  return {
    apiBase: API_BASE,
    categoriesVisible: known.size,
    productsTotal: products.length,
    productsBrowsable: products.length - hiddenCount,
    productsUnreachableByCategory: hiddenCount,
    unreachableCategoryIds: Object.fromEntries(unreachable),
  };
});

/**
 * Resolve a category by id by scanning the root categories and their children
 * (there is no get-category-by-id endpoint). Returns null if not found.
 */
export const resolveCategory = cache(
  async (id: string): Promise<Category | null> => {
    const roots = await getRootCategories();
    const inRoot = roots.find((c) => bareId(c.PK) === id);
    if (inRoot) return inRoot;

    const childLists = await mapLimit(roots, MAX_CONCURRENCY, (r) =>
      getSubcategories(bareId(r.PK)),
    );
    for (const list of childLists) {
      const found = list.find((c) => bareId(c.PK) === id);
      if (found) return found;
    }
    return null;
  },
);

/** Flat search index of every category + product, for the catalogue search box. */
export interface SearchIndexItem {
  kind: "category" | "product";
  id: string;
  name: string;
  href: string;
  context?: string;
}

export const getSearchItems = cache(async (): Promise<SearchIndexItem[]> => {
  const [tree, products] = await Promise.all([
    getCatalogTree(),
    getAllProducts(),
  ]);

  const catName = new Map<string, string>();
  tree.forEach((n) => {
    catName.set(bareId(n.category.PK), n.category.Name);
    n.subcategories.forEach((s) => catName.set(bareId(s.PK), s.Name));
  });

  const items: SearchIndexItem[] = [];
  tree.forEach((n) => {
    const rid = bareId(n.category.PK);
    items.push({
      kind: "category",
      id: rid,
      name: n.category.Name,
      href: `/products/${rid}`,
    });
    n.subcategories.forEach((s) => {
      const sid = bareId(s.PK);
      items.push({
        kind: "category",
        id: sid,
        name: s.Name,
        href: `/products/${sid}?p=${rid}`,
        context: n.category.Name,
      });
    });
  });
  products.forEach((p) => {
    const pid = bareId(p.PK);
    items.push({
      kind: "product",
      id: pid,
      name: p.Name.trim(),
      href: `/product/${pid}`,
      context: p.CategoryId ? catName.get(p.CategoryId) : undefined,
    });
  });
  return items;
});

/* ------------------------------------------------------------------ */
/*  Testimonials — managed from the admin panel (GET /testimonials).    */
/* ------------------------------------------------------------------ */

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/** First non-empty string among the given keys (case/shape tolerant). */
function pickStr(o: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

/**
 * Live testimonials from the admin panel. Maps flexibly across possible field
 * names. Returns [] if the endpoint is empty/unavailable so the caller can fall
 * back to the built-in set.
 */
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const json = await getJson<unknown>("/testimonials");
  const data = json?.data as unknown;
  const list: Record<string, unknown>[] = Array.isArray(data)
    ? (data as Record<string, unknown>[])
    : Array.isArray((data as { testimonials?: unknown[] })?.testimonials)
      ? ((data as { testimonials: Record<string, unknown>[] }).testimonials)
      : [];

  return list
    .map((o) => ({
      quote: pickStr(o, [
        "quote", "Quote", "message", "Message", "text", "Text",
        "review", "Review", "content", "Content", "Testimonial", "Feedback",
      ]),
      name: pickStr(o, [
        "name", "Name", "author", "Author", "clientName", "ClientName", "customer", "Customer",
      ]),
      role: pickStr(o, [
        "role", "Role", "designation", "Designation", "company", "Company",
        "title", "Title", "organisation", "Organisation", "organization", "Organization",
      ]),
    }))
    .filter((t) => t.quote.length > 0)
    .map((t) => ({
      quote: t.quote,
      name: t.name || "Veecos Client",
      role: t.role || "Verified customer",
    }));
});

/* ------------------------------------------------------------------ */
/*  Leads — server-side forward (called from the /api/leads route).     */
/* ------------------------------------------------------------------ */

export async function forwardLead(
  payload: LeadPayload,
): Promise<{ ok: boolean; message?: string; status: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const json = await res.json().catch(() => null);
    return {
      ok: res.ok && json?.success !== false,
      message: json?.message,
      status: res.status,
    };
  } catch {
    clearTimeout(timer);
    return { ok: false, message: "Upstream request failed.", status: 502 };
  }
}
