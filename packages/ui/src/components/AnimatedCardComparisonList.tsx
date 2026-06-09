"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "../lib/cn";

export interface ComparisonFeatureRow {
  id: string;
  name: string;
  starter: boolean;
  pro: boolean;
  enterprise: boolean;
}

export interface AnimatedCardComparisonListProps {
  className?: string;
  title?: string;
  subtitle?: string;
  rows?: ComparisonFeatureRow[];
}

const DEFAULT_ROWS: ComparisonFeatureRow[] = [
  { id: "1", name: "Motion presets", starter: true, pro: true, enterprise: true },
  { id: "2", name: "Custom SVG animations", starter: false, pro: true, enterprise: true },
  { id: "3", name: "Theme studio access", starter: false, pro: true, enterprise: true },
  { id: "4", name: "Team workspaces", starter: false, pro: false, enterprise: true },
  { id: "5", name: "24/7 priority support", starter: false, pro: false, enterprise: true },
];

export function AnimatedCardComparisonList({
  className,
  title = "Interactive feature matrix",
  subtitle = "Select a tier to highlight plan differences",
  rows = DEFAULT_ROWS,
}: AnimatedCardComparisonListProps) {
  const [activeTier, setActiveTier] = useState<"starter" | "pro" | "enterprise">("pro");

  return (
    <div className={cn("w-full max-w-md rounded-2xl border border-border/80 bg-card/45 p-6 backdrop-blur-xl shadow-2xl space-y-5", className)}>
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <p className="text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex gap-1 bg-zinc-950/60 border border-border/30 rounded-xl p-0.5">
          {(["starter", "pro", "enterprise"] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={cn(
                "px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer capitalize",
                activeTier === tier ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {rows.map((row) => {
          const isIncluded = row[activeTier];

          return (
            <div
              key={row.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/20 border border-border/20 transition-all hover:bg-zinc-900/40"
            >
              <span className="text-xs text-foreground font-medium">{row.name}</span>
              <AnimatePresence mode="wait">
                {isIncluded ? (
                  <motion.div
                    key="included"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1 text-emerald-400"
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Included</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="excluded"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1 text-muted-foreground/60"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Upgrade</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
