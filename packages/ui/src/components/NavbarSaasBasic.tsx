"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

const LINKS = [
  { label: "Features", hasMenu: true },
  { label: "Pricing", hasMenu: false },
  { label: "Customers", hasMenu: false },
  { label: "Docs", hasMenu: false },
];

export function NavbarSaasBasic({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
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
        "relative w-full max-w-2xl mx-auto",
        "rounded-2xl border border-white/[0.08]",
        "bg-[color-mix(in_srgb,var(--bg-2)_82%,transparent)] backdrop-blur-2xl",
        "shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)_inset]",
        "px-4 py-3 font-sans text-foreground",
        className,
      )}
    >
      {/* hairline accent glow */}
      <span aria-hidden className="pointer-events-none absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="flex items-center justify-between gap-4">
        <a href="/" className="group flex items-center gap-2.5">
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-bg shadow-[0_0_18px_-4px_var(--accent-glow)]">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-semibold tracking-tight">Lunch<span className="text-primary">.</span></span>
          <span className="hidden sm:inline-flex items-center rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/70">v4.2</span>
        </a>

        <ul role="menubar" className="hidden md:flex items-center gap-0.5">
          {LINKS.map((l) => (
            <li key={l.label} role="none">
              <button
                role="menuitem"
                aria-haspopup={l.hasMenu ? "menu" : undefined}
                className="group inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                {l.label}
                {l.hasMenu && <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-hover:rotate-180" />}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex h-8 items-center rounded-lg px-3 text-[12px] font-medium text-muted-foreground hover:text-foreground">
            Sign in
          </button>
          <button className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[12px] font-semibold text-bg shadow-[0_0_18px_-6px_var(--accent-glow)] transition-all hover:shadow-[0_0_24px_-4px_var(--accent-glow)] hover:-translate-y-px">
            Start free
          </button>
          <button
            ref={triggerRef}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="navbar-saas-basic-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-foreground"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="navbar-saas-basic-menu"
            ref={menuRef}
            role="menu"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-white/[0.06] mt-3"
          >
            <ul className="pt-3 flex flex-col gap-0.5">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <button role="menuitem" className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-foreground">
                    {l.label}
                    <ChevronDown className="h-3 w-3 -rotate-90 opacity-40" />
                  </button>
                </li>
              ))}
              <li className="mt-2 grid grid-cols-2 gap-2">
                <button className="h-9 rounded-lg border border-white/10 text-sm text-foreground">Sign in</button>
                <button className="h-9 rounded-lg bg-primary text-sm font-semibold text-bg">Start free</button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
