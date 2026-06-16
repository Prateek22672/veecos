import type { Metadata } from "next";
import { Target, Eye } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { features, stats } from "@/lib/content";
import { site } from "@/lib/site";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us — Commercial Kitchen Equipment Makers in Vizag",
  description:
    "Established in 1998, Veecos Canteen Equipments is a leading manufacturer of commercial kitchen equipment in Visakhapatnam (Vizag), serving Andhra Pradesh & Telangana. Learn about our mission, vision, quality and 25+ years of experience.",
  keywords: [
    "about Veecos",
    "commercial kitchen equipment manufacturer Visakhapatnam",
    "canteen equipment makers Vizag",
    "NSIC certified kitchen equipment",
    "ISO 9001 kitchen equipment manufacturer",
  ],
  alternates: { canonical: "/about" },
};

const aboutImg = images.chefLadle;

export default function AboutPage() {
  return (
    <>
      <PageHero
        image={images.aboutHero}
        eyebrow="About Veecos"
        title="Built on quality, since 1998"
        description="Your trusted partner in high-quality commercial kitchen equipment manufacturing — durable products designed for optimal performance across every foodservice establishment."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Intro */}
      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-paper-2">
                <SmartImage
                  src={aboutImg}
                  alt="Veecos team manufacturing commercial kitchen equipment"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <div>
              <Reveal>
                <Eyebrow>Who we are</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 text-[clamp(2rem,3.8vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.02em] text-ink">
                  A leading commercial kitchen equipment manufacturer
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 text-base leading-relaxed text-ink/60">
                  Established in 1998, Veecos Canteen Equipments specialises in
                  pre-preparation tools, cooking ranges, exhaust hoods, wash-area
                  equipment and more. Our commitment to quality has earned us a
                  loyal customer base across Andhra Pradesh and Telangana —
                  including institutions, hospitals, restaurants, hotels, cafes,
                  resto-bars and bakeries.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-4 text-base leading-relaxed text-ink/60">
                  We excel in turn-key projects — comprehensive solutions that
                  encompass kitchen design and planning. Trust Veecos to handle all
                  aspects of your kitchen needs, ensuring efficiency and excellence
                  in every project.
                </p>
              </Reveal>

              <div className="mt-9 grid gap-x-8 gap-y-5 border-t border-ink/10 pt-8 sm:grid-cols-2">
                {features.map((f, i) => (
                  <Reveal key={f.title} delay={0.2 + i * 0.05}>
                    <div className="flex items-start gap-3.5">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink" />
                      <p className="text-sm font-medium text-ink">{f.title}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.4}>
                <div className="mt-8 flex items-center gap-4 border-t border-ink/10 pt-7">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/40">
                    Certified by
                  </span>
                  <SmartImage
                    src={images.nsic}
                    alt="NSIC certified"
                    width={48}
                    height={48}
                    className="size-12 object-contain"
                  />
                  <SmartImage
                    src={images.iso}
                    alt="ISO 9001:2015 certified"
                    width={48}
                    height={48}
                    className="size-12 object-contain"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats band */}
      <section className="bg-paper pb-6">
        <Container>
          <dl className="grid grid-cols-2 gap-y-10 border-y border-ink/10 py-12 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <div className="text-center lg:text-left">
                  <dt className="text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-none tracking-[-0.03em] text-ink">
                    {s.value}
                  </dt>
                  <dd className="mt-3 text-sm text-ink/45">{s.label}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <MissionCard
                icon={Target}
                label="Our Mission"
                text="To provide commercial kitchen equipment of high quality at reasonable prices. The kitchen is the heart and brain of any hospitality business — at Veecos we deliver both quality and trouble-free equipment at a price that even small-budget restaurants can afford, helping them make their dream come true without compromising on quality."
              />
            </Reveal>
            <Reveal delay={0.08}>
              <MissionCard
                icon={Eye}
                label="Our Vision"
                text="To provide high-value products and solutions that help customers save time spent on maintenance and energy — making their kitchens more environment-friendly. We plan to walk through this long journey by consistently maintaining the highest quality in everything we manufacture."
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Why characteristics — feature grid (dark) */}
      <section className="bg-charcoal py-20 text-white sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow light>Why choose us</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,3.8vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.02em]">
              Characteristics that set our equipment apart
            </h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="h-full bg-charcoal p-8">
                  <div className="flex items-center justify-between">
                    <f.icon className="size-7 text-white/70" strokeWidth={1.4} />
                    <span className="text-xs font-medium tabular-nums text-white/30">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-8 text-base font-medium">{f.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/50">
                    {f.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-12 text-sm text-white/40">
            {site.name} · NSIC Certified · Serving hospitality businesses since{" "}
            {site.established}.
          </p>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}

function MissionCard({
  icon: Icon,
  label,
  text,
}: {
  icon: typeof Target;
  label: string;
  text: string;
}) {
  return (
    <div className="h-full rounded-[1.75rem] border border-ink/10 bg-paper-2 p-8 sm:p-10">
      <div className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full border border-ink/15 text-ink">
          <Icon className="size-5.5" strokeWidth={1.5} />
        </span>
        <h3 className="text-xl font-medium tracking-tight text-ink">{label}</h3>
      </div>
      <p className="mt-6 text-base leading-relaxed text-ink/60">{text}</p>
    </div>
  );
}
