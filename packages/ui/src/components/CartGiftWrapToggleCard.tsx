"use client";

import React, { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, PenLine, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface CartGiftWrapToggleCardProps {
  className?: string;
  fee?: number;
}

export function CartGiftWrapToggleCard({ className, fee = 4.5 }: CartGiftWrapToggleCardProps) {
  const [wrap, setWrap] = useState(false);
  const [note, setNote] = useState("");
  const noteId = useId();
  const MAX = 140;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-sm text-foreground select-none",
        className
      )}
      role="region"
      aria-label="Gift wrap and personal note options"
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">GIFT_WRAP_OPTIONS</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Adds {fee.toFixed(2)} to your order</span>
      </div>

      <div
        className={cn(
          "relative rounded-xl border p-3 transition-colors",
          wrap ? "border-accent/40 bg-accent-soft/40" : "border-edge bg-bg-3"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "p-2 rounded-lg transition-colors",
                wrap ? "bg-accent text-bg" : "bg-bg-4 text-text-2"
              )}
            >
              <Gift className="w-4 h-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-text">Wrap as a gift</p>
              <p className="text-[10px] text-text-3 font-mono">Recycled kraft + ribbon</p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={wrap}
            aria-label="Toggle gift wrap"
            onClick={() => setWrap((v) => !v)}
            className={cn(
              "relative w-11 h-6 rounded-full transition-colors",
              wrap ? "bg-accent" : "bg-bg-4 border border-edge-2"
            )}
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              className={cn(
                "absolute top-0.5 w-5 h-5 rounded-full shadow",
                wrap ? "right-0.5 bg-bg" : "left-0.5 bg-text"
              )}
              aria-hidden="true"
            />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {wrap && (
            <motion.div
              key="extra"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-edge space-y-2">
                <label htmlFor={noteId} className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-text-3">
                  <PenLine className="w-3 h-3" aria-hidden="true" />
                  Personal note
                </label>
                <textarea
                  id={noteId}
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, MAX))}
                  rows={2}
                  placeholder="Happy birthday — open carefully…"
                  className="w-full resize-none rounded-lg bg-bg border border-edge text-text text-xs font-sans p-2 placeholder:text-text-4 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
                />
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-text-4 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber" aria-hidden="true" />
                    Hand-written on card
                  </span>
                  <span className={cn("tabular-nums", note.length === MAX ? "text-amber" : "text-text-3")}>
                    {note.length}/{MAX}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-text-3 font-mono">Wrap fee</span>
        <motion.span
          key={wrap ? "on" : "off"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className={cn("font-bold tabular-nums", wrap ? "text-accent" : "text-text-3")}
          aria-live="polite"
        >
          {wrap ? `+$${fee.toFixed(2)}` : "—"}
        </motion.span>
      </div>
    </div>
  );
}
