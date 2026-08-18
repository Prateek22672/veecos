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
    image: "/journey/consult-veecos.webp",
  },
  {
    n: "02",
    label: "Design",
    title: "We plan every inch",
    text: "Engineers turn your brief into a 2D layout built around real workflow — hygiene zoning, easy access and smart use of every footprint.",
    icon: PencilRuler,
    image: "/journey/design-veecos.webp",
  },
  {
    n: "03",
    label: "Fabricate",
    title: "We build it to last",
    text: "CNC-precision fabrication in food-grade 304/316 stainless — four-sided pressed and pre-assembled in our Visakhapatnam workshop.",
    icon: Factory,
    image: "/journey/durable-veecos.webp",
  },
  {
    n: "04",
    label: "Install",
    title: "We fit & commission",
    text: "On-site installation exactly as designed. Every piece is tested and signed off — your kitchen handed over ready to cook.",
    icon: Wrench,
    image: "/journey/installation-veecos.webp",
  },
  {
    n: "05",
    label: "Support",
    title: "We stay with you",
    text: "Dependable pan-India after-sales, preventive maintenance and genuine spares — keeping you running for years after handover.",
    icon: LifeBuoy,
    image: "/journey/support-veecos.webp",
  },
];

// Hand-drawn route the trail follows — a smooth left↔right wave, one band
// per step, in a 0–100 wide / 0–500 tall coordinate space (stretched to fit
// the real track via preserveAspectRatio="none"). This is what replaces the
// straight center spine.
const TRAIL_D =
  "M18,0 C18,60 82,40 82,100 C82,160 18,140 18,200 C18,260 82,240 82,300 C82,360 18,340 18,400 L18,480";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function Milestone({ step, index }: { step: Step; index: number }) {
  const left = index % 2 === 0;
  const Icon = step.icon;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15%" }}
      className={cn(
        "relative",
        "md:w-[54%]",
        left ? "md:pr-6" : "md:ml-auto md:pl-6 md:text-right",
      )}
    >
      {/* Pinned photograph — positioning parent for the ghost numeral, so it
          sits off the photo's real rendered edge instead of overlapping it */}
      <div className={cn("relative w-full max-w-sm", !left && "ml-auto")}>
        {/* Ghost numeral — sits beside the photo, never hidden behind it */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-1/2 hidden -translate-y-1/2 select-none text-[6.5rem] font-bold leading-none tracking-tighter text-ink/[0.09] md:block lg:text-[8rem]",
            left ? "left-full ml-4 lg:ml-6" : "right-full mr-4 lg:mr-6",
          )}
        >
          {step.n}
        </span>

        <div
          className={cn(
            "group relative z-10 rounded-sm border-[10px] border-white bg-white shadow-[0_28px_60px_-30px_rgba(20,20,15,0.5)] transition-transform duration-500 ease-out hover:rotate-0",
            left ? "-rotate-3" : "rotate-2",
          )}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
            <Image
              src={step.image}
              alt={step.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          {/* Caption tag — overlaps the photo's bottom edge like a paper tab */}
          <span
            className={cn(
              "absolute -bottom-3.5 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper shadow-[0_8px_20px_-8px_rgba(20,20,15,0.6)]",
              left ? "left-4" : "right-4",
            )}
          >
            <Icon className="size-3" strokeWidth={2} />
            {step.n} · {step.label}
          </span>
        </div>
      </div>

      {/* Copy */}
      <div className={cn("relative z-10 mt-9 max-w-sm", !left && "md:ml-auto")}>
        <h3 className="text-[clamp(1.5rem,2.4vw,2.1rem)] font-medium leading-tight tracking-[-0.02em] text-ink">
          {step.title}
        </h3>
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink/60">
          {step.text}
        </p>
      </div>
    </motion.div>
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
  const trailDrawn = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Seal rides the same left↔right rhythm as the trail, settling centre at
  // the final step. Pure function of scroll, so scrolling up reverses it.
  const { scrollYProgress: sealProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sealX = useTransform(
    sealProgress,
    [0, 0.18, 0.38, 0.58, 0.78, 1],
    ["10vw", "80vw", "10vw", "80vw", "10vw", "10vw"],
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
        style={{ x: reduce ? "10vw" : sealX, opacity: reduce ? 0.5 : sealOpacity }}
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
            Five stops on the way from the first conversation to a kitchen
            that runs, day after day — follow the trail.
          </p>
        </motion.div>

        {/* Trail */}
        <div
          ref={trackRef}
          className="relative mx-auto mt-20 max-w-4xl space-y-24 sm:mt-24 md:space-y-32"
        >
          {/* Hand-drawn connecting route — desktop only, draws in on scroll */}
          <svg
            aria-hidden
            viewBox="0 0 100 500"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
          >
            <path
              d={TRAIL_D}
              fill="none"
              stroke="var(--color-ink)"
              strokeOpacity="0.12"
              strokeWidth="1.5"
              strokeLinecap="round"
              pathLength={1}
            />
            <motion.path
              d={TRAIL_D}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="1"
              pathLength={1}
              style={{ strokeDashoffset: reduce ? 0 : trailDrawn }}
            />
          </svg>

          {STEPS.map((step, i) => (
            <Milestone key={step.n} step={step} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
