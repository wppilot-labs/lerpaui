"use client";

import React, { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface NewsletterFormSectionProps {
  className?: string;
}

export function NewsletterFormSection({ className }: NewsletterFormSectionProps) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setDone(true);
  };

  return (
    <div
      className={cn(
        "w-full max-w-xl rounded-2xl border border-border/50 bg-card/60 p-5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-bold">Weekly product digest</h3>
          <p className="text-sm text-muted-foreground/60">One email, every Friday. No spam, unsubscribe anytime.</p>
        </div>

        <form onSubmit={submit} className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
          <label htmlFor="nl-inline-email" className="sr-only">
            Email address
          </label>
          <div className="relative flex-1 sm:w-56">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
            <input
              id="nl-inline-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] py-2.5 pl-10 pr-3 text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={done}
            className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:brightness-110 disabled:bg-emerald-500/20 disabled:text-emerald-400"
          >
            {done ? (
              <>
                <Check className="h-4 w-4" /> Done
              </>
            ) : (
              <>
                Subscribe <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
