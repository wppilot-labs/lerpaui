"use client";

import React, { useState } from 'react';

import { Command, Search, CornerDownLeft } from 'lucide-react';
import { cn } from '../lib/cn';

export interface AICommandPaletteMenuProps {
  className?: string;
}

export const AICommandPaletteMenu: React.FC<AICommandPaletteMenuProps> = ({ className }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const options = [
    { label: "Generate prompt", hotkey: "G", desc: "Launch AI prompt assistant dashboard" },
    { label: "Sync components registry", hotkey: "S", desc: "Build aggregated json schema layouts" },
    { label: "Deploy mockup sandbox", hotkey: "D", desc: "Push visual pages code to production staging" },
    { label: "Configure API connection", hotkey: "C", desc: "Set neural rate limits parameters keys" }
  ];

  const filtered = options.filter(opt => 
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={cn('w-full max-w-[340px] border border-border bg-card/85 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl select-none', className)}>
      {/* Search Input bar */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/40 bg-secondary/10">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
          placeholder="Type command search..." 
          className="bg-transparent border-none outline-none text-xs text-foreground placeholder:text-muted-foreground w-full font-semibold"
        />
        <Command className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
      </div>

      {/* Results grid */}
      <div className="p-2 space-y-1 max-h-[220px] overflow-y-auto">
        {filtered.map((opt, idx) => {
          const isActive = selectedIndex === idx;
          return (
            <div
              key={opt.label}
              role="button"
              tabIndex={0}
              onMouseEnter={() => setSelectedIndex(idx)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedIndex(idx); } }}
              className={cn(
                'p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all',
                isActive ? 'bg-primary/10 border-primary/25 text-foreground' : 'border-transparent hover:bg-secondary/40 text-muted-foreground'
              )}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-extrabold text-foreground">{opt.label}</span>
                <span className="text-[9px] text-muted-foreground font-semibold leading-none">{opt.desc}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border font-mono uppercase">
                  {"⌘" + opt.hotkey}
                </span>
                {isActive && <CornerDownLeft className="w-3 h-3 text-primary animate-pulse" />}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-8 text-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            No commands match your query
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t border-border/40 bg-secondary/20 text-[9px] text-muted-foreground font-semibold">
        <span>Use cursor to navigate</span>
        <div className="flex items-center gap-1">
          <span>Enter to execute</span>
          <CornerDownLeft className="w-2.5 h-2.5" />
        </div>
      </div>
    </div>
  );
};
