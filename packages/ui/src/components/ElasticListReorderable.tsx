"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { GripVertical, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export function ElasticListReorderable({ className }: { className?: string }) {
  const [items, _setItems] = useState([
    { id: "1", label: "Elastic Physics Engine" },
    { id: "2", label: "Bento Layout Config" },
    { id: "3", label: "Glow Accent Indicators" },
  ]);

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Reorderable List</h3>
          <p className="text-[10px] text-muted-foreground">List items stretch slightly when reordered</p>
        </div>
        <Sparkles className="w-4 h-4 text-primary" />
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {items.map((item, _idx) => (
            <motion.div
              key={item.id}
              layout
              className="flex items-center gap-3 p-3 bg-zinc-900/40 border border-border/30 rounded-xl cursor-grab active:cursor-grabbing transition-all hover:bg-zinc-900/60"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-foreground font-medium">{item.label}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
