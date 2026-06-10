import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { getRootCategories } from "@/lib/api";

export async function ProductsShowcase() {
  const categories = (await getRootCategories())
    // hide obvious test/placeholder rows from the public site
    .filter((c) => !/test/i.test(c.Name))
    .slice(0, 6);

  return (
    <section id="products" className="scroll-mt-24 bg-paper py-20 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Our products"
            title="A complete range for every kitchen"
            description="Browse our core equipment categories — each one fully customisable to your kitchen's size and workflow."
          />
          <Reveal>
            <Button href="/products" variant="outline" withArrow>
              View all products
            </Button>
          </Reveal>
        </div>

        {categories.length > 0 ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Reveal key={c.PK} delay={(i % 3) * 0.07}>
                <CategoryCard category={c} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-14 rounded-2xl border border-line bg-white p-10 text-center text-ink/55">
            Our product catalogue is being updated. Please{" "}
            <a href="/contact" className="font-medium text-brand-700 underline">
              contact us
            </a>{" "}
            for the full range.
          </p>
        )}
      </Container>
    </section>
  );
}
