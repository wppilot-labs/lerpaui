"use client";

import React, { useState, useEffect } from 'react';
import { Bot, Zap, Coins, Clock, RefreshCw } from 'lucide-react';
import { cn } from '../lib/cn';

export interface AgentConfig {
  id: string;
  name: string;
  model: string;
  avatar?: React.ReactNode;
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';
  response: string;
  metrics?: {
    timeToFirstToken?: string; // e.g., "120ms"
    tokensPerSecond?: number;   // e.g., 55
    cost?: string;             // e.g., "$0.0015"
  };
}

export interface MultiAgentConversationalPanelProps {
  prompt: string;
  agents: AgentConfig[];
  onRegenerateAll?: () => void;
  className?: string;
}

export const MultiAgentConversationalPanel: React.FC<MultiAgentConversationalPanelProps> = ({
  prompt,
  agents,
  onRegenerateAll,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<'compare' | string>('compare');
  const _prefersReducedMotion = usePrefersReducedMotion();

  // Color helper mappings for borders/glows
  const colorMaps = {
    blue: {
      border: 'border-blue-500/30 hover:border-blue-500/50',
      bg: 'bg-blue-500/10',
      text: 'text-blue-500',
      shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]',
      gradient: 'from-blue-500/20 to-transparent',
    },
    emerald: {
      border: 'border-emerald-500/30 hover:border-emerald-500/50',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-500',
      shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      gradient: 'from-emerald-500/20 to-transparent',
    },
    purple: {
      border: 'border-purple-500/30 hover:border-purple-500/50',
      bg: 'bg-purple-500/10',
      text: 'text-purple-500',
      shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
      gradient: 'from-purple-500/20 to-transparent',
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-500/50',
      bg: 'bg-amber-500/10',
      text: 'text-amber-500',
      shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      gradient: 'from-amber-500/20 to-transparent',
    },
    rose: {
      border: 'border-rose-500/30 hover:border-rose-500/50',
      bg: 'bg-rose-500/10',
      text: 'text-rose-500',
      shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]',
      gradient: 'from-rose-500/20 to-transparent',
    },
  };

  // Find the fastest agent
  const fastestAgentId = (() => {
    let maxTps = 0;
    let winnerId = '';
    agents.forEach(a => {
      if (a.metrics?.tokensPerSecond && a.metrics.tokensPerSecond > maxTps) {
        maxTps = a.metrics.tokensPerSecond;
        winnerId = a.id;
      }
    });
    return winnerId;
  })();

  return (
    <div className={cn("w-full rounded-3xl border border-border bg-card/45 backdrop-blur-xl shadow-lg p-5 flex flex-col gap-6", className)}>
      {/* Header comparing query */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div className="flex-1 space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full inline-block">
            Comparative Query
          </span>
          <p className="text-sm font-semibold text-foreground italic leading-relaxed">
            &quot;{prompt}&quot;
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex bg-muted rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('compare')}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-all duration-200",
                activeTab === 'compare' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Side-by-Side
            </button>
            {agents.map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => setActiveTab(a.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-medium transition-all duration-200",
                  activeTab === a.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {a.name}
              </button>
            ))}
          </div>

          {onRegenerateAll && (
            <button
              type="button"
              onClick={onRegenerateAll}
              className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80 transition-all hover:rotate-180 duration-500"
              title="Regenerate all"
              aria-label="Regenerate all"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Agents Responses Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {agents.map(agent => {
          const map = colorMaps[agent.color] || colorMaps.blue;
          const isWinner = agent.id === fastestAgentId;
          const shouldShow = activeTab === 'compare' || activeTab === agent.id;

          if (!shouldShow) return null;

          return (
            <div
              key={agent.id}
              className={cn(
                "flex flex-col rounded-2xl border bg-card/30 backdrop-blur-md overflow-hidden transition-all duration-300",
                map.border,
                map.shadow,
                activeTab !== 'compare' && "col-span-full"
              )}
            >
              {/* Agent Bubble Header */}
              <div className="p-4 border-b border-border/40 flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3">
                  {agent.avatar ? (
                    agent.avatar
                  ) : (
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", map.bg, map.border, map.text)}>
                      <Bot className="h-4.5 w-4.5" />
                    </div>
                  )}
                  <div>
                    <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      {agent.name}
                      {isWinner && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold flex items-center gap-0.5">
                          <Zap className="h-2 w-2" /> Fastest
                        </span>
                      )}
                    </h5>
                    <p className="text-[9px] text-muted-foreground font-mono">{agent.model}</p>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border/60">
                    A/B Test
                  </span>
                </div>
              </div>

              {/* Response Text Box */}
              <div className="p-4 flex-1 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap min-h-[140px] bg-gradient-to-b from-transparent to-card/10">
                {agent.response}
              </div>

              {/* Performance Metrics Dashboard Footer */}
              {agent.metrics && (
                <div className="p-3 border-t border-border/40 bg-muted/25 flex flex-wrap gap-x-4 gap-y-2 items-center justify-between text-[11px] text-muted-foreground font-mono">
                  {agent.metrics.timeToFirstToken && (
                    <div className="flex items-center gap-1" title="Time to first token">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{agent.metrics.timeToFirstToken}</span>
                    </div>
                  )}
                  {agent.metrics.tokensPerSecond && (
                    <div className="flex items-center gap-1" title="Tokens per second">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <span className="font-semibold text-foreground">
                        {agent.metrics.tokensPerSecond} t/s
                      </span>
                    </div>
                  )}
                  {agent.metrics.cost && (
                    <div className="flex items-center gap-1" title="Est. cost">
                      <Coins className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{agent.metrics.cost}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
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
