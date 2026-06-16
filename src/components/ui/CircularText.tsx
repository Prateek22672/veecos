"use client";

import { useEffect } from "react";
import { motion, useAnimation, useMotionValue, type Transition } from "motion/react";
import { cn } from "@/lib/cn";

type Hover = "slowDown" | "speedUp" | "pause" | "goBonkers";

const rotationTransition = (duration: number, from: number, loop = true) => ({
  from,
  to: from + 360,
  ease: "linear" as const,
  duration,
  type: "tween" as const,
  repeat: loop ? Infinity : 0,
});

const makeTransition = (duration: number, from: number): Transition =>
  ({
    rotate: rotationTransition(duration, from),
    scale: { type: "spring", damping: 20, stiffness: 300 },
  }) as Transition;

/** Rotating circular text seal (React Bits, adapted to TS). Inherits text color. */
export function CircularText({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
}: {
  text: string;
  spinDuration?: number;
  onHover?: Hover;
  className?: string;
}) {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: makeTransition(spinDuration, start),
    });
  }, [spinDuration, text, controls, rotation]);

  const handleHoverStart = () => {
    const start = rotation.get();
    let transition: Transition;
    let scaleVal = 1;
    switch (onHover) {
      case "slowDown":
        transition = makeTransition(spinDuration * 2, start);
        break;
      case "speedUp":
        transition = makeTransition(spinDuration / 4, start);
        break;
      case "pause":
        transition = {
          rotate: { type: "spring", damping: 20, stiffness: 300 },
          scale: { type: "spring", damping: 20, stiffness: 300 },
        } as Transition;
        break;
      case "goBonkers":
        transition = makeTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transition = makeTransition(spinDuration, start);
    }
    controls.start({ rotate: start + 360, scale: scaleVal, transition });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: makeTransition(spinDuration, start),
    });
  };

  return (
    <motion.div
      className={cn(
        "relative size-[170px] rounded-full text-center font-semibold",
        className,
      )}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const factor = Math.PI / letters.length;
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;
        return (
          <span
            key={i}
            className="absolute inset-0 inline-block text-[13px] uppercase tracking-[0.1em]"
            style={{ transform, WebkitTransform: transform }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
}
