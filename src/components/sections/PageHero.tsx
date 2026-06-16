"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ChevronRight, ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CircularText } from "@/components/ui/CircularText";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export interface PageHeroProps {
  image: string;
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
  subtitle?: string;
  /** Shorter hero — for content-heavy pages like the catalogue. */
  compact?: boolean;
}

/**
 * Full-bleed image hero with an overlaid heading (bottom-left) — matches the
 * home hero's cinematic look across About / Services / Contact.
 */
export function PageHero({
  image,
  eyebrow,
  title,
  description,
  crumbs,
  subtitle,
  compact = false,
}: PageHeroProps) {
  const reduce = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden">
      <motion.div
        initial={reduce ? false : { scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.3, ease: EASE }}
        className="absolute inset-0"
      >
        <Image
          src={image}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Top fade keeps the nav readable; bottom scrim carries the heading */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/55 via-ink/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />

      {/* Rotating brand seal — upper-right on small screens (clear of the
          heading), bottom-right corner on large screens. */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
        className="pointer-events-none absolute right-3 top-28 z-10 text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)] sm:right-6 sm:top-32 lg:right-10 lg:top-auto lg:bottom-10"
      >
        <div className="relative grid place-items-center">
          <CircularText
            text="✦ VEECOS ✦ SINCE 1998 "
            spinDuration={22}
            className="size-20 text-white sm:size-24 lg:size-32"
          />
          <span className="absolute grid size-7 place-items-center rounded-full border border-white text-white sm:size-9 lg:size-11">
            <ArrowDown className="size-3.5 sm:size-4 lg:size-5" />
          </span>
        </div>
      </motion.div>

      <Container
        className={cn(
          "relative flex flex-col justify-end pb-12 pt-32 sm:pb-16 sm:pt-36",
          compact
            ? "min-h-[54vh] sm:min-h-[58vh] lg:min-h-[62vh]"
            : "min-h-[70vh] sm:min-h-[74vh] lg:min-h-[82vh]",
        )}
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          {crumbs && (
            <motion.nav
              variants={fadeUp}
              className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-white/60"
            >
              {crumbs.map((c, i) => (
                <span key={c.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="size-3.5 text-white/40" />}
                  {c.href ? (
                    <Link
                      href={c.href}
                      className="transition-colors hover:text-white"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-white/85">{c.label}</span>
                  )}
                </span>
              ))}
            </motion.nav>
          )}

          {eyebrow && (
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70"
            >
              <span className="h-px w-8 bg-white/40" />
              {eyebrow}
            </motion.span>
          )}

          <motion.h1
            variants={fadeUp}
            className="mt-4 text-[clamp(2.25rem,5.5vw,4.75rem)] font-medium leading-[0.98] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              variants={fadeUp}
              className="mt-3 text-lg font-medium text-white/80"
            >
              {subtitle}
            </motion.p>
          )}

          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
            >
              {description}
            </motion.p>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
