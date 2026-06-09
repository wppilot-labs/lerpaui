"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Ruler, Check } from "lucide-react";
import { cn } from "../lib/cn";

type Step = {
  key: string;
  question: string;
  options: string[];
};

const STEPS: Step[] = [
  { key: "height", question: "How tall are you?", options: ["Under 5'4\"", "5'4\"–5'8\"", "5'9\"–6'0\"", "Over 6'0\""] },
  { key: "build", question: "Which best fits your build?", options: ["Slim", "Athletic", "Regular", "Broad"] },
  { key: "fit", question: "How do you like clothes to fit?", options: ["Fitted", "True to size", "Relaxed"] },
];

const RESULT: Record<string, string> = {
  Slim: "S",
  Athletic: "M",
  Regular: "M",
  Broad: "L",
};

export interface ProductFitFinderWizardProps {
  className?: string;
}

export function ProductFitFinderWizard({ className }: ProductFitFinderWizardProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = step >= STEPS.length;

  const current = STEPS[step];
  const recommended = RESULT[answers["build"]] ?? "M";

  const choose = (opt: string) => {
    setAnswers((a) => ({ ...a, [current.key]: opt }));
    setStep((s) => s + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Ruler className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Find your fit</h3>
        {!done && (
          <span className="ml-auto text-xs text-muted-foreground/55">
            Step {step + 1} of {STEPS.length}
          </span>
        )}
      </div>

      {/* progress */}
      <div className="flex gap-1.5 mb-5">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < step || done ? "bg-primary" : i === step ? "bg-primary/50" : "bg-foreground/10",
            )}
          />
        ))}
      </div>

      {!done ? (
        <div>
          <p className="text-sm font-semibold mb-3">{current.question}</p>
          <div className="space-y-2" role="radiogroup" aria-label={current.question}>
            {current.options.map((opt) => {
              const on = answers[current.key] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => choose(opt)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm font-medium text-left transition-all",
                    on
                      ? "border-primary bg-primary/10"
                      : "border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/30",
                  )}
                >
                  {opt}
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
                </button>
              );
            })}
          </div>

          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground/70 hover:text-foreground"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-2">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <Check className="w-6 h-6 text-emerald-400" strokeWidth={2.5} />
          </div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground/55 font-bold">
            Your recommended size
          </p>
          <p className="text-4xl font-black my-1">{recommended}</p>
          <p className="text-xs text-muted-foreground/60 mb-4">
            Based on your height, build & fit preference
          </p>
          <button
            type="button"
            className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Shop size {recommended}
          </button>
          <button
            type="button"
            onClick={reset}
            className="mt-2 text-xs font-semibold text-muted-foreground/70 hover:text-foreground"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
