'use client';

import React from 'react';
import { Sparkles, Cpu, Database } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PortfolioBentoFeature {
  tag: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface BentoStat {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface BentoBoxVisualPortfolioProps {
  className?: string;
  /** Featured large card content. */
  feature?: PortfolioBentoFeature;
  /** Small statistic cards (up to two). */
  stats?: [BentoStat, BentoStat];
  /** Header label. */
  label?: string;
  /** Footer label. */
  footer?: string;
}

const DEFAULT_FEATURE: PortfolioBentoFeature = {
  tag: "Core",
  title: "Core Layer",
  desc: "Adaptive spring vectors routing multi-agent workloads elastically.",
  icon: Sparkles,
};

const DEFAULT_STATS: [BentoStat, BentoStat] = [
  { value: "99.8%", label: "Precision", icon: Cpu },
  { value: "0.4ms", label: "Latency", icon: Database },
];

export const BentoBoxVisualPortfolio: React.FC<BentoBoxVisualPortfolioProps> = ({
  className,
  feature = DEFAULT_FEATURE,
  stats = DEFAULT_STATS,
  label = "Bento Portfolio Block",
  footer = "Bento Grid responsive structure",
}) => {
  const FeatureIcon = feature.icon;
  const StatOneIcon = stats[0].icon;
  const StatTwoIcon = stats[1].icon;
  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>

      <div className="grid grid-cols-3 gap-2.5 w-full h-[200px] overflow-hidden my-auto py-2">
        {/* Large Grid Item */}
        <div className="col-span-2 row-span-2 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/60 to-indigo-950/60 p-3 flex flex-col justify-between text-white shadow-lg overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <FeatureIcon className="w-4 h-4 text-purple-200" />
            <span className="text-[6px] font-mono tracking-widest bg-white/20 px-1 py-0.5 rounded uppercase">{feature.tag}</span>
          </div>
          <div>
            <h4 className="text-[10px] font-black tracking-wide leading-tight">{feature.title}</h4>
            <p className="text-[6.5px] opacity-80 leading-normal mt-0.5">{feature.desc}</p>
          </div>
        </div>

        {/* Small Grid Item 1 */}
        <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-tr from-blue-900/60 to-cyan-950/60 p-2.5 flex flex-col justify-between text-white shadow-lg overflow-hidden group">
          <StatOneIcon className="w-3.5 h-3.5 text-blue-200" />
          <div>
            <span className="text-[7.5px] font-black tracking-wide leading-tight block">{stats[0].value}</span>
            <span className="text-[5.5px] text-blue-200 uppercase font-black tracking-wider leading-none">{stats[0].label}</span>
          </div>
        </div>

        {/* Small Grid Item 2 */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-bl from-emerald-900/60 to-teal-950/60 p-2.5 flex flex-col justify-between text-white shadow-lg overflow-hidden group">
          <StatTwoIcon className="w-3.5 h-3.5 text-emerald-200" />
          <div>
            <span className="text-[7.5px] font-black tracking-wide leading-tight block">{stats[1].value}</span>
            <span className="text-[5.5px] text-emerald-200 uppercase font-black tracking-wider leading-none">{stats[1].label}</span>
          </div>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">{footer}</span>
    </div>
  );
};
