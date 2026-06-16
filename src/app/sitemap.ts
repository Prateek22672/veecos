import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getCatalogTree, getAllProducts, bareId } from "@/lib/api";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = ["", "/about", "/services", "/products", "/contact"].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const categoryRoutes: MetadataRoute.Sitemap = [];
  const productRoutes: MetadataRoute.Sitemap = [];

  try {
    const tree = await getCatalogTree();
    for (const node of tree) {
      categoryRoutes.push({
        url: `${site.url}/products/${bareId(node.category.PK)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
      for (const sub of node.subcategories) {
        categoryRoutes.push({
          url: `${site.url}/products/${bareId(sub.PK)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }

    const products = await getAllProducts();
    for (const p of products) {
      productRoutes.push({
        url: `${site.url}/product/${bareId(p.PK)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  } catch {
    // catalogue unavailable at build — ship the static map.
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
