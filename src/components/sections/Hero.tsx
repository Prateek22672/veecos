"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { images } from "@/lib/images";
import { BlurText } from "@/components/ui/BlurText";
import { CircularText } from "@/components/ui/CircularText";
import { EnquiryDialog } from "@/components/contact/EnquiryDialog";

const TRUST = [
  "25+ Years Experience",
  "100+ Projects Delivered",
  "500+ Equipment Installations",
];

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function Hero() {
  const reduce = useReducedMotion();
  // Sentinel at the hero's end drives the fixed seal's fade-out.
  const heroEndRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroEndRef,
    offset: ["start end", "start start"],
  });
  const sealOpacity = useTransform(scrollYProgress, [0.45, 1], [1, 0]);
  const sealY = useTransform(scrollYProgress, [0, 1], [0, 220]);

  return (
    <>
      {/* Fixed rotating seal — balances the right side, fades at hero end */}
      <motion.div
        style={{ opacity: reduce ? 1 : sealOpacity, y: reduce ? 0 : sealY }}
        className="fixed right-3 top-[18%] z-40 text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)] sm:right-5 sm:top-32 lg:right-7"
      >
        <Link
          href="#work"
          aria-label="Scroll to explore"
          className="group relative grid place-items-center"
        >
          <CircularText
            text="✦ VEECOS ✦ SINCE 1998 "
            spinDuration={22}
            onHover="speedUp"
            className="size-24 text-white lg:size-[140px]"
          />
          <span className="absolute grid size-9 place-items-center rounded-full border border-white text-white transition-transform duration-300 group-hover:scale-110 lg:size-12">
            <ArrowDown className="size-4 lg:size-5" />
          </span>
        </Link>
      </motion.div>

      {/*
        ── Full-bleed image hero ──
        Headline overlaid bottom-left. Direct child of <main>, so it pins
        (sticky) while the "Our work" panel scrolls up and stacks over it.
      */}
      <div className="sticky top-0 z-0 h-[88svh] w-full overflow-hidden">
        <motion.div
          initial={reduce ? false : { scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.3, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={images.homeHero}
            alt="A premium stainless-steel commercial kitchen manufactured by Veecos"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* Top fade keeps the nav readable; bottom scrim carries the headline */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />

        <Container className="absolute inset-x-0 bottom-0 pb-12 sm:pb-16">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70"
            >
              <span className="h-px w-8 bg-white/40" />
              Turn-key commercial kitchens
            </motion.span>

            <h1 className="mt-5 text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]">
              <BlurText
                text="Commercial kitchens"
                animateBy="words"
                delay={120}
                stepDuration={0.4}
              />
              <BlurText
                text="built for high volume."
                animateBy="words"
                delay={120}
                stepDuration={0.4}
              />
            </h1>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <EnquiryDialog
                label="Request a Quote"
                trigger={{ variant: "white", size: "lg" }}
              />
              <Link
                href="/products"
                className="group inline-flex h-13 items-center gap-2 rounded-full border border-white/40 px-7 text-[15px] font-medium text-white transition-all duration-300 hover:bg-white hover:text-ink"
              >
                Explore Products
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>

            {/* Social proof — above the fold */}
            <motion.ul
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-white/85"
            >
              {TRUST.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-white" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </Container>
      </div>

      {/* Sentinel marking the hero's end */}
      <div ref={heroEndRef} aria-hidden className="h-px w-full" />
    </>
  );
}
