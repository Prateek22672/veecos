import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getRootCategories, bareId } from "@/lib/api";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/services", "/products", "/contact"].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await getRootCategories();
    categoryRoutes = categories
      .filter((c) => !/test/i.test(c.Name))
      .map((c) => ({
        url: `${site.url}/products/${bareId(c.PK)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    // catalog unavailable at build — ship the static map.
  }

  return [...staticRoutes, ...categoryRoutes];
}
