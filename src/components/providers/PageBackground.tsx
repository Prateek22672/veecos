"use client";

import { useEffect } from "react";

/**
 * Some pages (product detail, etc.) are white top-to-bottom, while the
 * shared <body> is cream (bg-paper). On mobile, overscroll rubber-banding
 * reveals the <body> background past the page's own content, so on a
 * white page that shows as a jarring cream flash. This swaps the body
 * background to match for as long as the page is mounted.
 */
export function PageBackground({ color = "#ffffff" }: { color?: string }) {
  useEffect(() => {
    const { body } = document;
    const prev = body.style.backgroundColor;
    body.style.backgroundColor = color;
    return () => {
      body.style.backgroundColor = prev;
    };
  }, [color]);

  return null;
}
