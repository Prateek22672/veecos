/**
 * Typed client for the Veecos serverless API (API Gateway + Lambda + DynamoDB).
 * All read calls are server-side; products/categories are fetched with ISR.
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://vs1aoaj0t2.execute-api.ap-south-1.amazonaws.com";

/** Seconds to cache catalog reads (ISR). */
const CATALOG_REVALIDATE = 300;

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Category {
  PK: string;
  SK: string;
  Name: string;
  Slug: string;
  Type: "Category";
  ParentId?: string;
  GSI1PK?: string;
  GSI1SK?: string;
}

export interface Product {
  PK: string;
  SK: string;
  Name: string;
  Slug: string;
  Type: "Product";
  Images?: string[];
  Specs?: Record<string, string>;
  IsAvailable?: boolean;
  IsCustomizable?: boolean;
  Description?: string;
  GSI1PK?: string;
}

/** Strip the `ENTITY#` prefix from a PK/SK to get the bare id used in URLs. */
export function bareId(pkOrSk: string): string {
  return pkOrSk.includes("#") ? pkOrSk.split("#").slice(1).join("#") : pkOrSk;
}

async function getJson<T>(
  path: string,
  revalidate = CATALOG_REVALIDATE,
): Promise<ApiEnvelope<T> | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as ApiEnvelope<T>;
  } catch {
    // Network/API failure should degrade gracefully, never crash a page.
    return null;
  }
}

/** Top-level (root) categories. */
export async function getRootCategories(): Promise<Category[]> {
  const json = await getJson<{ categories: Category[] }>("/categories");
  return json?.data?.categories ?? [];
}

/** Child categories of a given category id. */
export async function getSubcategories(id: string): Promise<Category[]> {
  const json = await getJson<{ subcategories: Category[] }>(
    `/categories/${encodeURIComponent(id)}/subcategories`,
  );
  return json?.data?.subcategories ?? [];
}

/** Products that live directly under a category id. */
export async function getCategoryProducts(id: string): Promise<Product[]> {
  const json = await getJson<{ products: Product[] }>(
    `/categories/${encodeURIComponent(id)}/products`,
  );
  return json?.data?.products ?? [];
}

/** Full detail for a single product id. */
export async function getProduct(id: string): Promise<Product | null> {
  const json = await getJson<Product>(`/products/${encodeURIComponent(id)}`);
  return json?.data ?? null;
}

/** Turn a slug/id into a readable label, e.g. "gas-cooking-ranges" → "Gas Cooking Ranges". */
export function prettify(value: string): string {
  return bareId(value)
    .replace(/^cat[_-]/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * There is no get-category-by-id endpoint, so resolve a category's name by
 * scanning the root categories and their direct children. Returns the
 * Category object if found, otherwise null.
 */
export async function resolveCategory(id: string): Promise<Category | null> {
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
}

/* ------------------------------------------------------------------ */
/*  Leads (client-side POST from the contact form)                     */
/* ------------------------------------------------------------------ */

export interface LeadPayload {
  LeadType: "GENERAL" | "PRODUCT_SPECIFIC";
  ProductId?: string;
  ContactData: {
    Name: string;
    Email: string;
    Phone?: string;
    CompanyName?: string;
    Message?: string;
  };
}

export async function submitLead(
  payload: LeadPayload,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => null);
    return {
      ok: res.ok && json?.success !== false,
      message: json?.message,
    };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
