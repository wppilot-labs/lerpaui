"use client";

import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

const AVATARS = [
  "from-rose-400 to-orange-400",
  "from-sky-400 to-indigo-400",
  "from-emerald-400 to-teal-400",
  "from-violet-400 to-fuchsia-400",
];

export interface WaitlistFormSectionProps {
  className?: string;
}

export function WaitlistFormSection({ className }: WaitlistFormSectionProps) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setJoined(true);
  };

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border/50 bg-card/60 p-6 text-center font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        Launching soon
      </span>

      <h3 className="mt-3 text-2xl font-black leading-tight">Join the waitlist</h3>
      <p className="mt-1 text-sm text-muted-foreground/60">Be first to get access when we open the doors.</p>

      {joined ? (
        <div className="mt-5 flex flex-col items-center">
          <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <Check className="h-7 w-7" />
          </span>
          <p className="text-sm font-semibold">You&apos;re on the list</p>
          <p className="text-xs text-muted-foreground/55">We&apos;ll email you the moment it&apos;s ready.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 flex items-center gap-2">
          <label htmlFor="wl-email" className="sr-only">
            Email address
          </label>
          <input
            id="wl-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="flex-1 rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2.5 text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:brightness-110"
          >
            Join <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="flex -space-x-2">
          {AVATARS.map((a, i) => (
            <span
              key={i}
              className={cn("h-7 w-7 rounded-full border-2 border-card bg-gradient-to-br", a)}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground/50">2,300+ already joined</span>
      </div>
    </div>
  );
}
