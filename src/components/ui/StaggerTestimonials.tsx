"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/cn";

const SQRT_5000 = Math.sqrt(5000);
const AUTOPLAY_MS = 7000;

export interface StaggerItem {
  quote: string;
  name: string;
  role: string;
}
type Item = StaggerItem & { tempId: number };

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function rotate(list: Item[], steps: number): Item[] {
  const next = [...list];
  if (steps > 0) {
    for (let i = steps; i > 0; i--) {
      const it = next.shift();
      if (it) next.push({ ...it, tempId: it.tempId + list.length });
    }
  } else {
    for (let i = steps; i < 0; i++) {
      const it = next.pop();
      if (it) next.unshift({ ...it, tempId: it.tempId - list.length });
    }
  }
  return next;
}

interface CardProps {
  position: number;
  item: Item;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<CardProps> = ({
  position,
  item,
  handleMove,
  cardSize,
}) => {
  const isCenter = position === 0;
  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 border-ink bg-ink text-white"
          : "z-0 border-line bg-white text-ink hover:border-ink/40",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath:
          "polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)",
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px var(--color-ink)" : "none",
      }}
    >
      <span
        className={cn(
          "absolute block origin-top-right rotate-45",
          isCenter ? "bg-white/20" : "bg-line",
        )}
        style={{ right: -1, top: 48, width: SQRT_5000, height: 1 }}
      />
      <div
        className={cn(
          "mb-4 grid size-12 place-items-center rounded-full text-sm font-semibold",
          isCenter ? "bg-white/15 text-white" : "bg-ink/6 text-ink",
        )}
      >
        {initials(item.name)}
      </div>
      <Quote
        className={cn("mb-3 size-6", isCenter ? "text-white/70" : "text-ink/40")}
        fill="currentColor"
      />
      <h3
        className={cn(
          "text-base font-medium leading-snug sm:text-lg",
          isCenter ? "text-white" : "text-ink",
        )}
      >
        {item.quote}
      </h3>
      <p
        className={cn(
          "absolute bottom-8 left-8 right-8 mt-2 text-sm",
          isCenter ? "text-white/70" : "text-ink/55",
        )}
      >
        — {item.name}, {item.role}
      </p>
    </div>
  );
};

function NavButtons({ onMove }: { onMove: (s: number) => void }) {
  return (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => onMove(-1)}
        className="grid size-12 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={() => onMove(1)}
        className="grid size-12 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
        aria-label="Next testimonial"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

export function StaggerTestimonials({ items }: { items: StaggerItem[] }) {
  const [cardSize, setCardSize] = useState(365);
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);
  const [list, setList] = useState<Item[]>(
    items.map((it, i) => ({ ...it, tempId: i })),
  );

  const handleMove = (steps: number) => setList((prev) => rotate(prev, steps));

  useEffect(() => {
    const update = () => {
      const wide = window.matchMedia("(min-width: 640px)").matches;
      setIsMobile(!wide);
      setCardSize(wide ? 365 : 290);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Smooth autoplay — advances on an interval, pauses on hover / reduced-motion.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setList((prev) => rotate(prev, 1)), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  // ── Mobile: one clean card, crossfading ──
  if (isMobile) {
    const mid = list.length % 2 ? (list.length + 1) / 2 : list.length / 2;
    const center = list[mid] ?? list[0];
    return (
      <div
        className="w-full px-1"
        onTouchStart={() => setPaused(true)}
      >
        <div className="relative min-h-[18rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={center.tempId}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-ink bg-ink p-7 text-white shadow-[0_24px_60px_-30px_rgba(20,20,15,0.6)]"
            >
              <div className="grid size-12 place-items-center rounded-full bg-white/15 text-sm font-semibold text-white">
                {initials(center.name)}
              </div>
              <Quote className="mt-5 size-6 text-white/70" fill="currentColor" />
              <p className="mt-3 text-lg font-medium leading-snug text-white">
                {center.quote}
              </p>
              <p className="mt-5 text-sm text-white/65">
                — {center.name}, {center.role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-6">
          <NavButtons onMove={handleMove} />
        </div>
      </div>
    );
  }

  // ── Desktop: staggered fan ──
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 560 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {list.map((item, index) => {
        const position =
          list.length % 2
            ? index - (list.length + 1) / 2
            : index - list.length / 2;
        return (
          <TestimonialCard
            key={item.tempId}
            item={item}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <NavButtons onMove={handleMove} />
      </div>
    </div>
  );
}
