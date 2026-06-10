"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { ChefHat } from "lucide-react";

/**
 * next/image wrapper that falls back to a branded placeholder when the
 * source 404s (some catalog images live on S3 and may not be uploaded yet).
 */
export function SmartImage({
  src,
  alt,
  className,
  fallbackLabel,
  ...rest
}: ImageProps & { fallbackLabel?: string }) {
  const [failed, setFailed] = useState(!src);

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
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
