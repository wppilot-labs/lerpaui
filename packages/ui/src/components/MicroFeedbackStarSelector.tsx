"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "../lib/cn";

export function MicroFeedbackStarSelector({
  className,
  maxStars = 5,
  onChange,
}: {
  className?: string;
  maxStars?: number;
  onChange?: (val: number) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [clicks, setClicks] = useState<number[]>([]); // To trigger particle effects per star click

  const handleSelect = (idx: number) => {
    setRating(idx);
    if (onChange) onChange(idx);

    // Trigger click effect for particles
    setClicks((prev) => [...prev, idx]);
    setTimeout(() => {
      setClicks((prev) => prev.filter((i) => i !== idx));
    }, 800);
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="flex items-center gap-1">
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((idx) => {
          const isFilled = hoverRating !== null ? idx <= hoverRating : idx <= rating;
          const isClicked = clicks.includes(idx);

          return (
            <div key={idx} className="relative">
              <motion.button
                onClick={() => handleSelect(idx)}
                onMouseEnter={() => setHoverRating(idx)}
                onMouseLeave={() => setHoverRating(null)}
                className="p-1 hover:scale-125 cursor-pointer text-yellow-500 transition-transform active:scale-90"
                animate={{
                  scale: isFilled ? 1.15 : 1,
                  rotate: isFilled ? [0, 5, -5, 0] : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 15,
                }}
              >
                <Star
                  className="w-6 h-6"
                  fill={isFilled ? "var(--color-yellow-500, #eab308)" : "none"}
                  stroke="var(--color-yellow-500, #eab308)"
                  strokeWidth={1.5}
                />
              </motion.button>

              {/* Particle explosion indicator when selected */}
              <AnimatePresence>
                {isClicked && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {[...Array(6)].map((_, pIdx) => {
                      const angle = (pIdx * 360) / 6;
                      const rad = (angle * Math.PI) / 180;
                      const distance = 24;
                      return (
                        <motion.div
                          key={pIdx}
                          className="absolute w-1 h-1 rounded-full bg-yellow-400"
                          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                          animate={{
                            x: Math.cos(rad) * distance,
                            y: Math.sin(rad) * distance,
                            scale: 0.1,
                            opacity: 0,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground/60">
        Score: {rating} / {maxStars}
      </span>
    </div>
  );
}
