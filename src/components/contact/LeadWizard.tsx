"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Package,
  Headset,
  ChevronLeft,
  Search,
  Loader2,
  AlertCircle,
  ArrowRight,
  FolderTree,
  Box,
  Pencil,
} from "lucide-react";
import { submitLead } from "@/lib/leads";
import { cn } from "@/lib/cn";

type CatItem = {
  kind: "category" | "product";
  id: string;
  name: string;
  context?: string;
};
type Step = "intent" | "select" | "details" | "success";
type Intent = "quote" | "consult";

const EASE = [0.16, 1, 0.3, 1] as const;

export function LeadWizard({
  productId,
  productName,
}: {
  productId?: string;
  productName?: string;
}) {
  const preset: CatItem | null = productName
    ? { kind: "product", id: productId ?? "", name: productName }
    : null;

  const [step, setStep] = useState<Step>(preset ? "details" : "intent");
  const [intent, setIntent] = useState<Intent>("quote");
  const [selected, setSelected] = useState<CatItem | null>(preset);
  const [items, setItems] = useState<CatItem[]>([]);
  const [loadingCat, setLoadingCat] = useState(false);
  const [query, setQuery] = useState("");
  const [f, setF] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string>();

  async function loadCatalog() {
    if (items.length || loadingCat) return;
    setLoadingCat(true);
    try {
      const res = await fetch("/api/catalog");
      const json = await res.json();
      setItems(Array.isArray(json.items) ? json.items : []);
    } catch {
      /* degrade silently — the user can still skip */
    } finally {
      setLoadingCat(false);
    }
  }

  const q = query.trim().toLowerCase();
  const categories = items.filter((i) => i.kind === "category");
  const filtered = (q ? items.filter((i) => i.name.toLowerCase().includes(q)) : categories).slice(0, 18);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.firstName.trim() || !f.email.trim()) {
      setStatus("error");
      setError("Please add your name and email.");
      return;
    }
    setStatus("loading");
    setError(undefined);
    const ctx =
      intent === "consult"
        ? "Consultation request"
        : selected
          ? `Interested in: ${selected.name}`
          : "General quote";
    const message = [`[${ctx}]`, f.message.trim()].filter(Boolean).join(" ");
    const res = await submitLead({
      LeadType: selected?.kind === "product" ? "PRODUCT_SPECIFIC" : "GENERAL",
      ProductId: selected?.kind === "product" && selected.id ? selected.id : undefined,
      ContactData: {
        Name: [f.firstName, f.lastName].map((s) => s.trim()).filter(Boolean).join(" "),
        Email: f.email.trim(),
        Phone: f.phone.trim() || undefined,
        CompanyName: f.company.trim() || undefined,
        Message: message || undefined,
      },
    });
    if (res.ok) {
      setStep("success");
    } else {
      setStatus("error");
      setError(res.message ?? "Something went wrong. Please try again or call us.");
    }
  }

  const stepIndex = step === "intent" ? 0 : step === "select" ? 1 : step === "details" ? (intent === "consult" ? 1 : 2) : 3;
  const totalDots = intent === "consult" ? 2 : 3;
  const canGoBack = !preset && step !== "intent" && step !== "success";

  function back() {
    if (step === "details") setStep(intent === "consult" ? "intent" : "select");
    else if (step === "select") setStep("intent");
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        {canGoBack && (
          <button
            type="button"
            onClick={back}
            aria-label="Back"
            className="-ml-1 grid size-8 shrink-0 place-items-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold tracking-tight text-ink">
            {step === "success"
              ? "Request received"
              : step === "intent"
                ? "How can we help?"
                : step === "select"
                  ? "What are you interested in?"
                  : "Your details"}
          </h3>
          <p className="mt-0.5 text-sm text-ink/55">
            {step === "success"
              ? "We'll be in touch shortly."
              : step === "intent"
                ? "Get a tailored quote or talk to an expert."
                : step === "select"
                  ? "Pick a range — or skip if you're not sure."
                  : "We typically respond within one business day."}
          </p>
        </div>
        {step !== "success" && (
          <div className="hidden items-center gap-1.5 sm:flex">
            {Array.from({ length: totalDots }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i <= stepIndex ? "w-5 bg-ink" : "w-1.5 bg-ink/20",
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait" initial={false}>
          {/* ── Step 1: intent ── */}
          {step === "intent" && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="space-y-3"
            >
              <IntentCard
                icon={<Package className="size-5" />}
                title="Request a product quote"
                sub="Choose a category or product and get pricing."
                onClick={() => {
                  setIntent("quote");
                  setStep("select");
                  loadCatalog();
                }}
              />
              <IntentCard
                icon={<Headset className="size-5" />}
                title="Talk to an expert"
                sub="Not sure yet? Tell us your needs and we'll guide you."
                onClick={() => {
                  setIntent("consult");
                  setSelected(null);
                  setStep("details");
                }}
              />
            </motion.div>
          )}

          {/* ── Step 2: select ── */}
          {step === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <div className="flex items-center gap-2.5 rounded-full border border-ink/15 bg-white px-4 py-2.5 focus-within:border-ink/40">
                <Search className="size-4 shrink-0 text-ink/40" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search categories & products…"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
                />
              </div>

              <div className="mt-4 max-h-64 overflow-y-auto">
                {loadingCat ? (
                  <div className="grid gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-11 animate-pulse rounded-xl bg-ink/5" />
                    ))}
                  </div>
                ) : filtered.length > 0 ? (
                  <ul className="grid gap-2">
                    {filtered.map((item) => (
                      <li key={`${item.kind}-${item.id}`}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(item);
                            setStep("details");
                          }}
                          className="group flex w-full items-center gap-3 rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-left transition-all hover:border-ink/30 hover:bg-ink/[0.02]"
                        >
                          <span
                            className={cn(
                              "grid size-8 shrink-0 place-items-center rounded-lg",
                              item.kind === "category" ? "bg-ink/6 text-ink" : "bg-ink text-paper",
                            )}
                          >
                            {item.kind === "category" ? (
                              <FolderTree className="size-4" />
                            ) : (
                              <Box className="size-4" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-ink">
                              {item.name}
                            </span>
                            {item.context && (
                              <span className="block truncate text-[11px] uppercase tracking-[0.1em] text-ink/40">
                                {item.context}
                              </span>
                            )}
                          </span>
                          <ArrowRight className="size-4 text-ink/30 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="py-6 text-center text-sm text-ink/50">
                    {items.length === 0
                      ? "Couldn't load the catalogue — you can still continue below."
                      : `No matches for “${query.trim()}”.`}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setStep("details");
                }}
                className="mt-4 w-full rounded-full border border-ink/15 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30 hover:text-ink"
              >
                I&apos;m not sure yet — skip this
              </button>
            </motion.div>
          )}

          {/* ── Step 3: details ── */}
          {step === "details" && (
            <motion.form
              key="details"
              onSubmit={submit}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="space-y-4"
              noValidate
            >
              {/* Selection summary */}
              <div className="flex items-center gap-2.5 rounded-xl bg-ink/[0.04] px-3.5 py-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-ink text-paper">
                  {intent === "consult" ? (
                    <Headset className="size-3.5" />
                  ) : selected?.kind === "product" ? (
                    <Box className="size-3.5" />
                  ) : (
                    <Package className="size-3.5" />
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-ink">
                  {intent === "consult"
                    ? "Consultation with an expert"
                    : selected
                      ? selected.name
                      : "General quote"}
                </span>
                {!preset && (
                  <button
                    type="button"
                    onClick={() => setStep(intent === "consult" ? "intent" : "select")}
                    className="inline-flex items-center gap-1 text-xs font-medium text-ink/55 transition-colors hover:text-ink"
                  >
                    <Pencil className="size-3" />
                    Change
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <WField label="First name" required value={f.firstName} onChange={set("firstName")} />
                <WField label="Last name" value={f.lastName} onChange={set("lastName")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <WField label="Email" type="email" required value={f.email} onChange={set("email")} />
                <WField label="Phone" type="tel" value={f.phone} onChange={set("phone")} />
              </div>
              <WField label="Company / Organisation" value={f.company} onChange={set("company")} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/80">
                  Message
                </label>
                <textarea
                  rows={3}
                  value={f.message}
                  onChange={set("message")}
                  placeholder={
                    selected
                      ? `Tell us your requirements for the ${selected.name}…`
                      : "Tell us about your kitchen project…"
                  }
                  className="w-full resize-none rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink/40 focus:bg-white focus:ring-2 focus:ring-ink/15"
                />
              </div>

              {status === "error" && (
                <p className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="size-4" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-8 text-sm font-medium text-white transition-all hover:bg-charcoal disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>{intent === "consult" ? "Request consultation" : "Submit quote request"}</>
                )}
              </button>
              <p className="text-center text-xs text-ink/45">
                We&apos;ll never share your details. Or email{" "}
                <a href="mailto:sales@vce.co.in" className="underline">
                  sales@vce.co.in
                </a>
              </p>
            </motion.form>
          )}

          {/* ── Success ── */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-col items-center rounded-2xl border border-green-200/70 bg-gradient-to-b from-green-50 to-paper-2 p-8 text-center sm:p-10"
            >
              <SuccessTick />
              <motion.h4
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
                className="mt-5 text-2xl font-semibold text-ink"
              >
                Thank you!
              </motion.h4>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4, ease: EASE }}
                className="mt-2 max-w-sm text-sm leading-relaxed text-ink/65"
              >
                {intent === "consult"
                  ? "Your consultation request is in. Our team will reach out shortly."
                  : "Your quote request is in. We'll get back with pricing & options shortly."}{" "}
                For anything urgent, call{" "}
                <a
                  href="tel:+919848196184"
                  className="font-medium text-ink underline underline-offset-4"
                >
                  +91 9848196184
                </a>
                .
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Celebratory animated green check — circle springs in, ring pulses, tick draws. */
function SuccessTick() {
  return (
    <div className="relative grid place-items-center">
      <motion.span
        className="absolute size-24 rounded-full bg-green-500/15"
        initial={{ scale: 0.5, opacity: 0.9 }}
        animate={{ scale: 1.7, opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
      />
      <motion.div
        className="grid size-20 place-items-center rounded-full bg-green-500 text-white shadow-[0_14px_34px_-10px_rgba(34,197,94,0.7)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.05 }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-10"
          aria-hidden
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

function IntentCard({
  icon,
  title,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl border border-ink/12 bg-white p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-[0_18px_44px_-26px_rgba(20,20,15,0.4)]"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink text-paper">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-medium text-ink">{title}</span>
        <span className="mt-0.5 block text-sm leading-snug text-ink/55">{sub}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

function WField({
  label,
  type = "text",
  required = false,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink/80">
        {label}
        {required && <span className="text-ink/40"> *</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink/40 focus:bg-white focus:ring-2 focus:ring-ink/15"
      />
    </div>
  );
}
