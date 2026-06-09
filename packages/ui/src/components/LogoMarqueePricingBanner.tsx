'use client';

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { Cpu, Terminal, Sparkles, Layers } from 'lucide-react';
import { cn } from '../lib/cn';

export interface LogoMarqueePricingBannerProps {
  className?: string;
}

export const LogoMarqueePricingBanner: React.FC<LogoMarqueePricingBannerProps> = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);

  const logos = [
    { name: "Neuro Core", icon: Cpu },
    { name: "Synapse net", icon: Sparkles },
    { name: "Vault DB", icon: Layers },
    { name: "Docker Shard", icon: Terminal }
  ];

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Pricing Marquee Banner</span>

      <div 
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        className="relative w-full h-[180px] border border-border/30 rounded-2xl bg-card shadow-lg flex flex-col justify-between p-4 my-auto overflow-hidden group"
      >
        <div className="flex flex-col">
          <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">TRUSTED BY THE BEST</span>
          <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Integration Shards</h4>
        </div>

        {/* Endless Marquee Loop */}
        <div className="relative w-full overflow-hidden py-2 border-t border-b border-border/10 my-3">
          <motion.div 
            className="flex gap-4 w-max"
            animate={{ x: isHovered ? [-160, 0] : [0, -160] }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "linear"
            }}
          >
            {/* Double the logos array to achieve infinite scroll loop */}
            {[...logos, ...logos].map((logo, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-1.5 bg-secondary/20 border border-border/40 rounded-lg px-2.5 py-1 text-[8px] font-mono text-foreground uppercase"
              >
                <logo.icon className="w-3 h-3 text-primary shrink-0" />
                <span>{logo.name}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex items-center justify-between text-[7px] font-mono text-muted-foreground">
          <span>Enterprise grade compliance</span>
          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover panel to reverse marquee velocity</span>
    </div>
  );
};
