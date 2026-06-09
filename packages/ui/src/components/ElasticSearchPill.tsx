"use client";

import React, { useState, useRef } from "react";
import { motion} from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "../lib/cn";

export function ElasticSearchPill({
  className,
  onSearch,
}: {
  className?: string;
  onSearch?: (val: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setVal("");
    if (onSearch) onSearch("");
    inputRef.current?.focus();
  };

  const handleValChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setVal(nextVal);
    if (onSearch) onSearch(nextVal);
  };

  return (
    <div className={cn("flex items-center justify-center p-2", className)}>
      <motion.div
        animate={{
          width: focused ? "240px" : "160px",
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
        }}
        className={cn(
          "relative flex items-center bg-white/[0.02] border border-white/[0.04] p-1 rounded-full shadow-inner transition-colors duration-300",
          focused ? "border-primary/40 bg-white/[0.03]" : "hover:border-white/[0.12]"
        )}
      >
        <Search className="w-4 h-4 text-muted-foreground/30 ml-2.5 flex-shrink-0" />

        <input
          ref={inputRef}
          type="text"
          placeholder="Quick search..."
          value={val}
          onChange={handleValChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border-none text-xs text-foreground placeholder:text-muted-foreground/30 focus:ring-0 focus:outline-none pl-2.5 pr-2.5 py-1.5"
        />

        {/* Clear Button */}
        {val && (
          <button
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-white/[0.04] text-muted-foreground/45 hover:text-foreground transition-all cursor-pointer mr-1.5 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Keyboard shortcut placeholder */}
        {!val && (
          <div className="absolute right-2 px-1.5 py-0.5 rounded border border-white/[0.04] bg-white/[0.01] text-[8px] font-bold text-muted-foreground/30 font-mono tracking-wider select-none uppercase pointer-events-none">
            ⌘K
          </div>
        )}
      </motion.div>
    </div>
  );
}
