"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CornerDownLeft } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

const PROMPTS = [
  "Summarize my unread threads",
  "Draft a launch announcement",
  "Find churn risks this week",
];

export interface HeroSectionAiStartupProps {
  className?: string;
}

export function HeroSectionAiStartup({ className }: HeroSectionAiStartupProps) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState("");

  return (
    <section
      className={cn(
        "relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border/50 bg-card/45 p-8 text-center shadow-xl backdrop-blur-xl font-sans text-foreground",
        className,
      )}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Now with GPT-class reasoning
        </span>

        <h1 className="mt-4 max-w-lg bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-4xl font-black leading-[1.1] tracking-tight text-transparent sm:text-5xl">
          Your second brain, powered by AI
        </h1>

        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          Ask anything about your work. Nova connects to your tools and turns
          scattered context into instant, cited answers.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setValue("");
          }}
          className="mt-6 w-full max-w-md"
        >
          <label htmlFor="ai-prompt" className="sr-only">
            Ask Nova anything
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-secondary/30 p-2 pl-4 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/30">
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            <input
              id="ai-prompt"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask Nova anything…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send prompt"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:brightness-110"
            >
              <CornerDownLeft className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setValue(p)}
              className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-secondary/30 px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {p}
              <ArrowRight className="h-3.5 w-3.5 opacity-50" />
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
