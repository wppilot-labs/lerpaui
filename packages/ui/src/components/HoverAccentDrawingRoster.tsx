"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring} from "framer-motion";
import { cn } from '../lib/cn';
import { ArrowUpRight } from 'lucide-react';

export interface RosterItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tags?: string[];
  ctaText?: string;
}

export interface HoverAccentDrawingRosterProps extends React.HTMLAttributes<HTMLDivElement> {
  items: RosterItem[];
  onItemClick?: (item: RosterItem) => void;
  drawSpeed?: number; // Duration in seconds
}

export const HoverAccentDrawingRoster: React.FC<HoverAccentDrawingRosterProps> = ({
  items,
  onItemClick,
  drawSpeed = 0.6,
  className,
  ...props
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse cursor coordinate values for floating image preview
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring math for smooth trailing preview movement
  const springConfig = { stiffness: 220, damping: 25, mass: 0.5 };
  const floatX = useSpring(mouseX, springConfig);
  const floatY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Set coordinates relative to container
    mouseX.set(e.clientX - containerRect.left);
    mouseY.set(e.clientY - containerRect.top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn('relative w-full max-w-4xl mx-auto flex flex-col', className)}
      {...props}
    >
      {/* Floating Image Preview Container (Visible only when hovering over rows) */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            style={{
              x: floatX,
              y: floatY,
              translateX: '35px', // offset right of pointer
              translateY: '-50%', // center vertically on pointer
            }}
            initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            exit={{ opacity: 0, scale: 0.6, rotate: -10 }}
            className="absolute pointer-events-none z-30 hidden lg:block h-60 w-44 overflow-hidden rounded-2xl border-2 border-primary bg-background shadow-2xl"
          >
            <motion.img
              key={items[hoveredIndex].image}
              src={items[hoveredIndex].image}
              alt={items[hoveredIndex].title}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full object-cover select-none"
            />
            {/* Ambient overlay blur */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roster Items Stack */}
      <div className="flex flex-col border-y border-border">
        {items.map((item, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onItemClick && onItemClick(item)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onItemClick && onItemClick(item); } }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8 px-6 cursor-pointer select-none overflow-hidden transition-colors duration-300"
            >
              {/* Premium drawn SVG border outline */}
              <AnimatePresence>
                {isHovered && (
                  <svg className="absolute inset-0 z-10 h-full w-full pointer-events-none">
                    {/* Outline rect that draws itself */}
                    <motion.rect
                      x="2"
                      y="2"
                      width="calc(100% - 4px)"
                      height="calc(100% - 4px)"
                      rx="8"
                      ry="8"
                      fill="transparent"
                      stroke="rgb(var(--primary))"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      exit={{ pathLength: 0 }}
                      transition={{ duration: drawSpeed, ease: 'easeInOut' }}
                    />
                  </svg>
                )}
              </AnimatePresence>

              {/* Title & Index */}
              <div className="relative z-20 flex items-baseline gap-6">
                <span className="text-xs font-mono text-muted-foreground/60 group-hover:text-primary transition-colors">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                
                <div className="flex flex-col">
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground group-hover:translate-x-1.5 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <span className="text-sm font-medium text-muted-foreground mt-0.5">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {/* Tags and CTA */}
              <div className="relative z-20 flex items-center justify-between sm:justify-end gap-6">
                {/* Horizontal tags roster */}
                {item.tags && (
                  <div className="hidden md:flex items-center gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs text-muted-foreground font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Call to action arrow icon */}
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors select-none">
                  <span className="hidden sm:inline-block">
                    {item.ctaText || 'Explore'}
                  </span>
                  <ArrowUpRight className="h-5 w-5 rotate-0 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>

              {/* Subtle hover row overlay */}
              <div className="absolute inset-0 -z-10 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
