"use client";

/* eslint-disable @next/next/no-img-element -- the chef mark is a fixed SVG/logo
   composition that must render exactly as designed (no next/image optimisation). */
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { SPLASH_DONE_EVENT } from "@/lib/use-splash-gate";

/**
 * Brand splash shown on every full page load / refresh. Renders the chef mark
 * (chef-face.svg + the VE logo placed on the hat) over a clean paper backdrop,
 * then fades out to reveal the site. CSS animations run pre-hydration so it
 * appears instantly with no flash; JS only handles the timed fade-out.
 */
export function SplashScreen() {
  const [phase, setPhase] = useState<"visible" | "leaving" | "gone">("visible");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const leave = setTimeout(() => setPhase("leaving"), 1300);
    const gone = setTimeout(() => {
      setPhase("gone");
      document.body.style.overflow = "";
      // Signal heroes to begin their entrance now that the splash is gone.
      (window as Window & { __splashDone?: boolean }).__splashDone = true;
      window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
    }, 1950);
    return () => {
      clearTimeout(leave);
      clearTimeout(gone);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[120] grid place-items-center bg-paper transition-opacity duration-700 ease-out",
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      {/* faint cutlery watermark for depth */}
      <img
        src="/cutlury-logo.svg"
        alt=""
        className="pointer-events-none absolute left-1/2 top-1/2 size-[34rem] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.04]"
      />

      <div className="relative flex flex-col items-center px-6">
        {/* ── Chef mark — exact composition, do not alter ── */}
        <div className="relative inline-block animate-splash-pop">
          {/* Main Chef Graphic */}
          <img
            src="/chef-face.svg"
            alt="Veecos chef"
            width={240}
            height={240}
            className="block h-auto mx-auto"
          />
          {/* Logo placed precisely on the right side of the hat */}
          <img
            src="/veecos-logo.png"
            alt="Veecos Logo"
            className="absolute top-[20%] left-[70%] h-auto w-[22px] rotate-[18deg] opacity-95 mix-blend-multiply pointer-events-none"
          />
        </div>

        {/* ── Official logo lockup (the brand mark — distinct from the chef art) ── */}
        <div className="animate-splash-rise mt-7 flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white p-1.5 ring-1 ring-ink/10">
            <img
              src="/veecos-logo.png"
              alt="Veecos logo"
              className="size-full rounded-full object-contain"
            />
          </span>
          <span className="flex flex-col text-left leading-none">
            <span className="text-xl font-bold tracking-[-0.01em] text-ink">
              VEECOS
            </span>
            <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.32em] text-ink/45">
              Canteen Equipments
            </span>
          </span>
        </div>

        {/* ── Loading bar ── */}
        <div className="mt-7 h-[3px] w-40 overflow-hidden rounded-full bg-ink/10">
          <div className="animate-splash-bar h-full w-full rounded-full bg-ink" />
        </div>
      </div>
    </div>
  );
}
