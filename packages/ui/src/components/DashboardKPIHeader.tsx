"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { DollarSign, Users, Eye, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { cn } from "../lib/cn";

export interface KPICardData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  sparklineData: number[];
  icon: React.ReactNode;
}

export interface DashboardKPIHeaderProps {
  className?: string;
  data?: KPICardData[];
}

export const DashboardKPIHeader: React.FC<DashboardKPIHeaderProps> = ({ className, data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const defaultData: KPICardData[] = [
    {
      title: "Monthly Revenue",
      value: "$142,384",
      change: "+12.4%",
      isPositive: true,
      sparklineData: [45, 52, 49, 62, 58, 67, 78],
      icon: <DollarSign className="w-4 h-4 text-primary" />,
    },
    {
      title: "Active Customers",
      value: "12,948",
      change: "+8.2%",
      isPositive: true,
      sparklineData: [32, 38, 35, 42, 49, 44, 53],
      icon: <Users className="w-4 h-4 text-accent" />,
    },
    {
      title: "Page Impressions",
      value: "482,900",
      change: "-3.1%",
      isPositive: false,
      sparklineData: [85, 80, 78, 72, 74, 68, 62],
      icon: <Eye className="w-4 h-4 text-emerald-400" />,
    },
    {
      title: "API Performance",
      value: "99.98%",
      change: "+0.02%",
      isPositive: true,
      sparklineData: [99.9, 99.8, 99.95, 99.97, 99.96, 99.99, 99.98],
      icon: <Activity className="w-4 h-4 text-amber-400" />,
    },
  ];

  const cards = data || defaultData;

  // Generate SVG path for sparkline chart
  const getSvgPath = (points: number[], width: number, height: number) => {
    const minVal = Math.min(...points);
    const maxVal = Math.max(...points);
    const range = maxVal - minVal || 1;

    return points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((val - minVal) / range) * (height - 8) - 4; // Padding
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  return (
    <div className={cn("w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 select-none", className)}>
      {cards.map((card, idx) => {
        const isHovered = hoveredIndex === idx;
        const width = 120;
        const height = 40;
        const svgPath = getSvgPath(card.sparklineData, width, height);

        return (
          <div
            key={idx}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative p-6 rounded-2xl border border-border/50 bg-card/45 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer shadow-lg hover:shadow-primary/5 hover:border-primary/20"
          >
            {/* Ambient luxury radial light on hover */}
            <div
              className={cn(
                "absolute -inset-px rounded-2xl bg-radial from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 pointer-events-none",
                isHovered && "opacity-100"
              )}
            />

            {/* Top row */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {card.title}
                </span>
                <h4 className="text-2xl font-bold text-foreground mt-1 tracking-tight font-mono">
                  {card.value}
                </h4>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/55 border border-border/40 flex items-center justify-center">
                {card.icon}
              </div>
            </div>

            {/* Bottom row (trends & sparkline) */}
            <div className="flex items-end justify-between mt-2 gap-4">
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "flex items-center text-[10px] font-black py-0.5 px-2 rounded-lg",
                    card.isPositive
                      ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20"
                      : "text-destructive bg-destructive/10 border border-destructive/20"
                  )}
                >
                  {card.isPositive ? (
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-0.5" />
                  )}
                  {card.change}
                </span>
              </div>

              {/* Responsive SVG Sparkline with stroke-dashoffset drawing effect */}
              <div className="relative">
                <svg width={width} height={height} className="overflow-visible">
                  <motion.path
                    d={svgPath}
                    fill="none"
                    stroke={card.isPositive ? "rgba(16, 185, 129, 0.75)" : "rgba(239, 68, 68, 0.75)"}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                  {/* Highlight current point on hover */}
                  {isHovered && (
                    <motion.circle
                      cx={width}
                      cy={
                        height -
                        ((card.sparklineData[card.sparklineData.length - 1] -
                          Math.min(...card.sparklineData)) /
                          (Math.max(...card.sparklineData) - Math.min(...card.sparklineData) || 1)) *
                          (height - 8) -
                        4
                      }
                      r={3}
                      fill={card.isPositive ? "#10b981" : "#ef4444"}
                      className="animate-pulse"
                    />
                  )}
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
