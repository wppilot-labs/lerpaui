"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

const SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const REASONS = ["Ease of use", "Value for money", "Support", "Features", "Performance"];

export interface SurveyFormSectionProps {
  className?: string;
}

export function SurveyFormSection({ className }: SurveyFormSectionProps) {
  const [score, setScore] = useState<number | null>(8);
  const [reason, setReason] = useState("Ease of use");
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
      <h3 className="text-base font-bold">How likely are you to recommend us?</h3>
      <p className="mb-4 text-sm text-muted-foreground/55">0 = not at all likely, 10 = extremely likely.</p>

      <div role="radiogroup" aria-label="Likelihood to recommend" className="mb-1.5 flex flex-wrap gap-1.5">
        {SCALE.map((n) => {
          const active = score === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${n} out of 10`}
              onClick={() => setScore(n)}
              className={cn(
                "h-9 w-9 rounded-lg border text-sm font-bold transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-foreground/[0.06] text-muted-foreground/70 hover:bg-foreground/[0.04]",
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mb-4 flex justify-between px-0.5 text-xs text-muted-foreground/40">
        <span>Not likely</span>
        <span>Very likely</span>
      </div>

      <div className="mb-4">
        <label htmlFor="survey-reason" className="mb-1.5 block text-xs font-medium text-muted-foreground/80">
          What mattered most?
        </label>
        <select
          id="survey-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none"
        >
          {REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="survey-comment" className="mb-1 block text-xs font-medium text-muted-foreground/80">
          Anything else? (optional)
        </label>
        <textarea
          id="survey-comment"
          rows={2}
          placeholder="Tell us more…"
          className="w-full resize-none rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:brightness-110"
      >
        {sent ? (
          <>
            <Check className="h-4 w-4" /> Thanks for your feedback
          </>
        ) : (
          "Submit response"
        )}
      </button>
    </form>
  );
}
