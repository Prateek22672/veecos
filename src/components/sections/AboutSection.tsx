import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { features } from "@/lib/content";
import { images } from "@/lib/images";

const aboutImg = images.chefTossing;

export function AboutSection() {
  return (
    <section className="bg-paper-2 py-14 sm:py-20">
      <div className="mx-auto w-[95%] max-w-[100rem] overflow-hidden rounded-[2.5rem] border border-line bg-white shadow-[0_40px_110px_-55px_rgba(28,27,27,0.45)]">
        <Container className="flex min-h-[84vh] items-center py-14 sm:py-16 lg:py-20">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* image */}
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line shadow-card">
              <SmartImage
                src={aboutImg}
                alt="Veecos commercial kitchen project"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-card sm:-right-6">
              <MiniStat value="25+" label="Years" />
              <MiniStat value="100+" label="Projects" />
            </div>
          </Reveal>

          {/* copy */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <Eyebrow>About Veecos</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.08] text-ink sm:text-4xl">
                Your trusted partner in commercial kitchen manufacturing
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-base leading-relaxed text-ink/65">
                Established in 1998, Veecos Canteen Equipments is a leading
                manufacturer of commercial kitchen equipment — specialising in
                pre-preparation tools, cooking ranges, exhaust hoods, wash-area
                equipment and more. Our commitment to quality has earned us a loyal
                customer base across Andhra Pradesh and Telangana.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={0.12 + i * 0.05}>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-ink">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{f.title}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.35}>
              <div className="mt-9">
                <Button href="/about" withArrow>
                  Read our story
                </Button>
              </div>
            </Reveal>
          </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-ink px-7 py-5 text-center">
      <p className="text-2xl font-bold text-brand">{value}</p>
      <p className="text-[11px] uppercase tracking-widest text-white/60">{label}</p>
    </div>
  );
}
