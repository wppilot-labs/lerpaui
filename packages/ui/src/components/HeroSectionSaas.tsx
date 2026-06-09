"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

const AVATARS = [
  "bg-violet-500/25 text-violet-300",
  "bg-sky-500/25 text-sky-300",
  "bg-emerald-500/25 text-emerald-300",
  "bg-amber-500/25 text-amber-300",
];

export interface HeroSectionSaasProps {
  className?: string;
}

export function HeroSectionSaas({ className }: HeroSectionSaasProps) {
  const reduced = usePrefersReducedMotion();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section
      className={cn(
        "w-full max-w-2xl overflow-hidden rounded-2xl border border-border/50 bg-card/45 p-8 text-center shadow-xl backdrop-blur-xl font-sans text-foreground",
        className,
      )}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          New: automations are live
        </span>

        <h1 className="mt-4 max-w-lg text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl">
          The workspace where teams
          <br />
          <span className="text-primary">actually get things done</span>
        </h1>

        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          Plan, track, and ship work in one place. Replace five tools with one
          that your whole team will love.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setDone(true);
          }}
          className="mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row"
        >
          <label htmlFor="saas-email" className="sr-only">
            Work email
          </label>
          <input
            id="saas-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setDone(false);
            }}
            placeholder="you@company.com"
            className="flex-1 rounded-xl border border-border/60 bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          <button
            type="submit"
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all",
              done
                ? "bg-emerald-500 text-white"
                : "bg-primary text-primary-foreground hover:brightness-110",
            )}
          >
            {done ? (
              <>
                <Check className="h-4 w-4" /> You&apos;re in
              </>
            ) : (
              <>
                Get started <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 flex items-center gap-2.5">
          <div className="flex -space-x-2">
            {AVATARS.map((a, i) => (
              <span
                key={i}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 border-card text-[11px] font-bold",
                  a,
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/70">
            Join <span className="font-semibold text-foreground">12,000+</span>{" "}
            teams already on board
          </p>
        </div>
      </motion.div>
    </section>
  );
}
