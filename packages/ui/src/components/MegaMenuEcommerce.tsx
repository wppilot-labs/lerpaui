"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShoppingBag, ChevronDown, Flame, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

const CATS = [
  { title: "Women", items: ["Dresses", "Knitwear", "Outerwear", "Bags", "Shoes"] },
  { title: "Men", items: ["Shirts", "Tailoring", "Denim", "Sneakers", "Accessories"] },
  { title: "Home", items: ["Bedding", "Lighting", "Ceramics", "Fragrance"] },
];

const PROMO = [
  { tag: "New season", title: "Resort '26", img: "from-amber to-pink" },
  { tag: "Last drops", title: "Knit edit", img: "from-cyan to-violet" },
];

export function MegaMenuEcommerce({ className }: { className?: string }) {
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
      <nav aria-label="Shop" className="rounded-xl border border-white/[0.07] bg-bg-2/80 backdrop-blur-xl px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
            <ShoppingBag className="h-4 w-4 text-primary" /> Maison
          </a>
          <div className="flex items-center gap-1">
            <button
              ref={triggerRef}
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-haspopup="menu"
              aria-controls="mega-ec-panel"
              className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[12px] uppercase tracking-[0.14em] font-semibold text-foreground hover:bg-white/[0.04]"
            >
              Shop
              <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
            </button>
            <button className="rounded-md px-3 py-1.5 text-[12px] uppercase tracking-[0.14em] font-semibold text-muted-foreground hover:text-foreground">
              Stories
            </button>
            <button className="rounded-md px-3 py-1.5 text-[12px] uppercase tracking-[0.14em] font-semibold text-pink hover:bg-pink/10">
              Sale
            </button>
          </div>
          <button aria-label="Cart, 3 items" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[12px] font-semibold text-bg">
            <ShoppingBag className="h-3.5 w-3.5" /> 3
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mega-ec-panel"
            role="menu"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full mt-2 z-20 rounded-2xl border border-white/[0.08] bg-bg-2/95 backdrop-blur-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            <div className="grid grid-cols-[1fr_1fr_1fr_1.1fr]">
              {CATS.map((c) => (
                <div key={c.title} className="p-4 border-r border-white/[0.06]">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/70 mb-2">{c.title}</h4>
                  <ul className="flex flex-col gap-0.5">
                    {c.items.map((it, i) => (
                      <li key={it}>
                        <button role="menuitem" className="group w-full text-left rounded-md px-2 py-1 text-[12.5px] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground flex items-center justify-between">
                          {it}
                          {i === 0 && c.title === "Women" && <Flame className="h-3 w-3 text-pink" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="p-4 bg-bg-3/30 grid grid-cols-1 gap-2 content-start">
                {PROMO.map((p) => (
                  <button key={p.title} role="menuitem" className={cn("group relative aspect-[3/2] rounded-lg overflow-hidden text-left bg-gradient-to-br", p.img)}>
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute inset-x-3 bottom-3 z-10 text-white">
                      <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.16em] opacity-90 mb-1">
                        <Sparkles className="h-2.5 w-2.5" /> {p.tag}
                      </span>
                      <span className="block text-sm font-semibold">{p.title}</span>
                    </span>
                    <ArrowRight className="absolute top-3 right-3 z-10 h-4 w-4 text-white transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
