"use client";

import { motion } from "motion/react";
import { Phone } from "lucide-react";
import { site } from "@/lib/site";
import { EnquiryDialog } from "@/components/contact/EnquiryDialog";

export function BottomBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6"
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
