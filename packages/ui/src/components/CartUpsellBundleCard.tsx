"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Sparkles, ShoppingBag } from "lucide-react";
import { cn } from "../lib/cn";

interface BundleItem {
  id: string;
  name: string;
  price: number;
  hue: string;
}

const ITEMS: BundleItem[] = [
  { id: "b-1", name: "Lounge Tee", price: 38, hue: "from-rose-400/40 to-rose-600/20" },
  { id: "b-2", name: "Pleat Trousers", price: 128, hue: "from-amber-400/40 to-amber-600/20" },
  { id: "b-3", name: "Linen Overshirt", price: 168, hue: "from-emerald-400/40 to-emerald-600/20" },
];

export interface CartUpsellBundleCardProps {
  className?: string;
}

export function CartUpsellBundleCard({ className }: CartUpsellBundleCardProps) {
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [confirmed, setConfirmed] = useState(false);
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (reset.current) clearTimeout(reset.current);
  }, []);

  const toggle = (id: string) =>
    setPicked((p) => ({ ...p, [id]: !p[id] }));

  const subtotal = ITEMS.reduce((s, i) => s + (picked[i.id] ? i.price : 0), 0);
  const bundleTotal = ITEMS.reduce((s, i) => s + i.price, 0);
  const allOn = ITEMS.every((i) => picked[i.id]);
  const savings = allOn ? Math.round(bundleTotal * 0.12) : 0;
  const finalTotal = allOn ? bundleTotal - savings : subtotal;

  const addAll = () => {
    setPicked(Object.fromEntries(ITEMS.map((i) => [i.id, true])));
    if (reset.current) clearTimeout(reset.current);
    setConfirmed(true);
    reset.current = setTimeout(() => setConfirmed(false), 2200);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-sm text-foreground select-none",
        className
      )}
      role="region"
      aria-label="Complete the look bundle"
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">COMPLETE_THE_LOOK</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Add all for 12% off the bundle</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {ITEMS.map((item) => {
          const on = !!picked[item.id];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              aria-pressed={on}
              aria-label={`${on ? "Remove" : "Add"} ${item.name}`}
              className={cn(
                "relative aspect-[4/5] rounded-xl overflow-hidden border transition-colors text-left group",
                on ? "border-accent" : "border-edge hover:border-edge-2"
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br", item.hue)} />
              <div className="absolute inset-0 bg-bg/30" />
              <span className="absolute top-1.5 right-1.5">
                <span
                  className={cn(
                    "flex items-center justify-center w-5 h-5 rounded-full transition-all",
                    on ? "bg-accent text-bg" : "bg-bg/70 text-white/60 group-hover:bg-bg"
                  )}
                >
                  {on ? <Check className="w-3 h-3" aria-hidden="true" /> : <Plus className="w-3 h-3" aria-hidden="true" />}
                </span>
              </span>
              <span className="absolute bottom-1.5 left-1.5 right-1.5 flex flex-col">
                <span className="text-[10px] font-bold text-white truncate">{item.name}</span>
                <span className="text-[9px] text-white/70 font-mono">${item.price}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-edge text-xs">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-3 font-mono uppercase tracking-wider">Bundle total</span>
          <span className="font-bold text-text" aria-live="polite">
            ${finalTotal}
            {allOn && savings > 0 && (
              <span className="ml-1.5 text-[10px] font-mono text-accent">−${savings}</span>
            )}
          </span>
        </div>
        <motion.button
          type="button"
          onClick={addAll}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-2 rounded-xl bg-accent text-bg font-bold text-[11px] flex items-center gap-1.5 shadow-lg shadow-accent/20"
        >
          <AnimatePresence mode="wait" initial={false}>
            {confirmed ? (
              <motion.span
                key="ok"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                Added
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Add all
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <p className="text-[9px] text-text-4 font-mono flex items-center gap-1 -mt-1">
        <ShoppingBag className="w-3 h-3" aria-hidden="true" />
        Free shipping unlocked at 3 items
      </p>
    </div>
  );
}
