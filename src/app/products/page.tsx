import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CatalogShelf } from "@/components/catalog/CatalogShelf";
import { CategoryRail } from "@/components/catalog/CategoryRail";
import { ProductSearch } from "@/components/catalog/ProductSearch";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { getCatalogTree, getAllProducts, getSearchItems, bareId } from "@/lib/api";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Products — Commercial Kitchen Equipment Catalogue (Vizag)",
  description:
    "Explore the full Veecos range of commercial kitchen equipment in Visakhapatnam (Vizag) — cooking ranges, refrigeration, exhaust hoods, wash-area equipment, work tables and more. Organised by category; request a quote on any product. Serving Vizag, Hyderabad & all of Andhra Pradesh & Telangana.",
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
      "Browse the complete Veecos commercial kitchen equipment catalogue — cooking, refrigeration, exhaust, wash-area & more. Manufactured in Visakhapatnam (Vizag).",
    images: [{ url: images.restaurantPass, alt: "Veecos commercial kitchen equipment catalogue, Visakhapatnam (Vizag)" }],
  },
};

// ISR: served fast from cache, refreshed in the background. Admin changes also
// appear instantly via on-demand revalidation (POST /api/revalidate).
export const revalidate = 60;

export default async function ProductsPage() {
  const [tree, allProducts, searchItems] = await Promise.all([
    getCatalogTree(),
    getAllProducts(),
    getSearchItems(),
  ]);

  const productsFor = (catId: string) =>
    allProducts.filter((p) => p.CategoryId === catId);

  // Quick-jump rail + ItemList: every main category.
  const railItems = tree.map(({ category, subcategories }) => {
    const rid = bareId(category.PK);
    return {
      id: rid,
      name: category.Name,
      href: `/products/${rid}`,
      count: subcategories.length || productsFor(rid).length,
    };
  });

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
        description="Browse by category, then drill into a range to see every product — every item is fully customisable, request a quote on anything."
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      {tree.length > 0 ? (
        <>
          {/* ── Sticky command bar: search + category quick-nav ── */}
          <div className="sticky top-[4.75rem] z-30 border-y border-ink/8 bg-paper/85 backdrop-blur-md sm:top-20">
            <Container className="space-y-3 py-4">
              <div className="mx-auto max-w-xl">
                <ProductSearch items={searchItems} />
              </div>
              <CategoryRail items={railItems} />
            </Container>
          </div>

          {/* ── One shelf per main category ── */}
          <div className="bg-paper pb-16 pt-10 sm:pb-20">
            <Container className="space-y-16">
              {tree.map(({ category, subcategories }, ci) => {
                const rid = bareId(category.PK);
                const ownProducts = productsFor(rid);
                const hasSubs = subcategories.length > 0;
                const countLabel = hasSubs
                  ? `${subcategories.length} ${subcategories.length > 1 ? "ranges" : "range"}`
                  : `${ownProducts.length} ${ownProducts.length === 1 ? "product" : "products"}`;

                if (!hasSubs && ownProducts.length === 0) return null;

                return (
                  <section
                    key={rid}
                    id={`cat-${rid}`}
                    className="scroll-mt-40"
                  >
                    <div className="mb-6 flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
                          {countLabel}
                        </p>
                        <h2 className="mt-1.5 truncate text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                          {category.Name}
                        </h2>
                      </div>
                      <Link
                        href={`/products/${rid}`}
                        className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                      >
                        View all
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </div>

                    <Reveal>
                      <CatalogShelf>
                        {hasSubs
                          ? subcategories.map((sub, i) => (
                              <CategoryCard
                                key={sub.PK}
                                category={sub}
                                parentId={rid}
                                priority={ci === 0 && i < 4}
                                cta="Explore"
                                meta={(() => {
                                  const n = productsFor(bareId(sub.PK)).length;
                                  return n > 0
                                    ? `${n} ${n === 1 ? "product" : "products"}`
                                    : undefined;
                                })()}
                              />
                            ))
                          : ownProducts.map((p, i) => (
                              <ProductCard
                                key={p.PK}
                                product={p}
                                eyebrow={category.Name}
                                priority={ci === 0 && i < 4}
                              />
                            ))}
                      </CatalogShelf>
                    </Reveal>
                  </section>
                );
              })}
            </Container>
          </div>
        </>
      ) : allProducts.length > 0 ? (
        // Fallback: root categories unavailable → show the live product list.
        <section className="bg-paper py-12 sm:py-16">
          <Container>
            <div className="mx-auto mb-8 max-w-xl">
              <ProductSearch items={searchItems} />
            </div>
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
              All products · {allProducts.length} item
              {allProducts.length > 1 ? "s" : ""}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allProducts.map((p, i) => (
                <Reveal key={p.PK} delay={(i % 4) * 0.06}>
                  <ProductCard product={p} priority={i < 4} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : (
        <section className="bg-paper py-16 sm:py-24">
          <Container>
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
          </Container>
        </section>
      )}

      <CtaBand secondary={{ label: "Talk to our team", href: "/contact" }} />
    </>
  );
}
