"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { cn } from "../lib/cn";

export function TranslucentFilterDrawer({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "design", "development", "marketing", "analytics"];

  return (
    <div className={cn("relative w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-hidden", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">Interactive Side Drawer</h3>
        <p className="text-[10px] text-muted-foreground">Slide-out filtering pane overlay</p>
      </div>

      <div className="py-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-xl text-primary text-xs font-bold transition-all cursor-pointer shadow-lg shadow-primary/5"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Configure Filters
        </button>
      </div>

      {/* Slide-out Drawer Panel overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop filter blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md z-30 cursor-pointer"
            />

            {/* Side sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute top-0 right-0 bottom-0 w-[220px] bg-zinc-950 border-l border-border/40 p-4 z-40 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/30">
                  <span className="text-xs font-bold text-foreground">Filters</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-zinc-800 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Category</span>
                  <div className="space-y-1.5">
                    {categories.map((cat) => {
                      const isActive = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer capitalize text-left",
                            isActive ? "bg-primary/20 border-primary/40 text-primary" : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-zinc-900"
                          )}
                        >
                          {cat}
                          {isActive && <Check className="w-3.5 h-3.5 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/95 transition-colors shadow-lg shadow-primary/20 cursor-pointer text-center"
              >
                Apply Settings
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
