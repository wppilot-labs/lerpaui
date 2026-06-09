"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

const SERVICES = ["Web design", "Branding", "Development", "Consulting"];
const BUDGETS = ["< $5k", "$5k–15k", "$15k–50k", "$50k+"];

export interface QuoteRequestFormSectionProps {
  className?: string;
}

export function QuoteRequestFormSection({ className }: QuoteRequestFormSectionProps) {
  const [service, setService] = useState("Web design");
  const [budget, setBudget] = useState("$5k–15k");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        "w-full max-w-lg rounded-2xl border border-border/50 bg-card/60 p-5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <h3 className="text-base font-bold">Request a quote</h3>
      <p className="mb-4 text-sm text-muted-foreground/55">Tell us about your project and we&apos;ll reply within 24h.</p>

      <div className="space-y-3">
        <div>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground/80">Service needed</span>
          <div className="flex flex-wrap gap-1.5">
            {SERVICES.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={service === s}
                onClick={() => setService(s)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  service === s
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-foreground/[0.06] text-muted-foreground/70 hover:bg-foreground/[0.04]",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground/80">Estimated budget</span>
          <div className="grid grid-cols-4 gap-1.5">
            {BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={budget === b}
                onClick={() => setBudget(b)}
                className={cn(
                  "rounded-xl border py-2 text-sm font-semibold transition-colors",
                  budget === b
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-foreground/[0.06] text-muted-foreground/70 hover:bg-foreground/[0.04]",
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="qr-name" className="mb-1 block text-xs font-medium text-muted-foreground/80">
              Your name
            </label>
            <input
              id="qr-name"
              type="text"
              placeholder="Jordan Avery"
              className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="qr-email" className="mb-1 block text-xs font-medium text-muted-foreground/80">
              Work email
            </label>
            <input
              id="qr-email"
              type="email"
              placeholder="jordan@company.com"
              className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="qr-details" className="mb-1 block text-xs font-medium text-muted-foreground/80">
            Project details
          </label>
          <textarea
            id="qr-details"
            rows={3}
            placeholder="Goals, timeline, and anything else we should know…"
            className="w-full resize-none rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:brightness-110"
      >
        {sent ? (
          <>
            <Check className="h-4 w-4" /> Request sent
          </>
        ) : (
          "Get my quote"
        )}
      </button>
    </form>
  );
}
