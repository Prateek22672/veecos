"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const KEY = "veecos:seo-overrides";
const SEO_CHANGED_EVENT = "veecos:seo-changed";

type Override = { title?: string; description?: string };

/**
 * Applies SEO edits made in /seo (stored in localStorage) to the live document
 * head for the current page — so the client sees their changes immediately in
 * this browser. It does NOT change what crawlers see (that requires the config
 * to be committed/deployed); it's a live preview aid for the SEO manager.
 */
export function SeoOverrides() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const apply = () => {
      let map: Record<string, Override> = {};
      try {
        map = JSON.parse(localStorage.getItem(KEY) || "{}");
      } catch {
        return;
      }
      const o = map[pathname];
      if (!o) return;
      if (o.title) document.title = o.title;
      if (o.description) {
        let el = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (!el) {
          el = document.createElement("meta");
          el.name = "description";
          document.head.appendChild(el);
        }
        el.content = o.description;
      }
    };

    apply();
    window.addEventListener(SEO_CHANGED_EVENT, apply);
    return () => window.removeEventListener(SEO_CHANGED_EVENT, apply);
  }, [pathname]);

  return null;
}
