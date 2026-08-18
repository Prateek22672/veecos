"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Phone } from "lucide-react";
import { site } from "@/lib/site";
import { EnquiryDialog } from "@/components/contact/EnquiryDialog";

// Matches the bottom-4 / sm:bottom-6 resting position below.
const BASE_BOTTOM = 16;
const BASE_BOTTOM_SM = 24;
const GAP_ABOVE_FOOTER = 16;

export function BottomBar() {
  // Being `fixed`, this pill normally sits at a constant viewport position —
  // which means once the footer scrolls up underneath it, it overlaps and
  // blocks the footer's own links. Instead of hiding it, dock it right above
  // the footer's top edge as it approaches, and let it settle back to its
  // normal resting spot on scroll-up — driven by how far the footer has
  // intruded into the viewport, written straight to the DOM (not React
  // state) so it stays smooth at 60fps without re-rendering every scroll tick.
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = document.querySelector("footer");
    const el = wrapRef.current;
    if (!footer || !el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const footerTop = footer.getBoundingClientRect().top;
      const base = window.innerWidth >= 640 ? BASE_BOTTOM_SM : BASE_BOTTOM;
      const overlap = window.innerHeight - footerTop;
      el.style.bottom = `${Math.max(base, overlap + GAP_ABOVE_FOOTER)}px`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 transition-[bottom] duration-150 ease-out sm:bottom-6"
    >
      <div className="flex items-center gap-1 rounded-full border border-white/60 bg-white/70 p-1.5 shadow-[0_14px_44px_-12px_rgba(28,27,27,0.4)] ring-1 ring-inset ring-white/50 backdrop-blur-2xl sm:gap-1.5">
        <a
          href={`tel:${site.phones[0].replace(/\s/g, "")}`}
          className="flex items-center gap-2 rounded-full px-4 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-ink/5 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <Phone className="size-4.5 shrink-0 text-ink/60 sm:size-4" />
          Call us
        </a>

        {/* Get a Quote — now beside "Call us" on every screen */}
        <EnquiryDialog
          label="Get a Quote"
          trigger={{
            size: "md",
            withArrow: true,
            className: "h-12 px-5 text-[15px] sm:h-10 sm:text-sm",
          }}
        />
      </div>
    </motion.div>
  );
}
