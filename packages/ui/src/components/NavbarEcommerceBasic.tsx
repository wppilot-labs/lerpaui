"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShoppingBag, Search, Heart, User, Menu, X } from "lucide-react";
import { cn } from "../lib/cn";

const LINKS = ["New", "Women", "Men", "Sale", "Lookbook"];

export function NavbarEcommerceBasic({ className }: { className?: string }) {
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
    <header className={cn("w-full max-w-3xl mx-auto", className)}>
      {/* announcement strip */}
      <div className="text-center py-1.5 text-[11px] font-medium tracking-wide bg-foreground text-bg rounded-t-lg">
        Free shipping on orders over $80 · Code <span className="font-mono">SUMMER</span>
      </div>

      <nav
        aria-label="Primary"
        className="relative rounded-b-lg border-x border-b border-white/[0.07] bg-bg-2/80 backdrop-blur-xl px-5 py-3.5 font-sans text-foreground"
      >
        <div className="flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" strokeWidth={2.3} />
            <span className="text-base font-bold tracking-tight uppercase">Maison<span className="text-primary">.</span></span>
          </a>

          <ul role="menubar" className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l} role="none">
                <button role="menuitem" className="relative rounded-md px-3 py-1.5 text-[12px] uppercase tracking-[0.14em] font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  {l}
                  {l === "Sale" && <span aria-hidden className="absolute -top-0.5 -right-1 h-1.5 w-1.5 rounded-full bg-pink shadow-[0_0_8px_var(--pink)]" />}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <button aria-label="Search" className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/[0.04]">
              <Search className="h-4 w-4" />
            </button>
            <button aria-label="Wishlist" className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/[0.04]">
              <Heart className="h-4 w-4" />
            </button>
            <button aria-label="Account" className="hidden sm:grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/[0.04]">
              <User className="h-4 w-4" />
            </button>
            <button aria-label="Cart, 3 items" className="relative inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[12px] font-semibold text-bg">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="font-mono">3</span>
            </button>
            <button
              ref={triggerRef}
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="navbar-ec-menu"
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
              id="navbar-ec-menu"
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
                    <button role="menuitem" className="w-full text-left rounded-md px-3 py-2 text-sm uppercase tracking-wider font-semibold text-muted-foreground hover:bg-white/[0.04] hover:text-foreground">{l}</button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
