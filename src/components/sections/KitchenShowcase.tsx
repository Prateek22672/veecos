"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { SealBadge } from "@/components/ui/SealBadge";
import { site } from "@/lib/site";
import { images } from "@/lib/images";

const STATS = [
  { to: 25, suffix: "+", label: "Years of experience" },
  { to: 100, suffix: "+", label: "Projects delivered" },
  { to: 50, suffix: "+", label: "Happy clients" },
];

/**
 * Cinematic scroll reveal for the one hero project photo we have — no pin/
 * scroll-jack (the page wrapper is overflow-hidden, which breaks
 * position:sticky anyway), just transform/opacity/clip-path driven purely by
 * scroll progress, same technique as JourneySection. Fully reversible on
 * scroll-up, GPU-only properties, so it stays smooth with no layout thrash.
 */
function CinematicFrame() {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const check = () => setNarrow(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start 0.92", "start 0.35"],
  });

  // Outer frame: settles from a gentle 3D tilt to flat while it grows in —
  // the "unveiling" motion.
  const rotateX = useTransform(scrollYProgress, [0, 1], [narrow ? 6 : 10, 0]);
  const frameScale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const frameOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  // Curtain: the photo is cropped in from top+bottom and opens up as it
  // settles — a distinct "reveal" beat, not just another fade/zoom.
  const clipInset = useTransform(scrollYProgress, [0, 1], [7, 0]);
  const clipPath = useTransform(clipInset, (v) => `inset(${v}% 0% ${v}% 0%)`);

  // Ken Burns: a slow continuous drift on the photo itself, independent of
  // the frame — depth, not just a static crop.
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.18, 1.05]);

  // Foreground text settles in a beat after the frame — layered parallax.
  const textY = useTransform(scrollYProgress, [0.15, 1], [22, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.75], [0, 1]);

  // Vignette deepens slightly as the frame arrives, for cinematic weight.
  const vignetteOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <div ref={frameRef} className="perspective-[1400px]">
      <motion.div
        style={
          reduce
            ? undefined
            : { rotateX, scale: frameScale, opacity: frameOpacity, willChange: "transform" }
        }
        className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] shadow-[0_50px_100px_-40px_rgba(20,20,15,0.55)] sm:aspect-[25/9] sm:rounded-[2rem]"
      >
        <motion.div
          style={reduce ? undefined : { clipPath }}
          className="absolute inset-0"
        >
          <motion.div
            style={reduce ? undefined : { scale: imageScale, willChange: "transform" }}
            className="absolute inset-0"
          >
            <Image
              src={images.turnkeyKitchen}
              alt="A complete commercial kitchen delivered by Veecos"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div
            style={reduce ? undefined : { opacity: vignetteOpacity }}
            className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent"
          />
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: textY, opacity: textOpacity }}
          className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white sm:p-9"
        >
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
              Turn-key project
            </p>
            <p className="mt-1.5 text-lg font-medium leading-tight sm:text-2xl">
              Designed, fabricated &amp; installed by Veecos
            </p>
          </div>
          <span className="hidden shrink-0 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur sm:inline-block">
            Since {site.established}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function KitchenShowcase() {
  return (
    <section className="relative bg-paper py-10 sm:py-14">
      <SealBadge
        sizeClass="size-24 lg:size-48"
        className="absolute -left-7 top-3 lg:-left-12 lg:top-10"
      />
      {/* Cutlery emblem — complements the chef hat, diagonally opposite */}
      <Image
        src="/cutlury-logo.svg"
        alt=""
        aria-hidden
        width={240}
        height={240}
        className="pointer-events-none absolute -right-7 top-[14%] size-24 -rotate-12 select-none opacity-[0.06] sm:-right-6 sm:size-28 lg:right-2 lg:top-[30%] lg:size-44"
      />
      <Container>
        {/* Heading */}
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
              <span className="h-px w-8 bg-ink/25" />
              Our work
            </span>
            <h2 className="mt-5 text-[clamp(2.25rem,4.6vw,4rem)] font-medium leading-[0.96] tracking-[-0.02em] text-ink">
              Built for real, working kitchens
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/55">
              From the first layout to the final weld — turn-key commercial
              kitchens engineered to run, day after day.
            </p>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal delay={0.05}>
          <dl className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/10 pt-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                  <Counter to={s.to} />
                  {s.suffix}
                </dt>
                <dd className="mt-1.5 text-xs leading-snug text-ink/45">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Project image — cinematic scroll reveal */}
        <div className="mt-14">
          <CinematicFrame />
        </div>
      </Container>
    </section>
  );
}
