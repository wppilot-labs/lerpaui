"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "../lib/cn";

interface MicroFeedbackStaggeredRatingProps {
  maxRating?: number;
  onRatingSelect?: (rating: number) => void;
  className?: string;
}

export function MicroFeedbackStaggeredRating({
  maxRating = 5,
  onRatingSelect,
  className,
}: MicroFeedbackStaggeredRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    setRating(idx);
    if (onRatingSelect) onRatingSelect(idx);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center border border-white/5 bg-zinc-950/40 rounded-2xl p-6 shadow-2xl select-none",
        className
      )}
      style={{ width: 320, height: 160 }}
    >
      <div className="flex flex-col gap-1 font-mono select-none self-start mb-4">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">FEEDBACK_SYSTEM</span>
        <span className="text-xs text-white font-bold">Rate launch_os efficiency</span>
      </div>

      {/* Rater Core Grid */}
      <div className="flex items-center gap-2.5">
        {Array.from({ length: maxRating }).map((_, i) => {
          const index = i + 1;
          const isActive = index <= (hoveredIndex !== null ? hoveredIndex : rating);

          return (
            <motion.div
              key={i}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleSelect(index)}
              className="cursor-pointer"
              whileHover={{ scale: 1.25, rotate: 12 }}
              whileTap={{ scale: 0.85 }}
            >
              <Star
                className={cn(
                  "w-7 h-7 transition-all duration-300",
                  isActive
                    ? "fill-primary stroke-primary"
                    : "stroke-white/30 fill-transparent hover:stroke-white/50"
                )}
                style={isActive ? { filter: "drop-shadow(0 0 12px rgba(var(--primary-rgb), 0.6))" } : undefined}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic textual feedback based on rating */}
      <div className="h-4 mt-4 text-[9px] font-mono text-white/40 uppercase tracking-widest select-none">
        <AnimatePresence mode="wait">
          {rating > 0 && (
            <motion.span
              key={rating}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="font-semibold text-primary"
            >
              {rating === 1 && "Need improvements"}
              {rating === 2 && "Acceptable state"}
              {rating === 3 && "Beautiful framework"}
              {rating === 4 && "Elite interactivity"}
              {rating === 5 && "Absolute premium luxury"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
