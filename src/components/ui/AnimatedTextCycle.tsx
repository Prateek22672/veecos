"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/cn";

/** Cycles through words with a smooth blur/slide, auto-sizing the slot. */
export default function AnimatedTextCycle({
  words,
  interval = 2600,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<string>("auto");
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = measureRef.current?.children[index] as HTMLElement | undefined;
    if (el) setWidth(`${el.getBoundingClientRect().width}px`);
  }, [index]);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [interval, words.length]);

  return (
    <>
      {/* hidden measurer */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none absolute opacity-0"
        style={{ visibility: "hidden" }}
      >
        {words.map((w, i) => (
          <span key={i} className={cn("font-semibold", className)}>
            {w}
          </span>
        ))}
      </div>

      <motion.span
        className="relative inline-block align-bottom"
        animate={{ width }}
        transition={{ type: "spring", stiffness: 150, damping: 16, mass: 1.1 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            className={cn("inline-block whitespace-nowrap font-semibold", className)}
            initial={{ y: -18, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 18, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}
