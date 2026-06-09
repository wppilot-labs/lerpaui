'use client';

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { Shield, DollarSign } from 'lucide-react';
import { cn } from '../lib/cn';

export interface NeumorphicOutsetPricingCardProps {
  className?: string;
}

export const NeumorphicOutsetPricingCard: React.FC<NeumorphicOutsetPricingCardProps> = ({ className }) => {
  const [isSelected, setIsSelected] = useState(true);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Neumorphic Outset Price Card</span>

      <div className="flex items-center justify-center w-full h-[180px] my-auto">
        <motion.div 
          onClick={() => setIsSelected(!isSelected)}
          animate={isSelected ? {
            boxShadow: "inset 4px 4px 10px rgba(0,0,0,0.1), inset -4px -4px 10px rgba(255,255,255,0.05)",
            scale: 0.98
          } : {
            boxShadow: "6px 6px 15px rgba(0,0,0,0.15), -6px -6px 15px rgba(255,255,255,0.05)",
            scale: 1
          }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="w-full max-w-[200px] border border-border/40 rounded-3xl p-4 bg-card cursor-pointer flex flex-col justify-between h-[160px] select-none"
        >
          <div className="flex justify-between items-start">
            <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">NEO ENTERPRISE</span>
            <Shield className={cn("w-4 h-4 transition-colors", isSelected ? "text-primary" : "text-muted-foreground")} />
          </div>

          <div className="flex items-baseline mt-3">
            <DollarSign className="w-3.5 h-3.5 text-foreground/75 shrink-0" />
            <span className="text-xl font-black text-foreground">89</span>
            <span className="text-[8px] font-mono text-muted-foreground ml-1.5 uppercase">/MO</span>
          </div>

          <span className="text-[7.5px] text-muted-foreground font-mono mt-2 border-t border-border/10 pt-2 text-center uppercase tracking-widest leading-none">
            {isSelected ? 'PLAN ACTIVE' : 'CLICK TO CHOOSE'}
          </span>
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click panel to indent tactile outline concave</span>
    </div>
  );
};
