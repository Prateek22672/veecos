"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling. Initialises on mount, drives its own rAF loop, and
 * cleans up on unmount. Skipped entirely for users who prefer reduced motion.
 * Renders nothing — Lenis hooks the window scroll directly, so native scroll
 * (and motion/react's useScroll) keep working.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Expose so overlays (e.g. Modal) can pause/resume page scroll while open.
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
      (window as unknown as { lenis?: Lenis }).lenis = undefined;
    };
  }, []);

  // Reset scroll on every route change — Lenis otherwise keeps the previous
  // position, so a new page (e.g. a product) would open mid-scroll.
  // Exception: switching between category/range pages inside /products —
  // jumping to 0 there means re-scrolling past the hero every time, so we
  // land on the category bar instead, right above the new results.
  useEffect(() => {
    const prev = prevPathname.current;
    prevPathname.current = pathname;
    const bothInProducts =
      !!prev && prev.startsWith("/products/") && pathname.startsWith("/products/");
    const anchor = bothInProducts
      ? document.getElementById("category-nav")
      : null;
    const target = anchor
      ? anchor.getBoundingClientRect().top + window.scrollY - 88
      : 0;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { immediate: true });
    } else if (typeof window !== "undefined") {
      window.scrollTo(0, target);
    }
  }, [pathname]);

  return null;
}
