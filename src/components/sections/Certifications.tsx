import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";

/**
 * Shared certifications panel (CE, ISO 9001, ISO 14001, OHSAS 18001).
 * Used on the products catalogue and every product page. Responsive: text +
 * image side-by-side on desktop, stacked on mobile.
 */
export function Certifications() {
  return (
    <section className="bg-paper-2 py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="max-w-md">
              <Eyebrow>Quality &amp; compliance</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                Certified to international standards
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink/60">
                Every Veecos product is built to recognised quality, safety and
                environmental standards — CE, ISO 9001, ISO 14001 and OHSAS
                18001 — so you can specify our commercial kitchen equipment with
                full confidence.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto w-full max-w-[17rem] overflow-hidden rounded-2xl border border-line bg-white p-3 shadow-card">
              <Image
                src="/certification-veecos.png"
                alt="Veecos certifications — CE, ISO 9001, ISO 14001 and OHSAS 18001 certified commercial kitchen equipment manufacturer in Visakhapatnam (Vizag)"
                width={768}
                height={980}
                sizes="272px"
                className="h-auto w-full rounded-lg"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
