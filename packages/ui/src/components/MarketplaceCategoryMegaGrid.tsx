"use client";

import React from "react";
import {
  Smartphone, Laptop, Headphones, Camera, Gamepad2, Watch,
  Home, Shirt, Dumbbell, Car, Baby, BookOpen, ChevronRight,
} from "lucide-react";
import { cn } from "../lib/cn";

type Category = { name: string; count: string; Icon: React.ElementType };

const CATEGORIES: Category[] = [
  { name: "Phones", count: "2,340", Icon: Smartphone },
  { name: "Laptops", count: "1,180", Icon: Laptop },
  { name: "Audio", count: "3,902", Icon: Headphones },
  { name: "Cameras", count: "640", Icon: Camera },
  { name: "Gaming", count: "1,775", Icon: Gamepad2 },
  { name: "Wearables", count: "890", Icon: Watch },
  { name: "Home", count: "5,210", Icon: Home },
  { name: "Fashion", count: "8,430", Icon: Shirt },
  { name: "Fitness", count: "1,260", Icon: Dumbbell },
  { name: "Auto", count: "740", Icon: Car },
  { name: "Kids", count: "2,015", Icon: Baby },
  { name: "Books", count: "9,800", Icon: BookOpen },
];

export interface MarketplaceCategoryMegaGridProps {
  className?: string;
}

export function MarketplaceCategoryMegaGrid({ className }: MarketplaceCategoryMegaGridProps) {
  return (
    <div className={cn("w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold">Browse categories</h3>
        <a href="/" className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline">
          All categories <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {CATEGORIES.map((c) => (
          <a
            key={c.name}
            href="/"
            className="group flex flex-col items-center gap-2 rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] py-5 hover:border-primary/30 hover:bg-primary/[0.04] transition-colors"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground/[0.04] text-muted-foreground/70 group-hover:text-primary transition-colors">
              <c.Icon className="w-5 h-5" />
            </span>
            <span className="text-sm font-semibold">{c.name}</span>
            <span className="text-[11px] text-muted-foreground/45 tabular-nums">{c.count}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
