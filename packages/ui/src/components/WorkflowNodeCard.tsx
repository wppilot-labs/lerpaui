"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { CheckCircle2, AlertTriangle, Loader2, ChevronDown, Settings, HelpCircle, Database } from 'lucide-react';
import { cn } from '../lib/cn';

export interface WorkflowNodeCardProps {
  /** Node Title */
  title: string;
  /** Subtitle / Description */
  subtitle: string;
  /** Execution status of node */
  status: 'success' | 'running' | 'failed';
  /** List of incoming handle connection names */
  inputs?: string[];
  /** List of outgoing handle connection names */
  outputs?: string[];
  /** Optional class names */
  className?: string;
  /** Optional default expanded settings accordion state */
  defaultExpanded?: boolean;
}

export const WorkflowNodeCard: React.FC<WorkflowNodeCardProps> = ({
  title,
  subtitle,
  status,
  inputs = ['Input Stream'],
  outputs = ['Output Stream'],
  className,
  defaultExpanded = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  
  // Simulated Slider States
  const [throughput, setThroughput] = useState(78);
  const [throttle, setThrottle] = useState(15);
  const [timeout, setTimeoutVal] = useState(1500);

  // Status mapping colors & symbols
  const statusConfig = {
    success: {
      border: 'border-emerald-500/50 shadow-emerald-500/10',
      glow: 'bg-emerald-500',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      label: 'Success',
    },
    running: {
      border: 'border-amber-500/50 shadow-amber-500/10',
      glow: 'bg-amber-500 animate-pulse',
      icon: <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />,
      text: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      label: 'Syncing',
    },
    failed: {
      border: 'border-rose-500/50 shadow-rose-500/10',
      glow: 'bg-rose-500 animate-ping',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      text: 'text-rose-400',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      label: 'Failed',
    },
  };

  const activeStatus = statusConfig[status] || statusConfig.success;

  return (
    <div className={cn(
      "relative w-full max-w-sm rounded-xl border bg-card text-card-foreground shadow-lg transition-all duration-300 z-10 hover:shadow-xl",
      activeStatus.border,
      className
    )}>
      {/* Node Status Glow Line Header Accent */}
      <div className={cn(
        "absolute top-0 left-6 right-6 h-[2px] blur-[1px] opacity-80",
        activeStatus.glow
      )} />

      {/* Main Node Header */}
      <div className="p-4 relative">
        {/* Connection Ports Overlay - Left Side (Inputs) */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center gap-4 -translate-x-1.5 pointer-events-none">
          {inputs.map((inputName, idx) => (
            <div key={`input-${idx}`} className="group relative flex items-center select-none pointer-events-auto">
              {/* Connector port bulb */}
              <div className="w-3 h-3 rounded-full border border-zinc-400 dark:border-zinc-700 bg-background shadow-md hover:scale-130 hover:border-primary transition-all duration-150 cursor-crosshair flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-700 group-hover:bg-primary" />
              </div>
              {/* Popover helper text on hover */}
              <span className="absolute left-4 px-2 py-0.5 rounded bg-zinc-950 text-white font-mono text-[9px] scale-0 group-hover:scale-100 origin-left transition-all duration-150 shadow-lg whitespace-nowrap z-50">
                {inputName}
              </span>
            </div>
          ))}
        </div>

        {/* Connection Ports Overlay - Right Side (Outputs) */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center gap-4 translate-x-1.5 pointer-events-none">
          {outputs.map((outputName, idx) => (
            <div key={`output-${idx}`} className="group relative flex items-center justify-end select-none pointer-events-auto">
              {/* Popover helper text on hover */}
              <span className="absolute right-4 px-2 py-0.5 rounded bg-zinc-950 text-white font-mono text-[9px] scale-0 group-hover:scale-100 origin-right transition-all duration-150 shadow-lg whitespace-nowrap z-50">
                {outputName}
              </span>
              {/* Connector port bulb */}
              <div className="w-3 h-3 rounded-full border border-zinc-400 dark:border-zinc-700 bg-background shadow-md hover:scale-130 hover:border-primary transition-all duration-150 cursor-crosshair flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-700 group-hover:bg-primary" />
              </div>
            </div>
          ))}
        </div>

        {/* Card Info Content */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary text-secondary-foreground border border-border">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              {title && <h4 className="text-sm font-semibold tracking-tight leading-tight">{title}</h4>}
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            activeStatus.badge
          )}>
            {activeStatus.icon}
            <span>{activeStatus.label}</span>
          </div>
        </div>
      </div>

      {/* Accordion Trigger Toggle */}
      <div 
        role="button" 
        tabIndex={0} 
        onClick={() => setIsOpen(!isOpen)} 
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(!isOpen); } }}
        className="border-t border-border/80 px-4 py-2 flex items-center justify-between text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none bg-muted/20 hover:bg-muted/40 transition-all rounded-b-xl"
      >
        <div className="flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5 text-primary" />
          <span>PARAMETER CONTROLS</span>
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", isOpen && "rotate-180")} />
      </div>

      {/* Expandable Accordion Slider Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden border-t border-border bg-muted/10 rounded-b-xl"
          >
            <div className="p-4 space-y-4 font-sans text-xs">
              
              {/* Slider 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-semibold flex items-center gap-1">
                    Throughput rate
                    <span title="Processing Speed operations/sec">
                      <HelpCircle className="w-3 h-3 text-muted-foreground/60" />
                    </span>
                  </span>
                  <span className="font-mono text-foreground font-bold">{throughput}/s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={throughput}
                  onChange={(e) => setThroughput(Number(e.target.value))}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Slider 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-semibold flex items-center gap-1">
                    Throttle dampening
                    <span title="Simulated delay overlay">
                      <HelpCircle className="w-3 h-3 text-muted-foreground/60" />
                    </span>
                  </span>
                  <span className="font-mono text-foreground font-bold">{throttle}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={throttle}
                  onChange={(e) => setThrottle(Number(e.target.value))}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Slider 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-semibold flex items-center gap-1">
                    Timeout threshold
                    <span title="Node trigger expiration ceiling">
                      <HelpCircle className="w-3 h-3 text-muted-foreground/60" />
                    </span>
                  </span>
                  <span className="font-mono text-foreground font-bold">{timeout}ms</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={timeout}
                  onChange={(e) => setTimeoutVal(Number(e.target.value))}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Dynamic Telemetry Info */}
              <div className="mt-2 pt-2 border-t border-border/80 flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                <span>Buffer size: {Math.round(throughput * (throttle / 100))}</span>
                <span>Latency: {Math.round(timeout / 12)}ms</span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
