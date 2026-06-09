'use client';

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { Sparkles, Terminal, Layers, Cpu } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CircularDialProjectOrbitProps {
  className?: string;
}

export const CircularDialProjectOrbit: React.FC<CircularDialProjectOrbitProps> = ({ className }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const steps = [
    { label: "AI Core", icon: Sparkles, angle: 0, color: "text-purple-500 border-purple-500/20" },
    { label: "Net Sync", icon: Terminal, angle: 90, color: "text-blue-500 border-blue-500/20" },
    { label: "Vault DB", icon: Layers, angle: 180, color: "text-emerald-500 border-emerald-500/20" },
    { label: "Ledger", icon: Cpu, angle: 270, color: "text-orange-500 border-orange-500/20" }
  ];

  const rotation = -activeIdx * 90;

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Circular Orbit Select</span>

      <div className="relative w-full h-[180px] flex items-center justify-center my-auto z-0">
        {/* Orbital Path Circle */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          className="relative w-28 h-28 rounded-full border border-dashed border-border/80 flex items-center justify-center"
        >
          {steps.map((step, idx) => {
            const active = idx === activeIdx;
            const rad = (step.angle * Math.PI) / 180;
            const x = Math.cos(rad) * 56;
            const y = Math.sin(rad) * 56;

            return (
              <motion.button
                key={idx}
                aria-label={step.label}
                onClick={() => setActiveIdx(idx)}
                style={{ x, y }}
                animate={{ rotate: -rotation }}
                transition={{ type: "spring", stiffness: 100, damping: 18 }}
                className={cn('absolute w-7 h-7 rounded-full border bg-card flex items-center justify-center hover:border-primary/45 transition-colors focus:outline-none shadow-md',
                  active ? 'border-primary text-primary bg-primary/5 scale-108 z-10' : 'text-muted-foreground border-border'
                )}
              >
                <step.icon className="w-3.5 h-3.5" />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Central Active Node */}
        <div className="absolute w-12 h-12 rounded-full border border-primary/20 bg-card/60 flex flex-col items-center justify-center shadow-lg text-center z-10">
          <span className="text-[7px] font-black uppercase text-primary leading-none">{steps[activeIdx].label}</span>
          <span className="text-[5px] font-mono text-muted-foreground leading-none mt-0.5">ACTIVE</span>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click outer nodes to rotate orbits</span>
    </div>
  );
};
