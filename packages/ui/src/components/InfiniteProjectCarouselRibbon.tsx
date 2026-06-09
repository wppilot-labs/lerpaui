'use client';

import React from 'react';
import { motion} from "framer-motion";
import { Sparkles, Terminal, Layers } from 'lucide-react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface RibbonProject {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Tailwind border + hover-border classes. */
  color: string;
}

export interface InfiniteProjectCarouselRibbonProps {
  className?: string;
  /** Projects in the ribbon. */
  projects?: RibbonProject[];
  /** Header label. */
  label?: string;
}

const DEFAULT_PROJECTS: RibbonProject[] = [
  { title: "Studio One", desc: "Brand and identity work.", icon: Sparkles, color: "border-purple-500/20 hover:border-purple-500/40" },
  { title: "Studio Two", desc: "Multi-tenant product builds.", icon: Terminal, color: "border-blue-500/20 hover:border-blue-500/40" },
  { title: "Studio Three", desc: "Search and recommendation work.", icon: Layers, color: "border-emerald-500/20 hover:border-emerald-500/40" }
];

export const InfiniteProjectCarouselRibbon: React.FC<InfiniteProjectCarouselRibbonProps> = ({
  className,
  projects = DEFAULT_PROJECTS,
  label = "Project Scrolling Ribbon",
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>

      <div className="flex flex-col gap-3 w-full h-[180px] overflow-hidden my-auto relative">
        <motion.div
          animate={prefersReducedMotion ? { y: 0 } : { y: [0, -180] }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            y: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 10,
              ease: "linear"
            }
          }}
          className="flex flex-col gap-3 w-full absolute top-0"
        >
          {[...projects, ...projects, ...projects].map((proj, idx) => (
            <div 
              key={idx}
              className={cn('w-full border bg-card/60 p-3 rounded-2xl flex items-center justify-between transition-colors shadow-inner', proj.color)}
            >
              <div className="flex items-center gap-3">
                <proj.icon className="w-4 h-4 text-primary shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9.5px] font-black tracking-wide text-foreground leading-tight">{proj.title}</span>
                  <span className="text-[7.5px] text-muted-foreground font-semibold leading-tight mt-0.5">{proj.desc}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Seamless looping vertical project stack</span>
    </div>
  );
};
