"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "../lib/cn";

export function ElasticSearchFilterPill({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  const tags = ["all", "latest", "trending", "featured"];

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex gap-2 bg-zinc-950/40 p-2 rounded-xl border border-border/40 items-center">
        <Search className="w-4 h-4 text-muted-foreground ml-1" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items..."
          className="flex-1 bg-transparent text-xs text-foreground focus:outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {tags.map((tag) => {
          const isActive = selectedTag === tag;
          return (
            <motion.button
              key={tag}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTag(tag)}
              className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer capitalize shrink-0",
                isActive
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-zinc-900 border-border/40 text-muted-foreground hover:text-foreground"
              )}
            >
              {tag}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
