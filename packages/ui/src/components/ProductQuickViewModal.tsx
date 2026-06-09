"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ShoppingBag, Star, Plus, Minus, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface ProductQuickViewModalProps {
  className?: string;
}

interface Swatch {
  id: string;
  name: string;
  hex: string;
}

const COLORS: Swatch[] = [
  { id: "obsidian", name: "Obsidian", hex: "#111111" },
  { id: "linen", name: "Linen", hex: "#E8E1D2" },
  { id: "moss", name: "Moss", hex: "#465B3F" },
  { id: "rust", name: "Rust", hex: "#A8482B" },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

const GALLERY = [
  { hue: 14, label: "Front view" },
  { hue: 200, label: "Side view" },
  { hue: 280, label: "Detail view" },
  { hue: 45, label: "Back view" },
];

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div
      role="img"
      aria-label={`Rated ${value} out of ${max} stars`}
      className="inline-flex items-center gap-0.5"
    >
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/40"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function ProductQuickViewModal({ className }: ProductQuickViewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(COLORS[0].id);
  const [size, setSize] = useState<string>("M");
  const [qty, setQty] = useState(1);
  const reducedMotion = useReducedMotion();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  const titleId = useId();
  const descId = useId();
  const sizeLabelId = useId();
  const colorLabelId = useId();
  const qtyId = useId();

  const close = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(focusableSelector);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    const t = window.setTimeout(() => firstFocusRef.current?.focus(), 60);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(t);
    };
  }, [isOpen, close]);

  const motionProps = reducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.96, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 8 },
        transition: { type: "spring" as const, duration: 0.4 },
      };

  const swatch = COLORS.find((c) => c.id === color) ?? COLORS[0];
  const current = GALLERY[activeImage];

  return (
    <div className={cn("flex flex-col items-center gap-3 font-sans", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary hover:brightness-110 text-primary-foreground font-semibold text-sm rounded-xl shadow-lg active:scale-95 transition-all inline-flex items-center gap-2"
      >
        <ShoppingBag className="w-4 h-4" aria-hidden="true" />
        Quick view
      </button>

      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              aria-hidden="true"
            />

            <motion.div
              ref={panelRef}
              {...motionProps}
              className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close dialog"
                className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-card/80 backdrop-blur hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Gallery */}
              <div className="md:w-1/2 bg-muted/40 p-4 flex flex-col">
                <div
                  className="aspect-square w-full rounded-xl overflow-hidden flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, hsl(${current.hue} 35% 80%), hsl(${current.hue} 45% 55%))`,
                  }}
                  aria-label={current.label}
                  role="img"
                >
                  <ShoppingBag className="w-20 h-20 text-white/60" aria-hidden="true" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2" role="tablist" aria-label="Product images">
                  {GALLERY.map((g, i) => {
                    const active = activeImage === i;
                    return (
                      <button
                        key={i}
                        ref={i === 0 ? firstFocusRef : undefined}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-label={g.label}
                        onClick={() => setActiveImage(i)}
                        className={cn(
                          "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                          active ? "border-primary" : "border-transparent hover:border-border"
                        )}
                        style={{
                          background: `linear-gradient(135deg, hsl(${g.hue} 35% 80%), hsl(${g.hue} 45% 55%))`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Details */}
              <div className="md:w-1/2 p-6 overflow-y-auto">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                  New arrival
                </p>
                <h2 id={titleId} className="text-xl font-semibold text-foreground mb-1">
                  Atelier Wool Overcoat
                </h2>
                <div className="flex items-center gap-2 mb-3">
                  <StarRating value={4.6} />
                  <span className="text-xs text-muted-foreground">4.6 · 218 reviews</span>
                </div>
                <p className="text-2xl font-bold text-foreground mb-4">
                  $248
                  <span className="ml-2 text-sm font-normal text-muted-foreground line-through">$320</span>
                </p>
                <p id={descId} className="text-sm text-muted-foreground leading-relaxed mb-5">
                  A heavyweight double-faced wool overcoat with raglan sleeves and a single-button closure.
                  Tailored in Portugal.
                </p>

                {/* Color */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span id={colorLabelId} className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      Color
                    </span>
                    <span className="text-xs text-muted-foreground">{swatch.name}</span>
                  </div>
                  <div role="radiogroup" aria-labelledby={colorLabelId} className="flex gap-2">
                    {COLORS.map((c) => {
                      const active = color === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          aria-label={c.name}
                          onClick={() => setColor(c.id)}
                          className={cn(
                            "h-8 w-8 rounded-full border-2 transition-all",
                            active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-foreground/30"
                          )}
                          style={{ backgroundColor: c.hex }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Size */}
                <div className="mb-5">
                  <span id={sizeLabelId} className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                    Size
                  </span>
                  <div role="radiogroup" aria-labelledby={sizeLabelId} className="flex gap-2">
                    {SIZES.map((s) => {
                      const active = size === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setSize(s)}
                          className={cn(
                            "min-w-[2.5rem] h-9 px-2 rounded-md border text-xs font-semibold transition-all",
                            active
                              ? "bg-foreground text-background border-foreground"
                              : "bg-background text-foreground border-border hover:border-foreground/40"
                          )}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-5">
                  <label htmlFor={qtyId} className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                    Quantity
                  </label>
                  <div className="inline-flex items-center rounded-md border border-border">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      disabled={qty <= 1}
                      className="h-9 w-9 inline-flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <input
                      id={qtyId}
                      type="number"
                      min={1}
                      max={99}
                      value={qty}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!Number.isNaN(v)) setQty(Math.max(1, Math.min(99, v)));
                      }}
                      className="w-12 text-center bg-transparent text-sm font-semibold text-foreground border-x border-border focus:outline-none focus:ring-2 focus:ring-primary/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(99, q + 1))}
                      aria-label="Increase quantity"
                      className="h-9 w-9 inline-flex items-center justify-center text-foreground hover:bg-muted"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={close}
                  className="w-full py-2.5 bg-primary hover:brightness-110 text-primary-foreground text-sm font-semibold rounded-lg shadow-sm transition-all inline-flex items-center justify-center gap-2 mb-2"
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  Add to cart · ${248 * qty}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center gap-1"
                >
                  View full details
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
