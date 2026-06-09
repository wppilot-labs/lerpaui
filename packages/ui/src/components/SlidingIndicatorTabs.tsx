"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

export function SlidingIndicatorTabs({
  className,
  tabs = ["Overview", "Features", "Analytics", "Settings"],
  onTabChange,
}: {
  className?: string;
  tabs?: string[];
  onTabChange?: (tab: string) => void;
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div
      className={cn(
        "flex items-center gap-1 bg-white/[0.02] border border-white/[0.04] p-1.5 rounded-2xl shadow-inner",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (onTabChange) onTabChange(tab);
            }}
            className={cn(
              "relative px-4 py-2 text-xs font-semibold rounded-xl transition-colors duration-300 cursor-pointer select-none",
              isActive ? "text-foreground" : "text-muted-foreground/60 hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 bg-primary/10 border border-primary/25 rounded-xl -z-10 shadow-sm"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}
