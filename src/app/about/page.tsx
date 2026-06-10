import type { Metadata } from "next";
import { Target, Eye, Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ContactSection } from "@/components/sections/ContactSection";
import { features, stats } from "@/lib/content";
import { site } from "@/lib/site";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Established in 1998, Veecos Canteen Equipments is a leading manufacturer of commercial kitchen equipment across Andhra Pradesh and Telangana. Learn about our mission, vision and values.",
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
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line shadow-card">
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
                <h2 className="mt-4 text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl">
                  A leading commercial kitchen equipment manufacturer
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 text-base leading-relaxed text-ink/65">
                  Established in 1998, Veecos Canteen Equipments specialises in
                  pre-preparation tools, cooking ranges, exhaust hoods, wash-area
                  equipment and more. Our commitment to quality has earned us a
                  loyal customer base across Andhra Pradesh and Telangana —
                  including institutions, hospitals, restaurants, hotels, cafes,
                  resto-bars and bakeries.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-4 text-base leading-relaxed text-ink/65">
                  We excel in turn-key projects — comprehensive solutions that
                  encompass kitchen design and planning. Trust Veecos to handle all
                  aspects of your kitchen needs, ensuring efficiency and excellence
                  in every project.
                </p>
              </Reveal>

              <div className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {features.map((f, i) => (
                  <Reveal key={f.title} delay={0.2 + i * 0.05}>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-ink">
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      <p className="text-sm font-semibold text-ink">{f.title}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.4}>
                <div className="mt-9 flex items-center gap-4 border-t border-line pt-7">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
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
      <section className="bg-ink py-14 text-white">
        <Container>
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <div className="text-center lg:text-left">
                  <dt className="text-4xl font-bold text-brand sm:text-5xl">
                    {s.value}
                  </dt>
                  <dd className="mt-2 text-sm text-white/60">{s.label}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="bg-paper-2 py-20 sm:py-28">
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
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Characteristics that set our equipment apart
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                  <span className="grid size-12 place-items-center rounded-xl bg-brand/15 text-brand">
                    <f.icon className="size-6" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    {f.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-12 text-sm text-white/45">
            {site.name} · NSIC Certified · Serving hospitality businesses since{" "}
            {site.established}.
          </p>
        </Container>
      </section>

      <ContactSection />
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
    <div className="h-full rounded-3xl border border-line bg-white p-8 shadow-soft sm:p-10">
      <span className="grid size-14 place-items-center rounded-2xl bg-brand text-ink">
        <Icon className="size-7" strokeWidth={1.7} />
      </span>
      <h3 className="mt-6 text-2xl font-semibold text-ink">{label}</h3>
      <p className="mt-4 text-base leading-relaxed text-ink/65">{text}</p>
    </div>
  );
}
