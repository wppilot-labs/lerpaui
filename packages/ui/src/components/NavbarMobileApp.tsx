"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Smartphone, Download, Apple, Menu, X, Play } from "lucide-react";
import { cn } from "../lib/cn";

const LINKS = ["Features", "Screens", "Pricing", "Reviews"];

export function NavbarMobileApp({ className }: { className?: string }) {
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
        "relative w-full max-w-3xl mx-auto rounded-[28px] border border-white/[0.08]",
        "bg-gradient-to-b from-bg-2/90 to-bg/90 backdrop-blur-2xl",
        "shadow-[0_30px_60px_-32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)_inset]",
        "px-4 py-3 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-cyan via-violet to-pink text-bg shadow-[0_0_20px_-4px_rgba(95,223,255,0.5)]">
            <Smartphone className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Loop</div>
            <div className="text-[9px] font-mono text-muted-foreground/70 uppercase tracking-[0.15em]">iOS · Android</div>
          </div>
        </a>

        <ul role="menubar" className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <li key={l} role="none">
              <button role="menuitem" className="rounded-full px-3 py-1.5 text-[12.5px] font-medium text-muted-foreground hover:bg-white/[0.06] hover:text-foreground transition-colors">{l}</button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button aria-label="Download for iOS" className="hidden sm:inline-flex h-9 items-center gap-2 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-[11px] font-medium text-foreground hover:bg-white/[0.06] transition-colors">
            <Apple className="h-3.5 w-3.5" />
            <span className="flex flex-col items-start leading-none">
              <span className="text-[8px] uppercase tracking-wider text-muted-foreground/60">Get on</span>
              <span>App Store</span>
            </span>
          </button>
          <button aria-label="Download for Android" className="hidden md:inline-flex h-9 items-center gap-2 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-[11px] font-medium text-foreground hover:bg-white/[0.06] transition-colors">
            <Play className="h-3.5 w-3.5 fill-foreground" />
            <span className="flex flex-col items-start leading-none">
              <span className="text-[8px] uppercase tracking-wider text-muted-foreground/60">Get on</span>
              <span>Play Store</span>
            </span>
          </button>
          <button className="sm:hidden inline-flex h-9 items-center gap-1.5 rounded-xl bg-foreground px-3 text-[11px] font-semibold text-bg">
            <Download className="h-3 w-3" /> Get app
          </button>
          <button
            ref={triggerRef}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="navbar-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-foreground"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="navbar-mobile-menu"
            role="menu"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden mt-3"
          >
            <ul className="border-t border-white/[0.06] pt-3 flex flex-col gap-0.5">
              {LINKS.map((l) => (
                <li key={l}><button role="menuitem" className="w-full text-left rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-foreground">{l}</button></li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
