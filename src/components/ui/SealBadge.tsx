"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Decorative chef-hat brand mark. Purely visual (pointer-events-none), faint,
 * with a gentle idle float. Positioned via `className`.
 */
export function SealBadge({
  className,
  sizeClass = "size-48",
}: {
  className?: string;
  sizeClass?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      animate={reduce ? undefined : { y: [0, -12, 0], rotate: [-3, 3, -3] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className={cn("pointer-events-none", className)}
    >
      <Image
        src="/chef-hat.svg"
        alt=""
        width={200}
        height={200}
        unoptimized
        className={cn(sizeClass, "opacity-10")}
      />
    </motion.div>
  );
}
