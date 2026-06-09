"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, Search, User, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

const PRIMARY = [
  { label: "Home", count: null },
  { label: "Products", count: 12 },
  { label: "Solutions", count: 4 },
  { label: "Customers", count: null },
  { label: "Resources", count: 8 },
  { label: "Pricing", count: null },
];

const SECONDARY = ["Support", "Status", "Changelog", "Login"];

export function MobileMenuDrawerBlock({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // ESC + focus return
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // focus first interactive after open
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={cn("relative w-full max-w-md mx-auto h-[440px] rounded-2xl border border-white/[0.07] bg-bg-2 overflow-hidden font-sans text-foreground", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <span className="text-sm font-semibold">Acme</span>
        <button
          ref={triggerRef}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-drawer-panel"
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      <div className="p-6 text-center text-[12px] text-muted-foreground/70">
        Tap the menu icon to slide the drawer in from the right.
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm"
              aria-hidden
            />
            <motion.aside
              key="panel"
              id="mobile-drawer-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={reduced ? { opacity: 0 } : { x: "100%" }}
              animate={reduced ? { opacity: 1 } : { x: 0 }}
              exit={reduced ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 z-30 w-[78%] bg-bg-2 border-l border-white/[0.08] flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Menu</span>
                </div>
                <button
                  ref={closeRef}
                  onClick={() => { setOpen(false); triggerRef.current?.focus(); }}
                  aria-label="Close menu"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/[0.05]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-4 py-3 border-b border-white/[0.06]">
                <label htmlFor="drawer-search" className="sr-only">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    id="drawer-search"
                    type="search"
                    placeholder="Search..."
                    autoComplete="off"
                    className="w-full h-9 rounded-md border border-white/10 bg-white/[0.03] pl-8 pr-3 text-[12.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
              </div>

              <nav aria-label="Drawer" className="flex-1 overflow-y-auto px-2 py-3">
                <ul role="menu" className="flex flex-col gap-0.5">
                  {PRIMARY.map((it) => (
                    <li key={it.label}>
                      <button role="menuitem" className="group w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-white/[0.05]">
                        <span>{it.label}</span>
                        <span className="flex items-center gap-2 text-muted-foreground/60">
                          {it.count !== null && <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-mono">{it.count}</span>}
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="my-3 h-px bg-white/[0.06]" />
                <ul className="flex flex-col gap-0.5">
                  {SECONDARY.map((it) => (
                    <li key={it}>
                      <button className="w-full text-left rounded-lg px-3 py-2 text-[12.5px] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground">{it}</button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-white/[0.06] p-3">
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-[13px] font-semibold text-bg">
                  <User className="h-3.5 w-3.5" /> Sign in
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
