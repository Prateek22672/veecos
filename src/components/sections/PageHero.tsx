"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { Container } from "@/components/ui/Container";

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

export interface PageHeroProps {
  image: string;
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
  subtitle?: string;
}

export function PageHero({
  image,
  eyebrow,
  title,
  description,
  crumbs,
  subtitle,
}: PageHeroProps) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 70, damping: 20, mass: 0.5 });
  const imgX = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const imgY = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce) return;
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative flex min-h-[70svh] flex-col overflow-hidden bg-night py-20 text-white sm:min-h-[75svh] sm:py-24 lg:min-h-[80svh]"
    >
      {/* Full-bleed background image */}
      <motion.div
        style={{ x: reduce ? undefined : imgX, y: reduce ? undefined : imgY }}
        className="absolute inset-0 z-0 scale-110"
      >
        <Image
          src={image}
          alt="Page hero image"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Legibility overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-night/92 via-night/65 to-night/25" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-night/75 via-transparent to-night/45" />
      <div className="pointer-events-none absolute -left-40 top-1/3 z-0 size-[40rem] rounded-full bg-brand/12 blur-[150px]" />

      <Container className="relative z-10 flex flex-col justify-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          {crumbs && (
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-1.5 text-xs text-white/50">
              {crumbs.map((c, i) => (
                <span key={c.label} className="flex items-center gap-1.5">
                  {i > 0 && <span>→</span>}
                  {c.href ? (
                    <a href={c.href} className="transition-colors hover:text-brand">
                      {c.label}
                    </a>
                  ) : (
                    <span className="text-white/80">{c.label}</span>
                  )}
                </span>
              ))}
            </motion.div>
          )}

          {eyebrow && (
            <motion.div variants={fadeUp}>
              <span className="inline-flex text-[11px] font-semibold uppercase tracking-[0.16em] text-brand/80">
                {eyebrow}
              </span>
            </motion.div>
          )}

          <motion.h1
            variants={fadeUp}
            className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p variants={fadeUp} className="mt-4 text-lg font-medium text-white/80">
              {subtitle}
            </motion.p>
          )}

          {description && (
            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {description}
            </motion.p>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
