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
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { images } from "@/lib/images";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const lineUp: Variants = {
  hidden: { y: "110%" },
  show: (i = 0) => ({
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: 0.2 + i * 0.1 },
  }),
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle mouse parallax for the background image.
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
      className="relative z-0 flex min-h-[88svh] flex-col overflow-hidden bg-night pt-28 pb-16 text-white lg:sticky lg:top-0 lg:h-[100svh] lg:min-h-0 lg:pb-0 lg:pt-0"
    >
      {/* Full-bleed background image */}
      <motion.div
        style={{ x: reduce ? undefined : imgX, y: reduce ? undefined : imgY }}
        className="absolute inset-0 z-0 scale-110"
      >
        <Image
          src={images.homeHero}
          alt="Commercial kitchen project delivered by Veecos"
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

      <Container className="relative z-10 flex h-full flex-col">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="my-auto max-w-2xl"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md">
              <BadgeCheck className="size-3.5 text-brand" />
              NSIC &amp; ISO 9001:2015 Certified · Since {site.established}
            </span>
          </motion.div>

          <h1 className="mt-6 text-[clamp(2.6rem,5vw,4.6rem)] font-semibold leading-[1.0] tracking-[-0.03em] text-white">
            <Line i={0}>Commercial kitchens</Line>
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span variants={lineUp} custom={1} className="inline-block">
                built for{" "}
                <span className="relative text-brand">
                  high volume.
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-brand"
                    initial={reduce ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}
                  />
                </span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-[15px] leading-relaxed text-white/75 sm:text-base"
          >
            Manufacturing, installation and turn-key kitchen projects trusted by
            hotels, hospitals, institutions and restaurants since {site.established}.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button href="/products" size="lg" withArrow>
              Explore Products
            </Button>
            <Button
              href="/contact"
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:border-white hover:bg-white hover:text-ink"
            >
              Get a Free Quote
            </Button>
          </motion.div>
        </motion.div>
      </Container>

      {/* one tasteful floating badge (desktop) */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
        className="absolute bottom-10 right-10 z-20 hidden items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3.5 shadow-card ring-1 ring-inset ring-white/15 backdrop-blur-xl lg:flex"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-ink">
          <ShieldCheck className="size-5" strokeWidth={1.8} />
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight text-white">
            Turn-key kitchens
          </p>
          <p className="mt-0.5 text-[11px] text-white/65">Design · Build · Install</p>
        </div>
      </motion.div>
    </section>
  );
}

function Line({ children, i = 0 }: { children: React.ReactNode; i?: number }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span variants={lineUp} custom={i} className="inline-block">
        {children}
      </motion.span>
    </span>
  );
}
