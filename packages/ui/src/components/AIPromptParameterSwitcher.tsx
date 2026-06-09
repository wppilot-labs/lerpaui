"use client";

import React, { useState, useEffect } from 'react';
import { Sliders, Shield, Zap } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface AIPromptParameterSwitcherProps {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  onChange?: (params: { temperature: number; maxTokens: number; topP: number }) => void;
  className?: string;
}

export const AIPromptParameterSwitcher: React.FC<AIPromptParameterSwitcherProps> = ({
  temperature: initialTemp = 0.7,
  maxTokens: initialTokens = 2048,
  topP: initialTopP = 0.9,
  onChange,
  className,
}) => {
  const [temp, setTemp] = useState(initialTemp);
  const [tokens, setTokens] = useState(initialTokens);
  const [topP, setTopP] = useState(initialTopP);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setTemp(initialTemp);
  }, [initialTemp]);

  useEffect(() => {
    setTokens(initialTokens);
  }, [initialTokens]);

  useEffect(() => {
    setTopP(initialTopP);
  }, [initialTopP]);

  const handleParamChange = (newTemp: number, newTokens: number, newTopP: number) => {
    setTemp(newTemp);
    setTokens(newTokens);
    setTopP(newTopP);
    onChange?.({ temperature: newTemp, maxTokens: newTokens, topP: newTopP });
  };

  const applyPreset = (presetType: 'precise' | 'balanced' | 'creative') => {
    if (presetType === 'precise') {
      handleParamChange(0.2, 1024, 0.95);
    } else if (presetType === 'balanced') {
      handleParamChange(0.7, 2048, 0.9);
    } else if (presetType === 'creative') {
      handleParamChange(1.3, 4096, 0.85);
    }
  };

  // Temperature description tag
  const getTempDescription = (val: number) => {
    if (val < 0.4) return { text: 'Deterministic & Precise', color: 'text-emerald-500 bg-emerald-500/10' };
    if (val < 0.9) return { text: 'Balanced & Natural', color: 'text-sky-500 bg-sky-500/10' };
    return { text: 'Creative & Imaginative', color: 'text-purple-500 bg-purple-500/10' };
  };

  const tempDesc = getTempDescription(temp);

  return (
    <div className={cn(
      "p-5 rounded-2xl border border-border/60 bg-card/45 backdrop-blur-xl shadow-md w-full max-w-lg flex flex-col gap-5",
      className
    )}>
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Sliders className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">AI Parameters</h4>
            <p className="text-[10px] text-muted-foreground">Adjust creativity and size settings</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset('precise')}
            className={cn(
              "px-2.5 py-1 text-[10px] font-semibold rounded-md border transition-all duration-200",
              temp <= 0.3
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                : "border-border/60 hover:bg-muted text-muted-foreground"
            )}
          >
            Precise
          </button>
          <button
            type="button"
            onClick={() => applyPreset('balanced')}
            className={cn(
              "px-2.5 py-1 text-[10px] font-semibold rounded-md border transition-all duration-200",
              temp > 0.3 && temp <= 0.8
                ? "bg-sky-500/10 border-sky-500/30 text-sky-500"
                : "border-border/60 hover:bg-muted text-muted-foreground"
            )}
          >
            Balanced
          </button>
          <button
            type="button"
            onClick={() => applyPreset('creative')}
            className={cn(
              "px-2.5 py-1 text-[10px] font-semibold rounded-md border transition-all duration-200",
              temp > 0.8
                ? "bg-purple-500/10 border-purple-500/30 text-purple-500"
                : "border-border/60 hover:bg-muted text-muted-foreground"
            )}
          >
            Creative
          </button>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="space-y-4">
        {/* Slider 1: Temperature */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground/80 flex items-center gap-1">
              Temperature
              <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-mono font-bold", tempDesc.color)}>
                {tempDesc.text}
              </span>
            </span>
            <span className="font-mono text-[11px] font-semibold bg-muted px-1.5 py-0.5 rounded text-foreground">
              {temp.toFixed(2)}
            </span>
          </div>
          <div className="relative group/slide flex items-center h-4">
            <div className="absolute inset-y-1.5 left-0 right-0 rounded-full bg-muted overflow-hidden">
              {/* Temperature colored gradient trace */}
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-500"
                style={{ width: `${(temp / 2) * 100}%` }}
              />
            </div>
            <input
              type="range"
              aria-label="Temperature"
              min="0"
              max="2"
              step="0.01"
              value={temp}
              onChange={e => handleParamChange(parseFloat(e.target.value), tokens, topP)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {/* Custom glowing handle thumb */}
            <div
              className={cn(
                "absolute h-4 w-4 rounded-full bg-card border-2 border-primary pointer-events-none -ml-2 transition-transform group-hover/slide:scale-110",
                !prefersReducedMotion && "transition-[left]"
              )}
              style={{ left: `${(temp / 2) * 100}%`, boxShadow: '0 0 8px rgba(var(--primary-rgb), 0.6)' }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground/80 leading-normal">
            Controls predictability: lower values make replies deterministic; higher values make them creative.
          </p>
        </div>

        {/* Slider 2: Max Tokens */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground/80 flex items-center gap-1">
              Max Length
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-mono font-bold flex items-center gap-0.5">
                <Zap className="h-2 w-2" /> Tokens
              </span>
            </span>
            <span className="font-mono text-[11px] font-semibold bg-muted px-1.5 py-0.5 rounded text-foreground">
              {tokens}
            </span>
          </div>
          <div className="relative group/slide flex items-center h-4">
            <div className="absolute inset-y-1.5 left-0 right-0 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{ width: `${((tokens - 256) / (4096 - 256)) * 100}%` }}
              />
            </div>
            <input
              type="range"
              aria-label="Max length (tokens)"
              min="256"
              max="4096"
              step="16"
              value={tokens}
              onChange={e => handleParamChange(temp, parseInt(e.target.value), topP)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className={cn(
                "absolute h-4 w-4 rounded-full bg-card border-2 border-primary pointer-events-none -ml-2 transition-transform group-hover/slide:scale-110",
                !prefersReducedMotion && "transition-[left]"
              )}
              style={{ left: `${((tokens - 256) / (4096 - 256)) * 100}%`, boxShadow: '0 0 8px rgba(var(--primary-rgb), 0.6)' }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground/80 leading-normal">
            Limits size of generation: 1 token is roughly 4 characters or 0.75 words.
          </p>
        </div>

        {/* Slider 3: Top P */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground/80 flex items-center gap-1">
              Top P (Nucleus)
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-mono font-bold flex items-center gap-0.5">
                <Shield className="h-2 w-2" /> Sampling
              </span>
            </span>
            <span className="font-mono text-[11px] font-semibold bg-muted px-1.5 py-0.5 rounded text-foreground">
              {topP.toFixed(2)}
            </span>
          </div>
          <div className="relative group/slide flex items-center h-4">
            <div className="absolute inset-y-1.5 left-0 right-0 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-indigo-500"
                style={{ width: `${topP * 100}%` }}
              />
            </div>
            <input
              type="range"
              aria-label="Top P"
              min="0"
              max="1"
              step="0.01"
              value={topP}
              onChange={e => handleParamChange(temp, tokens, parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className={cn(
                "absolute h-4 w-4 rounded-full bg-card border-2 border-primary pointer-events-none -ml-2 transition-transform group-hover/slide:scale-110",
                !prefersReducedMotion && "transition-[left]"
              )}
              style={{ left: `${topP * 100}%`, boxShadow: '0 0 8px rgba(var(--primary-rgb), 0.6)' }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground/80 leading-normal">
            Controls selection diversity: only selects tokens that meet a cumulative probability threshold.
          </p>
        </div>
      </div>
    </div>
  );
};

