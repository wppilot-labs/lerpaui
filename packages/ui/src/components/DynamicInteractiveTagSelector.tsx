"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { X, Plus } from "lucide-react";
import { cn } from "../lib/cn";

interface DynamicInteractiveTagSelectorProps {
  className?: string;
}

export function DynamicInteractiveTagSelector({ className }: DynamicInteractiveTagSelectorProps) {
  const [tags, setTags] = useState<string[]>(["Lerpa UI", "Luxury", "Premium"]);
  const [inputVal, setInputVal] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    // Check duplication
    if (!tags.includes(inputVal.trim())) {
      setTags((prev) => [...prev, inputVal.trim()]);
    }
    setInputVal("");
  };

  const handleRemove = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between border border-white/5 bg-zinc-950/40 rounded-2xl p-6 shadow-2xl font-sans select-none",
        className
      )}
      style={{ width: 340, height: 260 }}
    >
      <div className="absolute top-4 left-4 flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">TAGS_SELECTOR</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Enter label below to append bouncy pills</span>
      </div>

      {/* Floating Tag capsules stack */}
      <div className="flex-1 flex flex-wrap gap-2 items-center justify-start mt-12 content-start overflow-y-auto pr-1">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.div
              key={tag}
              initial={{ scale: 0.5, opacity: 0, y: 5 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-tight select-none cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemove(tag)}
                className="text-primary hover:text-white cursor-pointer flex items-center justify-center"
              >
                <X className="w-3 h-3 stroke-[2.5px]" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Form Submission */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 mt-4 z-20 select-text">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Add custom metadata label..."
          className="flex-1 px-3.5 py-2 bg-black border border-white/10 rounded-full font-sans text-xs text-white placeholder-white/35 outline-none focus:border-primary transition-all duration-300"
        />
        <button
          type="submit"
          className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform duration-200"
        >
          <Plus className="w-4 h-4 stroke-[2.5px]" />
        </button>
      </form>

      <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest mt-3">
        TAGS_CONTAINER // SECURED
      </div>
    </div>
  );
}
