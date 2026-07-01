"use client";

import { useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/cn";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [""];

  return (
    <div className="lg:sticky lg:top-24">
      {/* Main — the whole product shown (contain) on a clean padded frame */}
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-soft sm:p-8 lg:max-w-none">
        <div className="relative h-full w-full">
          <SmartImage
            key={active}
            src={list[active]}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 42vw"
            fallbackLabel={alt}
            className="object-contain"
          />
        </div>
      </div>

      {list.length > 1 && (
        <div className="mx-auto mt-4 grid max-w-md grid-cols-5 gap-2.5 sm:grid-cols-6 lg:max-w-none">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-white p-1.5 transition-all",
                active === i
                  ? "border-ink ring-2 ring-ink/15"
                  : "border-line hover:border-ink/30",
              )}
            >
              <div className="relative h-full w-full">
                <SmartImage
                  src={img}
                  alt={`${alt} thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
