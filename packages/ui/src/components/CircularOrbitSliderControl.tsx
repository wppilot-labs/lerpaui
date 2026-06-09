'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring} from "framer-motion";
import { Sparkles, Database, Terminal, Shield, Globe, Settings } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CircularOrbitSliderControlProps {
  className?: string;
}

export const CircularOrbitSliderControl: React.FC<CircularOrbitSliderControlProps> = ({ className }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const rot = useMotionValue(0);
  const springRot = useSpring(rot, { stiffness: 100, damping: 20 });

  const items = [
    { icon: Sparkles, label: "AI Models" },
    { icon: Database, label: "Data Vault" },
    { icon: Terminal, label: "Gateway" },
    { icon: Shield, label: "Security" },
    { icon: Globe, label: "Deployments" },
    { icon: Settings, label: "Configs" },
  ];

  const handleSelect = (idx: number) => {
    setActiveIdx(idx);
    const targetAngle = idx * -60; // 360 / 6 items
    rot.set(targetAngle);
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Concentric Orbit wheels</span>

      <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
        {/* Core Center Pulse */}
        <div className="absolute w-12 h-12 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center z-10 shadow-inner">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          </div>
        </div>

        {/* Orbit track ring */}
        <div className="absolute w-36 h-36 rounded-full border border-border/60 pointer-events-none" />

        {/* Rotating Wheel container */}
        <motion.div
          style={{ rotate: springRot }}
          className="w-full h-full relative"
        >
          {items.map((item, idx) => {
            const angleDeg = idx * 60;
            const angleRad = (angleDeg * Math.PI) / 180;
            const radius = 68;
            const xVal = Math.cos(angleRad) * radius;
            const yVal = Math.sin(angleRad) * radius;
            const isActive = idx === activeIdx;

            const leftOffset = parseFloat((xVal - 16).toFixed(4));
            const topOffset = parseFloat((yVal - 16).toFixed(4));
            const leftStyle = leftOffset >= 0 ? `calc(50% + ${leftOffset}px)` : `calc(50% - ${Math.abs(leftOffset)}px)`;
            const topStyle = topOffset >= 0 ? `calc(50% + ${topOffset}px)` : `calc(50% - ${Math.abs(topOffset)}px)`;

            return (
              <button
                key={idx}
                aria-label={item.label}
                onClick={() => handleSelect(idx)}
                className={cn('absolute w-8 h-8 rounded-full border bg-card flex items-center justify-center hover:border-primary/45 transition-colors focus:outline-none shadow-sm',
                  isActive ? 'border-primary shadow-lg scale-110' : 'border-border'
                )}
                style={{
                  left: leftStyle,
                  top: topStyle,
                }}
              >
                <item.icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
              </button>
            );
          })}
        </motion.div>
      </div>

      <div className="w-full text-center z-10">
        <span className="text-[8px] font-mono tracking-widest text-primary font-black uppercase">Selected Option</span>
        <h4 className="text-xs font-black tracking-wide text-foreground mt-0.5">{items[activeIdx].label}</h4>
      </div>
    </div>
  );
};
