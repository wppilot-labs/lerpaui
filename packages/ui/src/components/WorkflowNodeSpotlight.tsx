"use client";

import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, AlertCircle, Clock, GripHorizontal, ArrowRight } from 'lucide-react';
import { cn } from '../lib/cn';

export interface WorkflowNodeSpotlightProps {
  title: string;
  description?: string;
  status?: 'active' | 'success' | 'warning' | 'error' | 'waiting';
  processingTime?: string;
  inputs?: string[];
  outputs?: string[];
  className?: string;
}

export const WorkflowNodeSpotlight: React.FC<WorkflowNodeSpotlightProps> = ({
  title,
  description,
  status = 'active',
  processingTime = '0ms',
  inputs = [],
  outputs = [],
  className,
}) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Node Status styling config
  const statusStyles = {
    active: {
      border: 'border-blue-500/30 hover:border-blue-500/50',
      icon: <Play className="h-3.5 w-3.5 text-blue-500 animate-pulse" />,
      bg: 'bg-blue-500/10 text-blue-500',
      text: 'Active',
      spotlightColor: 'rgba(59, 130, 246, 0.12)',
    },
    success: {
      border: 'border-emerald-500/30 hover:border-emerald-500/50',
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
      bg: 'bg-emerald-500/10 text-emerald-500',
      text: 'Completed',
      spotlightColor: 'rgba(16, 185, 129, 0.12)',
    },
    warning: {
      border: 'border-amber-500/30 hover:border-amber-500/50',
      icon: <AlertCircle className="h-3.5 w-3.5 text-amber-500" />,
      bg: 'bg-amber-500/10 text-amber-500',
      text: 'Warning',
      spotlightColor: 'rgba(245, 158, 11, 0.12)',
    },
    error: {
      border: 'border-rose-500/30 hover:border-rose-500/50',
      icon: <AlertCircle className="h-3.5 w-3.5 text-rose-500" />,
      bg: 'bg-rose-500/10 text-rose-500',
      text: 'Failed',
      spotlightColor: 'rgba(244, 63, 94, 0.12)',
    },
    waiting: {
      border: 'border-muted/30 hover:border-muted-foreground/45',
      icon: <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
      bg: 'bg-muted text-muted-foreground',
      text: 'Waiting',
      spotlightColor: 'rgba(107, 114, 128, 0.08)',
    },
  };

  const styleConfig = statusStyles[status] || statusStyles.active;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-2xl border bg-card/65 backdrop-blur-md p-4 transition-all duration-300 w-full max-w-sm overflow-hidden",
        styleConfig.border,
        isHovered && !prefersReducedMotion ? "shadow-lg shadow-primary/5" : "shadow-sm",
        className
      )}
    >
      {/* Interactive Cursor Spotlight Underlay */}
      {isHovered && !prefersReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(320px circle at ${coords.x}px ${coords.y}px, ${styleConfig.spotlightColor}, transparent 80%)`,
          }}
        />
      )}

      {/* Connection Port Nodes representing Graph Wire hooks */}
      {/* Left: Input Nodes */}
      {inputs.length > 0 && (
        <div className="absolute -left-1.5 inset-y-0 flex flex-col justify-center gap-3">
          {inputs.map((input, idx) => (
            <div 
              key={`in-${idx}`}
              className="h-3 w-3 rounded-full border-2 border-background bg-border hover:bg-primary transition-all duration-200" 
              title={`Input: ${input}`} 
            />
          ))}
        </div>
      )}

      {/* Right: Output Nodes */}
      {outputs.length > 0 && (
        <div className="absolute -right-1.5 inset-y-0 flex flex-col justify-center gap-3">
          {outputs.map((output, idx) => (
            <div 
              key={`out-${idx}`}
              className={cn(
                "h-3 w-3 rounded-full border-2 border-background hover:bg-primary transition-all duration-200",
                status === 'active' ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]" : "bg-border"
              )}
              title={`Output: ${output}`} 
            />
          ))}
        </div>
      )}

      {/* Visual Drag Handle Grid */}
      <div className="flex justify-center text-muted-foreground/30 -mt-1.5 mb-2.5 cursor-grab active:cursor-grabbing">
        <GripHorizontal className="h-4 w-4" />
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-3">
        {/* Row 1: Status badge & Latency metric */}
        <div className="flex items-center justify-between">
          <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border border-border/40 leading-none", styleConfig.bg)}>
            {styleConfig.icon}
            <span>{styleConfig.text}</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-0.5" title="Execution latency">
            <Clock className="h-3 w-3" />
            {processingTime}
          </span>
        </div>

        {/* Row 2: Node Name & Details */}
        <div className="space-y-1">
          {title && (
            <h4 className="text-sm font-bold text-foreground tracking-tight">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Row 3: Parameter mappings flow summary */}
        {(inputs.length > 0 || outputs.length > 0) && (
          <div className="flex items-center gap-2 border-t border-border/40 pt-3 mt-1.5 text-[10px] text-muted-foreground font-mono">
            <span className="truncate max-w-[80px]" title={inputs.join(', ')}>
              {inputs[0] || 'void'}
            </span>
            <ArrowRight className="h-3 w-3 flex-shrink-0" />
            <span className="truncate text-foreground max-w-[80px]" title={outputs.join(', ')}>
              {outputs[0] || 'void'}
            </span>
            {(inputs.length > 1 || outputs.length > 1) && (
              <span className="ml-auto text-[9px] bg-muted px-1 rounded">
                +{Math.max(inputs.length, outputs.length) - 1} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Accessibility hook inlined at the bottom
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
}
