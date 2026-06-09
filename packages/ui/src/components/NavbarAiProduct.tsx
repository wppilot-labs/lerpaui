"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Brain, Menu, X, Zap, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

const LINKS = ["Models", "Playground", "Pricing", "Research", "Docs"];

export function NavbarAiProduct({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "relative w-full max-w-3xl mx-auto rounded-full border border-white/10",
        "bg-[color-mix(in_srgb,var(--bg-2)_85%,transparent)] backdrop-blur-2xl",
        "shadow-[0_20px_50px_-25px_var(--accent-glow),0_0_0_1px_rgba(255,255,255,0.05)_inset]",
        "px-4 py-2 font-sans text-foreground",
        className,
      )}
    >
      {/* aurora wash */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
        <span className="absolute -inset-x-20 -top-10 h-32 bg-[conic-gradient(from_120deg_at_50%_50%,transparent,var(--accent-soft),transparent,rgba(180,140,255,0.16),transparent)] blur-2xl opacity-70" />
      </span>

      <div className="relative flex items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-2 pl-1">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary via-violet to-cyan text-bg shadow-[0_0_18px_-4px_var(--accent-glow)]">
            <Brain className="h-4 w-4" strokeWidth={2.4} />
          </span>
          <span className="text-sm font-semibold tracking-tight">neuron<span className="text-primary">·</span>ai</span>
          <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-violet/15 px-2 py-0.5 text-[10px] font-mono text-[var(--violet)]">
            <Zap className="h-2.5 w-2.5" /> beta
          </span>
        </a>

        <ul role="menubar" className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <li key={l} role="none">
              <button role="menuitem" className="rounded-full px-3 py-1.5 text-[12.5px] font-medium text-muted-foreground hover:bg-white/[0.06] hover:text-foreground transition-colors">
                {l}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex h-8 items-center rounded-full px-3 text-[12px] text-muted-foreground hover:text-foreground">Sign in</button>
          <button className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground px-3.5 text-[12px] font-semibold text-bg transition-transform hover:-translate-y-px">
            Try free <ArrowRight className="h-3 w-3" />
          </button>
          <button
            ref={triggerRef}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="navbar-ai-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="navbar-ai-menu"
            role="menu"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden mt-2"
          >
            <ul className="border-t border-white/10 pt-2 flex flex-col gap-0.5 px-1">
              {LINKS.map((l) => (
                <li key={l}>
                  <button role="menuitem" className="w-full text-left rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-foreground">{l}</button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
