import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CardCarousel } from "@/components/ui/CardCarousel";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { getCatalogTree } from "@/lib/api";

export async function ProductsShowcase() {
  const tree = await getCatalogTree();
  // Tease a few main categories on the home page; the full catalogue lives on /products.
  const featured = tree.slice(0, 3);

  return (
    <section id="products" className="scroll-mt-24 bg-paper pb-12 pt-20 sm:pb-16 sm:pt-28">
      <Container>
        <SectionHeading
          emblem
          eyebrow="Our products"
          title="A complete range for every kitchen"
          description="Durable, customisable commercial kitchen equipment — explore the range by category, engineered to your space and workflow."
        />

        {featured.length > 0 ? (
          <>
            <CardCarousel
              gridClass="mt-14 lg:grid lg:grid-cols-3 lg:gap-6"
              trailing={
                <Link
                  href="/products"
                  className="group flex h-full min-h-[20rem] flex-col justify-between rounded-2xl bg-ink p-7 text-paper"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/50">
                      Veecos catalogue
                    </span>
                    <span className="grid size-9 place-items-center rounded-full border border-white/25 transition-transform duration-300 group-hover:-translate-y-0.5">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                  <div>
                    <p className="text-[clamp(1.75rem,8vw,2.4rem)] font-medium leading-[1.04] tracking-tight">
                      See the full product range
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-paper/55">
                      Every category, sub-category &amp; product — all in one
                      place.
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                      View all products
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              }
            >
              {featured.map(({ category, subcategories }, i) => (
                <Reveal key={category.PK} delay={(i % 3) * 0.07}>
                  <CategoryCard
                    category={category}
                    priority={i < 3}
                    cta="Explore range"
                    meta={
                      subcategories.length > 0
                        ? `${subcategories.length} ${
                            subcategories.length > 1
                              ? "sub-categories"
                              : "sub-category"
                          }`
                        : undefined
                    }
                  />
                </Reveal>
              ))}
            </CardCarousel>

            {/* Desktop CTA banner → products page */}
            <Reveal>
              <Link
                href="/products"
                className="group mt-8 hidden items-center justify-between gap-8 rounded-[1.75rem] bg-ink px-12 py-11 text-paper lg:flex"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/50">
                    Veecos catalogue
                  </p>
                  <p className="mt-2.5 text-[clamp(1.6rem,2.2vw,2.35rem)] font-medium leading-tight tracking-tight">
                    Explore the full product range
                  </p>
                  <p className="mt-2 text-sm text-paper/55">
                    Cooking, refrigeration, exhaust, wash-area &amp; more — all in
                    one place.
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-ink transition-transform duration-300 group-hover:-translate-y-0.5">
                  View all products
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          </>
        ) : (
          <p className="mt-14 rounded-2xl border border-ink/10 bg-paper-2 p-10 text-center text-ink/55">
            Our product catalogue is being updated. Please{" "}
            <a
              href="/contact"
              className="font-medium text-ink underline underline-offset-2"
            >
              contact us
            </a>{" "}
            for the full range.
          </p>
        )}
      </Container>
    </section>
  );
}
