import { pageMetadata } from "@/lib/seo-config";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { CtaBand } from "@/components/sections/CtaBand";
import { cn } from "@/lib/cn";
import { services } from "@/lib/content";
import { images } from "@/lib/images";

export const metadata = pageMetadata("services");

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
                  <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem] bg-paper-2">
                    <SmartImage
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>

                <div className={cn(flip && "lg:order-1")}>
                  <Reveal>
                    <div className="flex items-center gap-4">
                      <span className="text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.03em] text-ink/15">
                        {s.no}
                      </span>
                      <span className="grid size-12 place-items-center rounded-full border border-ink/15 text-ink">
                        <s.icon className="size-5.5" strokeWidth={1.5} />
                      </span>
                    </div>
                  </Reveal>
                  <Reveal delay={0.05}>
                    <h2 className="mt-6 text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
                      {s.title}
                    </h2>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-4 text-base leading-relaxed text-ink/60">
                      {s.description}
                    </p>
                  </Reveal>
                  <ul className="mt-7 space-y-3.5 border-t border-ink/10 pt-7">
                    {s.points.map((p, j) => (
                      <Reveal key={p} delay={0.15 + j * 0.05}>
                        <li className="flex items-center gap-3.5 text-sm text-ink/70">
                          <span className="size-1.5 shrink-0 rounded-full bg-ink" />
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

      <CtaBand />
    </>
  );
}
