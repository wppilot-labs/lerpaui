"use client";

import React, { useState } from "react";
import { motion, useMotionTemplate, useMotionValue} from "framer-motion";
import { cn } from "../lib/cn";

export function GlowGradientBorderCard({
  children,
  className,
  glowColor = "rgba(147, 51, 234, 0.4)", // Purple glow
  borderColor: _borderColor = "rgba(147, 51, 234, 0.2)",
}: {
  children?: React.ReactNode;
  className?: string;
  glowColor?: string;
  borderColor?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const borderBackground = useMotionTemplate`
    radial-gradient(
      250px circle at ${mouseX}px ${mouseY}px,
      ${glowColor},
      transparent 80%
    )
  `;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-2xl p-[1px] overflow-hidden bg-white/[0.03] border border-white/[0.06] transition-all duration-300",
        className
      )}
    >
      {/* Dynamic Glowing Border Segment */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: borderBackground,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Internal Content Space */}
      <div className="relative rounded-2xl bg-card p-6 h-full z-10">
        {/* Spotglow Effect inside */}
        <motion.div
          className="absolute inset-0 pointer-events-none -z-10 transition-opacity duration-300"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                350px circle at ${mouseX}px ${mouseY}px,
                ${glowColor.replace("0.4", "0.07")},
                transparent 70%
              )
            `,
            opacity: isHovered ? 1 : 0,
          }}
        />
        {children}
      </div>
    </div>
  );
}
