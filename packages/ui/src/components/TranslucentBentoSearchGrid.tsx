"use client";

import React, { useState } from "react";
import { Filter } from "lucide-react";
import { cn } from "../lib/cn";

export function TranslucentBentoSearchGrid({ className }: { className?: string }) {
  const [filter, setFilter] = useState("all");

  const items = [
    { id: "1", title: "Auth Flow", category: "dev" },
    { id: "2", title: "Bento Layout", category: "design" },
    { id: "3", title: "Sales Analysis", category: "analytics" },
  ];

  const filtered = items.filter(item => filter === "all" || item.category === filter);

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Bento Grid Filter</h3>
          <p className="text-[10px] text-muted-foreground">Select a category below</p>
        </div>
        <Filter className="w-4 h-4 text-primary" />
      </div>

      <div className="flex gap-1.5 justify-around bg-zinc-950/60 p-2 rounded-xl border border-border/30">
        {["all", "dev", "design", "analytics"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer capitalize",
              filter === cat ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-zinc-900/40 border border-border/20 rounded-xl"
          >
            <span className="text-xs text-foreground font-medium">{item.title}</span>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-primary/20 text-primary border border-primary/30">
              {item.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
