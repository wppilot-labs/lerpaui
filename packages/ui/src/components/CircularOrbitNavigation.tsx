"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring} from "framer-motion";
import { Shield, Sparkles, Database, Terminal, Settings, Globe } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CircularOrbitNavigationProps {
  onSelect?: (idx: number) => void;
  className?: string;
}

export const CircularOrbitNavigation: React.FC<CircularOrbitNavigationProps> = ({
  onSelect,
  className,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const rot = useMotionValue(0);
  const springRot = useSpring(rot, { stiffness: 120, damping: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [startRot, setStartRot] = useState(0);

  const orbits = [
    { icon: Sparkles, label: 'AI Suite' },
    { icon: Database, label: 'Data Hub' },
    { icon: Terminal, label: 'Gateway' },
    { icon: Shield, label: 'Ledger' },
    { icon: Globe, label: 'Deployments' },
    { icon: Settings, label: 'Configs' },
  ];

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const angleRad = Math.atan2(y, x);
    const angleDeg = (angleRad * 180) / Math.PI;

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setStartAngle(angleDeg);
    setStartRot(rot.get());
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const angleRad = Math.atan2(y, x);
    const angleDeg = (angleRad * 180) / Math.PI;
    
    rot.set(startRot + (angleDeg - startAngle));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) { /* noop */ }

    const currentRot = rot.get();
    const nearestIdx = Math.round(currentRot / 60);
    rot.set(nearestIdx * 60);

    let normalized = -nearestIdx % 6;
    if (normalized < 0) normalized += 6;

    setActiveIdx(normalized);
    onSelect?.(normalized);
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[280px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-center select-none overflow-hidden', className)}>
      <span className="absolute top-3 text-[9px] text-muted-foreground font-black uppercase tracking-widest">Orbit Navigation</span>

      <div className="relative w-44 h-44 flex items-center justify-center rounded-full mt-2">
        {/* Central Core logo */}
        <div className="absolute w-12 h-12 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center z-15 shadow-inner">
          <Globe className="w-5 h-5 text-primary animate-pulse" />
        </div>

        <motion.div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ rotate: springRot }}
          className="w-full h-full rounded-full border border-border/40 flex items-center justify-center cursor-grab active:cursor-grabbing relative touch-none"
        >
          {orbits.map((item, idx) => {
            const angleDeg = idx * 60;
            const angleRad = (angleDeg * Math.PI) / 180;
            const radius = 64;
            const xVal = Math.cos(angleRad) * radius;
            const yVal = Math.sin(angleRad) * radius;
            const Icon = item.icon;

            const leftOffset = parseFloat((xVal - 16).toFixed(4));
            const topOffset = parseFloat((yVal - 16).toFixed(4));
            const leftStyle = leftOffset >= 0 ? `calc(50% + ${leftOffset}px)` : `calc(50% - ${Math.abs(leftOffset)}px)`;
            const topStyle = topOffset >= 0 ? `calc(50% + ${topOffset}px)` : `calc(50% - ${Math.abs(topOffset)}px)`;

            return (
              <div
                key={idx}
                className={cn('absolute w-8 h-8 rounded-full flex items-center justify-center border shadow-sm transition-colors',
                  idx === activeIdx ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'
                )}
                style={{
                  left: leftStyle,
                  top: topStyle,
                  transform: `rotate(${-angleDeg}deg)`,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="absolute bottom-3 flex flex-col items-center gap-0.5">
        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{orbits[activeIdx].label}</span>
        <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide">Drag to spin orbits</span>
      </div>
    </div>
  );
};
