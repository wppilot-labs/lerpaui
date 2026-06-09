"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

export function GlowTabSliderHeader({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = ["all", "dev", "design", "ops"];

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">Glow Tab Switcher</h3>
        <p className="text-[10px] text-muted-foreground">Stretching linear background indicators</p>
      </div>

      <div className="flex gap-1.5 p-1 bg-zinc-950/60 rounded-xl border border-border/30 justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer capitalize flex-1 text-center",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="glow-tab-bg"
                  className="absolute inset-0 bg-primary/15 border border-primary/30 rounded-lg"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
