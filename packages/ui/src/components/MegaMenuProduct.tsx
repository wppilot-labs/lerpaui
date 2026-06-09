"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Package, ChevronDown, ArrowRight, Sparkles, Box, Layers, Globe } from "lucide-react";
import { cn } from "../lib/cn";

const FEATURED = [
  { icon: Sparkles, label: "Studio Pro", tag: "New", desc: "Visual editor + real-time collab", accent: "primary" },
  { icon: Box, label: "Headless CMS", tag: "Popular", desc: "Multi-tenant content infrastructure", accent: "cyan" },
];

const PRODUCTS = [
  { icon: Layers, label: "Components", count: "326" },
  { icon: Box, label: "Blocks", count: "37" },
  { icon: Globe, label: "Templates", count: "12" },
  { icon: Package, label: "Icons", count: "1.4k" },
];

export function MegaMenuProduct({ className }: { className?: string }) {
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
    <div className={cn("relative w-full max-w-2xl mx-auto font-sans text-foreground", className)}>
      <nav aria-label="Primary" className="rounded-xl border border-white/[0.07] bg-bg-2/80 backdrop-blur-xl px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">lerpa</span>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-controls="mega-product-panel"
            className="inline-flex min-h-[40px] items-center gap-1 rounded-md bg-white/[0.04] px-3 py-2 text-[13px] font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Products
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
          </button>
          <button type="button" className="min-h-[40px] rounded-md bg-primary px-3 text-[12px] font-semibold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">Start free</button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mega-product-panel"
            role="menu"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full mt-2 z-20 rounded-2xl border border-white/[0.08] bg-bg-2/95 backdrop-blur-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr]">
              {/* featured */}
              <div className="p-4 border-b sm:border-b-0 sm:border-r border-white/[0.06]">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/70 mb-3">Featured</h4>
                <div className="grid grid-cols-1 gap-2">
                  {FEATURED.map((f) => (
                    <button key={f.label} role="menuitem" className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-3 text-left hover:border-primary/30 transition-colors">
                      <span aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="relative flex items-start gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
                          <f.icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] font-semibold text-foreground">{f.label}</span>
                            <span className="rounded-full bg-primary/15 px-1.5 py-px text-[9px] font-mono uppercase tracking-wider text-primary">{f.tag}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground/80 leading-relaxed">{f.desc}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* product list */}
              <div className="p-4">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/70 mb-3">All products</h4>
                <ul className="flex flex-col gap-0.5">
                  {PRODUCTS.map((p) => (
                    <li key={p.label}>
                      <button role="menuitem" className="group w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/[0.04] transition-colors text-left">
                        <p.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                        <span className="text-[12.5px] flex-1 text-foreground">{p.label}</span>
                        <span className="font-mono text-[10px] text-muted-foreground/60">{p.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
