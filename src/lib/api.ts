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
import { unstable_cache } from "next/cache";
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
 * Cache tag applied to every catalogue read. `revalidateTag(CATALOG_TAG)`
 * purges the whole catalogue at once — the admin panel calls
 * POST /api/revalidate after a save so changes go live immediately.
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
/*  Set VEECOS_API_DEBUG=1 to log every call (URL, status, timing).           */
/*  Live diagnostics without redeploying: /api/catalog-health (summary) and   */
/*  /api/debug/catalog (raw upstream responses, uncached).                    */
/* ------------------------------------------------------------------ */

const API_DEBUG = process.env.VEECOS_API_DEBUG === "1";

/** 5xx and 429 are transient — the same request can succeed moments later. */
const isRetryableStatus = (status: number) => status >= 500 || status === 429;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * How long a successful catalogue response may be reused (seconds).
 *
 * This is a FALLBACK, not the update mechanism: the admin panel should call
 * POST /api/revalidate after each save, which purges the CATALOG_TAG and makes
 * changes appear immediately. The TTL only bounds staleness if that webhook is
 * missed. Verify freshness any time at /api/catalog-health.
 */
const CATALOG_TTL_SECONDS = 300;

/**
 * Live, uncached GET with a per-attempt timeout. Retries network/timeout
 * errors and transient 5xx/429 responses with backoff.
 *
 * THROWS on definitive failure rather than returning null — that is what keeps
 * failures out of the cache layer above (see `getJson`). Never call directly.
 */
async function fetchJsonLive<T>(path: string): Promise<ApiEnvelope<T>> {
  const url = `${API_BASE}${path}`;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const started = Date.now();
    try {
      const res = await fetch(url, {
        // Bypass Next's fetch cache — caching is handled explicitly by the
        // wrapper below, so that only SUCCESSFUL responses are ever stored.
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (API_DEBUG) {
        console.log(
          `[veecos-api] GET ${path} → ${res.status} (${Date.now() - started}ms, attempt ${attempt})`,
        );
      }

      if (res.ok) return (await res.json()) as ApiEnvelope<T>;

      if (isRetryableStatus(res.status) && attempt < MAX_ATTEMPTS) {
        await sleep(150 * attempt);
        continue;
      }
      throw new Error(`GET ${path} failed with ${res.status}`);
    } catch (err) {
      clearTimeout(timer);
      if (attempt === MAX_ATTEMPTS) throw err;
      await sleep(150 * attempt);
    }
  }
  throw new Error(`GET ${path} exhausted ${MAX_ATTEMPTS} attempts`);
}

/**
 * Cached JSON GET.
 *
 * Successful responses are stored in Next's Data Cache under CATALOG_TAG for
 * CATALOG_TTL_SECONDS, so a page render costs ~zero upstream calls. Because
 * `fetchJsonLive` THROWS on failure, a 5xx/timeout is never written to the
 * cache — a transient blip can't freeze a broken page for the whole TTL
 * (negative caching), and the previously cached good value keeps serving.
 *
 * Returns null on definitive failure so callers degrade gracefully instead of
 * crashing the page.
 */
async function getJson<T>(path: string): Promise<ApiEnvelope<T> | null> {
  try {
    const read = unstable_cache(
      () => fetchJsonLive<T>(path),
      ["veecos-api", path],
      { revalidate: CATALOG_TTL_SECONDS, tags: [CATALOG_TAG] },
    );
    return await read();
  } catch (err) {
    console.warn(
      `[veecos-api] GET ${path} unavailable:`,
      err instanceof Error ? err.message : err,
    );
    return null;
  }
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
  /** Job title only (e.g. "Procurement Head"). Empty if not given. */
  role: string;
  /** Organisation only (e.g. "GITAM University"). Empty string if not given. */
  company: string;
  /** Admin-uploaded photo. Most testimonials won't have one — always optional. */
  avatarUrl?: string;
  /** 1–5. Undefined if the admin didn't set a rating. */
  rating?: number;
}

/** First non-empty string among the given keys (case/shape tolerant). */
function pickStr(o: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

/** A string value that's plausibly a URL (avatar field naming isn't fixed yet). */
function pickUrl(o: Record<string, unknown>, keys: string[]): string | undefined {
  const v = pickStr(o, keys);
  return v && /^https?:\/\//i.test(v) ? v : undefined;
}

function pickRating(o: Record<string, unknown>): number | undefined {
  const v = o.Rating ?? o.rating ?? o.Stars ?? o.stars;
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? Math.min(5, Math.max(1, Math.round(n))) : undefined;
}

/**
 * Live testimonials from the admin panel. Maps flexibly across possible field
 * names — confirmed live shape is { Name, Designation, Company, Content,
 * Rating, showThis }, but the avatar field name isn't confirmed yet since no
 * live record has used it, so several likely names are checked. Filters out
 * anything explicitly unapproved as a safety net (the endpoint already only
 * returns showThis: true). Returns [] if unavailable so the caller falls back
 * to the built-in set.
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
    .filter((o) => o.showThis !== false && o.ShowThis !== false)
    .map((o) => ({
      quote: pickStr(o, [
        "Content", "content", "quote", "Quote", "message", "Message",
        "text", "Text", "review", "Review", "Testimonial", "Feedback",
      ]),
      name: pickStr(o, [
        "Name", "name", "author", "Author", "clientName", "ClientName", "customer", "Customer",
      ]),
      role: pickStr(o, ["Designation", "designation", "Role", "role", "Title", "title"]),
      company: pickStr(o, [
        "Company", "company", "Organisation", "organisation", "Organization", "organization",
      ]),
      avatarUrl: pickUrl(o, [
        "Avatar", "avatar", "AvatarUrl", "avatarUrl", "AvatarURL",
        "Image", "image", "ImageUrl", "imageUrl", "Photo", "photo", "ProfileImage",
      ]),
      rating: pickRating(o),
    }))
    .filter((t) => t.quote.length > 0)
    .map((t) => ({ ...t, name: t.name || "Veecos Client" }));
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
