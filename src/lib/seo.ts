/**
 * Centralised SEO helpers — auto-generate page metadata, image alt text and
 * structured data from product / category names so every catalogue page ships
 * descriptive, location-rich tags without manual work.
 *
 * Target market: Visakhapatnam (Vizag) first, then Hyderabad, Telangana and the
 * rest of Andhra Pradesh. Server-only use (called from generateMetadata).
 */
import type { Metadata } from "next";
import { site } from "./site";
import { categoryVisual } from "./catalog-visuals";
import { type Product } from "./catalog-types";

/** Service locations, strongest market first. */
export const LOCATIONS = [
  "Visakhapatnam",
  "Vizag",
  "Hyderabad",
  "Telangana",
  "Andhra Pradesh",
] as const;

/** Evergreen local keywords every catalogue page should rank for. */
const BASE_KEYWORDS = [
  "commercial kitchen equipment Vizag",
  "commercial kitchen equipment Visakhapatnam",
  "commercial kitchen equipment manufacturer Vizag",
  "commercial kitchen installation Visakhapatnam",
  "commercial kitchen maintenance Vizag",
  "kitchen equipment manufacturer Hyderabad",
  "canteen equipment Andhra Pradesh",
  "restaurant & hotel kitchen equipment Vizag",
];

/** Build name-derived keyword phrases (the product/category words + location). */
function nameKeywords(name: string): string[] {
  const clean = name.trim();
  if (!clean) return [];
  return [
    clean,
    `${clean} Vizag`,
    `${clean} Visakhapatnam`,
    `${clean} manufacturer`,
    `${clean} price Vizag`,
  ];
}

/** Spec summary string, first 3 specs — "Capacity: 50L, Material: 304 SS". */
function specSummary(product: Product): string {
  if (!product.Specs) return "";
  return Object.entries(product.Specs)
    .slice(0, 3)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
}

/* ----------------------------- Image alt text ----------------------------- */
/** Descriptive, location-rich alt for product images (Google Images ranking). */
export function productAlt(name: string): string {
  return `${name} — commercial kitchen equipment by Veecos, Visakhapatnam (Vizag)`;
}
/** Descriptive alt for a category cover image. */
export function categoryAlt(name: string): string {
  return `${name} — commercial kitchen equipment range by Veecos, Visakhapatnam (Vizag)`;
}

/* ------------------------------- Metadata --------------------------------- */
export function productMetadata(product: Product, id: string): Metadata {
  const name = product.Name.trim();
  const specs = specSummary(product);
  const image = product.Images?.[0] || categoryVisual(name, product.Slug).image;
  const description =
    `${name} by Veecos Canteen Equipments — durable, customisable commercial ` +
    `kitchen equipment in Visakhapatnam (Vizag).` +
    (specs ? ` ${specs}.` : "") +
    ` Manufactured, installed & serviced across Vizag, Hyderabad and ` +
    `Andhra Pradesh & Telangana. Request a quote today.`;

  return {
    title: `${name} — Commercial Kitchen Equipment, Vizag`,
    description,
    keywords: [...nameKeywords(name), ...BASE_KEYWORDS],
    alternates: { canonical: `/product/${id}` },
    openGraph: {
      type: "website",
      url: `${site.url}/product/${id}`,
      title: `${name} | Veecos Canteen Equipments, Vizag`,
      description,
      images: [{ url: image, alt: productAlt(name) }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Veecos`,
      description,
      images: [image],
    },
  };
}

export function categoryMetadata(
  name: string,
  id: string,
  image?: string,
): Metadata {
  const cover = image || categoryVisual(name).image;
  const description =
    `${name} from Veecos Canteen Equipments — commercial kitchen equipment ` +
    `manufacturer in Visakhapatnam (Vizag). Durable, fully customisable, with ` +
    `installation & after-sales service across Vizag, Hyderabad and Andhra ` +
    `Pradesh & Telangana. Browse the range and request a quote.`;

  return {
    title: `${name} — Commercial Kitchen Equipment, Vizag`,
    description,
    keywords: [...nameKeywords(name), ...BASE_KEYWORDS],
    alternates: { canonical: `/products/${id}` },
    openGraph: {
      type: "website",
      url: `${site.url}/products/${id}`,
      title: `${name} | Veecos Canteen Equipments, Vizag`,
      description,
      images: [{ url: cover, alt: categoryAlt(name) }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Veecos`,
      description,
      images: [cover],
    },
  };
}

/* ----------------------------- Structured data ---------------------------- */
/** BreadcrumbList JSON-LD from an ordered list of crumbs. */
export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${site.url}${c.path}`,
    })),
  };
}

/** ItemList JSON-LD — helps Google understand a category/collection's items. */
export function itemListJsonLd(
  name: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${site.url}${it.path}`,
    })),
  };
}
