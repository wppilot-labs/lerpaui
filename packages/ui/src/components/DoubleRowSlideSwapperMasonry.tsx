'use client';

import React, { useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue} from "framer-motion";
import { Cpu, Terminal, Sparkles, Layers } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DoubleRowSlideSwapperProps {
  className?: string;
}

export const DoubleRowSlideSwapperMasonry: React.FC<DoubleRowSlideSwapperProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const springMouseX = useSpring(mouseX, { stiffness: 60, damping: 15 });

  const slideX1 = useTransform(springMouseX, [0, 1], [-60, 40]);
  const slideX2 = useTransform(springMouseX, [0, 1], [40, -60]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    mouseX.set(relativeX);
  };

  const handlePointerLeave = () => {
    mouseX.set(0.5);
  };

  const row1 = [
    { title: "Neuro Core", icon: Cpu, color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30" },
    { title: "Synapse net", icon: Sparkles, color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30" },
    { title: "Vault cluster", icon: Layers, color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30" }
  ];

  const row2 = [
    { title: "Docker Shard", icon: Terminal, color: "from-pink-500/20 to-rose-500/10 border-pink-500/30" },
    { title: "Secure mesh", icon: Cpu, color: "from-amber-500/20 to-orange-500/10 border-amber-500/30" },
    { title: "Index sync", icon: Layers, color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30" }
  ];

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none cursor-ew-resize', className)}
    >
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Opposed Swapper Masonry</span>

      <div className="flex flex-col gap-3.5 w-full my-auto overflow-hidden py-2">
        {/* Row 1 */}
        <motion.div style={{ x: slideX1 }} className="flex gap-3 w-max">
          {row1.map((item, idx) => (
            <div key={idx} className={cn("h-16 w-32 border bg-gradient-to-b rounded-2xl p-2.5 flex flex-col justify-between bg-card text-foreground shadow-md transition-all duration-300 hover:scale-104", item.color)}>
              <div className="flex justify-between items-center">
                <item.icon className="w-3.5 h-3.5 opacity-80" />
                <span className="text-[7px] font-mono opacity-60">ACTIVE</span>
              </div>
              <h5 className="text-[9px] font-black tracking-wide uppercase leading-none">{item.title}</h5>
            </div>
          ))}
        </motion.div>

        {/* Row 2 */}
        <motion.div style={{ x: slideX2 }} className="flex gap-3 w-max self-end">
          {row2.map((item, idx) => (
            <div key={idx} className={cn("h-16 w-32 border bg-gradient-to-b rounded-2xl p-2.5 flex flex-col justify-between bg-card text-foreground shadow-md transition-all duration-300 hover:scale-104", item.color)}>
              <div className="flex justify-between items-center">
                <item.icon className="w-3.5 h-3.5 opacity-80" />
                <span className="text-[7px] font-mono opacity-60">READY</span>
              </div>
              <h5 className="text-[9px] font-black tracking-wide uppercase leading-none">{item.title}</h5>
            </div>
          ))}
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Slide cursor horizontally to scrub tracks</span>
    </div>
  );
};
