"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

export function InteractiveHapticToggle({
  className,
  checked: controlledChecked,
  onChange,
}: {
  className?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const [localChecked, setLocalChecked] = useState(false);
  const isChecked = controlledChecked !== undefined ? controlledChecked : localChecked;

  const handleToggle = () => {
    const nextVal = !isChecked;
    if (controlledChecked === undefined) setLocalChecked(nextVal);
    if (onChange) onChange(nextVal);
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <button
        onClick={handleToggle}
        className={cn(
          "relative w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 select-none",
          isChecked ? "bg-primary" : "bg-zinc-800 border border-zinc-700"
        )}
      >
        <motion.div
          className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
          layout
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 22,
          }}
          style={{
            x: isChecked ? "20px" : "0px",
          }}
        >
          {/* Micro dot on the thumb */}
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-colors duration-300",
              isChecked ? "bg-primary/80" : "bg-zinc-400"
            )}
          />
        </motion.div>
      </button>
    </div>
  );
}
