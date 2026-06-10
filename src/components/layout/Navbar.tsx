"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      // Hide on scroll-down, reveal on scroll-up.
      if (y > lastY.current && y > 140) setHidden(true);
      else if (y < lastY.current) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-4 pt-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 sm:pt-4",
        hidden && !open ? "-translate-y-[140%]" : "translate-y-0",
      )}
    >
      {/* Floating glass pill */}
      <div
        className={cn(
          "relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 rounded-full border pl-4 pr-2.5 transition-all duration-500",
          "border-white/60 ring-1 ring-inset ring-white/50 backdrop-blur-2xl",
          scrolled || open
            ? "bg-white/85 shadow-[0_12px_40px_-12px_rgba(28,27,27,0.3)]"
            : "bg-white/70 shadow-[0_10px_34px_-14px_rgba(28,27,27,0.22)]",
        )}
      >
        {/* glossy top sheen */}
        <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        <Logo />

        <ul className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium tracking-tight transition-colors",
                  isActive(item.href) ? "text-ink" : "text-ink/60 hover:text-ink",
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-brand/20 ring-1 ring-inset ring-brand/30"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/contact" size="md" withArrow>
            Get a Quote
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid size-11 place-items-center rounded-full border border-white/60 bg-white/50 text-ink ring-1 ring-inset ring-white/50 transition-colors hover:bg-white/80 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden"
          >
            <div className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-card ring-1 ring-inset ring-white/50 backdrop-blur-2xl">
              <ul className="flex flex-col p-2">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium",
                        isActive(item.href)
                          ? "bg-brand/15 text-ink"
                          : "text-ink/70",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-line/70 p-4">
                <Button
                  href="/contact"
                  className="w-full"
                  withArrow
                  onClick={() => setOpen(false)}
                >
                  Get a Quote
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
