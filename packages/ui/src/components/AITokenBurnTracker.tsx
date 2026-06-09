"use client";

import React, { useEffect, useState } from 'react';

import { Cpu, Zap, TrendingDown } from 'lucide-react';
import { cn } from '../lib/cn';

export interface AITokenBurnTrackerProps {
  initialTokens?: number;
  burnRate?: number; // tokens per second
  className?: string;
}

export const AITokenBurnTracker: React.FC<AITokenBurnTrackerProps> = ({
  initialTokens = 450000,
  burnRate = 120,
  className,
}) => {
  const [tokens, setTokens] = useState(initialTokens);
  const [history, setHistory] = useState<number[]>(Array(15).fill(initialTokens));

  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(prev => {
        const next = Math.max(0, prev - Math.floor(Math.random() * burnRate * 2));
        setHistory(h => [...h.slice(1), next]);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [burnRate]);

  // Sparkline calculation
  const max = Math.max(...history);
  const min = Math.min(...history);
  const range = max - min || 1;
  const points = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * 140;
    const y = 35 - ((val - min) / range) * 30;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={cn('p-5 rounded-2xl border border-border bg-card shadow-lg select-none max-w-[320px] relative overflow-hidden backdrop-blur-md bg-card/75', className)}>
      {/* Glow highlight */}
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Token Balance</span>
        </div>
        <div className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
          <Zap className="w-3 h-3" />
          <span>Burn Active</span>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
          {tokens.toLocaleString()}
        </span>
        <span className="text-[10px] text-muted-foreground ml-1.5 font-bold">Llama-3-70B</span>
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-4">
        {/* Sparkline chart */}
        <div className="h-10 w-[140px] flex items-center">
          <svg className="overflow-visible" width="140" height="35">
            <defs>
              <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(var(--p))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="oklch(var(--p))" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={`M 0,35 L ${points} L 140,35 Z`}
              fill="url(#sparklineGrad)"
            />
            <polyline
              fill="none"
              stroke="oklch(var(--p))"
              strokeWidth="2"
              points={points}
            />
          </svg>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Average Rate</span>
          <span className="text-xs font-black text-rose-400 mt-0.5 flex items-center gap-0.5">
            <TrendingDown className="w-3 h-3" />
            ~{burnRate} t/s
          </span>
        </div>
      </div>
    </div>
  );
};
