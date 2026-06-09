"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";

import { cn } from "../lib/cn";

export interface EmojiOption {
  rating: number;
  char: string;
  label: string;
}

export interface InteractiveFeedbackEmojiSelectorProps {
  className?: string;
  title?: string;
  subtitle?: string;
  emojis?: EmojiOption[];
  initialRating?: number | null;
}

const DEFAULT_EMOJIS: EmojiOption[] = [
  { rating: 1, char: "😢", label: "Unhappy" },
  { rating: 2, char: "😐", label: "Neutral" },
  { rating: 3, char: "🙂", label: "Good" },
  { rating: 4, char: "😍", label: "Excellent" },
];

export function InteractiveFeedbackEmojiSelector({
  className,
  title = "Emoji reactions",
  subtitle = "How was your experience?",
  emojis = DEFAULT_EMOJIS,
  initialRating = 3,
}: InteractiveFeedbackEmojiSelectorProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(initialRating);

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-[10px] text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex justify-around bg-zinc-950/40 p-3.5 rounded-xl border border-border/40">
        {emojis.map((emoji) => {
          const isSelected = selectedEmoji === emoji.rating;
          return (
            <button
              key={emoji.rating}
              onClick={() => setSelectedEmoji(emoji.rating)}
              className="flex flex-col items-center gap-1 cursor-pointer select-none group focus:outline-none"
            >
              <motion.div
                animate={{
                  scale: isSelected ? 1.3 : 1,
                  y: isSelected ? -4 : 0,
                  filter: isSelected ? "drop-shadow(0 4px 6px rgba(59,130,246,0.3))" : "grayscale(30%)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="text-2xl"
              >
                {emoji.char}
              </motion.div>
              <span className={cn(
                "text-[9px] font-bold uppercase transition-colors",
                isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {emoji.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
