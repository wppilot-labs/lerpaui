"use client";

import React, { useState, useEffect } from 'react';

import { Activity, Server } from 'lucide-react';
import { cn } from '../lib/cn';

export type StatusNodeState = 'online' | 'warning' | 'offline';

export interface StatusNode {
  name: string;
  status: StatusNodeState;
  /** Latency display string (e.g. "24ms"). */
  latency: string;
}

export interface GlowingStatusGridProps {
  className?: string;
  /** Nodes to display. */
  nodes?: StatusNode[];
  /** Header label. */
  label?: string;
  /** When true (default), online nodes jitter their latency over time. */
  simulate?: boolean;
}

const DEFAULT_NODES: StatusNode[] = [
  { name: "API Gateway", status: "online", latency: "24ms" },
  { name: "Auth Service", status: "online", latency: "14ms" },
  { name: "Catalog", status: "warning", latency: "128ms" },
  { name: "Storage", status: "online", latency: "38ms" },
  { name: "Vector Cache", status: "online", latency: "8ms" },
  { name: "Staging", status: "offline", latency: "0ms" }
];

export const GlowingStatusGrid: React.FC<GlowingStatusGridProps> = ({
  className,
  nodes: initialNodes = DEFAULT_NODES,
  label = "Cluster Health",
  simulate = true,
}) => {
  const [nodes, setNodes] = useState<StatusNode[]>(initialNodes);

  useEffect(() => {
    if (!simulate) return;
    const interval = setInterval(() => {
      setNodes(nodes => nodes.map(node => {
        if (node.status === 'online') {
          const lat = Math.max(5, parseInt(node.latency) + Math.floor(Math.random() * 8 - 4));
          return { ...node, latency: lat + "ms" };
        }
        return node;
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, [simulate]);

  const operational = nodes.filter(n => n.status !== 'offline').length;

  return (
    <div className={cn('p-5 rounded-2xl border border-border bg-card/85 backdrop-blur-md shadow-lg select-none max-w-[340px] relative', className)}>
      <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3.5">
        <div className="flex items-center gap-1.5">
          <Server className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-1 text-[8.5px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          {operational} / {nodes.length} Operational
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {nodes.map(node => {
          const stateColor = node.status === 'online' ? 'border-emerald-500/25 bg-emerald-950/10 text-emerald-400' :
                             node.status === 'warning' ? 'border-amber-500/25 bg-amber-950/10 text-amber-400' : 
                             'border-rose-500/25 bg-rose-950/10 text-rose-400';
          
          return (
            <div 
              key={node.name}
              className={cn('p-3 border rounded-xl flex flex-col gap-2 relative shadow-sm transition-colors duration-300', stateColor)}
            >
              {/* Pulsing indicator light */}
              <div className="absolute top-3 right-3 flex items-center justify-center">
                <span className={cn('w-2 h-2 rounded-full absolute', 
                  node.status === 'online' ? 'bg-emerald-400 animate-ping' :
                  node.status === 'warning' ? 'bg-amber-400 animate-ping' : 'bg-rose-400'
                )} />
                <span className={cn('w-2 h-2 rounded-full border border-card relative z-10', 
                  node.status === 'online' ? 'bg-emerald-500' :
                  node.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                )} />
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-extrabold text-foreground">{node.name}</span>
                <span className="text-[8px] uppercase tracking-wider font-bold opacity-60">Status: {node.status}</span>
              </div>
              <span className="text-[9px] font-bold font-mono opacity-80 mt-1">{node.latency}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
