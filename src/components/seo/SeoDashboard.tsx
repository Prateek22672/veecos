"use client";

import { useEffect, useState } from "react";
import { Download, RotateCcw, Copy, Check, Info } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { PageSeo } from "@/lib/seo-config";
import { cn } from "@/lib/cn";

const KEY = "veecos:seo-overrides";
export const SEO_CHANGED_EVENT = "veecos:seo-changed";

type Editable = Pick<PageSeo, "title" | "description" | "keywords">;
type Overrides = Record<string, Partial<Editable>>;
type PageDef = PageSeo & { key: string };

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function SeoDashboard({
  defaults,
  siteUrl,
}: {
  defaults: PageDef[];
  siteUrl: string;
}) {
  const [overrides, setOverrides] = useState<Overrides>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load saved edits once on mount (localStorage isn't available during SSR).
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setOverrides(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: Overrides) => {
    setOverrides(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(SEO_CHANGED_EVENT));
  };

  const set = (path: string, field: keyof Editable, value: string) => {
    const val =
      field === "keywords"
        ? value.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
        : value;
    persist({ ...overrides, [path]: { ...overrides[path], [field]: val } });
  };
  const resetPage = (path: string) => {
    const next = { ...overrides };
    delete next[path];
    persist(next);
  };

  const dirtyCount = Object.keys(overrides).length;

  const copyConfig = () => {
    const body = defaults
      .map((p) => {
        const e: Editable = {
          title: overrides[p.path]?.title ?? p.title,
          description: overrides[p.path]?.description ?? p.description,
          keywords: overrides[p.path]?.keywords ?? p.keywords,
        };
        return `  ${p.key}: ${JSON.stringify(e, null, 4).replace(/\n/g, "\n  ")}`;
      })
      .join(",\n");
    navigator.clipboard.writeText(`{\n${body}\n}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="min-h-screen bg-paper pb-24 pt-28 sm:pt-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
              Internal tool
            </p>
            <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              SEO manager
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/55">
              View and fine-tune the title, description and keywords for each
              page. Edits preview live in this browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyConfig}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-charcoal"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy config"}
            </button>
            <button
              type="button"
              onClick={() =>
                download("veecos-seo.json", JSON.stringify(overrides, null, 2))
              }
              className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/20 px-5 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
            >
              <Download className="size-4" /> Export
            </button>
            <button
              type="button"
              disabled={dirtyCount === 0}
              onClick={() => persist({})}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/20 px-5 text-sm font-medium text-ink transition-colors hover:bg-ink/5 disabled:opacity-40"
            >
              <RotateCcw className="size-4" /> Reset all
            </button>
          </div>
        </div>

        {/* How publishing works */}
        <div className="mt-6 flex gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-sm text-ink/70">
          <Info className="mt-0.5 size-4.5 shrink-0 text-ink/40" />
          <p className="leading-relaxed">
            Your edits are saved in <b>this browser</b> and update the pages you
            view here immediately. To publish them so Google &amp; visitors see
            them, click <b>Copy config</b> (or <b>Export</b>) and send it to your
            developer to commit — or we can connect this to your admin panel for
            one-click live updates.
          </p>
        </div>

        {/* Pages */}
        <div className="mt-8 space-y-6">
          {defaults.map((p) => {
            const eff: Editable = {
              title: overrides[p.path]?.title ?? p.title,
              description: overrides[p.path]?.description ?? p.description,
              keywords: overrides[p.path]?.keywords ?? p.keywords,
            };
            const edited = !!overrides[p.path];
            return (
              <div
                key={p.path}
                className="rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(20,20,15,0.4)] sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-paper">
                      {p.label}
                    </span>
                    <code className="text-xs text-ink/50">{p.path}</code>
                    {edited && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
                        Edited
                      </span>
                    )}
                  </div>
                  {edited && (
                    <button
                      type="button"
                      onClick={() => resetPage(p.path)}
                      className="text-xs font-medium text-ink/50 transition-colors hover:text-ink"
                    >
                      Reset page
                    </button>
                  )}
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  {/* Editor */}
                  <div className="space-y-4">
                    <Field
                      label="Title"
                      value={eff.title}
                      onChange={(v) => set(p.path, "title", v)}
                      ideal={60}
                    />
                    <Field
                      label="Meta description"
                      value={eff.description}
                      onChange={(v) => set(p.path, "description", v)}
                      ideal={160}
                      idealMin={140}
                      textarea
                    />
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50">
                        Keywords (comma or line separated)
                      </label>
                      <textarea
                        rows={2}
                        value={eff.keywords.join(", ")}
                        onChange={(e) => set(p.path, "keywords", e.target.value)}
                        className="w-full resize-none rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink/40 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Google preview */}
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
                      Google preview
                    </p>
                    <div className="rounded-2xl border border-line bg-paper-2 p-4">
                      <p className="text-xs text-ink/60">
                        {siteUrl.replace(/^https?:\/\//, "")}
                        {p.path === "/" ? "" : p.path}
                      </p>
                      <p className="mt-1 line-clamp-1 text-[19px] leading-tight text-[#1a0dab]">
                        {eff.title}
                      </p>
                      <p className="mt-1 line-clamp-3 text-[13px] leading-snug text-ink/70">
                        {eff.description}
                      </p>
                    </div>
                    <p className="mt-2 text-[11px] text-ink/45">
                      Canonical: {siteUrl}
                      {p.path}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  ideal,
  idealMin = 0,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ideal: number;
  idealMin?: number;
  textarea?: boolean;
}) {
  const len = value.length;
  const ok = len <= ideal && len >= idealMin;
  const tone = ok ? "text-green-600" : len > ideal ? "text-red-500" : "text-amber-600";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
          {label}
        </label>
        <span className={cn("text-[11px] font-medium tabular-nums", tone)}>
          {len}
          {idealMin ? `/${idealMin}–${ideal}` : `/${ideal}`}
        </span>
      </div>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-none rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink/40 focus:bg-white"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-xl border border-line bg-paper px-3.5 text-sm text-ink outline-none focus:border-ink/40 focus:bg-white"
        />
      )}
    </div>
  );
}
