"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/cn";

const SQRT_5000 = Math.sqrt(5000);

export interface StaggerItem {
  quote: string;
  name: string;
  role: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

interface CardProps {
  position: number;
  item: StaggerItem & { tempId: number };
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
          : "z-0 border-line bg-white text-ink hover:border-brand",
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
        boxShadow: isCenter ? "0px 8px 0px 4px var(--color-brand)" : "none",
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
          "mb-4 grid size-12 place-items-center rounded-full text-sm font-bold",
          isCenter ? "bg-brand text-ink" : "bg-brand/15 text-brand-700",
        )}
      >
        {initials(item.name)}
      </div>
      <Quote
        className={cn("mb-3 size-6", isCenter ? "text-brand" : "text-brand-700")}
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

export function StaggerTestimonials({ items }: { items: StaggerItem[] }) {
  const [cardSize, setCardSize] = useState(365);
  const [list, setList] = useState(items.map((it, i) => ({ ...it, tempId: i })));

  const handleMove = (steps: number) => {
    const newList = [...list];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 560 }}>
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

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className="grid size-12 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-brand hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={() => handleMove(1)}
          className="grid size-12 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-brand hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Next testimonial"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
