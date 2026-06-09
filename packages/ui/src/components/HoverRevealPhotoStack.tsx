"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

export function HoverRevealPhotoStack({
  className,
}: {
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const images = [
    { bg: "bg-gradient-to-tr from-purple-500 to-indigo-600", rotate: -8, scale: 0.9 },
    { bg: "bg-gradient-to-tr from-cyan-500 to-blue-600", rotate: 6, scale: 0.95 },
    { bg: "bg-gradient-to-tr from-emerald-500 to-teal-600", rotate: -2, scale: 1 },
  ];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-44 h-44 flex items-center justify-center cursor-pointer select-none",
        className
      )}
    >
      {images.map((img, idx) => {
        // Calculate offsets on hover vs stacked
        const hoverX = (idx - 1) * 64; // Fan out horizontally
        const hoverY = (idx - 1) * -8;
        const hoverRotate = (idx - 1) * 12;

        return (
          <motion.div
            key={idx}
            className={cn(
              "absolute w-28 h-36 rounded-2xl border border-white/[0.08] shadow-2xl p-2 bg-zinc-950 flex flex-col justify-between",
              img.bg
            )}
            animate={{
              x: isHovered ? hoverX : 0,
              y: isHovered ? hoverY : 0,
              rotate: isHovered ? hoverRotate : img.rotate,
              scale: isHovered ? 1.05 : img.scale,
              zIndex: idx,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 18,
            }}
          >
            {/* White Polaroid Border Style Card inside */}
            <div className="w-full h-[78%] bg-black/20 rounded-lg flex items-center justify-center text-white/50 text-[10px] font-mono select-none">
              UI {idx + 1}
            </div>
            <div className="h-[18%] flex items-center px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60 mr-1.5" />
              <span className="text-[7px] uppercase font-bold text-white/60 tracking-wider">
                Module
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
