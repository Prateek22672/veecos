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
  Type?: "Category";
  ParentId?: string;
  /** Admin panel sends the cover photo as `CoverImage`; `ImageUrl` is legacy/unused but kept as a fallback. */
  CoverImage?: string | null;
  ImageUrl?: string | null;
  GSI1PK?: string;
  GSI1SK?: string;
}

export interface Product {
  PK: string;
  SK: string;
  Name: string;
  Slug: string;
  Type?: "Product";
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

/**
 * Lightweight product shape for listing grids. Products carry large HTML
 * descriptions; shipping those to the browser for every card makes listing
 * pages heavy. This projection keeps only what cards + search need.
 */
export interface ProductSummary {
  PK: string;
  Name: string;
  Slug: string;
  CategoryId?: string;
  Images?: string[];
  Specs?: Record<string, string>;
  IsAvailable?: boolean;
  IsCustomizable?: boolean;
  /** Plain-text blob (name + description text + specs) for client-side search. */
  SearchText?: string;
}

/** Project a full product down to the listing summary (strips HTML). */
export function toProductSummary(p: Product): ProductSummary {
  const specEntries = p.Specs ? Object.entries(p.Specs).slice(0, 2) : [];
  const descText = (p.Description ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
  return {
    PK: p.PK,
    Name: p.Name,
    Slug: p.Slug,
    CategoryId: p.CategoryId,
    Images: p.Images?.length ? [p.Images[0]] : undefined,
    Specs: specEntries.length ? Object.fromEntries(specEntries) : undefined,
    IsAvailable: p.IsAvailable,
    IsCustomizable: p.IsCustomizable,
    SearchText: [p.Name, descText, ...specEntries.flat()].join(" ").toLowerCase(),
  };
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

/** The admin-uploaded cover photo for a category, if one was set. */
export function categoryCover(category: Category): string | undefined {
  return category.CoverImage || category.ImageUrl || undefined;
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
