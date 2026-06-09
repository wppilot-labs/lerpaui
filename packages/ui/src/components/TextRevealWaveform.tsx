"use client";

import React from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

export function TextRevealWaveform({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");

  const containerVars = {
    initial: {},
    hover: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const charVars = {
    initial: { y: 0 },
    hover: {
      y: [0, -10, 0],
      transition: {
        duration: 0.45,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVars}
      initial="initial"
      whileHover="hover"
      className={cn(
        "flex flex-wrap gap-x-2 text-xl sm:text-2xl font-extrabold text-foreground tracking-tight select-none cursor-pointer",
        className
      )}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-flex overflow-hidden py-1">
          {word.split("").map((char, cIdx) => (
            <motion.span
              key={cIdx}
              variants={charVars}
              className="inline-block hover:text-primary transition-colors duration-150"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
}
