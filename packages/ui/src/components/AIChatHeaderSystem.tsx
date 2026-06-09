"use client";

import React, { useState, useEffect } from 'react';
import { motion} from "framer-motion";
import { Network, Activity, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface AIChatHeaderSystemProps {
  botName?: string;
  className?: string;
}

export const AIChatHeaderSystem: React.FC<AIChatHeaderSystemProps> = ({
  botName = "Claude-3.5-Sonnet",
  className,
}) => {
  const [latency, setLatency] = useState(24);
  const [syncing, setSyncing] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(20 + Math.floor(Math.random() * 12));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 800);
  };

  return (
    <div className={cn('w-full border border-border bg-card/65 backdrop-blur-md px-5 py-3 rounded-2xl flex items-center justify-between shadow-sm select-none', className)}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          {/* Connection green status heartbeat dot */}
          <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping absolute" />
          </span>
        </div>
        <div>
          <h4 className="text-xs font-black text-foreground uppercase tracking-wider">{botName}</h4>
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
            <Network className="w-3 h-3 text-primary" />
            <span>Agent cluster Active</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Latency metric counter */}
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-0.5">
            <Activity className="w-2.5 h-2.5 text-primary" />
            <span>Latency</span>
          </span>
          <span className="text-xs font-bold text-foreground font-mono mt-0.5">{latency}ms</span>
        </div>

        {/* Sync manual spinner button */}
        <button
          type="button"
          onClick={triggerSync}
          aria-label="Sync connection"
          className="p-2 rounded-xl bg-secondary/50 border border-border/40 hover:border-primary/30 text-muted-foreground hover:text-foreground cursor-pointer transition-all active:scale-95"
        >
          <motion.div animate={prefersReducedMotion ? undefined : { rotate: syncing ? 360 : 0 }} transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: 'easeInOut' }}>
            <RefreshCw className="w-3.5 h-3.5" />
          </motion.div>
        </button>
      </div>
    </div>
  );
};
