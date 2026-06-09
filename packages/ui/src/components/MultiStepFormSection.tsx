"use client";

import React, { useState } from "react";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "../lib/cn";

const STEPS = ["Account", "Company", "Done"];

export interface MultiStepFormSectionProps {
  className?: string;
}

export function MultiStepFormSection({ className }: MultiStepFormSectionProps) {
  const [step, setStep] = useState(0);

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border/50 bg-card/60 p-5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  i < step && "bg-primary text-primary-foreground",
                  i === step && "bg-primary/15 text-primary ring-1 ring-primary",
                  i > step && "bg-foreground/[0.06] text-muted-foreground/50",
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("text-xs font-semibold", i === step ? "text-foreground" : "text-muted-foreground/45")}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <span className={cn("h-px flex-1", i < step ? "bg-primary" : "bg-foreground/[0.08]")} />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
        {step === 0 && (
          <>
            <div>
              <label htmlFor="msf-name" className="mb-1 block text-xs font-medium text-muted-foreground/80">
                Full name
              </label>
              <input
                id="msf-name"
                type="text"
                placeholder="Jordan Avery"
                className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="msf-email" className="mb-1 block text-xs font-medium text-muted-foreground/80">
                Email
              </label>
              <input
                id="msf-email"
                type="email"
                placeholder="jordan@company.com"
                className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none"
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <label htmlFor="msf-company" className="mb-1 block text-xs font-medium text-muted-foreground/80">
                Company name
              </label>
              <input
                id="msf-company"
                type="text"
                placeholder="Acme Inc"
                className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="msf-size" className="mb-1 block text-xs font-medium text-muted-foreground/80">
                Team size
              </label>
              <select
                id="msf-size"
                defaultValue="11-50"
                className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none"
              >
                <option>1-10</option>
                <option>11-50</option>
                <option>51-200</option>
                <option>200+</option>
              </select>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <Check className="h-7 w-7" />
            </span>
            <h4 className="text-base font-bold">You&apos;re all set</h4>
            <p className="mt-1 text-sm text-muted-foreground/60">We&apos;ll email you when your workspace is ready.</p>
          </div>
        )}

        {step < 2 && (
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1 rounded-xl border border-border/50 px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-foreground/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(2, s + 1))}
              className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:brightness-110"
            >
              {step === 1 ? "Finish" : "Next"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
