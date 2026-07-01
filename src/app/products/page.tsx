import { pageMetadata } from "@/lib/seo-config";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { CategoryOverviewCard } from "@/components/catalog/CategoryOverviewCard";
import { CategoryNav } from "@/components/catalog/CategoryNav";
import { ProductSearch } from "@/components/catalog/ProductSearch";
import { PageHero } from "@/components/sections/PageHero";
import { Certifications } from "@/components/sections/Certifications";
import { CtaBand } from "@/components/sections/CtaBand";
import {
  getCatalogTree,
  getAllProducts,
  getSearchItems,
  bareId,
} from "@/lib/api";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { images } from "@/lib/images";

export const metadata = pageMetadata("products");

// ISR: served fast from cache, refreshed in the background. Admin changes also
// appear instantly via on-demand revalidation (POST /api/revalidate).
export const revalidate = 60;

export default async function ProductsPage() {
  const [tree, allProducts, searchItems] = await Promise.all([
    getCatalogTree(),
    getAllProducts(),
    getSearchItems(),
  ]);

  const countUnder = (mainId: string, subIds: string[]) => {
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
        eyebrow="Product catalogue"
        title="Everything for your commercial kitchen"
        description="Browse by category or search the full Veecos range — every item is fully customisable, request a quote on anything."
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      {tree.length > 0 ? (
        <>
          {/* Search-first: a prominent search bar overlapping the hero */}
          <div className="relative z-20 -mt-9 sm:-mt-12">
            <Container>
              <div className="mx-auto max-w-2xl rounded-2xl border border-ink/10 bg-white p-3 shadow-[0_26px_60px_-28px_rgba(20,20,15,0.55)] sm:p-3.5">
                <ProductSearch items={searchItems} />
              </div>
              <ol className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink/50">
                {["Pick a category", "Choose a range", "Request a quote"].map(
                  (step, i) => (
                    <li key={step} className="flex items-center gap-2">
                      <span className="grid size-5 place-items-center rounded-full bg-ink text-[10px] font-semibold text-paper">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ),
                )}
              </ol>
            </Container>
          </div>

          <div className="mt-10">
            <CategoryNav tree={tree} />
          </div>

          {/* Categories */}
          <section className="bg-paper py-12 sm:py-16">
            <Container>
              <div className="mb-8 flex items-end justify-between gap-4">
                <Eyebrow>Browse by category</Eyebrow>
                <p className="hidden text-sm text-ink/45 sm:block">
                  {tree.length} {tree.length === 1 ? "category" : "categories"}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {tree.map(({ category, subcategories }, i) => {
                    const rid = bareId(category.PK);
                    const subIds = subcategories.map((s) => bareId(s.PK));
                    const subCount = subcategories.length;
                    const prodCount = countUnder(rid, subIds);
                    const meta =
                      subCount > 0
                        ? `${subCount} ${subCount > 1 ? "ranges" : "range"}`
                        : prodCount > 0
                          ? `${prodCount} ${prodCount > 1 ? "products" : "product"}`
                          : undefined;
                    return (
                      <Reveal key={category.PK} delay={(i % 3) * 0.06} className="h-full">
                        <CategoryOverviewCard
                          category={category}
                          subcategories={subcategories}
                          priority={i < 3}
                          meta={meta}
                        />
                      </Reveal>
                    );
                  })}
              </div>
            </Container>
          </section>
        </>
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

      <Certifications />

      <CtaBand secondary={{ label: "Talk to our team", href: "/contact" }} />
    </>
  );
}
