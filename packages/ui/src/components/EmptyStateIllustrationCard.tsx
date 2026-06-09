"use client";

import React from "react";
import { motion} from "framer-motion";
import { Sparkles, ArrowRight, FolderPlus } from "lucide-react";
import { cn } from "../lib/cn";

export interface EmptyStateIllustrationCardProps {
  className?: string;
  title?: string;
  description?: string;
  onActionClick?: () => void;
}

export const EmptyStateIllustrationCard: React.FC<EmptyStateIllustrationCardProps> = ({
  className,
  title = "No custom models loaded",
  description = "Connect external fine-tunes or API tokens to start configuring telemetry routing options.",
  onActionClick,
}) => {
  return (
    <div className={cn("w-full max-w-[420px] rounded-3xl border border-border/50 bg-card/45 p-8 backdrop-blur-xl shadow-2xl overflow-hidden select-none text-center relative flex flex-col items-center justify-center min-h-[300px]", className)}>
      {/* Glow ambient */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating high-end visual illustration mapping */}
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        {/* Floating circles background overlay */}
        <motion.div
          className="absolute inset-0 bg-primary/5 border border-primary/10 rounded-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-12 h-12 bg-accent/5 border border-accent/10 rounded-xl"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <FolderPlus className="w-8 h-8 text-primary relative z-10 animate-bounce" />
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-foreground tracking-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-[280px]">
        {description}
      </p>

      {/* CTA action trigger button */}
      <button
        onClick={onActionClick}
        className="mt-6 bg-primary text-primary-foreground font-bold text-xs py-2.5 px-6 rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-primary/20 shadow-md shadow-primary/5"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Deploy Custom Model</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
