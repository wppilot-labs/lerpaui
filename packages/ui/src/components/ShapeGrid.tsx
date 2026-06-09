"use client";

import React, { useMemo } from 'react';
import { motion} from "framer-motion";
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

interface ShapeGridProps {
  className?: string;
  columns?: number;
  rows?: number;
  color?: string;
  hoverColor?: string;
  density?: number; // percentage of cells filled with shapes (0 to 1)
}

type ShapeType = 'star' | 'diamond' | 'plus' | 'ring' | 'triangle';

export const ShapeGrid: React.FC<ShapeGridProps> = ({
  className,
  columns = 8,
  rows = 6,
  color = 'rgba(161, 161, 170, 0.12)', // slate-400 equivalent border trace
  hoverColor = '#818CF8', // primary indigo-400 glow
  density = 0.65,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  // SVG shape outline models
  const renderShape = (type: ShapeType, strokeColor: string) => {
    switch (type) {
      case 'star':
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5">
            <path d="M12 2L14.8 8.6L22 9.2L16.5 13.8L18.2 21L12 17.2L5.8 21L7.5 13.8L2 9.2L9.2 8.6L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'diamond':
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'plus':
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5">
            <path d="M12 5V19M5 12H19" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'ring':
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5">
            <circle cx="12" cy="12" r="8" />
          </svg>
        );
      case 'triangle':
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5">
            <path d="M12 3L21 19H3L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  };

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Generate grid mapping details
  const gridCells = useMemo(() => {
    const totalCells = columns * rows;
    const shapeTypes: ShapeType[] = ['star', 'diamond', 'plus', 'ring', 'triangle'];
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      const hasShape = mounted ? (Math.random() < density) : false;
      const type = shapeTypes[mounted ? Math.floor(Math.random() * shapeTypes.length) : (i % shapeTypes.length)];
      const delay = mounted ? Math.random() * 3 : 0;
      const duration = mounted ? Math.random() * 2 + 3 : 4;

      cells.push({ hasShape, type, delay, duration });
    }
    return cells;
  }, [columns, rows, density, mounted]);

  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
      className={cn(
        'relative grid h-full w-full border-t border-l border-zinc-200/5 dark:border-zinc-800/20 bg-background/5 select-none overflow-hidden',
        className
      )}
    >
      {gridCells.map((cell, idx) => (
        <div
          key={`cell-${idx}`}
          className="relative flex items-center justify-center border-r border-b border-zinc-200/5 dark:border-zinc-800/10 p-6 md:p-8"
        >
          {cell.hasShape && (
            <motion.div
              initial={{ opacity: 0.1, scale: 0.8 }}
              animate={prefersReducedMotion ? { opacity: 0.3, scale: 1 } : {
                opacity: [0.15, 0.45, 0.15],
                scale: [0.9, 1, 0.9],
              }}
              whileHover={prefersReducedMotion ? undefined : {
                opacity: 1,
                scale: 1.25,
                rotate: 90,
                transition: { type: 'spring', stiffness: 350, damping: 15 }
              }}
              transition={prefersReducedMotion ? { duration: 0 } : {
                duration: cell.duration,
                repeat: Infinity,
                delay: cell.delay,
                ease: 'easeInOut',
              }}
              style={{
                filter: 'drop-shadow(0 0 10px transparent)',
              }}
              className="cursor-pointer text-muted-foreground/30 hover:text-indigo-400 transition-colors duration-300"
            >
              {/* Dynamic hover stroke color resolver */}
              <HoverStrokeResolver
                color={color}
                hoverColor={hoverColor}
                type={cell.type}
                renderer={renderShape}
              />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

// Internal component to seamlessly switch stroke colors on react hover lifecycle events
interface HoverStrokeProps {
  color: string;
  hoverColor: string;
  type: ShapeType;
  renderer: (type: ShapeType, color: string) => React.ReactNode;
}

const HoverStrokeResolver: React.FC<HoverStrokeProps> = ({ color, hoverColor, type, renderer }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ color: hovered ? hoverColor : undefined }}
    >
      {renderer(type, hovered ? hoverColor : color)}
    </div>
  );
};
