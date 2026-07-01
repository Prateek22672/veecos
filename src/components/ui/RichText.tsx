import sanitizeHtml from "sanitize-html";
import { cn } from "@/lib/cn";

/**
 * Renders admin-authored rich text (HTML from the product description editor)
 * safely. Server-only sanitisation with a strict allow-list strips scripts,
 * event handlers and unsafe URLs before the HTML reaches the page. Plain-text
 * (legacy) descriptions are rendered with preserved line breaks.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "strong", "b", "em", "i", "u", "s", "span", "a", "mark",
    "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6",
    "blockquote", "hr", "code", "pre",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    th: ["colspan", "rowspan"],
    td: ["colspan", "rowspan"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  // Force external links to open safely.
  transformTags: {
    a: (_t, attribs) => ({
      tagName: "a",
      attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow" },
    }),
  },
};

export function RichText({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const value = html ?? "";
  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(value);

  if (!looksLikeHtml) {
    if (!value.trim()) return null;
    return (
      <p className={cn("whitespace-pre-line text-base leading-relaxed text-ink/65", className)}>
        {value}
      </p>
    );
  }

  // Wrap tables so wide ones scroll horizontally on mobile instead of overflowing.
  const clean = sanitizeHtml(value, OPTIONS)
    .replace(/<table/g, '<div class="rich-table"><table')
    .replace(/<\/table>/g, "</table></div>");
  if (!clean.trim()) return null;

  return (
    <div
      className={cn("rich-text", className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
