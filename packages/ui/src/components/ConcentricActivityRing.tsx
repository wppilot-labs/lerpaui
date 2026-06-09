"use client";

import React from 'react';
import { motion} from "framer-motion";
import { cn } from '../lib/cn';
import { Activity, Flame, Footprints } from 'lucide-react';

export interface ActivityRingData {
  label: string;
  value: number; // 0 to 100
  color: string; // Tailwind color, rgb, hex
  icon?: React.ReactNode;
}

interface ConcentricActivityRingProps {
  rings?: ActivityRingData[];
  size?: number; // Outer SVG container size in px
  strokeWidth?: number; // Width of each ring in px
  ringGap?: number; // Space between rings in px
  className?: string;
}

const defaultRings: ActivityRingData[] = [
  { label: 'Move', value: 78, color: '#f43f5e', icon: <Flame className="w-4 h-4 text-[#f43f5e]" /> },
  { label: 'Exercise', value: 58, color: '#10b981', icon: <Activity className="w-4 h-4 text-[#10b981]" /> },
  { label: 'Stand', value: 90, color: '#06b6d4', icon: <Footprints className="w-4 h-4 text-[#06b6d4]" /> },
];

export const ConcentricActivityRing: React.FC<ConcentricActivityRingProps> = ({
  rings = defaultRings,
  size = 240,
  strokeWidth = 14,
  ringGap = 4,
  className,
}) => {
  const center = size / 2;

  return (
    <div className={cn('relative flex flex-col items-center justify-center select-none', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Concentric Ring Layers */}
        <svg width={size} height={size} className="transform -rotate-90 select-none">
          {rings.map((ring, idx) => {
            // Radial size decreases for inner rings
            // Each level shifts radius inwards by (strokeWidth + gap)
            const radius = center - strokeWidth / 2 - idx * (strokeWidth + ringGap);
            const circumference = 2 * Math.PI * radius;
            
            // Calculate stroke-dashoffset
            const clampedValue = Math.max(0, Math.min(ring.value, 100));
            const offset = circumference - (clampedValue / 100) * circumference;

            return (
              <g key={idx} className="group/ring">
                {/* Background Full Track Circle */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  className="opacity-15"
                />

                {/* Animated Interactive Foreground Circular Progress Ring */}
                <motion.circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{
                    type: 'spring',
                    stiffness: 70,
                    damping: 15,
                    delay: idx * 0.15,
                  }}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{
                    transformOrigin: 'center',
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Ring central summary statistics widget */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-3xl font-extrabold text-foreground tracking-tight select-none">
            {Math.round(rings.reduce((acc, curr) => acc + curr.value, 0) / rings.length)}%
          </span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 select-none">
            AV. ACTIVITY
          </span>
        </div>
      </div>

      {/* Ring stats legend list layout */}
      <div className="flex flex-col gap-2 mt-6 w-full max-w-[200px]">
        {rings.map((ring, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 rounded-xl bg-muted/20 border border-border/50 hover:bg-muted/40 hover:border-border transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center p-1 rounded-lg bg-background/50 border border-border">
                {ring.icon}
              </span>
              <span className="text-xs font-bold text-muted-foreground uppercase">{ring.label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold font-mono text-foreground">{ring.value}%</span>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ring.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ConcentricActivityRing;
