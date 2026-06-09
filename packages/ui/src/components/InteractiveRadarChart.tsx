"use client";

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { cn } from '../lib/cn';

export interface InteractiveRadarChartProps {
  className?: string;
}

export const InteractiveRadarChart: React.FC<InteractiveRadarChartProps> = ({
  className,
}) => {
  const [metrics, setMetrics] = useState({
    Performance: 80,
    Efficiency: 65,
    Reliability: 90,
    Security: 75,
    Haptics: 85,
  });

  const keys = Object.keys(metrics) as Array<keyof typeof metrics>;
  const svgSize = 180;
  const center = svgSize / 2;

  const handleNodeDrag = (key: keyof typeof metrics, clientX: number, clientY: number, containerRect: DOMRect) => {
    const x = clientX - containerRect.left - center;
    const y = clientY - containerRect.top - center;
    const dist = Math.sqrt(x * x + y * y);
    // Convert distance to range 0-100
    const val = Math.max(10, Math.min(100, Math.round((dist / (svgSize * 0.45)) * 100)));
    setMetrics(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[340px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-between p-4 select-none overflow-hidden', className)}>
      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Radar Scrubber</span>

      <div className="relative w-44 h-44 flex items-center justify-center mt-2">
        <svg width={svgSize} height={svgSize} className="absolute overflow-visible">
          {/* Radial grid circles */}
          {[0.25, 0.5, 0.75, 1].map((scale, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={(svgSize * 0.4) * scale}
              fill="none"
              stroke="currentColor"
              className="text-border/40"
              strokeWidth="1"
            />
          ))}

          {/* Polygon connecting metrics */}
          <polygon
            points={keys.map((key, idx) => {
              const angleRad = (idx * 72 * Math.PI) / 180 - Math.PI / 2;
              const radius = (svgSize * 0.4) * (metrics[key] / 100);
              const x = center + Math.cos(angleRad) * radius;
              const y = center + Math.sin(angleRad) * radius;
              return `${x},${y}`;
            }).join(' ')}
            fill="currentColor"
            className="text-primary/10"
            stroke="currentColor"
            strokeWidth="2"
          />

          {/* Radial axis lines */}
          {keys.map((key, idx) => {
            const angleRad = (idx * 72 * Math.PI) / 180 - Math.PI / 2;
            const x = center + Math.cos(angleRad) * (svgSize * 0.4);
            const y = center + Math.sin(angleRad) * (svgSize * 0.4);
            return (
              <line
                key={idx}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="currentColor"
                className="text-border/40"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* Grab nodes overlay */}
        {keys.map((key, idx) => {
          const angleRad = (idx * 72 * Math.PI) / 180 - Math.PI / 2;
          const radius = (svgSize * 0.4) * (metrics[key] / 100);
          const x = center + Math.cos(angleRad) * radius;
          const y = center + Math.sin(angleRad) * radius;

          return (
            <motion.div
              key={key}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onDrag={(e) => {
                const ev = e as PointerEvent;
                const rect = (ev.target as HTMLElement | null)?.parentElement?.getBoundingClientRect();
                if (!rect) return;
                handleNodeDrag(key, ev.clientX, ev.clientY, rect);
              }}
              style={{ x: x - center, y: y - center }}
              className="absolute w-3.5 h-3.5 rounded-full border-2 border-primary bg-card cursor-grab active:cursor-grabbing shadow-md z-20 flex items-center justify-center"
            >
              <div className="w-1 h-1 rounded-full bg-primary" />
            </motion.div>
          );
        })}
      </div>

      <div className="w-full grid grid-cols-5 gap-1 text-[8px] font-black text-muted-foreground text-center uppercase tracking-wider">
        {keys.map(key => (
          <div key={key} className="flex flex-col gap-0.5">
            <span className="text-primary leading-none font-extrabold">{metrics[key]}</span>
            <span className="text-[6.5px] scale-90">{key.slice(0, 4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
