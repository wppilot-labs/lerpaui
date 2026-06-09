"use client";

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  metric: string;
  metricLabel: string;
  summary: string;
  image: string;
  tagColor?: string; // e.g. '#10b981'
}

export interface CaseStudyRosterGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: CaseStudy[];
  neonColor?: string; // primary neon color e.g., '#6366f1' or gradient
}

const defaultStudies: CaseStudy[] = [
  {
    id: 'cs1',
    title: 'Scaling Apex Outdoors to $14M Annual Recurring Revenue',
    category: 'E-Commerce Growth',
    metric: '+142%',
    metricLabel: 'Conversion Boost',
    summary: 'Replatformed and engineered custom fluid-spring product customizers resulting in unprecedented mobile basket conversion metrics.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop',
    tagColor: '#6366f1'
  },
  {
    id: 'cs2',
    title: 'Automated Shipping Architectures for Global Retail Group',
    category: 'Supply Chain Operations',
    metric: '2.4 Days',
    metricLabel: 'Fulfillment Leadtime Savings',
    summary: 'Designed advanced warehouse inventory allocations, shrinking delivery times while saving millions in global logistics costs.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400&auto=format&fit=crop',
    tagColor: '#10b981'
  },
  {
    id: 'cs3',
    title: 'Fluid Personalization Canvas for Designer Brand',
    category: 'Luxury Fashion UX',
    metric: '$4.2M',
    metricLabel: 'Net New Funnel Revenue',
    summary: 'Built elegant interactive product customizers with perspective engravings, resulting in massive average order value surges.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop',
    tagColor: '#ec4899'
  }
];

export const CaseStudyRosterGrid: React.FC<CaseStudyRosterGridProps> = ({
  items = defaultStudies,
  neonColor = '#6366f1',
  className,
  ...props
}) => {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "w-full max-w-6xl mx-auto px-4 py-8",
        className
      )}
      {...props}
    >
      {/* Intro text summary */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Success Showcases</span>
        </span>
        
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-zinc-50 tracking-tight mt-4">
          Engineered to Scale Markets
        </h2>
        
        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mt-3.5 leading-relaxed">
          Explore real-world case studies detailing how custom high-fidelity animation interactions boosted operational KPIs and product sales.
        </p>
      </div>

      {/* Grid containing cards with glowing neon boundary path tracers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((cs) => {
          const isHovered = hoveredCardId === cs.id;

          return (
            <div
              key={cs.id}
              onMouseEnter={() => setHoveredCardId(cs.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              className={cn(
                "relative rounded-3xl p-6 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 transition-all duration-350 cursor-pointer select-none overflow-hidden group flex flex-col justify-between min-h-[440px] shadow-sm"
              )}
            >
              {/* SVG Glowing Neon Vector Border Path Tracer overlay */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                fill="none"
              >
                {/* Neon continuous path rect */}
                <motion.rect
                  x="1.5"
                  y="1.5"
                  width="calc(100% - 3px)"
                  height="calc(100% - 3px)"
                  rx="24"
                  ry="24"
                  stroke={cs.tagColor || neonColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: isHovered && !prefersReducedMotion ? 1 : 0,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut"
                  }}
                  style={{
                    filter: `drop-shadow(0 0 6px ${cs.tagColor || neonColor})`,
                  }}
                />
              </svg>

              <div>
                {/* Case Study Image Backdrop */}
                <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 relative mb-5">
                  <img
                    src={cs.image}
                    alt={cs.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                  
                  {/* Category Pill tag overlay */}
                  <span 
                    className="absolute bottom-3 left-3 text-[9px] font-black uppercase text-white px-2.5 py-1 rounded-md tracking-widest"
                    style={{ backgroundColor: cs.tagColor || neonColor }}
                  >
                    {cs.category}
                  </span>
                </div>

                {/* Big Metric Display */}
                <div className="mb-4">
                  <div 
                    className="text-3xl font-black tracking-tight"
                    style={{ color: cs.tagColor || neonColor }}
                  >
                    {cs.metric}
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
                    {cs.metricLabel}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-zinc-100 tracking-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                  {cs.title}
                </h3>

                {/* Summary */}
                <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-2.5 leading-relaxed">
                  {cs.summary}
                </p>
              </div>

              {/* Read Case Study CTA bottom link */}
              <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100 dark:border-zinc-800/50">
                <span className="text-xs font-extrabold text-slate-700 dark:text-zinc-300">
                  Read Case Study
                </span>
                
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    "bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200",
                    "group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-950"
                  )}
                >
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Tactile reduced motion hook helper
const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
};
