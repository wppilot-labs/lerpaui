"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useTransform} from "framer-motion";
import { cn } from "../lib/cn";

export function TiltParallaxBentoGrid({
  children,
  className,
  title,
  subtitle,
}: {
  children?: React.ReactNode;
  className?: string;
  title: string;
  subtitle: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rotateXSpring = useSpring(0, { damping: 20, stiffness: 150 });
  const rotateYSpring = useSpring(0, { damping: 20, stiffness: 150 });

  const rotateX = useTransform(rotateXSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(rotateYSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Get normalized mouse positions (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    rotateXSpring.set(relativeY);
    rotateYSpring.set(relativeX);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    rotateXSpring.set(0);
    rotateYSpring.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-2xl w-full h-[220px] bg-card border border-white/[0.04] p-6 overflow-hidden flex flex-col justify-between shadow-lg cursor-pointer transition-all duration-300 [perspective:1000px]",
        className
      )}
    >
      <motion.div
        className="w-full h-full flex flex-col justify-between select-none"
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
        }}
      >
        <div style={{ transform: "translateZ(30px)" }}>
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
            Analytics
          </span>
          <h4 className="text-base font-extrabold text-foreground mt-3 tracking-tight">
            {title}
          </h4>
          <p className="text-xs text-muted-foreground/60 mt-1 leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div
          className="relative mt-4 flex-1 flex items-end justify-center min-h-[50px] overflow-hidden rounded-xl border border-white/[0.04] bg-white/[0.01]"
          style={{ transform: "translateZ(15px)" }}
        >
          {children || (
            <div className="w-full h-full p-3 flex items-center justify-around gap-1.5">
              {[40, 25, 60, 45, 80, 55, 95].map((val, idx) => (
                <motion.div
                  key={idx}
                  className="w-3 bg-gradient-to-t from-primary/40 to-primary rounded-t-[3px]"
                  initial={{ height: 0 }}
                  animate={{ height: hovered ? `${val}%` : "15%" }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    delay: idx * 0.04,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Grid Pattern Mesh */}
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none -z-10" />
    </div>
  );
}
