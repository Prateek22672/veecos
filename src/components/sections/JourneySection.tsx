"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  MessageSquare,
  PencilRuler,
  Factory,
  Wrench,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SealBadge } from "@/components/ui/SealBadge";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

type Step = {
  n: string;
  label: string;
  title: string;
  text: string;
  icon: LucideIcon;
  image: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    label: "Consult",
    title: "We start by listening",
    text: "Your space, your menu, your volume and your budget. Every Veecos kitchen begins with understanding exactly how you cook.",
    icon: MessageSquare,
    image: "/journey/consult-veecos.png",
  },
  {
    n: "02",
    label: "Design",
    title: "We plan every inch",
    text: "Engineers turn your brief into a 3D layout built around real workflow — hygiene zoning, easy access and smart use of every footprint.",
    icon: PencilRuler,
    image: "/journey/design-veecos.png",
  },
  {
    n: "03",
    label: "Fabricate",
    title: "We build it to last",
    text: "CNC-precision fabrication in food-grade 304/316 stainless — four-sided pressed and pre-assembled in our Visakhapatnam workshop.",
    icon: Factory,
    image: "/journey/durable-veecos.png",
  },
  {
    n: "04",
    label: "Install",
    title: "We fit & commission",
    text: "On-site installation exactly as designed. Every piece is tested and signed off — your kitchen handed over ready to cook.",
    icon: Wrench,
    image: "/journey/installation-veecos.png",
  },
  {
    n: "05",
    label: "Support",
    title: "We stay with you",
    text: "Dependable pan-India after-sales, preventive maintenance and genuine spares — keeping you running for years after handover.",
    icon: LifeBuoy,
    image: "/journey/support-veecos.png",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function Milestone({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Image drifts downward through its frame as the milestone passes — the
  // "flowing down the journey" feel.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["-12%", "12%"],
  );
  const flip = index % 2 === 1;
  const Icon = step.icon;

  return (
    <div
      ref={ref}
      className="relative pl-20 md:grid md:grid-cols-2 md:items-center md:gap-16 md:pl-0"
    >
      {/* Milestone marker on the spine */}
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-18%" }}
        transition={{ duration: 0.5, ease: EASE }}
        className="absolute left-8 top-1 z-10 grid size-12 -translate-x-1/2 place-items-center rounded-full border-2 border-ink bg-paper text-ink shadow-[0_0_0_6px_var(--color-paper)] md:left-1/2"
      >
        <Icon className="size-5" strokeWidth={1.6} />
      </motion.span>

      {/* Text */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15%" }}
        className={cn(
          "md:py-6",
          flip ? "md:order-2 md:pl-16" : "md:pr-16 md:text-right",
        )}
      >
        <div
          className={cn(
            "flex items-baseline gap-3",
            flip ? "" : "md:justify-end",
          )}
        >
          <span className="text-[clamp(2rem,3vw,3rem)] font-medium leading-none tracking-[-0.03em] text-ink/15">
            {step.n}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
            {step.label}
          </span>
        </div>
        <h3 className="mt-3 text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-tight tracking-[-0.02em] text-ink">
          {step.title}
        </h3>
        <p
          className={cn(
            "mt-3 max-w-md text-base leading-relaxed text-ink/60",
            flip ? "" : "md:ml-auto",
          )}
        >
          {step.text}
        </p>
      </motion.div>

      {/* Image — parallax flow */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.8, ease: EASE }}
        className={cn(
          "mt-6 md:mt-0",
          flip ? "md:order-1 md:pr-16" : "md:pl-16",
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-paper-2 shadow-[0_30px_70px_-45px_rgba(20,20,15,0.5)]">
          <motion.div style={{ y }} className="absolute inset-[-12%]">
            <Image
              src={step.image}
              alt={step.title}
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}

export function JourneySection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.85", "end 0.45"],
  });

  // Seal appears only while the journey is in frame, zig-zags left↔right as you
  // scroll through the milestones, and settles toward the centre at the last step.
  // It's a pure function of scroll position, so scrolling up reverses it exactly.
  const { scrollYProgress: sealProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sealX = useTransform(
    sealProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ["6vw", "76vw", "6vw", "76vw", "6vw", "6vw"],
  );
  const sealOpacity = useTransform(
    sealProgress,
    [0, 0.08, 0.9, 1],
    [0, 1, 1, 0],
  );

  return (
    <section ref={sectionRef} className="relative bg-paper py-10 sm:py-14">
      {/* Traveling brand seal — desktop only (within the journey frame) */}
      <motion.div
        aria-hidden
        style={{ x: reduce ? "6vw" : sealX, opacity: reduce ? 0.5 : sealOpacity }}
        className="pointer-events-none fixed left-0 top-[calc(50vh-64px)] z-30 hidden lg:block"
      >
        <SealBadge />
      </motion.div>

      {/* Static brand seal — mobile/tablet, tucked top-left clear of the heading */}
      <SealBadge
        sizeClass="size-24"
        className="absolute -left-7 top-3 lg:hidden"
      />
      <Container>
        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15%" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
            <span className="h-px w-8 bg-ink/25" />
            How we work
          </span>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[0.98] tracking-[-0.02em] text-ink">
            From an empty room to a working kitchen
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/55">
            Follow the journey — five milestones that take your project from the
            first conversation to a kitchen that runs, day after day.
          </p>
        </motion.div>

        {/* Milestone timeline */}
        <div
          ref={trackRef}
          className="relative mx-auto mt-16 max-w-5xl sm:mt-20"
        >
          {/* The path (fills as you scroll) */}
          <div
            aria-hidden
            className="absolute left-8 top-2 h-[calc(100%-1rem)] w-px overflow-hidden bg-ink/10 md:left-1/2 md:-translate-x-1/2"
          >
            <motion.div
              style={{ scaleY: reduce ? 1 : scrollYProgress }}
              className="h-full w-full origin-top bg-ink"
            />
          </div>

          <div className="space-y-16 md:space-y-28">
            {STEPS.map((step, i) => (
              <Milestone key={step.n} step={step} index={i} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
