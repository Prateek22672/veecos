import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import {
  getCategoryProducts,
  getSubcategories,
  resolveCategory,
  prettify,
} from "@/lib/api";

export const revalidate = 300;

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const cat = await resolveCategory(id);
  const name = cat?.Name ?? prettify(id);
  return {
    title: name,
    description: `Browse ${name} from Veecos Canteen Equipments — durable, customisable commercial kitchen equipment. Request a quote today.`,
    alternates: { canonical: `/products/${id}` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { id } = await params;

  const [category, subcategories, products] = await Promise.all([
    resolveCategory(id),
    getSubcategories(id),
    getCategoryProducts(id),
  ]);

  const name = category?.Name ?? prettify(id);
  const visibleSubs = subcategories.filter((c) => !/test/i.test(c.Name));

  return (
    <>
      <PageHeader
        eyebrow="Product range"
        title={name}
        description={`Explore ${name.toLowerCase()} — fully customisable to your kitchen's size and workflow.`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: name },
        ]}
      />

      <section className="bg-paper py-20 sm:py-28">
        <Container>
          {/* Subcategories */}
          {visibleSubs.length > 0 && (
            <div className="mb-20">
              <Reveal>
                <Eyebrow>Sub-categories</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
                  Refine your selection
                </h2>
              </Reveal>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleSubs.map((c, i) => (
                  <Reveal key={c.PK} delay={(i % 3) * 0.07}>
                    <CategoryCard category={c} priority={i < 3} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {products.length > 0 ? (
            <div>
              <Reveal>
                <Eyebrow>Products</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
                  {products.length} product{products.length > 1 ? "s" : ""} in this
                  range
                </h2>
              </Reveal>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((p, i) => (
                  <Reveal key={p.PK} delay={(i % 4) * 0.06}>
                    <ProductCard product={p} priority={i < 4} />
                  </Reveal>
                ))}
              </div>
            </div>
          ) : (
            visibleSubs.length === 0 && (
              <div className="rounded-2xl border border-line bg-white p-12 text-center">
                <p className="text-ink/60">
                  Products in this category are being added. Contact us for the
                  full range and pricing.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button href="/contact" withArrow>
                    Request details
                  </Button>
                </div>
              </div>
            )
          )}
        </Container>
      </section>
    </>
  );
}
