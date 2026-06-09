"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LayoutDashboard, Search, Bell, Settings, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

const LINKS = ["Overview", "Projects", "Reports", "Team"];

export function NavbarDashboardBasic({ className }: { className?: string }) {
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
      aria-label="Dashboard"
      className={cn(
        "relative w-full max-w-3xl mx-auto rounded-xl border border-white/[0.07]",
        "bg-bg-2/80 backdrop-blur-xl px-4 py-2.5 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-bg">
              <LayoutDashboard className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="hidden sm:block text-sm font-semibold">Console</span>
          </a>
          <span className="hidden sm:block h-5 w-px bg-white/10" />
          <button className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-white/[0.04] px-2 py-1 text-[11px] font-mono text-muted-foreground hover:text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" /> acme-prod
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        <ul role="menubar" className="hidden md:flex items-center gap-0.5">
          {LINKS.map((l, i) => (
            <li key={l} role="none">
              <button
                role="menuitem"
                aria-current={i === 0 ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                  i === 0 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                )}
              >
                {l}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button aria-label="Search (Ctrl K)" className="hidden sm:inline-flex h-8 items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-2.5 text-[11px] text-muted-foreground hover:text-foreground">
            <Search className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden lg:inline-block rounded border border-white/10 px-1 py-px font-mono text-[9px]">⌘K</kbd>
          </button>
          <button aria-label="Notifications, 3 unread" className="relative grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-white/[0.04] hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-pink shadow-[0_0_6px_var(--pink)]" />
          </button>
          <button aria-label="Settings" className="hidden sm:grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-white/[0.04] hover:text-foreground">
            <Settings className="h-4 w-4" />
          </button>
          <button aria-label="Account menu" className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan to-violet text-[11px] font-bold text-bg">AB</button>
          <button
            ref={triggerRef}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="navbar-dash-menu"
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
            id="navbar-dash-menu"
            role="menu"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden mt-3"
          >
            <ul className="border-t border-white/[0.06] pt-3 flex flex-col gap-0.5">
              {LINKS.map((l) => (
                <li key={l}><button role="menuitem" className="w-full text-left rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-foreground">{l}</button></li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
