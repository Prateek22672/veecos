import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { services } from "@/lib/content";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Veecos provides end-to-end commercial kitchen services since 1998 — kitchen design and planning, customised manufacturing, installation and commissioning, and pan-India after-sales support.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        image={images.serviceHero}
        eyebrow="Exclusive services"
        title="Everything the hospitality industry needs"
        description="A professional kitchen equipment manufacturer since 1998. From designing and planning your kitchen to customised manufacturing, installation, commissioning and after-sales support — we cover it all."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <section className="bg-paper py-20 sm:py-28">
        <Container className="space-y-20 sm:space-y-28">
          {services.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={s.no}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <Reveal className={cn(flip && "lg:order-2")}>
                  <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem] border border-line shadow-card">
                    <SmartImage
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <span className="absolute left-5 top-5 grid size-14 place-items-center rounded-2xl bg-paper/90 text-xl font-bold text-ink backdrop-blur">
                      {s.no}
                    </span>
                  </div>
                </Reveal>

                <div className={cn(flip && "lg:order-1")}>
                  <Reveal>
                    <span className="grid size-12 place-items-center rounded-xl bg-brand/15 text-brand-700">
                      <s.icon className="size-6" strokeWidth={1.7} />
                    </span>
                  </Reveal>
                  <Reveal delay={0.05}>
                    <h2 className="mt-5 text-2xl font-semibold text-ink sm:text-3xl">
                      {s.title}
                    </h2>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-4 text-base leading-relaxed text-ink/65">
                      {s.description}
                    </p>
                  </Reveal>
                  <ul className="mt-6 space-y-3">
                    {s.points.map((p, j) => (
                      <Reveal key={p} delay={0.15 + j * 0.05}>
                        <li className="flex items-center gap-3 text-sm text-ink/75">
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-ink">
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                          {p}
                        </li>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-ink py-20 text-white sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Ready to plan your commercial kitchen?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/65">
              Tell us about your space and requirements — our team will help you
              design an efficient, durable kitchen that fits your budget.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href="/contact" size="lg" withArrow>
                Get a free quote
              </Button>
              <Button href="/products" size="lg" variant="dark" className="bg-white/10 hover:bg-white/20">
                Browse products
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
