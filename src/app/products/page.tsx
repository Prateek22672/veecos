import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { CategoryNav } from "@/components/catalog/CategoryNav";
import { ProductBrowser } from "@/components/catalog/ProductBrowser";
import { PageHero } from "@/components/sections/PageHero";
import { Certifications } from "@/components/sections/Certifications";
import { CtaBand } from "@/components/sections/CtaBand";
import { getCatalogTree, getAllProducts, bareId } from "@/lib/api";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Products — Commercial Kitchen Equipment Catalogue (Vizag)",
  description:
    "Explore the full Veecos range of commercial kitchen equipment in Visakhapatnam (Vizag) — cooking ranges, refrigeration, exhaust hoods, wash-area equipment, work tables and more. Browse by category and request a quote on any product. Serving Vizag, Hyderabad & all of Andhra Pradesh & Telangana.",
  keywords: [
    "commercial kitchen equipment catalogue Vizag",
    "kitchen equipment products Visakhapatnam",
    "cooking ranges Visakhapatnam",
    "exhaust hoods & refrigeration Vizag",
    "stainless steel work tables & wash area",
    "commercial kitchen equipment manufacturer Andhra Pradesh",
  ],
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    url: `${site.url}/products`,
    title: "Commercial Kitchen Equipment Catalogue — Veecos, Vizag",
    description:
      "Browse the complete Veecos commercial kitchen equipment catalogue by category — cooking, refrigeration, exhaust, wash-area & more. Manufactured in Visakhapatnam (Vizag).",
    images: [
      {
        url: images.restaurantPass,
        alt: "Veecos commercial kitchen equipment catalogue, Visakhapatnam (Vizag)",
      },
    ],
  },
};

// ISR: served fast from cache, refreshed in the background. Admin changes also
// appear instantly via on-demand revalidation (POST /api/revalidate).
export const revalidate = 60;

export default async function ProductsPage() {
  const [tree, allProducts] = await Promise.all([
    getCatalogTree(),
    getAllProducts(),
  ]);

  const productsUnder = (mainId: string, subIds: string[]) => {
    const set = new Set([mainId, ...subIds]);
    return allProducts.filter((p) => p.CategoryId && set.has(p.CategoryId)).length;
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ]);
  const itemList = itemListJsonLd(
    "Veecos commercial kitchen equipment categories",
    tree.map(({ category }) => ({
      name: category.Name,
      path: `/products/${bareId(category.PK)}`,
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumb, itemList]),
        }}
      />

      <PageHero
        compact
        image={images.restaurantPass}
        eyebrow="Our products"
        title="The Veecos catalogue"
        description="Pick a category to explore its ranges — every item is fully customisable, request a quote on anything."
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      <CategoryNav tree={tree} />

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          {tree.length > 0 ? (
            <>
              <Eyebrow>Browse by category</Eyebrow>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tree.map(({ category, subcategories }, i) => {
                  const rid = bareId(category.PK);
                  const subIds = subcategories.map((s) => bareId(s.PK));
                  const subCount = subcategories.length;
                  const prodCount = productsUnder(rid, subIds);
                  const meta =
                    subCount > 0
                      ? `${subCount} ${subCount > 1 ? "ranges" : "range"}`
                      : prodCount > 0
                        ? `${prodCount} ${prodCount > 1 ? "products" : "product"}`
                        : undefined;
                  return (
                    <Reveal key={category.PK} delay={(i % 3) * 0.07}>
                      <CategoryCard
                        category={category}
                        priority={i < 3}
                        cta="Explore range"
                        meta={meta}
                      />
                    </Reveal>
                  );
                })}
              </div>

              {/* Search + filter across the whole catalogue */}
              {allProducts.length > 0 && (
                <div className="mt-16 border-t border-ink/10 pt-12">
                  <Eyebrow>Search all products</Eyebrow>
                  <div className="mt-8">
                    <ProductBrowser products={allProducts} tree={tree} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mx-auto max-w-xl rounded-3xl border border-ink/10 bg-paper-2 p-12 text-center">
              <p className="text-lg font-medium text-ink">
                Our catalogue is being updated
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/55">
                We&apos;re refreshing our product range. Tell us what you need and
                our team will send the full catalogue and a quote.
              </p>
              <a
                href="/contact"
                className="mt-7 inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors hover:bg-charcoal"
              >
                Request the catalogue
              </a>
            </div>
          )}
        </Container>
      </section>

      <Certifications />

      <CtaBand secondary={{ label: "Talk to our team", href: "/contact" }} />
    </>
  );
}
