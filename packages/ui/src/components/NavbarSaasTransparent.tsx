"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Triangle, Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/cn";

const LINKS = ["Platform", "Solutions", "Resources", "Pricing"];

export function NavbarSaasTransparent({ className }: { className?: string }) {
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
        "relative w-full max-w-3xl mx-auto px-5 py-3 font-sans text-foreground",
        // truly transparent: only a hairline bottom + soft glow on scroll-feel
        "border-b border-white/[0.06]",
        "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:pointer-events-none",
        className,
      )}
    >
      <div className="relative flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-foreground/95 text-bg">
            <Triangle className="h-4 w-4 fill-bg" strokeWidth={0} />
          </span>
          <span className="text-sm font-semibold tracking-tight">Vercel<span className="opacity-50">.io</span></span>
        </a>

        <ul role="menubar" className="hidden md:flex items-center gap-0.5">
          {LINKS.map((l) => (
            <li key={l} role="none">
              <button role="menuitem" className="rounded-md px-3 py-1.5 text-[13px] font-medium text-foreground/70 hover:text-foreground transition-colors">
                {l}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex h-8 items-center text-[12px] font-medium text-foreground/70 hover:text-foreground px-2">
            Log in
          </button>
          <button className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3.5 text-[12px] font-semibold text-bg transition-transform hover:-translate-y-px">
            Contact <ArrowUpRight className="h-3 w-3" />
          </button>
          <button
            ref={triggerRef}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="navbar-transparent-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="navbar-transparent-menu"
            role="menu"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden mt-3"
          >
            <ul className="border-t border-white/[0.06] pt-3 flex flex-col gap-0.5">
              {LINKS.map((l) => (
                <li key={l}>
                  <button role="menuitem" className="w-full text-left rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-white/[0.04]">
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
