"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring} from "framer-motion";
import { cn } from '../lib/cn';
import { TrendingUp, ShieldCheck } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
}

interface BentoStatsOverviewProps {
  title?: string;
  value?: string;
  change?: string;
  isPositive?: boolean;
  data?: DataPoint[];
  className?: string;
  height?: number;
}

const defaultChartData: DataPoint[] = [
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: 4800 },
  { label: 'Mar', value: 4500 },
  { label: 'Apr', value: 5900 },
  { label: 'May', value: 5100 },
  { label: 'Jun', value: 6800 },
  { label: 'Jul', value: 7200 },
  { label: 'Aug', value: 6900 },
  { label: 'Sep', value: 8400 },
  { label: 'Oct', value: 9200 },
  { label: 'Nov', value: 8900 },
  { label: 'Dec', value: 10500 },
];

export const BentoStatsOverview: React.FC<BentoStatsOverviewProps> = ({
  title = 'Platform Analytics',
  value = '$124,892.40',
  change = '+14.2%',
  isPositive = true,
  data = defaultChartData,
  className,
  height = 160,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // ResizeObserver to safely read SVG dimensions
  useEffect(() => {
    if (!svgRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height || height,
        });
      }
    });
    observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, [height]);

  // Motion values for tracking cursor guide line and dot
  const springConfig = { stiffness: 350, damping: 25, mass: 0.5 };
  const trackerX = useSpring(useMotionValue(0), springConfig);
  const trackerY = useSpring(useMotionValue(0), springConfig);

  // SVG dimensions for coordinates
  const svgWidth = dimensions.width;
  const svgHeight = dimensions.height;

  // Max and Min values to scale Y coordinates
  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values) * 1.1;
  const minValue = Math.min(...values) * 0.9;
  const valueRange = maxValue - minValue || 1;

  // Construct points array for the SVG path
  const points = data.map((d, i) => {
    const x = svgWidth > 0 ? (i / (data.length - 1)) * svgWidth : 0;
    const y = svgHeight > 0 ? svgHeight - ((d.value - minValue) / valueRange) * svgHeight : 0;
    return { x, y, value: d.value, label: d.label };
  });

  // SVG Area path syntax
  const linePath = points.length > 0 
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`
    : '';

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || points.length === 0) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;

    // Find the nearest point index based on cursor X location
    let nearestIndex = 0;
    let minDistance = Infinity;

    points.forEach((p, idx) => {
      const distance = Math.abs(p.x - cursorX);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = idx;
      }
    });

    setHoverIndex(nearestIndex);
    trackerX.set(points[nearestIndex].x);
    trackerY.set(points[nearestIndex].y);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-md transition-shadow duration-300 hover:shadow-xl select-none flex flex-col justify-between min-h-[340px] group',
        className
      )}
    >
      {/* Glow highlight in bento header */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/15 transition-all duration-500" />

      {/* Stats Header Block */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-foreground tracking-tight mt-1">
            {hoverIndex !== null ? `$${points[hoverIndex].value.toLocaleString()}` : value}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span
              className={cn(
                'font-bold px-1.5 py-0.5 rounded-full border',
                isPositive 
                  ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' 
                  : 'text-red-500 bg-red-500/10 border-red-500/20'
              )}
            >
              {change}
            </span>
            <span className="text-muted-foreground">
              {hoverIndex !== null ? `(${points[hoverIndex].label})` : 'vs last month'}
            </span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border flex items-center justify-center text-primary group-hover:scale-115 transition-transform duration-300">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Sparkline Graphic Area */}
      <div className="relative w-full mt-6" style={{ height }}>
        <svg
          ref={svgRef}
          className="w-full h-full cursor-crosshair overflow-visible z-10 relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Sparkline line glow filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Gradient fill */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(var(--primary, 99, 102, 241), 0.25)" />
              <stop offset="100%" stopColor="rgba(var(--primary, 99, 102, 241), 0)" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal representation) */}
          {svgHeight > 0 && (
            <>
              <line x1="0" y1={svgHeight * 0.25} x2={svgWidth} y2={svgHeight * 0.25} stroke="var(--border)" strokeDasharray="3 3" opacity="0.4" />
              <line x1="0" y1={svgHeight * 0.5} x2={svgWidth} y2={svgHeight * 0.5} stroke="var(--border)" strokeDasharray="3 3" opacity="0.4" />
              <line x1="0" y1={svgHeight * 0.75} x2={svgWidth} y2={svgHeight * 0.75} stroke="var(--border)" strokeDasharray="3 3" opacity="0.4" />
            </>
          )}

          {/* Sparkline Area Fill */}
          {areaPath && (
            <path d={areaPath} fill="url(#chartGradient)" />
          )}

          {/* Sparkline Glow Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="rgba(99, 102, 241, 1)" // standard theme primary color
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
          )}

          {/* Interactive Guide Tracking elements */}
          {hoverIndex !== null && svgHeight > 0 && (
            <>
              {/* Vertical Guide Line */}
              <motion.line
                x1={trackerX}
                y1={0}
                x2={trackerX}
                y2={svgHeight}
                stroke="rgba(99, 102, 241, 0.4)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Glowing Interactive Tracker Dot */}
              <motion.circle
                cx={trackerX}
                cy={trackerY}
                r="6"
                fill="rgba(99, 102, 241, 1)"
                stroke="white"
                strokeWidth="2"
                style={{
                  filter: 'drop-shadow(0px 0px 6px rgba(99, 102, 241, 0.8))',
                }}
              />
            </>
          )}
        </svg>
      </div>

      {/* Stats Bottom Verification Badge */}
      <div className="flex items-center gap-2 border-t border-border/40 pt-4 mt-2 text-[10px] text-muted-foreground select-none">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span className="font-semibold tracking-wider">LIVE DATA FEED VERIFIED</span>
      </div>
    </div>
  );
};
export default BentoStatsOverview;
