"use client";

import React from "react";
import { UserPlus, Settings, Rocket } from "lucide-react";
import { cn } from "../lib/cn";

export interface HowItWorksStepsProps {
  className?: string;
}

interface Step {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  {
    title: "Create your account",
    description: "Sign up in seconds with email or SSO — no credit card required to start.",
    icon: UserPlus,
  },
  {
    title: "Configure your workspace",
    description: "Connect your tools, invite teammates, and tailor settings to fit your workflow.",
    icon: Settings,
  },
  {
    title: "Launch and scale",
    description: "Go live with confidence and watch real-time insights as your product grows.",
    icon: Rocket,
  },
];

export function HowItWorksSteps({ className }: HowItWorksStepsProps) {
  return (
    <section aria-label="How it works" className={cn("w-full max-w-4xl", className)}>
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">How it works</h2>
        <p className="mt-2 text-sm text-muted-foreground">Get up and running in three simple steps.</p>
      </div>

      <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
        <div
          className="absolute left-0 right-0 top-7 hidden h-px bg-border md:block"
          aria-hidden="true"
        />
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.title} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                <Icon className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default HowItWorksSteps;
