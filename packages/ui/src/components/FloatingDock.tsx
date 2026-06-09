"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, type MotionValue } from "framer-motion";
import { cn } from '../lib/cn';

interface FloatingDockProps {
  className?: string;
  items: { title: string; icon: React.ReactNode; href?: string }[];
}

export const FloatingDock: React.FC<FloatingDockProps> = ({ className, items }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto flex h-16 items-end gap-3 rounded-2xl border border-border bg-card/85 backdrop-blur-md px-4 pb-3 shadow-lg z-20',
        className
      )}
    >
      {items.map((item, index) => (
        <DockIcon key={index} mouseX={mouseX} icon={item.icon} title={item.title} />
      ))}
    </motion.div>
  );
};

interface DockIconProps {
  mouseX: MotionValue<number>;
  icon: React.ReactNode;
  title: string;
}

function DockIcon({ mouseX, icon, title }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Measure icon center coordinate dynamically relative to page
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Dynamic dimension mappings based on proximity (elastic bounce)
  const widthTransform = useTransform(distance, [-120, 0, 120], [40, 68, 40]);
  const heightTransform = useTransform(distance, [-120, 0, 120], [40, 68, 40]);

  // Spring physical constraints
  const width = useSpring(widthTransform, { stiffness: 180, damping: 15 });
  const height = useSpring(heightTransform, { stiffness: 180, damping: 15 });

  return (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex aspect-square items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shadow-sm select-none cursor-pointer"
    >
      {/* Tooltip Popover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 5, x: '-50%' }}
            transition={{ duration: 0.15 }}
            className="absolute -top-10 left-1/2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs px-2.5 py-1 shadow-md whitespace-nowrap z-30"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-5 w-5 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
        {icon}
      </div>
    </motion.div>
  );
}
