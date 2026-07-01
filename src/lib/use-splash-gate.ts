"use client";

import { useEffect, useState } from "react";

/** Fired by <SplashScreen /> once it has fully faded out. */
export const SPLASH_DONE_EVENT = "veecos:splash-done";

type SplashWindow = Window & { __splashDone?: boolean };

/**
 * Returns true once the splash screen has finished, so hero entrance animations
 * can start *after* the splash — not while they're hidden behind it. Resolves
 * immediately on later client navigations (the splash only runs on full load).
 */
export function useSplashGate(): boolean {
  // Read the flag lazily — true immediately on client navigations (SSR = false).
  const [ready, setReady] = useState(
    () =>
      typeof window !== "undefined" &&
      !!(window as SplashWindow).__splashDone,
  );

  useEffect(() => {
    if (ready) return;
    const onDone = () => setReady(true);
    window.addEventListener(SPLASH_DONE_EVENT, onDone);
    // Safety net: never leave the hero hidden if the splash signal is missed.
    const fallback = setTimeout(() => setReady(true), 3500);
    return () => {
      window.removeEventListener(SPLASH_DONE_EVENT, onDone);
      clearTimeout(fallback);
    };
  }, [ready]);

  return ready;
}
