"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Download,
  Settings2,
  Rocket,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { cn } from "../lib/cn";

export interface HowItWorksStepsBlockProps {
  className?: string;
}

const STEPS = [
  {
    id: "install",
    title: "Install the CLI",
    description:
      "Add Lerpa UI to any Next.js or Vite project with a single command. No lock-in, no runtime.",
    icon: Download,
  },
  {
    id: "configure",
    title: "Configure your theme",
    description:
      "Pick design tokens, radius, and motion presets. Tokens write directly to your tailwind.config.",
    icon: Settings2,
  },
  {
    id: "deploy",
    title: "Ship your first block",
    description:
      "Copy a hero, pricing, or dashboard block. The source lives in your repo — edit anything.",
    icon: Rocket,
  },
  {
    id: "scale",
    title: "Scale with confidence",
    description:
      "Compose 300+ components into product surfaces. Accessibility and reduced-motion built in.",
    icon: TrendingUp,
  },
] as const;

export function HowItWorksStepsBlock({ className }: HowItWorksStepsBlockProps) {
  const headingId = React.useId();
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "w-full max-w-4xl rounded-3xl border border-border/60 bg-card/40 p-8 text-foreground backdrop-blur-xl sm:p-10",
        className,
      )}
    >
      <header className="mb-8 flex flex-col gap-2 sm:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          How it works
        </p>
        <h2 id={headingId} className="text-2xl font-semibold tracking-tight sm:text-3xl">
          From install to production in four steps
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A predictable workflow your team already knows — every step is opt-in,
          every artifact lives in your repository.
        </p>
      </header>

      <ol
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = activeStep === index;
          const isComplete = activeStep > index;

          return (
            <motion.li
              key={step.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 0.4, delay: index * 0.08, ease: "easeOut" }
              }
              className="relative"
            >
              <button
                type="button"
                onMouseEnter={() => setActiveStep(index)}
                onFocus={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
                aria-pressed={isActive}
                aria-label={`Step ${index + 1}: ${step.title}`}
                className={cn(
                  "group h-full w-full rounded-2xl border bg-background/60 p-5 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "border-primary/60 bg-card shadow-sm"
                    : "border-border/60 hover:border-border",
                )}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition-colors",
                      isActive || isComplete
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-muted/40 text-muted-foreground",
                    )}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </button>

              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-[-12px] top-1/2 hidden -translate-y-1/2 text-border lg:block"
                >
                  <ArrowRight className="h-4 w-4" />
                </span>
              ) : null}
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
