/**
 * Central, page-wise SEO. One source of truth for the main static pages so the
 * tags stay consistent, complete and easy to edit. The /seo dashboard reads
 * this to display/preview tags; the pages read it via `pageMetadata()`.
 */
import type { Metadata } from "next";
import { site } from "./site";

export type PageSeoKey = "home" | "about" | "services" | "products" | "contact";

export interface PageSeo {
  path: string;
  label: string;
  /** Rendered verbatim as the <title>. Aim for ≤ 60 characters. */
  title: string;
  /** Meta description. Aim for 140–160 characters. */
  description: string;
  keywords: string[];
  /** Open Graph / Twitter share image (path under /public or absolute URL). */
  ogImage: string;
}

export const PAGE_SEO: Record<PageSeoKey, PageSeo> = {
  home: {
    path: "/",
    label: "Home",
    title: "Commercial Kitchen Equipment Manufacturer in Vizag | Veecos",
    description:
      "Veecos — Vizag's trusted commercial kitchen equipment manufacturer since 1998. Cooking ranges, exhaust, refrigeration & turn-key kitchens across AP & Telangana.",
    keywords: [
      "commercial kitchen equipment Vizag",
      "commercial kitchen equipment Visakhapatnam",
      "best kitchen equipment in Vizag",
      "canteen equipment manufacturer Visakhapatnam",
      "commercial kitchen equipment manufacturer Andhra Pradesh",
      "cooking range manufacturer Vizag",
      "exhaust hood manufacturer",
      "stainless steel kitchen equipment",
      "turn-key commercial kitchen Visakhapatnam",
      "Veecos Canteen Equipments",
    ],
    ogImage: site.ogImage,
  },
  about: {
    path: "/about",
    label: "About",
    title: "About Veecos — Kitchen Equipment Makers in Vizag Since 1998",
    description:
      "Established in 1998, Veecos is a leading commercial kitchen equipment manufacturer in Visakhapatnam (Vizag) — NSIC & ISO 9001 certified, serving AP & Telangana.",
    keywords: [
      "about Veecos",
      "commercial kitchen equipment manufacturer Visakhapatnam",
      "canteen equipment makers Vizag",
      "NSIC certified kitchen equipment",
      "ISO 9001 kitchen equipment manufacturer",
      "25 years kitchen equipment experience",
    ],
    ogImage: "/sections/aboutHero.webp",
  },
  services: {
    path: "/services",
    label: "Services",
    title: "Kitchen Design, Manufacturing & Installation in Vizag | Veecos",
    description:
      "End-to-end commercial kitchen services in Vizag — design & planning, custom manufacturing, on-site installation & commissioning, and pan-India after-sales support.",
    keywords: [
      "commercial kitchen equipment installation",
      "commercial kitchen installation Vizag",
      "kitchen design and planning Visakhapatnam",
      "custom kitchen fabrication Andhra Pradesh",
      "kitchen commissioning & after-sales service",
      "turn-key kitchen project Vizag",
    ],
    ogImage: "/sections/serviceHero.webp",
  },
  products: {
    path: "/products",
    label: "Products",
    title: "Commercial Kitchen Equipment Catalogue, Vizag | Veecos",
    description:
      "Browse the full Veecos range — cooking ranges, refrigeration, exhaust hoods, wash-area & work tables. Fully customisable, made in Vizag. Request a quote on any product.",
    keywords: [
      "commercial kitchen equipment catalogue Vizag",
      "kitchen equipment products Visakhapatnam",
      "cooking ranges Visakhapatnam",
      "exhaust hoods & refrigeration Vizag",
      "stainless steel work tables & wash area",
      "commercial kitchen equipment manufacturer Andhra Pradesh",
    ],
    ogImage: site.ogImage,
  },
  contact: {
    path: "/contact",
    label: "Contact",
    title: "Contact Veecos — Kitchen Equipment, Auto Nagar Vizag",
    description:
      "Contact Veecos Canteen Equipments, Auto Nagar, Visakhapatnam. Call +91 9848196184 or email sales@vce.co.in for a commercial kitchen equipment quote & installation.",
    keywords: [
      "contact Veecos",
      "commercial kitchen equipment Visakhapatnam contact",
      "kitchen equipment shop Auto Nagar Vizag",
      "request a quote kitchen equipment",
    ],
    ogImage: site.ogImage,
  },
};

/** Build Next.js Metadata for a static page from the central config. */
export function pageMetadata(key: PageSeoKey): Metadata {
  const p = PAGE_SEO[key];
  return {
    title: { absolute: p.title },
    description: p.description,
    keywords: p.keywords,
    alternates: { canonical: p.path },
    openGraph: {
      type: "website",
      url: `${site.url}${p.path}`,
      title: p.title,
      description: p.description,
      images: [{ url: p.ogImage, alt: `${site.name} — ${p.label}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.description,
      images: [p.ogImage],
    },
  };
}
