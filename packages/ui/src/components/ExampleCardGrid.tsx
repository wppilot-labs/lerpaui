"use client";

import React from "react";
import { LayoutDashboard, ShoppingBag, MessageCircle, BarChart3, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/cn";

type Example = { title: string; desc: string; tag: string; Icon: React.ElementType };

const EXAMPLES: Example[] = [
  { title: "Admin dashboard", desc: "Charts, tables & filters", tag: "App", Icon: LayoutDashboard },
  { title: "Storefront", desc: "Product grid & cart", tag: "E-commerce", Icon: ShoppingBag },
  { title: "Support inbox", desc: "Threaded conversations", tag: "SaaS", Icon: MessageCircle },
  { title: "Analytics", desc: "Funnels & cohorts", tag: "Data", Icon: BarChart3 },
];

export interface ExampleCardGridProps {
  className?: string;
}

export function ExampleCardGrid({ className }: ExampleCardGridProps) {
  return (
    <div className={cn("w-full max-w-lg font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-4">Example templates</h3>
      <div className="grid grid-cols-2 gap-3">
        {EXAMPLES.map((ex) => (
          <a
            key={ex.title}
            href="/"
            className="group relative rounded-2xl border border-border/50 bg-card/45 backdrop-blur-xl p-5 shadow-lg hover:border-primary/30 hover:bg-card/60 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ex.Icon className="w-5 h-5" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
            <div className="text-sm font-bold">{ex.title}</div>
            <div className="text-xs text-muted-foreground/60 mt-0.5">{ex.desc}</div>
            <span className="mt-3 inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-foreground/[0.04] border border-foreground/[0.06] text-muted-foreground/60">
              {ex.tag}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
