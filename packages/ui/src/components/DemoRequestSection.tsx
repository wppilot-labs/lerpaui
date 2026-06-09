"use client";

import React, { useState } from "react";
import { Sparkles, Check, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

const BENEFITS = [
  "Personalized 1:1 product walkthrough",
  "Migration & onboarding guidance",
  "Custom pricing for your team size",
];

export interface DemoRequestSectionProps {
  className?: string;
}

export function DemoRequestSection({ className }: DemoRequestSectionProps) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className={cn("w-full max-w-3xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden", className)}>
      <div className="grid md:grid-cols-2">
        <div className="p-6 md:border-r border-foreground/[0.06]">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary mb-3">
            <Sparkles className="w-4 h-4" /> Live demo
          </span>
          <h3 className="text-xl font-bold leading-tight">See what your team can ship in a week.</h3>
          <p className="text-sm text-muted-foreground/65 mt-2 leading-relaxed">
            Get a guided tour tailored to your workflow. No slides — just the product.
          </p>
          <ul className="mt-4 space-y-2">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground/80">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 bg-foreground/[0.01]">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="drs-name" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Full name</label>
              <input id="drs-name" type="text" required placeholder="Jane Doe" className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="drs-email" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Work email</label>
              <input id="drs-email" type="email" required placeholder="jane@acme.co" className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="drs-msg" className="block text-xs font-semibold text-muted-foreground/70 mb-1">What do you want to solve?</label>
              <textarea id="drs-msg" rows={2} placeholder="Tell us about your use case..." className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm resize-none focus:ring-1 focus:ring-primary/50 focus:outline-none" />
            </div>
            <button
              type="submit"
              disabled={sent}
              className="w-full py-2.5 bg-primary hover:brightness-110 disabled:opacity-80 text-primary-foreground text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all"
            >
              {sent ? (
                <>
                  <Check className="w-4 h-4" /> We&apos;ll be in touch
                </>
              ) : (
                <>
                  Schedule my demo <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-xs text-muted-foreground/40 text-center">No credit card required.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
