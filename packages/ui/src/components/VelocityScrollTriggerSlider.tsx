'use client';

import React, { useRef, useState } from 'react';

import { Sparkles, Terminal, Database } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ScrollPanel {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface VelocityScrollTriggerSliderProps {
  className?: string;
  /** Panels to scroll through. */
  panels?: ScrollPanel[];
  /** Header label. */
  label?: string;
}

const DEFAULT_PANELS: ScrollPanel[] = [
  { title: "Optimization", desc: "Adaptive parameter tuning networks.", icon: Sparkles },
  { title: "Gateway", desc: "Secure multi-tenant gateway layers.", icon: Terminal },
  { title: "Vector Store", desc: "Elastic similarity vector shards.", icon: Database },
];

export const VelocityScrollTriggerSlider: React.FC<VelocityScrollTriggerSliderProps> = ({
  className,
  panels = DEFAULT_PANELS,
  label = "Velocity Scroll Matrix",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const idx = Math.round(scrollLeft / width);
    setActiveIdx(idx);
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>

      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-[180px] overflow-x-auto flex snap-x snap-mandatory scrollbar-none items-center scroll-smooth gap-4 px-2"
      >
        {panels.map((panel, idx) => (
          <div
            key={idx}
            className="w-full shrink-0 snap-center snap-always flex items-center justify-center"
          >
            <div className="w-[230px] h-[140px] bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-md">
              <div className="flex justify-between items-start">
                <span className="text-[8px] font-mono tracking-widest bg-secondary/40 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">MODULE 0{idx + 1}</span>
                <panel.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wide text-foreground">{panel.title}</h4>
                <p className="text-[9px] text-muted-foreground leading-normal mt-1">{panel.desc}</p>
              </div>
              <span className="text-[8px] font-mono text-muted-foreground/60 font-black">SWIPE OR SCROLL PANEL</span>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-between items-center z-10 px-2">
        <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide">Scroll tracks node swipe speed</span>
        <div className="flex gap-1">
          {panels.map((_, idx) => (
            <div
              key={idx}
              className={cn('h-1.5 rounded-full transition-all duration-300', 
                idx === activeIdx ? 'w-4 bg-primary' : 'w-1.5 bg-border'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
