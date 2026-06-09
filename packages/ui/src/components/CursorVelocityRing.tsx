'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform} from "framer-motion";
import { cn } from '../lib/cn';

interface CursorVelocityRingProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  ringCount?: number;
  baseRadius?: number;
  glow?: boolean;
  containerId?: string;
}

export function CursorVelocityRing({
  children,
  ringCount = 3,
  baseRadius = 20,
  glow = true,
  className,
  containerId: _containerId,
  ...props
}: CursorVelocityRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [_isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const velX = useMotionValue(0);
  const velY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 220, mass: 0.6 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  const springConfigVel = { damping: 25, stiffness: 120 };
  const dX = useSpring(velX, springConfigVel);
  const dY = useSpring(velY, springConfigVel);

  const lastPos = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      let targetX = e.clientX;
      let targetY = e.clientY;

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const inside =
          targetX >= rect.left &&
          targetX <= rect.right &&
          targetY >= rect.top &&
          targetY <= rect.bottom;

        setIsHovered(inside);
        if (!inside) {
          setIsVisible(false);
          return;
        } else {
          setIsVisible(true);
        }

        // Relative to container
        targetX = targetX - rect.left;
        targetY = targetY - rect.top;
      } else {
        setIsVisible(true);
        setIsHovered(true);
      }

      mouseX.set(targetX);
      mouseY.set(targetY);

      const dt = Math.max(1, now - lastPos.current.time);
      const vx = (targetX - lastPos.current.x) / dt;
      const vy = (targetY - lastPos.current.y) / dt;

      velX.set(vx);
      velY.set(vy);

      lastPos.current = { x: targetX, y: targetY, time: now };
    };

    const handleMouseLeave = () => {
      if (containerRef.current) {
        setIsHovered(false);
        setIsVisible(false);
      }
    };

    const node = containerRef.current;
    window.addEventListener('mousemove', handleMouseMove);
    if (node) {
      node.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (node) {
        node.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [mouseX, mouseY, velX, velY]);

  // Speed and rotation calculations
  const speed = useTransform([dX, dY], ([vx, vy]) => {
    return Math.sqrt((vx as number) ** 2 + (vy as number) ** 2);
  });

  const angle = useTransform([dX, dY], ([vx, vy]) => {
    return Math.atan2(vy as number, vx as number) * (180 / Math.PI);
  });

  // Squash & Stretch parameters
  const ringScaleX = useTransform(speed, (s) => 1 + Math.min(s * 0.8, 1.8));
  const ringScaleY = useTransform(speed, (s) => 1 / (1 + Math.min(s * 0.4, 0.6)));
  
  // Opacity transitions smoothly
  const cursorOpacity = useSpring(isVisible ? 1 : 0, { damping: 20, stiffness: 150 });

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-none select-none", className)}
      {...props}
    >
      {/* Absolute Overlay layer representing the custom cursor */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-50 mix-blend-difference"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: cursorOpacity,
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Inner solid Dot */}
          <motion.div
            className="absolute rounded-full bg-white shadow-lg"
            style={{
              width: 8,
              height: 8,
            }}
          />

          {/* Dynamic Concentric Rings */}
          {Array.from({ length: ringCount }).map((_, index) => {
            const factor = 1 + index * 0.45;
            const _delayFactor = index * 0.05;
            
            return (
              <motion.div
                key={index}
                className={cn(
                  "absolute rounded-full border border-white/60",
                  glow && "shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                )}
                style={{
                  width: baseRadius * 2 * factor,
                  height: baseRadius * 2 * factor,
                  rotate: angle,
                  scaleX: ringScaleX,
                  scaleY: ringScaleY,
                }}
                transition={{
                  type: 'spring',
                  damping: 35 + index * 5,
                  stiffness: 220 - index * 20,
                  mass: 0.5 + index * 0.1,
                }}
              />
            );
          })}
        </div>
      </motion.div>

      {children}
    </div>
  );
}
