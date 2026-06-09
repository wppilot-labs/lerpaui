"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Bookmark, ShoppingCart, X, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

interface SavedItem {
  id: string;
  name: string;
  variant: string;
  price: number;
}

const SEED: SavedItem[] = [
  { id: "s-1", name: "Aurora Linen Shirt", variant: "Ecru / M", price: 78 },
  { id: "s-2", name: "Loft Denim Jacket", variant: "Indigo / L", price: 168 },
  { id: "s-3", name: "Vault Carry Tote", variant: "Sand", price: 124 },
  { id: "s-4", name: "Trail Knit Beanie", variant: "Moss", price: 32 },
];

export interface CartSavedForLaterStackProps {
  className?: string;
}

export function CartSavedForLaterStack({ className }: CartSavedForLaterStackProps) {
  const [saved, setSaved] = useState<SavedItem[]>(SEED);
  const [cart, setCart] = useState<SavedItem[]>([]);
  const [expanded, setExpanded] = useState(false);

  const move = (id: string) => {
    const item = saved.find((s) => s.id === id);
    if (!item) return;
    setSaved((prev) => prev.filter((s) => s.id !== id));
    setCart((prev) => [...prev, item]);
  };

  const remove = (id: string) => setSaved((prev) => prev.filter((s) => s.id !== id));

  return (
    <LayoutGroup id="cart-saved-for-later-stack">
      <div
        className={cn(
          "flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-sm text-foreground select-none",
          className
        )}
        role="region"
        aria-label="Saved for later stack"
      >
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">SAVED_FOR_LATER</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">Tap to peek, swap to cart</span>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/60 hover:text-primary transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Bookmark className="w-3 h-3" aria-hidden="true" />
            {saved.length} saved
          </span>
          <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
        </button>

        <div className="relative h-32" aria-live="polite">
          <AnimatePresence initial={false}>
            {saved.slice(0, expanded ? saved.length : 3).map((item, i) => {
              const stackIndex = expanded ? 0 : i;
              return (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{
                    opacity: 1,
                    y: expanded ? i * 56 : stackIndex * 8,
                    scale: expanded ? 1 : 1 - stackIndex * 0.04,
                    zIndex: 10 - stackIndex,
                  }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-2.5 rounded-xl bg-bg-3 border border-edge"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate text-text">{item.name}</p>
                    <p className="text-[10px] text-text-3 font-mono truncate">{item.variant} · ${item.price}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => move(item.id)}
                      aria-label={`Move ${item.name} to cart`}
                      className="p-1.5 rounded-md bg-accent-soft text-accent hover:bg-accent hover:text-bg transition-colors"
                    >
                      <ShoppingCart className="w-3 h-3" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="p-1.5 rounded-md text-text-3 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <X className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-edge text-[10px] font-mono">
          <span className="text-text-3 uppercase tracking-wider">Cart</span>
          <motion.span
            key={cart.length}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="px-2 py-0.5 rounded-full bg-accent text-bg font-bold"
          >
            {cart.length} item{cart.length === 1 ? "" : "s"}
          </motion.span>
        </div>
      </div>
    </LayoutGroup>
  );
}
