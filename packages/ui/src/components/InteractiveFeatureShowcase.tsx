"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { LayoutDashboard, Terminal, Globe } from 'lucide-react';
import { cn } from '../lib/cn';

export interface InteractiveFeatureShowcaseProps {
  className?: string;
}

export const InteractiveFeatureShowcase: React.FC<InteractiveFeatureShowcaseProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: "Control Panel", icon: LayoutDashboard, desc: "Visual studio mapping all dynamic oklch CSS color scales presets on live cards." },
    { title: "Terminal CLI", icon: Terminal, desc: "Aggregates, validates, and downloads standard TypeScript react hooks straight to workspace." },
    { title: "Gateway API", icon: Globe, desc: "Stream JSON property nodes from custom OpenAI or Anthropic models in high-performance runs." }
  ];

  return (
    <div className={cn('w-full max-w-[340px] p-5 border border-border bg-card/85 backdrop-blur-md shadow-lg rounded-2xl select-none flex flex-col gap-4 relative', className)}>
      <div className="flex items-center gap-1.5 pb-2.5 border-b border-border/40 w-full mb-1">
        <LayoutDashboard className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Product Showcase</span>
      </div>

      {/* Sidebar tab selection pills */}
      <div className="flex gap-1.5 bg-secondary/40 border border-border/30 p-0.5 rounded-xl">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === idx;
          const Icon = tab.icon;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={cn(
                'flex-1 py-2 rounded-lg flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer select-none',
                isActive ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-[8px] font-bold uppercase tracking-wider">{tab.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic mockup presentation window */}
      <div className="min-h-[110px] border border-border/60 bg-card rounded-xl p-4 flex flex-col justify-center relative overflow-hidden shadow-sm">
        {/* Abstract design elements background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-1.5"
          >
            <span className="text-xs font-black text-foreground">{tabs[activeTab].title}</span>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {tabs[activeTab].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
