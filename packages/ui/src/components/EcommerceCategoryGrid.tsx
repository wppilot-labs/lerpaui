"use client";

import React from "react";
import { Shirt, Footprints, Watch, ShoppingBag, Glasses, Backpack, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/cn";

type Category = {
  id: string;
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
};

const CATEGORIES: Category[] = [
  { id: "tops", name: "Tops & Tees", count: 248, icon: Shirt, tone: "from-sky-400/25 to-blue-500/15" },
  { id: "shoes", name: "Footwear", count: 132, icon: Footprints, tone: "from-amber-400/25 to-orange-500/15" },
  { id: "watches", name: "Watches", count: 64, icon: Watch, tone: "from-emerald-400/25 to-teal-500/15" },
  { id: "bags", name: "Bags", count: 97, icon: ShoppingBag, tone: "from-rose-400/25 to-pink-500/15" },
  { id: "eyewear", name: "Eyewear", count: 41, icon: Glasses, tone: "from-violet-400/25 to-purple-500/15" },
  { id: "packs", name: "Backpacks", count: 53, icon: Backpack, tone: "from-cyan-400/25 to-sky-500/15" },
];

export interface EcommerceCategoryGridProps {
  className?: string;
}

export function EcommerceCategoryGrid({ className }: EcommerceCategoryGridProps) {
  return (
    <div className={cn("w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-3">Shop by category</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              type="button"
              className={cn(
                "group relative text-left rounded-xl border border-foreground/[0.06] bg-gradient-to-br p-5 overflow-hidden transition hover:border-foreground/15",
                c.tone,
              )}
            >
              <div className="h-12 w-12 rounded-lg bg-background/40 backdrop-blur flex items-center justify-center">
                <Icon className="w-6 h-6 text-foreground" />
              </div>
              <div className="mt-3 text-sm font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground/60">{c.count} items</div>
              <ArrowUpRight className="absolute right-3 top-3 w-4 h-4 text-muted-foreground/40 group-hover:text-foreground transition" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
