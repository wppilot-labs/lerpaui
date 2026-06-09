"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Database, Cpu, ArrowRight } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface AISchemaVisualizerProps {
  className?: string;
}

const MOCK_SCHEMA = [
  { key: "id", type: "UUID", desc: "Unique identity primary key" },
  { key: "name", type: "String", desc: "User profile full username" },
  { key: "status", type: "Enum", desc: "Account subscription status state" },
  { key: "latency", type: "Float", desc: "Simulated neural query execution delay" },
  { key: "payload", type: "JSON", desc: "Structured contextual meta payload" },
  { key: "metadata", type: "Array", desc: "Secondary nested parameter keys" }
];

export const AISchemaVisualizer: React.FC<AISchemaVisualizerProps> = ({ className }) => {
  const [nodes, setNodes] = useState<Array<{ key: string; type: string; desc: string }>>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isStreaming) return;
    setNodes([]);
    let current = 0;
    const interval = setInterval(() => {
      if (current < MOCK_SCHEMA.length) {
        const nextNode = MOCK_SCHEMA[current];
        if (nextNode) {
          setNodes(prev => [...prev, nextNode]);
        }
        current++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className={cn('w-full max-w-[340px] p-5 border border-border bg-card/85 backdrop-blur-md rounded-2xl select-none relative overflow-hidden shadow-xl', className)}>
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Database className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">JSON Schema Stream</span>
        </div>
        <button
          type="button"
          onClick={() => setIsStreaming(true)}
          className="text-[9px] font-black uppercase bg-secondary/80 hover:bg-secondary border border-border px-2 py-0.5 rounded-lg cursor-pointer"
        >
          {isStreaming ? 'Streaming...' : 'Re-Run Stream'}
        </button>
      </div>

      <div className="space-y-2.5 relative min-h-[220px]">
        <AnimatePresence>
          {nodes.filter(Boolean).map((node) => (
            <motion.div
              key={node.key}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -15, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 20 }}
              className="p-2.5 border border-border/60 bg-card rounded-xl flex items-center justify-between relative shadow-sm"
            >
              {/* Connector dot */}
              <div className="absolute left-[-11px] w-2 h-2 rounded-full bg-primary/60 border border-card" />
              
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-foreground font-mono">{node.key}</span>
                  <span className="text-[8px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider font-mono">{node.type}</span>
                </div>
                <span className="text-[9px] text-muted-foreground font-semibold">{node.desc}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/45" />
            </motion.div>
          ))}
        </AnimatePresence>

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-40">
            <Cpu className="w-8 h-8 mb-2 animate-spin-slow text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Listening for Stream...</span>
          </div>
        )}
      </div>
    </div>
  );
};
