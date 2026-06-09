"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Hexagon, Menu, X } from "lucide-react";
import { cn } from "../lib/cn";

const LEFT = ["Product", "Solutions", "Pricing"];
const RIGHT = ["Customers", "Changelog", "Docs"];

export function NavbarSaasCenterLogo({ className }: { className?: string }) {
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
        "relative w-full max-w-3xl mx-auto rounded-2xl border border-white/[0.07]",
        "bg-[color-mix(in_srgb,var(--bg-2)_78%,transparent)] backdrop-blur-2xl px-5 py-3 font-sans text-foreground",
        "shadow-[0_24px_50px_-26px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* left links */}
        <ul role="menubar" className="hidden md:flex items-center justify-end gap-1">
          {LEFT.map((l) => (
            <li key={l} role="none">
              <button role="menuitem" className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">{l}</button>
            </li>
          ))}
        </ul>

        {/* center brand */}
        <a href="/" className="group flex items-center gap-2 justify-self-center md:justify-self-auto">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-bg-3 ring-1 ring-white/10 text-primary shadow-[0_0_20px_-6px_var(--accent-glow)]">
            <Hexagon className="h-4 w-4" strokeWidth={2.5} />
            <span aria-hidden className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Pivot<span className="text-primary">/</span>UI</span>
        </a>

        {/* right links + CTA */}
        <div className="hidden md:flex items-center justify-start gap-1">
          <ul role="menubar" className="flex items-center gap-1">
            {RIGHT.map((l) => (
              <li key={l} role="none">
                <button role="menuitem" className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">{l}</button>
              </li>
            ))}
          </ul>
          <span className="mx-2 h-5 w-px bg-white/10" />
          <button className="h-8 rounded-lg bg-primary px-3.5 text-[12px] font-semibold text-bg shadow-[0_0_18px_-6px_var(--accent-glow)] hover:-translate-y-px transition-all">
            Get started
          </button>
        </div>

        {/* mobile trigger lives right */}
        <button
          ref={triggerRef}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="navbar-center-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden justify-self-end inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="navbar-center-menu"
            role="menu"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-white/[0.06] mt-3"
          >
            <ul className="pt-3 flex flex-col gap-0.5">
              {[...LEFT, ...RIGHT].map((l) => (
                <li key={l}>
                  <button role="menuitem" className="w-full text-left rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-foreground">
                    {l}
                  </button>
                </li>
              ))}
              <li className="mt-2"><button className="w-full h-9 rounded-lg bg-primary text-sm font-semibold text-bg">Get started</button></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
