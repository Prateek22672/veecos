/**
 * Client-safe catalogue types + pure helpers.
 * NO network calls and NO API base URL live here, so this module can be
 * imported by client components without leaking the backend endpoint into the
 * browser bundle. All real fetching lives in the server-only `@/lib/api`.
 */

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
  ImageUrl?: string;
  GSI1PK?: string;
  GSI1SK?: string;
}

export interface Product {
  PK: string;
  SK: string;
  Name: string;
  Slug: string;
  Type: "Product";
  CategoryId?: string;
  Images?: string[];
  Specs?: Record<string, string>;
  IsAvailable?: boolean;
  IsCustomizable?: boolean;
  Description?: string;
  GSI1PK?: string;
}

/** A main category together with its direct child categories — for the catalogue tree. */
export interface CatalogNode {
  category: Category;
  subcategories: Category[];
}

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

/** Strip the `ENTITY#` prefix from a PK/SK to get the bare id used in URLs. */
export function bareId(pkOrSk: string): string {
  return pkOrSk.includes("#") ? pkOrSk.split("#").slice(1).join("#") : pkOrSk;
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
