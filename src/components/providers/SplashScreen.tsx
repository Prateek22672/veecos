"use client";

/* eslint-disable @next/next/no-img-element -- the chef mark is a fixed SVG/logo
   composition that must render exactly as designed (no next/image optimisation). */
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

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
            className="absolute top-[19%] left-[63%] h-auto w-[22px] rotate-[18deg] opacity-95 mix-blend-multiply pointer-events-none"
          />
        </div>

        {/* ── Wordmark ── */}
        <div className="animate-splash-rise mt-6 text-center">
          <p className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            VEECOS
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.32em] text-ink/45">
            Canteen Equipments
          </p>
        </div>

        {/* ── Loading bar ── */}
        <div className="mt-7 h-[3px] w-40 overflow-hidden rounded-full bg-ink/10">
          <div className="animate-splash-bar h-full w-full rounded-full bg-ink" />
        </div>
      </div>
    </div>
  );
}
