"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring} from "framer-motion";
import { Compass, Settings, User, Mail, Bell, RotateCw } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CircularMenuDialProps {
  onSelect?: (idx: number) => void;
  className?: string;
}

export const CircularMenuDial: React.FC<CircularMenuDialProps> = ({
  onSelect,
  className,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const rot = useMotionValue(0);
  const springRot = useSpring(rot, { stiffness: 120, damping: 20 });

  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [startRot, setStartRot] = useState(0);

  const menuItems = [
    { icon: Compass, label: 'Explore' },
    { icon: Settings, label: 'Settings' },
    { icon: User, label: 'Profile' },
    { icon: Mail, label: 'Messages' },
    { icon: Bell, label: 'Alerts' },
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
    
    const delta = angleDeg - startAngle;
    rot.set(startRot + delta);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) { /* noop */ }

    // Snap to nearest 72 deg slice (360 / 5)
    const currentRot = rot.get();
    const nearestIdx = Math.round(currentRot / 72);
    rot.set(nearestIdx * 72);
    
    // Normalize index
    let normalized = -nearestIdx % 5;
    if (normalized < 0) normalized += 5;
    
    setActiveIdx(normalized);
    onSelect?.(normalized);
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[280px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-center select-none overflow-hidden', className)}>
      <div className="absolute top-4 flex flex-col items-center z-10">
        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Dial Menu</span>
        <h4 className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-3 py-0.5 rounded-full uppercase tracking-wider">{menuItems[activeIdx].label}</h4>
      </div>

      <div className="relative w-44 h-44 flex items-center justify-center rounded-full mt-4">
        {/* Core wheel path */}
        <motion.div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ rotate: springRot }}
          className="w-full h-full rounded-full border-4 border-border bg-card flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg relative touch-none"
        >
          <RotateCw className="w-6 h-6 text-muted-foreground/35 animate-spin" style={{ animationDuration: '8s' }} />

          {/* Place five icons circular wise */}
          {menuItems.map((item, idx) => {
            const angleDeg = idx * 72;
            const angleRad = (angleDeg * Math.PI) / 180;
            const radius = 56;
            const xVal = Math.cos(angleRad) * radius;
            const yVal = Math.sin(angleRad) * radius;
            const Icon = item.icon;

            const leftOffset = parseFloat((xVal - 18).toFixed(4));
            const topOffset = parseFloat((yVal - 18).toFixed(4));
            const leftStyle = leftOffset >= 0 ? `calc(50% + ${leftOffset}px)` : `calc(50% - ${Math.abs(leftOffset)}px)`;
            const topStyle = topOffset >= 0 ? `calc(50% + ${topOffset}px)` : `calc(50% - ${Math.abs(topOffset)}px)`;

            return (
              <div
                key={idx}
                className={cn('absolute w-9 h-9 rounded-full flex items-center justify-center transition-colors border shadow-sm',
                  idx === activeIdx 
                    ? 'border-primary bg-primary text-primary-foreground' 
                    : 'border-border bg-secondary/30 text-muted-foreground'
                )}
                style={{
                  left: leftStyle,
                  top: topStyle,
                  transform: `rotate(${-angleDeg}deg)`, // Keep icon level
                }}
              >
                <Icon className="w-4 h-4" />
              </div>
            );
          })}
        </motion.div>
      </div>

      <span className="absolute bottom-3 text-[9px] text-muted-foreground font-extrabold uppercase tracking-wide">Drag wheel to rotate dial</span>
    </div>
  );
};
