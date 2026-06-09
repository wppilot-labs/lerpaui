"use client";

import React, { useState } from 'react';
import { motion, MotionValue, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { cn } from '../lib/cn';

export interface InfiniteCylinderScrollProps {
  items?: string[];
  onSelect?: (item: string) => void;
  className?: string;
}

interface CylinderItemProps {
  item: string;
  idx: number;
  activeIdx: number;
  y: MotionValue<number>;
}

const CylinderItem: React.FC<CylinderItemProps> = ({ item, idx, activeIdx, y }) => {
  const itemY = idx * 42;
  const angle = useTransform(y, (currY) => {
    const delta = (itemY + currY) / 42;
    return Math.max(-65, Math.min(65, delta * 30));
  });
  const scale = useTransform(y, (currY) => {
    const delta = Math.abs(itemY + currY) / 42;
    return Math.max(0.75, 1 - delta * 0.08);
  });
  const opacity = useTransform(y, (currY) => {
    const delta = Math.abs(itemY + currY) / 42;
    return Math.max(0.15, 1 - delta * 0.25);
  });

  return (
    <motion.div
      key={idx}
      style={{
        rotateX: angle,
        scale,
        opacity,
        transformOrigin: 'center center -100px',
      }}
      className={cn(
        'h-9 px-4 flex items-center justify-center text-xs font-black uppercase tracking-wide transition-colors duration-200',
        idx === activeIdx ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      {item}
    </motion.div>
  );
};

export const InfiniteCylinderScroll: React.FC<InfiniteCylinderScrollProps> = ({
  items = ['Analytics Hub', 'AI Agent Roster', 'Vector Index', 'Billing Engine', 'Node Gateway', 'Security Ledger', 'Cron Pipelines'],
  onSelect,
  className,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const y = useMotionValue(0);

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    const itemHeight = 42;
    const currentY = y.get() + info.velocity.y * 0.1;
    const nearestIdx = Math.round(-currentY / itemHeight);

    // Virtual snapping
    const targetIdx = Math.max(0, Math.min(items.length - 1, nearestIdx));
    y.set(-targetIdx * itemHeight);
    setActiveIdx(targetIdx);
    onSelect?.(items[targetIdx]);
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(8);
  };

  return (
    <div
      className={cn(
        'relative w-full max-w-[280px] h-[220px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-center select-none overflow-hidden',
        className
      )}
    >
      <span className="absolute top-3 text-[9px] text-muted-foreground font-black uppercase tracking-widest z-10">
        Cylinder Scroll
      </span>

      {/* 3D viewport wrapper */}
      <div
        className="relative w-full h-[150px] overflow-hidden flex items-center justify-center"
        style={{ perspective: '800px' }}
      >
        {/* Selected target zone */}
        <div className="absolute left-4 right-4 h-10 border-y border-primary/20 bg-primary/5 rounded-md pointer-events-none z-10" />

        <motion.div
          drag="y"
          dragConstraints={{ top: -((items.length - 1) * 42), bottom: 0 }}
          style={{ y, transformStyle: 'preserve-3d' }}
          onDragEnd={handleDragEnd}
          className="w-full cursor-grab active:cursor-grabbing py-12 flex flex-col items-center gap-1.5 touch-y"
        >
          {items.map((item, idx) => (
            <CylinderItem key={idx} item={item} idx={idx} activeIdx={activeIdx} y={y} />
          ))}
        </motion.div>
      </div>

      <span className="absolute bottom-3 text-[9px] text-muted-foreground font-extrabold uppercase tracking-wide">
        Drag up/down to rotate drum
      </span>
    </div>
  );
};
