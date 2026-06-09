"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone, Mail, Building2 } from "lucide-react";
import { cn } from "../lib/cn";

export interface CtaContactSalesPanelProps {
  className?: string;
  onSubmit?: (data: { name: string; email: string; company: string; seats: string }) => void;
  eyebrow?: string;
  title?: string;
  description?: string;
  email?: string;
  phone?: string;
  seatTiers?: string[];
  submitLabel?: string;
}

const DEFAULT_SEAT_TIERS = ["10-50", "50-200", "200-1k", "1k+"];

export function CtaContactSalesPanel({
  className,
  onSubmit,
  eyebrow = "Enterprise",
  title = "Talk to sales",
  description = "Volume pricing, custom SLAs, dedicated CSM. We typically reply within one business day.",
  email = "sales@example.com",
  phone = "+1 (555) 010-7788",
  seatTiers = DEFAULT_SEAT_TIERS,
  submitLabel = "Request pricing",
}: CtaContactSalesPanelProps) {
  const reduced = useReducedMotion() ?? false;
  const [seats, setSeats] = React.useState(seatTiers[1] ?? seatTiers[0]);
  const formId = React.useId();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit?.({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      seats,
    });
  }

  return (
    <section
      aria-labelledby={formId}
      className={cn(
        "w-full overflow-hidden rounded-3xl border bg-card shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="grid items-stretch md:grid-cols-[1.1fr_1fr]">
        <div className="border-b bg-muted/10 px-6 py-12 md:border-b-0 md:border-r md:px-8 md:py-16">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
            <Building2 className="h-3 w-3" aria-hidden /> {eyebrow}
          </span>
          <h2 id={formId} className="mt-4 text-balance text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-md text-pretty text-sm text-muted-foreground">
            {description}
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" aria-hidden />
              <a href={`mailto:${email}`} className="text-foreground hover:underline">{email}</a>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" aria-hidden />
              <span className="text-foreground">{phone}</span>
            </li>
          </ul>
        </div>

        <motion.form
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          onSubmit={submit}
          className="space-y-4 px-6 py-12 md:px-8 md:py-16"
        >
          <Field name="name" label="Full name" required placeholder="Ada Lovelace" />
          <Field name="email" label="Work email" required type="email" placeholder="ada@company.com" />
          <Field name="company" label="Company" required placeholder="Acme Inc." />

          <div>
            <span className="mb-1.5 block text-xs font-medium text-foreground">Team size</span>
            <div className="grid grid-cols-4 gap-1.5 rounded-lg border bg-muted/20 p-1">
              {seatTiers.map((t) => (
                <button
                  type="button"
                  key={t}
                  aria-pressed={seats === t}
                  onClick={() => setSeats(t)}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                    seats === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110"
          >
            {submitLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </button>
          <p className="text-[11px] text-muted-foreground">
            By submitting, you agree to our terms and privacy policy.
          </p>
        </motion.form>
      </div>
    </section>
  );
}

function Field({ name, label, required, type = "text", placeholder }: { name: string; label: string; required?: boolean; type?: string; placeholder?: string }) {
  const id = React.useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-foreground">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

export default CtaContactSalesPanel;
