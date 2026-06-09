"use client";

import React from "react";
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock, Leaf } from "lucide-react";
import { cn } from "../lib/cn";

type Badge = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
};

const BADGES: Badge[] = [
  { id: "secure", icon: Lock, title: "Secure checkout", sub: "256-bit SSL encryption" },
  { id: "ship", icon: Truck, title: "Free shipping", sub: "On orders over $50" },
  { id: "returns", icon: RotateCcw, title: "60-day returns", sub: "No questions asked" },
  { id: "warranty", icon: ShieldCheck, title: "2-year warranty", sub: "On all products" },
  { id: "support", icon: Headphones, title: "24/7 support", sub: "Real humans, anytime" },
  { id: "eco", icon: Leaf, title: "Carbon neutral", sub: "Offset every order" },
];

export interface EcommerceTrustStripBlockProps {
  className?: string;
}

export function EcommerceTrustStripBlock({ className }: EcommerceTrustStripBlockProps) {
  return (
    <div className={cn("w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {BADGES.map((b) => {
          const Icon = b.icon;
          return (
            <li key={b.id} className="flex items-center gap-2.5 rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] p-3.5">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{b.title}</div>
                <div className="text-xs text-muted-foreground/55 truncate">{b.sub}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
