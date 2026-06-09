"use client";

import React, { useState } from "react";
import { Sparkles, Check, Mail } from "lucide-react";
import { cn } from "../lib/cn";

const PERKS = ["Early access to new features", "Curated industry reading", "Subscriber-only discounts"];

export interface NewsletterSectionProps {
  className?: string;
}

export function NewsletterSection({ className }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setDone(true);
  };

  return (
    <section
      className={cn(
        "grid w-full max-w-2xl overflow-hidden rounded-3xl border border-border/50 bg-card/50 font-sans text-foreground shadow-xl backdrop-blur-xl sm:grid-cols-2",
        className,
      )}
    >
      <div className="relative flex flex-col justify-between gap-4 bg-gradient-to-br from-primary/25 via-violet-500/15 to-transparent p-6">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 left-4 h-28 w-28 rounded-full bg-violet-500/20 blur-2xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-1 text-xs font-bold text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> The Loop
          </span>
          <h2 className="mt-3 text-2xl font-black leading-tight">Stay ahead of the curve</h2>
          <p className="mt-1 text-sm text-muted-foreground/70">Join 24,000 builders getting our weekly brief.</p>
        </div>
        <ul className="relative space-y-2">
          {PERKS.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground/80">
              <Check className="h-4 w-4 shrink-0 text-primary" /> {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-center p-6">
        {done ? (
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <Check className="h-7 w-7" />
            </span>
            <h3 className="text-base font-bold">Welcome aboard</h3>
            <p className="mt-1 text-sm text-muted-foreground/60">Check your inbox to confirm.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label htmlFor="nl-section-email" className="mb-1.5 block text-xs font-medium text-muted-foreground/80">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                <input
                  id="nl-section-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] py-2.5 pl-10 pr-3 text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:brightness-110"
            >
              Subscribe for free
            </button>
            <p className="text-center text-xs text-muted-foreground/45">No spam. Unsubscribe whenever you like.</p>
          </form>
        )}
      </div>
    </section>
  );
}
