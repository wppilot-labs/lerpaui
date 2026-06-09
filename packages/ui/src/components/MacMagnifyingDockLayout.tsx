"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface MacDockItem {
  id: string | number;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export interface MacMagnifyingDockLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'style'> {
  items: MacDockItem[];
  baseSize?: number; // Base icon size in pixels
  magnifiedSize?: number; // Magnified icon size in pixels
  distanceLimit?: number; // Distance in pixels within which magnification triggers
}

export const MacMagnifyingDockLayout: React.FC<MacMagnifyingDockLayoutProps> = ({
  items,
  baseSize = 48,
  magnifiedSize = 80,
  distanceLimit = 140,
  className,
  ...props
}) => {
  const dockRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(Infinity);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion) return;
    mouseX.set(e.clientX);
  };

  const handleMouseLeave = () => {
    mouseX.set(Infinity);
  };

  return (
    <div className="flex w-full items-center justify-center py-6">
      <motion.div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'flex items-end gap-3 rounded-2xl border border-border/80 bg-background/30 px-4 py-3 shadow-2xl backdrop-blur-xl transition-all duration-300',
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <MacDockItemButton
            key={item.id}
            item={item}
            mouseX={mouseX}
            baseSize={baseSize}
            magnifiedSize={magnifiedSize}
            distanceLimit={distanceLimit}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </motion.div>
    </div>
  );
};

interface MacDockItemButtonProps {
  item: MacDockItem;
  mouseX: MotionValue<number>;
  baseSize: number;
  magnifiedSize: number;
  distanceLimit: number;
  prefersReducedMotion: boolean;
}

const MacDockItemButton: React.FC<MacDockItemButtonProps> = ({
  item,
  mouseX,
  baseSize,
  magnifiedSize,
  distanceLimit,
  prefersReducedMotion,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Smoothly transform size based on mouse proximity
  const sizeTransform = useTransform(mouseX, (val) => {
    if (prefersReducedMotion || val === Infinity || !buttonRef.current) {
      return baseSize;
    }

    const bounds = buttonRef.current.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const distance = Math.abs(val - centerX);

    if (distance < distanceLimit) {
      // Bell curve: maximum magnification at center, tapering off to baseSize
      const progress = 1 - distance / distanceLimit;
      const angle = progress * Math.PI / 2;
      return baseSize + (magnifiedSize - baseSize) * Math.sin(angle);
    }

    return baseSize;
  });

  const size = useSpring(sizeTransform, {
    stiffness: 220,
    damping: 24,
    mass: 0.1,
  });

  return (
    <motion.button
      ref={buttonRef}
      onClick={item.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col items-center justify-end rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{
        width: prefersReducedMotion ? baseSize : size,
        height: prefersReducedMotion ? baseSize : size,
      }}
    >
      {/* Dynamic Tooltip */}
      <div
        className={cn(
          'absolute -top-10 z-30 scale-95 rounded-md border border-border bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md transition-all duration-200 pointer-events-none opacity-0',
          isHovered && 'opacity-100 scale-100 -top-12'
        )}
      >
        {item.label}
      </div>

      {/* Icon Frame */}
      <div
        className="flex h-full w-full items-center justify-center rounded-xl bg-card border border-border text-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
        style={{
          fontSize: 'calc(var(--size) * 0.5)',
        }}
      >
        {item.icon}
      </div>
    </motion.button>
  );
};
