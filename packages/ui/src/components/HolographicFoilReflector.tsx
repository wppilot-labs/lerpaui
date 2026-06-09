"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring} from "framer-motion";
import { cn } from "../lib/cn";

interface HolographicFoilReflectorProps {
  className?: string;
  children?: React.ReactNode;
}

export function HolographicFoilReflector({ className, children }: HolographicFoilReflectorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Mouse rotation positions
  const _mouseX = useMotionValue(0);
  const _mouseY = useMotionValue(0);

  // Smooth springs for tilt
  const rotateX = useSpring(useMotionValue(0), { damping: 25, stiffness: 200 });
  const rotateY = useSpring(useMotionValue(0), { damping: 25, stiffness: 200 });

  // Holographic foil coordinate offsets
  const foilX = useSpring(useMotionValue(50), { damping: 30, stiffness: 150 });
  const foilY = useSpring(useMotionValue(50), { damping: 30, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Centered percentage points (-0.5 to 0.5)
    const pctX = (x / rect.width) - 0.5;
    const pctY = (y / rect.height) - 0.5;

    // Set rotation springs
    rotateX.set(-pctY * 20); // Tilt up/down
    rotateY.set(pctX * 20);  // Tilt left/right

    // Foil gradient coordinates
    foilX.set((x / rect.width) * 100);
    foilY.set((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    foilX.set(50);
    foilY.set(50);
  };

  // Build the dynamic linear/radial gradient string using framer motion templates
  const holoGradient = useMotionTemplate`radial-gradient(circle at ${foilX}% ${foilY}%, rgba(255,0,128,0.25) 0%, rgba(0,255,255,0.2) 30%, rgba(255,255,0,0.15) 60%, transparent 80%)`;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className="relative w-72 h-96 cursor-pointer"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "w-full h-full rounded-2xl bg-zinc-950/80 border border-white/10 p-6 flex flex-col justify-between overflow-hidden shadow-2xl relative transition-all duration-300",
          hovered && "shadow-[0_20px_50px_rgba(255,0,128,0.1)] border-white/20",
          className
        )}
      >
        {/* Iridescent Holographic Foil Reflective Overlay */}
        <motion.div
          style={{
            background: holoGradient,
            mixBlendMode: "screen",
          }}
          className="absolute inset-0 pointer-events-none z-10 opacity-70"
        />

        {/* Backing structural glowing grid */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] z-0" />

        {/* Card Content slots */}
        <div className="relative z-15 flex-1 flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
