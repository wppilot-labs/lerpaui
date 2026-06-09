'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Layers, Cpu, Compass } from 'lucide-react';
import { cn } from '../lib/cn';

export interface GalleryItem {
  title: string;
  tag: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Tailwind gradient + border + text classes for the active panel. */
  color: string;
}

export interface ElasticExpandableGalleryItemProps {
  className?: string;
  /** Gallery items. */
  items?: GalleryItem[];
  /** Header label. */
  label?: string;
  /** Initially expanded item, or `null` for none. */
  defaultIndex?: number | null;
}

const DEFAULT_ITEMS: GalleryItem[] = [
  { title: "Compute", tag: "Core", desc: "Elastic processing layer.", icon: Cpu, color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400" },
  { title: "Vector Store", tag: "Data", desc: "Similarity index cluster.", icon: Layers, color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400" },
  { title: "Routing", tag: "Mesh", desc: "Dynamic route orchestration.", icon: Compass, color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400" }
];

export const ElasticExpandableGalleryItem: React.FC<ElasticExpandableGalleryItemProps> = ({
  className,
  items = DEFAULT_ITEMS,
  label = "Elastic Expandable Gallery",
  defaultIndex = 0,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultIndex);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>

      <div className="flex flex-col gap-2 w-full my-auto">
        {items.map((item, idx) => {
          const isActive = activeIndex === idx;
          return (
            <motion.div
              key={idx}
              layout
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              onClick={() => setActiveIndex(isActive ? null : idx)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveIndex(isActive ? null : idx); } }}
              className={cn(
                'relative border rounded-2xl p-4 bg-card cursor-pointer overflow-hidden flex flex-col justify-between transition-all duration-300 bg-gradient-to-r shadow-md',
                isActive ? item.color : 'from-secondary/10 to-secondary/5 border-border hover:border-muted-foreground/30 text-muted-foreground'
              )}
              transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-xl bg-card border border-border/40', isActive ? 'text-foreground' : '')}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono tracking-wider opacity-70 uppercase">{item.tag}</span>
                    <h4 className="text-xs font-black tracking-wide text-foreground">{item.title}</h4>
                  </div>
                </div>
                <Sparkles className={cn('w-3.5 h-3.5 opacity-60 transition-transform duration-300', isActive ? 'scale-110 rotate-12 opacity-100 text-foreground' : 'scale-70')} />
              </div>

              {isActive && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 text-[10px] text-muted-foreground leading-relaxed border-t border-border/30 pt-2"
                >
                  {item.desc} Expandable metadata elastically reveals dynamic workflow properties upon interactions.
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click panels to expand elastically</span>
    </div>
  );
};
