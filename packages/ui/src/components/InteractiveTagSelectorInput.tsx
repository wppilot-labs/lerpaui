"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { X, Plus } from "lucide-react";
import { cn } from "../lib/cn";

export function InteractiveTagSelectorInput({
  className,
  initialTags = ["SaaS", "Next.js", "Tailwind"],
}: {
  className?: string;
  initialTags?: string[];
}) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputVal, setInputVal] = useState("");

  const handleAdd = () => {
    const trimmed = inputVal.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setInputVal("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const handleRemove = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl w-full max-w-[320px] bg-card border border-white/[0.04] p-4 flex flex-col gap-3.5 overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
        <span className="text-[10px] uppercase font-bold text-accent tracking-wider">
          Keywords selector
        </span>
        <span className="text-[8px] text-muted-foreground/40">Enter to submit</span>
      </div>

      {/* Render Tags */}
      <div className="flex flex-wrap gap-1.5 min-h-[40px] items-center">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.div
              key={tag}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary/20 bg-primary/8 text-primary font-bold text-[9px] uppercase tracking-wider select-none shadow-sm"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemove(tag)}
                className="hover:bg-primary/20 rounded p-0.5 text-primary/60 hover:text-primary transition-all cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input controls */}
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          placeholder="New keyword..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-white/[0.02] border border-white/[0.04] rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary/40 focus:outline-none text-foreground placeholder:text-muted-foreground/30 focus:border-primary/20 transition-all"
        />
        <button
          onClick={handleAdd}
          className="p-2 bg-primary hover:brightness-110 text-white rounded-xl cursor-pointer transition-all flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
