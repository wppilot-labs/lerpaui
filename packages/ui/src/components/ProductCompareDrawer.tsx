"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X, Check, Minus } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

type Item = {
  id: string;
  name: string;
  price: string;
  tint: string;
  weight: string;
  waterproof: boolean;
  battery: string;
};

const ITEMS: Item[] = [
  {
    id: "a",
    name: "Trail 2",
    price: "$140",
    tint: "from-emerald-500/30 to-teal-500/10",
    weight: "290 g",
    waterproof: true,
    battery: "—",
  },
  {
    id: "b",
    name: "Pulse X",
    price: "$180",
    tint: "from-sky-500/30 to-indigo-500/10",
    weight: "245 g",
    waterproof: false,
    battery: "12 h",
  },
];

export interface ProductCompareDrawerProps {
  className?: string;
}

export function ProductCompareDrawer({ className }: ProductCompareDrawerProps) {
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  return (
    <div className={cn("font-sans text-foreground", className)}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
      >
        <Scale className="w-4 h-4" />
        Compare ({ITEMS.length})
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              role="dialog"
              aria-label="Compare products"
              initial={reduced ? { x: 0 } : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduced ? { x: 0 } : { x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="absolute right-0 top-0 bottom-0 w-[24rem] max-w-[90vw] bg-card/95 backdrop-blur-xl border-l border-border/60 p-5 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-primary" /> Compare
                </h2>
                <button
                  type="button"
                  aria-label="Close compare drawer"
                  onClick={() => setOpen(false)}
                  className="h-7 w-7 rounded-lg hover:bg-foreground/[0.06] flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {ITEMS.map((it) => (
                  <div key={it.id} className="text-center">
                    <div
                      className={cn(
                        "h-20 rounded-xl bg-gradient-to-br mb-2 border border-foreground/[0.05]",
                        it.tint,
                      )}
                    />
                    <div className="text-sm font-bold">{it.name}</div>
                    <div className="text-xs text-muted-foreground/60">
                      {it.price}
                    </div>
                  </div>
                ))}
              </div>

              <dl className="text-xs divide-y divide-border/30 border-y border-border/30">
                {[
                  { label: "Weight", render: (i: Item) => i.weight },
                  {
                    label: "Waterproof",
                    render: (i: Item) =>
                      i.waterproof ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                      ),
                  },
                  { label: "Battery", render: (i: Item) => i.battery },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-2 gap-3 py-2.5 relative"
                  >
                    <span className="absolute left-1/2 -translate-x-1/2 top-1 text-[11px] uppercase tracking-wider text-muted-foreground/40 font-bold">
                      {row.label}
                    </span>
                    {ITEMS.map((it) => (
                      <div
                        key={it.id}
                        className="text-center font-medium pt-3"
                      >
                        {row.render(it)}
                      </div>
                    ))}
                  </div>
                ))}
              </dl>

              <button
                type="button"
                className="mt-auto w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Add both to cart
              </button>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
