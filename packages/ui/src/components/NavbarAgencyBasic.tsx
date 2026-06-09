"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Asterisk, Menu, X } from "lucide-react";
import { cn } from "../lib/cn";

const LINKS = ["Work", "Studio", "Process", "Journal", "Contact"];

export function NavbarAgencyBasic({ className }: { className?: string }) {
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
        "relative w-full max-w-3xl mx-auto px-6 py-4 font-sans text-foreground",
        "border-y border-white/[0.06] bg-bg/40 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-6">
        <a href="/" className="group flex items-center gap-2.5">
          <Asterisk className="h-5 w-5 text-primary transition-transform group-hover:rotate-90" strokeWidth={2.5} />
          <span className="text-base font-serif italic tracking-tight">Atelier<span className="text-primary">.</span></span>
          <span className="hidden sm:inline-block text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.18em] ml-2">Est. MMXIX</span>
        </a>

        <ul role="menubar" className="hidden md:flex items-center gap-6">
          {LINKS.map((l, i) => (
            <li key={l} role="none">
              <button role="menuitem" className="group relative inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.16em] font-medium text-muted-foreground hover:text-foreground transition-colors">
                <span className="text-[9px] font-mono text-primary/70">0{i + 1}</span>
                {l}
                <span aria-hidden className="absolute -bottom-1.5 left-0 right-0 h-px origin-left scale-x-0 bg-primary transition-transform group-hover:scale-x-100" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button className="hidden sm:inline-flex h-9 items-center gap-2 rounded-full border border-foreground/20 px-4 text-[12px] font-medium uppercase tracking-[0.14em] text-foreground hover:bg-foreground hover:text-bg transition-colors">
            Brief us
          </button>
          <button
            ref={triggerRef}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="navbar-agency-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center text-foreground"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="navbar-agency-menu"
            role="menu"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden mt-4"
          >
            <ul className="border-t border-white/[0.06] pt-4 flex flex-col gap-1">
              {LINKS.map((l, i) => (
                <li key={l}>
                  <button role="menuitem" className="w-full flex items-center gap-3 py-2 text-base font-serif italic text-foreground/80 hover:text-primary">
                    <span className="text-[10px] font-mono text-primary">0{i + 1}</span>
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
