"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowUpRight, Twitter, Github, Linkedin } from "lucide-react";
import { cn } from "../lib/cn";

const ITEMS = ["Work", "Studio", "Journal", "Contact"];

const stagger = { animate: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.18 } },
};

export function MobileMenuFullscreen({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={cn("relative w-full max-w-md mx-auto h-[440px] rounded-2xl border border-white/[0.07] bg-bg-2 overflow-hidden font-sans text-foreground", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <span className="text-sm font-semibold tracking-tight">Studio<span className="text-primary">.</span></span>
        <button
          ref={triggerRef}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="fullscreen-menu"
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
      <div className="p-6 text-center text-[12px] text-muted-foreground/70">
        Tap the icon to open a fullscreen menu.
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="fullscreen-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={reduced ? { opacity: 0 } : { clipPath: "circle(0% at 90% 8%)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "circle(150% at 90% 8%)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "circle(0% at 90% 8%)" }}
            transition={{ duration: 0.5, ease: [0.83, 0, 0.17, 1] }}
            className="absolute inset-0 z-30 bg-bg-2 flex flex-col"
          >
            {/* gradient backdrop */}
            <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
              <span className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet/20 blur-3xl" />
            </span>

            <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <span className="text-sm font-semibold tracking-tight">Studio<span className="text-primary">.</span></span>
              <button
                ref={closeRef}
                onClick={() => { setOpen(false); triggerRef.current?.focus(); }}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <motion.nav
              aria-label="Fullscreen"
              variants={reduced ? undefined : stagger}
              initial="initial"
              animate="animate"
              className="relative flex-1 flex flex-col justify-center px-8 gap-1"
            >
              {ITEMS.map((it, i) => (
                <motion.button
                  key={it}
                  variants={reduced ? undefined : fadeUp}
                  className="group flex items-center justify-between text-left py-2 border-b border-white/[0.05] hover:border-primary/40 transition-colors"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="text-[10px] font-mono text-primary/70">0{i + 1}</span>
                    <span className="text-3xl font-serif italic text-foreground group-hover:text-primary transition-colors">{it}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.button>
              ))}
            </motion.nav>

            <div className="relative border-t border-white/[0.06] px-6 py-4 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/60">© Studio MMXXVI</span>
              <div className="flex items-center gap-2">
                {[Twitter, Github, Linkedin].map((Icon, idx) => (
                  <a key={idx} href="/" aria-label="Social link" className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-white/[0.05] hover:text-foreground">
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
