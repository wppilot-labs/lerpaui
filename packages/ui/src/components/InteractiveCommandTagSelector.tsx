"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Plus, X, Tag } from "lucide-react";
import { cn } from "../lib/cn";

export function InteractiveCommandTagSelector({ className }: { className?: string }) {
  const [tags, setTags] = useState<string[]>(["React", "Spring"]);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (!newTag.trim() || tags.includes(newTag)) return;
    setTags([...tags, newTag.trim()]);
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Command Tag Field</h3>
          <p className="text-[10px] text-muted-foreground">Add tags with spring-animated entry tags</p>
        </div>
        <Tag className="w-4 h-4 text-primary" />
      </div>

      <div className="flex flex-wrap gap-1.5 min-h-[40px] bg-zinc-950/40 p-2.5 rounded-xl border border-border/40">
        <AnimatePresence initial={false}>
          {tags.map((tag) => (
            <motion.span
              key={tag}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-primary/20 text-primary border border-primary/30"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:bg-primary/30 p-0.5 rounded text-primary cursor-pointer transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New tag..."
          className="flex-1 bg-zinc-900/50 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
          onKeyDown={(e) => e.key === "Enter" && addTag()}
        />
        <button
          onClick={addTag}
          className="p-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-xl text-primary transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
