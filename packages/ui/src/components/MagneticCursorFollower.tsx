"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring} from "framer-motion";
import { cn } from "../lib/cn";

export function MagneticCursorFollower({
  className,
  containerRef,
}: {
  className?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [activeTarget, setActiveTarget] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
    label: string;
  } | null>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  const width = useSpring(24, springConfig);
  const height = useSpring(24, springConfig);
  const borderRadius = useSpring(9999, springConfig);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      // Check if mouse is hovering over a magnetic target
      let targetFound = false;
      const targets = container.querySelectorAll("[data-magnetic-target]");
      
      for (const target of Array.from(targets)) {
        const targetRect = target.getBoundingClientRect();
        const padding = 15;
        
        if (
          e.clientX >= targetRect.left - padding &&
          e.clientX <= targetRect.right + padding &&
          e.clientY >= targetRect.top - padding &&
          e.clientY <= targetRect.bottom + padding
        ) {
          const relativeTargetX = targetRect.left - rect.left + targetRect.width / 2;
          const relativeTargetY = targetRect.top - rect.top + targetRect.height / 2;

          cursorX.set(relativeTargetX);
          cursorY.set(relativeTargetY);
          
          width.set(targetRect.width + 12);
          height.set(targetRect.height + 12);
          borderRadius.set(12);
          
          setActiveTarget({
            width: targetRect.width,
            height: targetRect.height,
            left: targetRect.left - rect.left,
            top: targetRect.top - rect.top,
            label: target.getAttribute("data-magnetic-label") || "Hovered",
          });
          targetFound = true;
          break;
        }
      }

      if (!targetFound) {
        cursorX.set(relativeX);
        cursorY.set(relativeY);
        width.set(24);
        height.set(24);
        borderRadius.set(9999);
        setActiveTarget(null);
      }
    };

    const handleMouseLeave = () => {
      cursorX.set(-100);
      cursorY.set(-100);
      setActiveTarget(null);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerRef, cursorX, cursorY, width, height, borderRadius]);

  return (
    <motion.div
      className={cn(
        "absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 border border-primary/40 bg-primary/10 z-35 flex items-center justify-center font-mono text-[8px] font-bold text-primary overflow-hidden",
        className
      )}
      style={{
        x,
        y,
        width,
        height,
        borderRadius,
        boxShadow: "0 0 20px rgba(var(--primary-rgb), 0.2)",
      }}
    >
      {activeTarget && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="uppercase tracking-wider select-none truncate px-1 text-primary"
        >
          {activeTarget.label}
        </motion.span>
      )}
    </motion.div>
  );
}
