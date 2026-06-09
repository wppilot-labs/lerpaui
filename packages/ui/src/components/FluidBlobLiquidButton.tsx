"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

interface FluidBlobLiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  glowColor?: string;
}

export function FluidBlobLiquidButton({
  className,
  glowColor: _glowColor = "rgba(var(--primary), 0.5)",
  children,
  ...props
}: FluidBlobLiquidButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // SVG Unique Filter ID to prevent collision
  const filterId = "liquid-blob-filter-btn";

  return (
    <div className="relative inline-block">
      {/* SVG Liquid Filter definitions */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Button Wrapper with goo filter applied */}
      <div 
        style={{ filter: `url(#${filterId})` }}
        className="relative flex items-center justify-center p-4"
      >
        {/* Floating background blobs */}
        <motion.div
          animate={{
            x: isHovered ? [-10, 10, -5] : 0,
            y: isHovered ? [-5, 5, -10] : 0,
            scale: isHovered ? [1, 1.25, 0.9] : 0.8,
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute left-2 w-10 h-10 rounded-full bg-primary/80 pointer-events-none blur-[2px]"
        />

        <motion.div
          animate={{
            x: isHovered ? [15, -15, 8] : 0,
            y: isHovered ? [10, -5, 5] : 0,
            scale: isHovered ? [1, 1.3, 0.85] : 0.8,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute right-2 w-10 h-10 rounded-full bg-accent/80 pointer-events-none blur-[2px]"
        />

        {/* Main core button */}
        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "relative z-10 px-8 py-3 rounded-full font-bold text-sm bg-primary text-primary-foreground shadow-lg flex items-center gap-2 cursor-pointer transition-all duration-300 border border-primary/20",
            isHovered && "scale-[1.03]",
            className
          )}
          style={isHovered ? { boxShadow: "0 0 20px rgba(var(--primary-rgb), 0.35)" } : undefined}
          {...props}
        >
          {children}
        </button>
      </div>
    </div>
  );
}
