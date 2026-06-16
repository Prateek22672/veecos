import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";

export interface Crumb {
  label: string;
  href?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative overflow-hidden bg-ink pt-32 pb-16 text-white sm:pt-36 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.07]" />
      <div className="pointer-events-none absolute -right-32 -top-24 size-[28rem] rounded-full bg-white/10 blur-[110px]" />
      <Container className="relative">
        {crumbs && (
          <Reveal>
            <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/50">
              {crumbs.map((c, i) => (
                <span key={c.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="size-3.5" />}
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-white/80">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </Reveal>
        )}
        {eyebrow && (
          <Reveal>
            <Eyebrow light>{eyebrow}</Eyebrow>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              {description}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
