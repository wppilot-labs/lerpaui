"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Boxes, ChevronDown, ArrowRight, BookOpen, Code2, Zap, Layers, GitBranch, Cpu } from "lucide-react";
import { cn } from "../lib/cn";

const SECTIONS = [
  {
    title: "Build",
    items: [
      { icon: Code2, label: "SDK Reference", desc: "Type-safe client APIs" },
      { icon: Zap, label: "Edge Functions", desc: "Sub-100ms latency" },
      { icon: Layers, label: "Database Studio", desc: "Visual schema editor" },
    ],
  },
  {
    title: "Operate",
    items: [
      { icon: GitBranch, label: "Branch Previews", desc: "Per-PR environments" },
      { icon: Cpu, label: "Observability", desc: "Logs · traces · metrics" },
      { icon: BookOpen, label: "Documentation", desc: "Guides & references" },
    ],
  },
];

export function MegaMenuBasic({ className }: { className?: string }) {
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
      <nav aria-label="Primary" className="relative rounded-xl border border-white/[0.07] bg-bg-2/80 backdrop-blur-xl px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">Platform</span>
          </a>
          <div className="flex items-center gap-1">
            <button
              ref={triggerRef}
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-haspopup="menu"
              aria-controls="mega-basic-panel"
              className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium text-foreground hover:bg-white/[0.04]"
            >
              Products
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
            </button>
            <button className="rounded-md px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.04]">Pricing</button>
            <button className="rounded-md px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.04]">Docs</button>
          </div>
          <button className="h-8 rounded-md bg-primary px-3 text-[12px] font-semibold text-bg">Sign in</button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mega-basic-panel"
            role="menu"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full mt-2 z-20 rounded-2xl border border-white/[0.08] bg-bg-2/95 backdrop-blur-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7),0_0_40px_-12px_var(--accent-glow)] overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-px bg-white/[0.04]">
              {SECTIONS.map((sec) => (
                <div key={sec.title} className="bg-bg-2/95 p-4">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/70 mb-2">{sec.title}</h4>
                  <ul className="flex flex-col gap-0.5">
                    {sec.items.map((it) => (
                      <li key={it.label}>
                        <button role="menuitem" className="group w-full flex items-start gap-3 rounded-lg p-2 hover:bg-white/[0.04] transition-colors text-left">
                          <span className="grid h-8 w-8 place-items-center rounded-md bg-white/[0.04] border border-white/[0.06] text-primary group-hover:bg-primary/10">
                            <it.icon className="h-4 w-4" />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[13px] font-medium text-foreground">{it.label}</span>
                            <span className="block text-[11px] text-muted-foreground/70">{it.desc}</span>
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 mt-2" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.06] text-[11px] font-mono text-muted-foreground/70 flex items-center justify-between">
              <span>Press <kbd className="rounded border border-white/10 px-1 font-mono text-[10px]">esc</kbd> to close</span>
              <a href="/" className="text-primary hover:underline">View all products →</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
