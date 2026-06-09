"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Search, X, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

interface ElasticSearchPillWithSuggestionsProps {
  className?: string;
}

export function ElasticSearchPillWithSuggestions({ className }: ElasticSearchPillWithSuggestionsProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");

  const mockSuggestions = [
    { title: "Dashboard Overview", tag: "Analytics", link: "#" },
    { title: "API Secure Gateway", tag: "Security", link: "#" },
    { title: "Theme Customizer Studio", tag: "Aesthetics", link: "#" },
  ];

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between border border-white/5 bg-zinc-950/40 rounded-2xl p-6 shadow-2xl font-sans select-none",
        className
      )}
      style={{ width: 340, height: 260 }}
    >
      <div className="absolute top-4 left-4 flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">SEARCH_PILL</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Click input to trigger expanding list</span>
      </div>

      {/* Pill Search Core */}
      <div className="relative mt-12 w-full z-20">
        <motion.div
          animate={{
            borderColor: isFocused ? "var(--primary)" : "rgba(255, 255, 255, 0.1)",
            boxShadow: isFocused ? "0 0 15px rgba(var(--primary), 0.25)" : "none",
          }}
          className="flex items-center gap-2 px-3 py-2 bg-black border rounded-full w-full relative"
        >
          <Search className="w-4 h-4 text-white/40 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search systems & components..."
            className="flex-1 bg-transparent border-none outline-none font-sans text-xs text-white placeholder-white/35"
          />
          {query.length > 0 && (
            <button onClick={() => setQuery("")} className="text-white/40 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>

        {/* Suggestion Dropdown List */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 6, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 right-0 bg-zinc-950/95 border border-white/10 rounded-2xl p-3 flex flex-col gap-2 shadow-2xl backdrop-blur-md z-30"
            >
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest px-1">SUGGESTED CHANNELS</span>

              <div className="flex flex-col gap-1.5">
                {mockSuggestions.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer text-white/70 hover:text-white transition-colors duration-200"
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-primary shrink-0" />
                      <span className="text-[10px] font-bold tracking-tight">{item.title}</span>
                    </div>
                    <span className="text-[7px] font-mono font-bold bg-white/5 px-2 py-0.5 rounded text-white/50">{item.tag}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest mt-auto">
        SYSTEM_INDEX // SECURED
      </div>
    </div>
  );
}
