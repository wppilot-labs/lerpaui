"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Mail, Package } from "lucide-react";
import { cn } from "../lib/cn";

export interface OrderConfirmationConfettiCardProps {
  className?: string;
  orderId?: string;
  email?: string;
  total?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  hue: number;
  size: number;
  rot: number;
  delay: number;
}

function makeParticles(): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < 26; i++) {
    out.push({
      id: i,
      x: (Math.random() - 0.5) * 240,
      y: 60 + Math.random() * 180,
      hue: Math.floor(Math.random() * 360),
      size: 4 + Math.random() * 6,
      rot: Math.random() * 720 - 360,
      delay: Math.random() * 0.25,
    });
  }
  return out;
}

export function OrderConfirmationConfettiCard({
  className,
  orderId = "ORD-29F4-8821",
  email = "you@lerpaui.com",
  total = "$148.42",
}: OrderConfirmationConfettiCardProps) {
  const reduce = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles only on the client to avoid SSR hydration mismatch.
  useEffect(() => {
    setParticles(makeParticles());
  }, []);

  return (
    <div
      className={cn(
        "relative w-full max-w-sm border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl p-5 backdrop-blur-xl overflow-hidden",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {!reduce ? (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute left-1/2 top-8 block"
              style={{
                width: p.size,
                height: p.size * 0.4,
                background: `hsl(${p.hue} 80% 60%)`,
                borderRadius: 2,
              }}
              initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: [0, 1, 1, 0],
                rotate: p.rot,
              }}
              transition={{
                duration: 1.6,
                delay: p.delay,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.1, 0.7, 1],
              }}
            />
          ))}
        </div>
      ) : null}

      <div className="relative flex flex-col items-center text-center">
        <div className="flex flex-col gap-1 font-mono select-none mb-4 text-center">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">ORDER_CONFIRMED</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">Receipt sent to your inbox</span>
        </div>

        <motion.div
          initial={reduce ? false : { scale: 0.4, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-400/40 grid place-items-center mb-3 shadow-[0_0_40px_-8px_rgba(16,185,129,0.6)]"
        >
          <Check className="w-7 h-7 text-emerald-400" aria-hidden="true" />
        </motion.div>

        <h3 className="text-base font-extrabold text-white">Thank you!</h3>
        <p className="text-[11px] text-white/55 mt-0.5">
          Order <span className="font-mono text-white/85">{orderId}</span> — {total}
        </p>

        <div className="mt-4 w-full grid grid-cols-2 gap-2">
          <a
            href="#receipt"
            className="h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-white/85 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Mail aria-hidden="true" className="w-3.5 h-3.5" />
            <span>Email receipt</span>
          </a>
          <a
            href="#track"
            className="h-9 rounded-xl bg-primary text-primary-foreground hover:brightness-110 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Package aria-hidden="true" className="w-3.5 h-3.5" />
            <span>Track order</span>
          </a>
        </div>

        <p className="text-[10px] text-white/40 mt-3 font-mono">{email}</p>
      </div>
    </div>
  );
}
