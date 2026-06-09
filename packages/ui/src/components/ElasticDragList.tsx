"use client";

import React, { useRef } from 'react';
import {motion, useMotionValue, useTransform, useVelocity, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import { cn } from '../lib/cn';
import { Trash2, Check, GripVertical } from 'lucide-react';

export interface ElasticDragItem {
  id: string;
  title: string;
  description?: string;
  avatar?: string;
  badge?: string;
}

export interface ElasticDragListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ElasticDragItem[];
  onReorder?: (newItems: ElasticDragItem[]) => void;
  onSwipeLeft?: (item: ElasticDragItem) => void;
  onSwipeRight?: (item: ElasticDragItem) => void;
  leftActionIcon?: React.ComponentType<{ className?: string }>;
  rightActionIcon?: React.ComponentType<{ className?: string }>;
}

export const ElasticDragList: React.FC<ElasticDragListProps> = ({
  items,
  onReorder: _onReorder,
  onSwipeLeft,
  onSwipeRight,
  leftActionIcon: LeftActionIcon = Check,
  rightActionIcon: RightActionIcon = Trash2,
  className,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col gap-2.5 w-full max-w-xl mx-auto', className)} {...props}>
      <AnimatePresence initial={false}>
        {items.map((item, _idx) => (
          <ElasticListItem
            key={item.id}
            item={item}
            onSwipeLeft={onSwipeLeft}
            onSwipeRight={onSwipeRight}
            LeftActionIcon={LeftActionIcon}
            RightActionIcon={RightActionIcon}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ElasticListItemProps {
  item: ElasticDragItem;
  onSwipeLeft?: (item: ElasticDragItem) => void;
  onSwipeRight?: (item: ElasticDragItem) => void;
  LeftActionIcon: React.ComponentType<{ className?: string }>;
  RightActionIcon: React.ComponentType<{ className?: string }>;
}

const ElasticListItem: React.FC<ElasticListItemProps> = ({
  item,
  onSwipeLeft,
  onSwipeRight,
  LeftActionIcon,
  RightActionIcon,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Drag motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Compute velocities for real-time elastic skew/stretches
  const xVelocity = useVelocity(x);
  const yVelocity = useVelocity(y);

  // Compute skew and scale factors from velocities
  const skewX = useTransform(xVelocity, [-1500, 1500], [-8, 8]);
  const skewY = useTransform(yVelocity, [-1500, 1500], [-4, 4]);
  const scale = useTransform(xVelocity, [-1500, 1500], [1.02, 1.02]);

  // Color interpolation for swipe depth
  const background = useTransform(
    x,
    [-180, 0, 180],
    [
      'rgba(239, 68, 68, 0.15)', // Red overlay for destructive swipe
      'rgba(0, 0, 0, 0)', // Neutral transparency
      'rgba(16, 185, 129, 0.15)', // Green overlay for success swipe
    ]
  );

  const handleDragEnd = (event: unknown, info: PanInfo) => {
    const swipeThreshold = 140;
    if (info.offset.x < -swipeThreshold) {
      if (onSwipeLeft) {
        onSwipeLeft(item);
      }
    } else if (info.offset.x > swipeThreshold) {
      if (onSwipeRight) {
        onSwipeRight(item);
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      layout
      exit={{
        opacity: 0,
        height: 0,
        scale: 0.85,
        transition: { duration: 0.25 },
      }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      {/* Swipe actions absolute background */}
      <motion.div
        style={{ background }}
        className="absolute inset-0 z-0 flex items-center justify-between px-6 pointer-events-none"
      >
        {/* Left Action (Swiped Right) */}
        <motion.div
          style={{
            opacity: useTransform(x, [40, 100], [0, 1]),
            scale: useTransform(x, [40, 100], [0.8, 1.15]),
          }}
          className="flex items-center gap-2 text-emerald-500 font-bold text-sm"
        >
          <LeftActionIcon className="h-5 w-5" />
          <span>Complete</span>
        </motion.div>

        {/* Right Action (Swiped Left) */}
        <motion.div
          style={{
            opacity: useTransform(x, [-100, -40], [1, 0]),
            scale: useTransform(x, [-100, -40], [1.15, 0.8]),
          }}
          className="flex items-center gap-2 text-destructive font-bold text-sm"
        >
          <span>Delete</span>
          <RightActionIcon className="h-5 w-5" />
        </motion.div>
      </motion.div>

      {/* Swipeable & Elastic Interactive Card Row */}
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        style={{
          x,
          skewX,
          skewY,
          scale,
        }}
        className="relative z-10 flex items-center justify-between gap-4 p-4 bg-card border-none cursor-grab active:cursor-grabbing select-none"
        whileDrag={prefersReducedMotion ? undefined : {
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        }}
        transition={prefersReducedMotion ? { duration: 0 } : {
          type: 'spring',
          stiffness: 400,
          damping: 28,
        }}
      >
        <div className="flex items-center gap-4.5">
          {/* Grab handle identifier */}
          <div className="text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Optional Avatar */}
          {item.avatar && (
            <img
              src={item.avatar}
              alt={item.title}
              className="h-10 w-10 rounded-full object-cover border border-border select-none pointer-events-none"
            />
          )}

          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm tracking-tight sm:text-base">
              {item.title}
            </span>
            {item.description && (
              <span className="text-xs text-muted-foreground leading-tight max-w-[280px] sm:max-w-xs md:max-w-sm">
                {item.description}
              </span>
            )}
          </div>
        </div>

        {/* Badge or Indicator */}
        {item.badge && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {item.badge}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};
