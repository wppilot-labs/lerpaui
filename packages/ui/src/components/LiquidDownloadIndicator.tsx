"use client";

import React, { useState, useEffect } from "react";
import { motion} from "framer-motion";
import { Download, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/cn";

export function LiquidDownloadIndicator({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!isDownloading) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          return 100;
        }
        return p + 4;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isDownloading]);

  const triggerDownload = () => {
    setProgress(0);
    setIsDownloading(true);
  };

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl flex flex-col items-center space-y-4", className)}>
      <div className="w-full flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Liquid Loader</h3>
          <p className="text-[10px] text-muted-foreground">Wave-accumulating download indicator</p>
        </div>
        <Download className="w-4 h-4 text-primary" />
      </div>

      <div className="relative w-28 h-28 rounded-2xl border border-border/40 bg-zinc-950/60 overflow-hidden flex items-center justify-center shadow-inner">
        {/* Accumulating liquid-like wave fill */}
        <motion.div
          animate={{ height: `${progress}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="absolute left-0 right-0 bottom-0 bg-primary/25 border-t border-primary/50"
        />

        <div className="z-10 flex flex-col items-center justify-center text-center">
          {progress === 100 ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-emerald-400 font-bold text-xs uppercase flex flex-col items-center gap-1"
            >
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <span>Complete</span>
            </motion.div>
          ) : (
            <span className="text-xl font-mono font-black text-foreground drop-shadow-md">{progress}%</span>
          )}
        </div>
      </div>

      <button
        onClick={triggerDownload}
        disabled={isDownloading}
        className={cn(
          "w-full py-2 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer text-center",
          isDownloading ? "bg-zinc-800 text-muted-foreground" : "bg-primary text-white hover:bg-primary/95 shadow-primary/10"
        )}
      >
        {isDownloading ? "Downloading Bundle..." : "Trigger Download"}
      </button>
    </div>
  );
}
