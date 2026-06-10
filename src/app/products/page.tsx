import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { getRootCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore the full Veecos range of commercial kitchen equipment — cooking ranges, refrigeration, exhaust hoods, wash-area equipment, work tables, pre-preparation machines and more.",
  alternates: { canonical: "/products" },
};

// Revalidate the catalog every 5 minutes.
export const revalidate = 300;

export default async function ProductsPage() {
  const categories = (await getRootCategories()).filter(
    (c) => !/test/i.test(c.Name),
  );

  return (
    <>
      <PageHeader
        eyebrow="Our products"
        title="Commercial kitchen equipment, by category"
        description="Every category below is fully customisable to your kitchen's size and workflow. Browse a range, then request a quote on any product."
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      <section className="bg-paper py-20 sm:py-28">
        <Container>
          {categories.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c, i) => (
                <Reveal key={c.PK} delay={(i % 3) * 0.07}>
                  <CategoryCard category={c} priority={i < 3} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-line bg-white p-12 text-center text-ink/55">
              Our product catalogue is being updated. Please{" "}
              <a href="/contact" className="font-medium text-brand-700 underline">
                contact us
              </a>{" "}
              for the full range.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
