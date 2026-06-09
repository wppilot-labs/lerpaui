"use client";

import React, { useState } from "react";
import { Check, Users } from "lucide-react";
import { cn } from "../lib/cn";

const TEAM_SIZES = ["1–10", "11–50", "51–200", "200+"];

export interface ContactSalesSectionProps {
  className?: string;
}

export function ContactSalesSection({ className }: ContactSalesSectionProps) {
  const [size, setSize] = useState(TEAM_SIZES[1]);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    window.setTimeout(() => setSent(false), 2500);
  };

  return (
    <section
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Users className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-base font-bold leading-tight">Talk to sales</h2>
          <p className="text-xs text-muted-foreground/65">
            Get a tailored demo and custom pricing.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="cs-work-email" className="mb-1.5 block text-sm font-medium text-foreground/80">
            Work email
          </label>
          <input
            id="cs-work-email"
            type="email"
            required
            placeholder="you@company.com"
            className="w-full rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <div>
          <label htmlFor="cs-company" className="mb-1.5 block text-sm font-medium text-foreground/80">
            Company
          </label>
          <input
            id="cs-company"
            type="text"
            required
            placeholder="Acme Inc."
            className="w-full rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-foreground/80">Team size</legend>
          <div className="grid grid-cols-4 gap-1.5">
            {TEAM_SIZES.map((opt) => {
              const isActive = size === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setSize(opt)}
                  className={cn(
                    "rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors",
                    isActive
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-foreground/[0.08] bg-foreground/[0.02] text-muted-foreground/70 hover:bg-foreground/[0.04]",
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </fieldset>

        <button
          type="submit"
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
            sent
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-primary text-primary-foreground hover:brightness-110",
          )}
        >
          {sent ? (
            <>
              <Check className="w-4 h-4" />
              We&apos;ll be in touch
            </>
          ) : (
            "Request a demo"
          )}
        </button>
      </form>
    </section>
  );
}
