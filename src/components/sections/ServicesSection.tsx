import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/content";

export function ServicesSection() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="What we do"
            title="End-to-end kitchen solutions, under one roof"
            description="From the first sketch to after-sales support — a single partner for every stage of your commercial kitchen."
          />
          <Reveal>
            <Button href="/services" variant="outline" withArrow>
              All services
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.no} delay={(i % 4) * 0.07}>
              <Link
                href="/services"
                className="group relative flex min-h-[26rem] flex-col overflow-hidden rounded-3xl shadow-card transition-transform duration-400 hover:-translate-y-1"
              >
                {/* background image */}
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/95 via-night/55 to-night/15" />
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />

                {/* content */}
                <div className="relative z-10 flex flex-1 flex-col p-6 text-white">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-brand text-ink shadow-[0_8px_20px_-8px_rgba(237,205,31,0.9)]">
                      <s.icon className="size-6" strokeWidth={1.8} />
                    </span>
                    <span className="text-sm font-semibold tracking-widest text-white/40">
                      {s.no}
                    </span>
                  </div>

                  <div className="mt-auto pt-10">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                      Service {s.no}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {s.short}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-ink">
                      Learn more
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
