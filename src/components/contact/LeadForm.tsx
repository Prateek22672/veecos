"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { submitLead } from "@/lib/leads";
import { cn } from "@/lib/cn";

type Status = "idle" | "loading" | "success" | "error";

export function LeadForm({
  productId,
  productName,
  compact = false,
}: {
  productId?: string;
  productName?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const firstName = String(data.get("firstName") ?? "").trim();
    const lastName = String(data.get("lastName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    if (!firstName || !email) {
      setStatus("error");
      setError("Please fill in your name and email.");
      return;
    }

    setStatus("loading");
    setError(undefined);

    const baseMessage = String(data.get("message") ?? "").trim();
    const message = productName
      ? `[Enquiry about: ${productName}] ${baseMessage}`
      : baseMessage;

    const res = await submitLead({
      LeadType: productId ? "PRODUCT_SPECIFIC" : "GENERAL",
      ProductId: productId,
      ContactData: {
        Name: [firstName, lastName].filter(Boolean).join(" "),
        Email: email,
        Phone: String(data.get("phone") ?? "").trim() || undefined,
        CompanyName: String(data.get("company") ?? "").trim() || undefined,
        Message: message || undefined,
      },
    });

    if (res.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
      setError(res.message ?? "Something went wrong. Please try again or call us.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-ink/10 bg-paper-2 p-10 text-center">
        <CheckCircle2 className="size-12 text-ink" strokeWidth={1.4} />
        <h3 className="mt-4 text-xl font-semibold text-ink">Thank you!</h3>
        <p className="mt-2 max-w-sm text-sm text-ink/65">
          Your enquiry has reached our team. We&apos;ll get back to you shortly.
          For anything urgent, call us on +91 9848196184.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-ink underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Field name="firstName" label="First name" required />
        <Field name="lastName" label="Last name" />
      </div>
      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Field name="email" label="Email" type="email" required />
        <Field name="phone" label="Phone" type="tel" />
      </div>
      <Field name="company" label="Company / Organisation" />
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink/80">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={compact ? 3 : 4}
          placeholder={
            productName
              ? `I'm interested in the ${productName}…`
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
          "Submit enquiry"
        )}
      </button>
      <p className="text-center text-xs text-ink/45">
        We&apos;ll never share your details. Or email{" "}
        <a href="mailto:sales@vce.co.in" className="underline">
          sales@vce.co.in
        </a>
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink/80">
        {label}
        {required && <span className="text-ink/40"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink/40 focus:bg-white focus:ring-2 focus:ring-ink/15"
      />
    </div>
  );
}
