"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface NewsletterSignupSectionProps {
  className?: string;
}

export function NewsletterSignupSection({ className }: NewsletterSignupSectionProps) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setDone(true);
  };

  return (
    <div className={cn("w-full max-w-sm text-center font-sans text-foreground", className)}>
      <h3 className="text-base font-bold">Subscribe to our newsletter</h3>
      <p className="mt-1 text-sm text-muted-foreground/55">Fresh ideas, delivered monthly.</p>

      {done ? (
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-400">
          <Check className="h-4 w-4" /> Thanks for subscribing
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4 flex items-center border-b border-foreground/15 pb-1.5 focus-within:border-primary">
          <label htmlFor="nl-min-email" className="sr-only">
            Email address
          </label>
          <input
            id="nl-min-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 bg-transparent px-1 py-1 text-sm placeholder:text-muted-foreground/30 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 px-1 text-sm font-bold text-primary transition-opacity hover:opacity-80"
          >
            Join
          </button>
        </form>
      )}
    </div>
  );
}
