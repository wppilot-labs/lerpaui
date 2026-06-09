'use client';

import React from 'react';
import { motion} from "framer-motion";
import { Sparkles, Layers, Terminal } from 'lucide-react';
import { cn } from '../lib/cn';

export interface MasonryItem {
  title: string;
  /** Tailwind height utility class (e.g. `h-[85px]`). */
  height: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Tailwind gradient + border classes. */
  bg: string;
}

export interface StaggeredMasonryGridProps {
  className?: string;
  /** Masonry items. */
  items?: MasonryItem[];
  /** Header label. */
  label?: string;
}

const DEFAULT_ITEMS: MasonryItem[] = [
  { title: "Studio A", height: "h-[85px]", tag: "Project", icon: Sparkles, bg: "from-purple-900/60 to-indigo-950/60 border-purple-500/20" },
  { title: "Studio B", height: "h-[105px]", tag: "Project", icon: Terminal, bg: "from-blue-900/60 to-cyan-950/60 border-blue-500/20" },
  { title: "Studio C", height: "h-[105px]", tag: "Project", icon: Layers, bg: "from-emerald-900/60 to-teal-950/60 border-emerald-500/20" },
  { title: "Studio D", height: "h-[85px]", tag: "Project", icon: Sparkles, bg: "from-orange-900/60 to-red-950/60 border-orange-500/20" }
];

export const StaggeredMasonryGrid: React.FC<StaggeredMasonryGridProps> = ({
  className,
  items = DEFAULT_ITEMS,
  label = "Staggered Masonry Mosaic",
}) => {

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } }
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 w-full h-[200px] overflow-hidden my-auto py-2 items-center"
      >
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            className={cn('w-full rounded-2xl border bg-gradient-to-br p-3.5 flex flex-col justify-between text-white shadow-lg cursor-pointer overflow-hidden', item.height, item.bg)}
          >
            <div className="flex justify-between items-start">
              <item.icon className="w-3.5 h-3.5 opacity-80" />
              <span className="text-[6px] font-mono tracking-widest bg-white/20 px-1 py-0.5 rounded uppercase font-black">{item.tag}</span>
            </div>
            <div>
              <h5 className="text-[9px] font-black tracking-wide truncate block">{item.title}</h5>
              <span className="text-[5px] text-white/60 uppercase block font-semibold leading-tight">Inspect work</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Staggered entrance portfolio cards</span>
    </div>
  );
};
