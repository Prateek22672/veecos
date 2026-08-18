"use client";

import { Star, Quote } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/cn";

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Most testimonials won't have one — always render without it looking fine. */
  avatarUrl?: string;
  rating?: number;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return (parts.map((w) => w[0]).join("") || "V").toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < rating ? "fill-brand text-brand" : "fill-transparent text-ink/15",
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  // "Designation · Company", either half optional.
  const meta = [item.role, item.company].filter(Boolean).join(" · ");

  return (
    <div className="flex w-[19rem] shrink-0 flex-col gap-4 rounded-2xl border border-line bg-white p-6 shadow-soft sm:w-[22rem]">
      <div className="flex items-start justify-between gap-3">
        <Quote className="size-6 text-brand/70" fill="currentColor" />
        {typeof item.rating === "number" && <Stars rating={item.rating} />}
      </div>

      <p className="line-clamp-5 text-[15px] leading-relaxed text-ink/75">
        &ldquo;{item.quote}&rdquo;
      </p>

      <div className="mt-auto flex items-center gap-3 border-t border-line pt-4">
        {item.avatarUrl ? (
          // object-contain (not cover): the avatar field is used for both
          // headshot photos and wide company logos/wordmarks (e.g. "ERS") -
          // cover would zoom in and crop a wide logo's edges off. Contain
          // always shows the whole image; the padding keeps it off the
          // circular edge so a rectangular logo doesn't touch the curve.
          <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-paper-2 p-1.5">
            <SmartImage
              src={item.avatarUrl}
              alt={item.name}
              fill
              sizes="44px"
              className="object-contain"
            />
          </div>
        ) : (
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-ink/6 text-sm font-semibold text-ink">
            {initials(item.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
          {meta && (
            <p className="truncate text-xs text-ink/55">{meta}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  slow = false,
}: {
  items: TestimonialItem[];
  reverse?: boolean;
  slow?: boolean;
}) {
  const strip = [...items, ...items];
  return (
    <div className="marquee-pause marquee-mask flex overflow-hidden">
      <div
        className={cn(
          "flex shrink-0 items-stretch gap-5 pr-5",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          slow && "marquee-slow",
        )}
      >
        {strip.map((item, i) => (
          <TestimonialCard key={`${item.name}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

/**
 * Auto-scrolling testimonial rows (reuses the same marquee CSS as the clients
 * logo strip). With few testimonials, a marquee of duplicated cards looks
 * sparse and repetitive, so a small set renders as a static centered grid
 * instead — the layout adapts to however many the admin has published.
 */
export function TestimonialMarquee({ items }: { items: TestimonialItem[] }) {
  if (items.length === 0) return null;

  if (items.length <= 3) {
    return (
      <div className="flex flex-wrap items-stretch justify-center gap-5 px-5">
        {items.map((item, i) => (
          <TestimonialCard key={`${item.name}-${i}`} item={item} />
        ))}
      </div>
    );
  }

  const mid = Math.ceil(items.length / 2);
  const rowA = items.slice(0, mid);
  const rowB = items.slice(mid);

  return (
    <div className="flex flex-col gap-5">
      <MarqueeRow items={rowA} />
      <MarqueeRow items={rowB.length ? rowB : rowA} reverse slow />
    </div>
  );
}
