"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Code2, Copy, Github, Star, Terminal } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroDeveloperToolProps {
  className?: string;
}

const INSTALL_COMMAND = "npx lerpa-cli init";

export function HeroDeveloperTool({ className }: HeroDeveloperToolProps) {
  const reduced = useReducedMotion() ?? false;
  const headingId = React.useId();
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-12 sm:py-20",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.5_0_0/0.08)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.5_0_0/0.08)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_30%,transparent_75%)]" />
      </div>

      <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[11px] font-medium text-primary"
          >
            <Code2 className="h-3.5 w-3.5" aria-hidden />
            {"<dev-tools />"}
          </motion.span>

          <motion.h1
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-5 text-balance text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl"
          >
            The component CLI built{" "}
            <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
              for developers
            </span>
            , not designers.
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground"
          >
            Type-safe, accessible React components you actually own. No runtime, no lock-in — just
            <code className="mx-1 rounded bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-foreground">
              .tsx
            </code>
            files copied into your repo.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <div className="group flex items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-3 py-2.5 font-mono text-sm text-foreground shadow-inner shadow-black/30">
              <span aria-hidden className="text-primary">$</span>
              <span className="flex-1 truncate">{INSTALL_COMMAND}</span>
              <button
                type="button"
                onClick={copy}
                aria-label={copied ? "Command copied" : "Copy install command"}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-primary" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
              </button>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/60 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <Github className="h-4 w-4" aria-hidden />
              Star on GitHub
              <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-background/70 px-1.5 py-0.5 text-xs text-muted-foreground">
                <Star className="h-3 w-3 text-amber-400" aria-hidden />
                12.4k
              </span>
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          aria-hidden
          className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 shadow-2xl shadow-black/30 backdrop-blur"
        >
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              <Terminal className="h-3 w-3" aria-hidden />
              hero.tsx
            </div>
            <div className="w-12" />
          </div>

          <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed">
            <code className="block">
              <span className="text-[oklch(0.65_0.15_300)]">import</span>{" "}
              <span className="text-foreground">{"{ Button }"}</span>{" "}
              <span className="text-[oklch(0.65_0.15_300)]">from</span>{" "}
              <span className="text-[oklch(0.72_0.18_140)]">&quot;@/components/ui/button&quot;</span>
              <span className="text-muted-foreground">;</span>
              {"\n"}
              <span className="text-[oklch(0.65_0.15_300)]">import</span>{" "}
              <span className="text-foreground">{"{ Sparkles }"}</span>{" "}
              <span className="text-[oklch(0.65_0.15_300)]">from</span>{" "}
              <span className="text-[oklch(0.72_0.18_140)]">&quot;lucide-react&quot;</span>
              <span className="text-muted-foreground">;</span>
              {"\n\n"}
              <span className="text-[oklch(0.65_0.15_300)]">export function</span>{" "}
              <span className="text-[oklch(0.75_0.16_220)]">Hero</span>
              <span className="text-foreground">() {"{"}</span>
              {"\n  "}
              <span className="text-[oklch(0.65_0.15_300)]">return</span>{" "}
              <span className="text-foreground">(</span>
              {"\n    "}
              <span className="text-muted-foreground">&lt;</span>
              <span className="text-[oklch(0.78_0.14_30)]">section</span>{" "}
              <span className="text-[oklch(0.7_0.14_200)]">className</span>
              <span className="text-foreground">=</span>
              <span className="text-[oklch(0.72_0.18_140)]">&quot;py-20&quot;</span>
              <span className="text-muted-foreground">&gt;</span>
              {"\n      "}
              <span className="text-muted-foreground">&lt;</span>
              <span className="text-[oklch(0.78_0.14_30)]">Button</span>{" "}
              <span className="text-[oklch(0.7_0.14_200)]">size</span>
              <span className="text-foreground">=</span>
              <span className="text-[oklch(0.72_0.18_140)]">&quot;lg&quot;</span>
              <span className="text-muted-foreground">&gt;</span>
              {"\n        "}
              <span className="text-muted-foreground">&lt;</span>
              <span className="text-[oklch(0.78_0.14_30)]">Sparkles</span>{" "}
              <span className="text-foreground">/&gt;</span>
              {"\n        "}
              <span className="text-foreground">Ship it</span>
              {"\n      "}
              <span className="text-muted-foreground">&lt;/</span>
              <span className="text-[oklch(0.78_0.14_30)]">Button</span>
              <span className="text-muted-foreground">&gt;</span>
              {"\n    "}
              <span className="text-muted-foreground">&lt;/</span>
              <span className="text-[oklch(0.78_0.14_30)]">section</span>
              <span className="text-muted-foreground">&gt;</span>
              {"\n  "}
              <span className="text-foreground">);</span>
              {"\n"}
              <span className="text-foreground">{"}"}</span>
            </code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroDeveloperTool;
