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
  "https://vs1aoaj0t2.execute-api.ap-south-1.amazonaws.com";

const REQUEST_TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 2;

/**
 * Cache tag applied to every catalogue read. The admin panel can purge the
 * whole catalogue instantly by calling POST /api/revalidate (revalidateTag).
 */
export const CATALOG_TAG = "catalog";

/**
 * Default server cache lifetime for catalogue data (seconds). Pages serve from
 * the Data Cache for speed and refresh in the background after this window;
 * on-demand revalidation (the admin webhook) makes changes appear instantly.
 */
const CATALOG_REVALIDATE = 60;

type FetchOpts = {
  /** Override the cache lifetime (seconds) for this read. */
  revalidate?: number;
};

/**
 * Resilient JSON GET: per-attempt timeout + one retry on network/timeout error,
 * graceful null on failure (never throws → a flaky API can't crash a page).
 * Responses are cached in Next's Data Cache and tagged so they can be purged
 * on demand — fast pages without re-hitting the backend on every request.
 */
async function getJson<T>(
  path: string,
  opts: FetchOpts = {},
): Promise<ApiEnvelope<T> | null> {
  const cacheOpt = {
    next: {
      revalidate: opts.revalidate ?? CATALOG_REVALIDATE,
      tags: [CATALOG_TAG] as string[],
    },
  };

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        ...cacheOpt,
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) return null;
      return (await res.json()) as ApiEnvelope<T>;
    } catch {
      clearTimeout(timer);
      // Last attempt failed → degrade gracefully.
      if (attempt === MAX_ATTEMPTS) return null;
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
 * Child categories of a category id. The `/subcategories` endpoint returns
 * child categories AND direct products mixed together, so we keep only categories.
 */
export const getSubcategories = cache(
  async (id: string): Promise<Category[]> => {
    const json = await getJson<{ subcategories: Array<Category | Product> }>(
      `/categories/${encodeURIComponent(id)}/subcategories`,
    );
    const list = json?.data?.subcategories ?? [];
    return list.filter((c): c is Category => c.Type === "Category");
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

/** All globally-active products — the live catalogue. */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  const json = await getJson<{ products: Product[] }>("/products");
  return json?.data?.products ?? [];
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
  const subs = await Promise.all(
    roots.map((r) => getSubcategories(bareId(r.PK))),
  );
  return roots.map((category, i) => ({
    category,
    subcategories: subs[i] ?? [],
  }));
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

    const childLists = await Promise.all(
      roots.map((r) => getSubcategories(bareId(r.PK))),
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
