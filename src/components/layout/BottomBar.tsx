"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Phone, ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";

export function BottomBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6"
    >
      <div className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/70 p-1.5 shadow-[0_14px_44px_-12px_rgba(28,27,27,0.4)] ring-1 ring-inset ring-white/50 backdrop-blur-2xl">
        <a
          href={`tel:${site.phones[0].replace(/\s/g, "")}`}
          className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 sm:px-5"
        >
          <Phone className="size-4 text-brand-700" />
          Call us
        </a>
        <span className="h-6 w-px bg-line" />
        <Link
          href="/contact"
          className="group flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink shadow-[0_8px_20px_-8px_rgba(237,205,31,0.9)] transition-all hover:bg-brand-600 hover:-translate-y-0.5 sm:px-6"
        >
          Get a Quote
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}
