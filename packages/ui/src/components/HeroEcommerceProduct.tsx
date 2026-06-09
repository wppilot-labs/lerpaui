"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingBag, Star, Truck, ShieldCheck } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroEcommerceProductProps {
  className?: string;
}

const COLORS = [
  { name: "Obsidian", hex: "#1a1820" },
  { name: "Sand", hex: "#c8b89a" },
  { name: "Moss", hex: "#5b7359" },
  { name: "Clay", hex: "#a85a3e" },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

export function HeroEcommerceProduct({ className }: HeroEcommerceProductProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [color, setColor] = React.useState(0);
  const [size, setSize] = React.useState(2);

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/20 px-6 py-12 backdrop-blur-xl sm:px-10 sm:py-16",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/40"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(ellipse at center, ${COLORS[color].hex} 0%, oklch(0.15 0.02 280) 75%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <motion.div
            key={color}
            initial={reduced ? false : { opacity: 0, y: 20, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="h-3/4 w-3/4 rounded-[40%_60%_55%_45%_/_55%_45%_60%_40%] shadow-2xl"
              style={{
                background: `radial-gradient(circle at 30% 25%, ${COLORS[color].hex}ee, ${COLORS[color].hex}99 60%, ${COLORS[color].hex}55)`,
                boxShadow: `inset -20px -40px 80px rgba(0,0,0,0.4), 0 30px 80px ${COLORS[color].hex}66`,
              }}
            />
          </motion.div>

          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> In stock
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
            <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur-md">
              Limited drop · 240/500
            </span>
            <span className="font-mono">{COLORS[color].name}</span>
          </div>
        </motion.div>

        <div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
              ))}
            </span>
            <span className="font-medium text-foreground">4.9</span>
            <span>(2,481 reviews)</span>
          </motion.div>

          <motion.h1
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-3 text-balance text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl"
          >
            The Atlas Heritage Tote
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground"
          >
            Hand-cut full-grain leather, brass hardware, lifetime repair. Built for fifteen years
            of weekday commutes and weekend escapes.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="mt-6 flex items-baseline gap-3"
          >
            <span className="text-4xl font-black text-foreground">$284</span>
            <span className="text-sm text-muted-foreground line-through">$340</span>
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              −16%
            </span>
          </motion.div>

          <div className="mt-7">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Color · <span className="text-foreground">{COLORS[color].name}</span>
            </div>
            <div className="mt-2 flex gap-2">
              {COLORS.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(i)}
                  aria-label={`Select color ${c.name}`}
                  aria-pressed={color === i}
                  className={cn(
                    "h-9 w-9 rounded-full border-2 ring-offset-2 ring-offset-background transition-all focus:outline-none focus:ring-2 focus:ring-primary",
                    color === i ? "border-primary scale-110" : "border-border/40"
                  )}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Size
            </div>
            <div className="mt-2 flex gap-2">
              {SIZES.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(i)}
                  aria-pressed={size === i}
                  className={cn(
                    "h-10 w-10 rounded-lg border text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary",
                    size === i
                      ? "border-foreground bg-foreground text-background"
                      : "border-border/40 bg-card/40 text-foreground hover:border-border"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <button
              type="button"
              className="group flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-background shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 motion-reduce:hover:translate-y-0"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              Add to bag — $284
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Save
            </button>
          </motion.div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/40 pt-5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-foreground" aria-hidden />
              <span>Free 2-day shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-foreground" aria-hidden />
              <span>Lifetime repair</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroEcommerceProduct;
