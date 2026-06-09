"use client";

import React, { useId, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { cn } from "../lib/cn";

interface ReviewItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  hue: number;
  initials: string;
}

const ITEMS: ReviewItem[] = [
  { id: "i1", name: "Aero Runner Mid",   qty: 1, price: 132.0, hue: 18,  initials: "AR" },
  { id: "i2", name: "Linen Crew Tee",    qty: 2, price: 32.5,  hue: 198, initials: "LT" },
  { id: "i3", name: "Trail Cap — Olive", qty: 1, price: 24.0,  hue: 92,  initials: "TC" },
  { id: "i4", name: "Wool Hiking Socks", qty: 3, price: 14.0,  hue: 262, initials: "WS" },
];

export interface CheckoutOrderReviewAccordionProps {
  className?: string;
  items?: ReviewItem[];
  shipping?: number;
  tax?: number;
}

export function CheckoutOrderReviewAccordion({
  className,
  items = ITEMS,
  shipping = 8.5,
  tax = 14.92,
}: CheckoutOrderReviewAccordionProps) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items],
  );
  const total = subtotal + shipping + tax;

  return (
    <div
      className={cn(
        "w-full max-w-sm border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl p-4 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none mb-3">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">ORDER_REVIEW</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Tap to expand · {items.length} items</span>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="w-full flex items-center gap-3 group"
      >
        <div className="flex -space-x-2 shrink-0">
          {items.slice(0, 4).map((i) => (
            <div
              key={i.id}
              aria-hidden="true"
              className="w-8 h-8 rounded-lg ring-2 ring-zinc-950 grid place-items-center text-[10px] font-bold text-white/85 font-mono"
              style={{
                background: `linear-gradient(135deg, hsl(${i.hue} 70% 22%), hsl(${i.hue} 70% 45%))`,
              }}
            >
              {i.initials}
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-xs font-bold text-white truncate">
            {items.length} items · {items.reduce((s, i) => s + i.qty, 0)} units
          </div>
          <div className="text-[10px] text-white/45 font-mono truncate">
            <ShoppingBag aria-hidden="true" className="inline w-2.5 h-2.5 mr-1" />
            Ships from 2 warehouses
          </div>
        </div>
        <span className="text-xs font-extrabold text-primary tabular-nums">${total.toFixed(2)}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "w-4 h-4 text-white/50 transition-transform duration-200",
            open && "rotate-180 text-white",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={bodyId}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
              {items.map((i) => (
                <div key={i.id} className="flex items-center gap-2.5 text-xs">
                  <div
                    aria-hidden="true"
                    className="w-9 h-9 rounded-lg shrink-0 grid place-items-center text-[10px] font-bold text-white/85 font-mono"
                    style={{
                      background: `linear-gradient(135deg, hsl(${i.hue} 70% 22%), hsl(${i.hue} 70% 45%))`,
                    }}
                  >
                    {i.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-white font-medium">{i.name}</div>
                    <div className="text-[10px] text-white/45 font-mono">qty {i.qty}</div>
                  </div>
                  <span className="tabular-nums text-white/85 font-mono">
                    ${(i.price * i.qty).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="mt-2 pt-2 border-t border-white/5 space-y-1 text-[11px] font-mono">
                <Row label="Subtotal" value={subtotal} />
                <Row label="Shipping" value={shipping} />
                <Row label="Tax" value={tax} />
                <div className="flex justify-between pt-1 border-t border-white/5 text-xs font-extrabold text-white">
                  <span>Total</span>
                  <span className="text-primary tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-white/55">
      <span>{label}</span>
      <span className="tabular-nums">${value.toFixed(2)}</span>
    </div>
  );
}
