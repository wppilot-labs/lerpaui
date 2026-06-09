"use client";

import React, { useState } from "react";
import { Reorder} from "framer-motion";
import { cn } from "../lib/cn";

export function InteractiveBentoMockup({
  className,
}: {
  className?: string;
}) {
  // Reorderable lists in bento grid
  const [items, setItems] = useState([
    { id: "item-1", title: "API Traffic", val: "94.2k", color: "from-cyan-500 to-blue-500" },
    { id: "item-2", title: "Latency Avg", val: "14ms", color: "from-purple-500 to-indigo-500" },
    { id: "item-3", title: "Conversion", val: "4.37%", color: "from-emerald-500 to-teal-500" },
  ]);

  return (
    <div
      className={cn(
        "relative rounded-2xl w-full max-w-[320px] bg-card border border-white/[0.04] p-5 flex flex-col gap-4 overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5">
        <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
          Bento Widget
        </span>
        <span className="text-[8px] text-muted-foreground/40">Drag to reorganize</span>
      </div>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="flex flex-col gap-2.5"
      >
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="flex items-center justify-between p-3.5 bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.04] rounded-xl cursor-grab active:cursor-grabbing select-none"
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-1.5 h-6 rounded-full bg-gradient-to-b", item.color)} />
              <span className="text-xs font-bold text-foreground">{item.title}</span>
            </div>
            <span className="text-xs font-mono font-extrabold text-primary">{item.val}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Background radial accent glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
    </div>
  );
}
