"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export function ElasticCollapsibleAccordion({
  items,
  className,
}: {
  items: { title: string; content: string }[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className={cn("w-full space-y-2.5", className)}>
      {items.map((item, idx) => {
        const isOpen = activeIndex === idx;

        return (
          <div
            key={idx}
            className="border border-white/[0.04] rounded-2xl bg-card overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => setActiveIndex(isOpen ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-xs uppercase tracking-wider hover:bg-white/[0.01] transition-colors cursor-pointer select-none"
            >
              <span>{item.title}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground/60" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: {
                      type: "spring",
                      stiffness: 180,
                      damping: 18,
                      mass: 0.8,
                    },
                    opacity: { duration: 0.15 },
                  }}
                >
                  <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground/65 leading-relaxed border-t border-white/[0.02]">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
