"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { cn } from '../lib/cn';

export interface ElasticDraggableTabsProps {
  onTabChange?: (tab: string) => void;
  className?: string;
}

export const ElasticDraggableTabs: React.FC<ElasticDraggableTabsProps> = ({
  onTabChange,
  className,
}) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Console', 'Security'];

  const dragX = useMotionValue(0);
  const _springX = useSpring(dragX, { stiffness: 400, damping: 30 });

  const handleDragEnd = (tab: string, info: PanInfo) => {
    const _itemWidth = 84;
    const currentOffset = info.offset.x;
    const currentIdx = tabs.indexOf(tab);
    
    let targetIdx = currentIdx;
    if (currentOffset > 40) targetIdx = Math.max(0, currentIdx - 1);
    else if (currentOffset < -40) targetIdx = Math.min(tabs.length - 1, currentIdx + 1);

    setActiveTab(tabs[targetIdx]);
    onTabChange?.(tabs[targetIdx]);
    dragX.set(0);
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[160px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-center select-none overflow-hidden p-4', className)}>
      <span className="absolute top-3 text-[9px] text-muted-foreground font-black uppercase tracking-widest">Draggable Tabs</span>

      <div className="relative flex bg-secondary/25 border border-border/80 rounded-xl p-1 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <motion.div
              key={tab}
              drag={isActive ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(_e, info) => handleDragEnd(tab, info)}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              onClick={() => {
                setActiveTab(tab);
                onTabChange?.(tab);
              }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveTab(tab); onTabChange?.(tab); } }}
              className={cn('relative h-7 px-4 rounded-lg flex items-center justify-center text-[10px] font-black uppercase tracking-wider cursor-grab active:cursor-grabbing touch-none transition-colors',
                isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
            </motion.div>
          );
        })}
      </div>

      <span className="absolute bottom-3 text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide">Flick active tab row to swap slots</span>
    </div>
  );
};
