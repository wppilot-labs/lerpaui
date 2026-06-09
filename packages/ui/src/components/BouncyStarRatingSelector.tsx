"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "../lib/cn";

export interface BouncyStarRatingSelectorProps {
  className?: string;
  title?: string;
  subtitle?: string;
  initialRating?: number;
  maxRating?: number;
}

export function BouncyStarRatingSelector({
  className,
  title = "Bouncy ratings",
  subtitle = "Spring rating star cluster",
  initialRating = 4,
  maxRating = 5,
}: BouncyStarRatingSelectorProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeVal = hoverRating ?? rating;
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-[10px] text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex gap-2 justify-center bg-zinc-950/60 p-4 rounded-xl border border-border/30">
        {stars.map((star) => {
          const isActive = star <= activeVal;

          return (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="focus:outline-none cursor-pointer"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.25 : 1,
                  rotate: isActive ? 12 : 0,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 15 }}
              >
                <Star
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isActive ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]" : "text-muted-foreground/60 hover:text-foreground"
                  )}
                />
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
