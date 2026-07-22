"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { ChefHat } from "lucide-react";

/**
 * next/image wrapper that falls back to a branded placeholder when the
 * source 404s (some catalog images live on S3 and may not be uploaded yet),
 * and shows a shimmer skeleton behind the image until it finishes loading —
 * so a slow S3 fetch reads as "loading", never as a blank/broken tile.
 */
export function SmartImage({
  src,
  alt,
  className,
  fallbackLabel,
  priority,
  ...rest
}: ImageProps & { fallbackLabel?: string }) {
  const [failed, setFailed] = useState(!src);
  const [loaded, setLoaded] = useState(false);
  // Only `fill` images (always inside a `relative` wrapper) get the absolute
  // skeleton overlay — small fixed-size icons (badges, logos) skip it so we
  // never render an absolutely-positioned div without a positioned parent.
  const isFill = "fill" in rest && rest.fill;

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-paper-2 to-line/60 text-ink/40",
          className,
        )}
        aria-label={alt}
      >
        <ChefHat className="size-9" strokeWidth={1.4} />
        {fallbackLabel && (
          <span className="px-4 text-center text-xs font-medium uppercase tracking-widest">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      {isFill && !loaded && (
        <div
          aria-hidden
          className={cn("skeleton absolute inset-0", className)}
        />
      )}
      <Image
        src={src}
        alt={alt}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={cn(
          className,
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        {...rest}
      />
    </>
  );
}
