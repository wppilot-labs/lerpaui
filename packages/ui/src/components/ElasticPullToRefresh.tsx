"use client";

import React, { useState, useEffect } from "react";
import {motion, useMotionValue, useTransform, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import { cn } from "../lib/cn";
import { ArrowDown, Check, Inbox, Trash2 } from "lucide-react";

export interface PullItem {
  id: string;
  title: string;
  sender: string;
  time: string;
  preview: string;
  category: string;
  accent: string;
}

export interface ElasticPullToRefreshProps {
  onRefresh?: () => Promise<void>;
  className?: string;
  /** Initial items shown in the inbox. */
  items?: PullItem[];
  /** Items appended one-by-one on each successful pull-to-refresh. */
  refreshPool?: Omit<PullItem, "id">[];
}

const DEFAULT_ITEMS: PullItem[] = [
  {
    id: "item-1",
    sender: "Customer Bank",
    title: "Monthly Dividends Cleared",
    preview: "Your monthly investment dividends of $1,280.50 have been allocated to your wallet.",
    time: "2m ago",
    category: "Finance",
    accent: "bg-emerald-500",
  },
  {
    id: "item-2",
    sender: "Design Team",
    title: "Design System Update",
    preview: "Reviewing premium effects, magnetic motions, and zoom navigation interfaces.",
    time: "1h ago",
    category: "Design",
    accent: "bg-purple-500",
  },
  {
    id: "item-3",
    sender: "Security Operations",
    title: "New Authorization Detected",
    preview: "A secure terminal session was registered for key api-credentials from IP 192.168.4.15.",
    time: "4h ago",
    category: "Security",
    accent: "bg-rose-500",
  },
];

const DEFAULT_REFRESH_POOL: Omit<PullItem, "id">[] = [
  {
    sender: "Build Assistant",
    title: "Compilation Succeeded",
    preview: "All visual components compiled with full type safety and zero compiler warnings.",
    time: "Just now",
    category: "Systems",
    accent: "bg-cyan-500",
  },
  {
    sender: "Rewards Program",
    title: "Lounge Access Activated",
    preview: "Your digital boarding credential has been added to your Wallet.",
    time: "Just now",
    category: "Travel",
    accent: "bg-amber-500",
  },
  {
    sender: "Motion Lab",
    title: "Animation Calibrated",
    preview: "Calibrated stiffness 180 with damping 12 for fluid viscous transitions.",
    time: "Just now",
    category: "Physics",
    accent: "bg-indigo-500",
  },
];

export function ElasticPullToRefresh({
  onRefresh,
  className,
  items: itemsProp = DEFAULT_ITEMS,
  refreshPool = DEFAULT_REFRESH_POOL,
}: ElasticPullToRefreshProps) {
  const [items, setItems] = useState<PullItem[]>(itemsProp);
  const [refreshState, setRefreshState] = useState<"idle" | "pulling" | "refreshing" | "success">("idle");
  const [poolIndex, setPoolIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Motion Value for Drag Y offset
  const dragY = useMotionValue(0);

  // Morph SVG path based on drag distance
  const pathD = useTransform(dragY, (latestYValue) => {
    const width = 320; // Mobile frame inner width
    const cx = width / 2;
    
    // Cap visual pulling stretch at 150px
    const yVal = Math.min(140, latestYValue);

    if (yVal <= 0) {
      return `M 0 0 L ${width} 0 L ${width} 0 Q ${cx} 0 0 0 Z`;
    }

    // Viscous fluid morph: stretches down in center, arches up at edges
    const controlY = yVal * 1.55;
    const edgeY = Math.min(15, yVal * 0.12);

    return `M 0 0 L ${width} 0 L ${width} ${edgeY} Q ${cx} ${controlY} 0 ${edgeY} Z`;
  });

  // Scale the loader icon in the center as we pull
  const loaderScale = useTransform(dragY, [0, 80], [0.3, 1]);
  const loaderOpacity = useTransform(dragY, [0, 60], [0, 1]);
  const loaderRotate = useTransform(dragY, [0, 120], [0, 360]);

  // Handle Drag States
  useEffect(() => {
    const unsubscribe = dragY.on("change", (latest) => {
      if (refreshState === "refreshing" || refreshState === "success") return;
      if (latest > 0) {
        setRefreshState("pulling");
      } else {
        setRefreshState("idle");
      }
    });
    return () => unsubscribe();
  }, [dragY, refreshState]);

  // Execute Refresh Action
  const triggerRefresh = async () => {
    setRefreshState("refreshing");
    
    // Run custom callback if provided
    if (onRefresh) {
      try {
        await onRefresh();
      } catch (err) {
        if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }
    } else {
      // Mock network latency of 1800ms
      await new Promise((resolve) => setTimeout(resolve, 1800));
    }

    // Prepend a fresh item from the pool
    const newTemplate = refreshPool[poolIndex % refreshPool.length];
    const newItem: PullItem = {
      ...newTemplate,
      id: `refreshed-${Date.now()}`,
    };
    setPoolIndex((p) => p + 1);
    setItems((prev) => [newItem, ...prev]);

    // Show Success State
    setRefreshState("success");

    // Hold success state for 800ms, then reset to idle
    setTimeout(() => {
      // Return container list back to top
      dragY.set(0);
      setRefreshState("idle");
    }, 850);
  };

  const handleDragEnd = (event: unknown, info: PanInfo) => {
    if (refreshState === "refreshing" || refreshState === "success") return;

    // Trigger point: if pulled past 95px, pull to refresh is validated
    if (info.offset.y >= 95) {
      triggerRefresh();
    } else {
      // Smoothly snap back to origin
      setRefreshState("idle");
    }
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={cn("w-full max-w-sm mx-auto flex flex-col items-center justify-center p-4", className)}>
      {/* Visual Mobile Frame Wrapper */}
      <div className="relative w-full max-w-[340px] h-[580px] rounded-[36px] bg-slate-950 border-[6px] border-slate-900 overflow-hidden shadow-2xl flex flex-col ring-8 ring-slate-900/30">
        
        {/* Mobile Camera Notch */}
        <div className="absolute top-0 inset-x-0 mx-auto w-32 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
        </div>

        {/* Mobile Top Status Bar */}
        <div className="h-10 bg-slate-950/80 backdrop-blur-md px-6 flex items-end justify-between text-[10px] text-slate-400 font-bold select-none pb-1 z-40">
          <span>9:41</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-[8px]">5G</span>
            <div className="w-4 h-2 rounded bg-slate-400" />
          </div>
        </div>

        {/* Mobile Screen Body */}
        <div className="flex-1 bg-slate-900/90 relative overflow-hidden flex flex-col">
          
          {/* LIQUID SVG ELASTIC PATH */}
          <div className="absolute top-0 inset-x-0 pointer-events-none z-30">
            <svg className="w-full h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d={pathD}
                fill="url(#neonLiquidGrad)"
                className="drop-shadow-[0_4px_12px_rgba(139,92,246,0.35)]"
              />
              <defs>
                <linearGradient id="neonLiquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="50%" stopColor="#4c1d95" />
                  <stop offset="100%" stopColor="#581c87" />
                </linearGradient>
              </defs>
            </svg>

            {/* NEON LOADER GRAPHIC inside liquid blob */}
            <div className="absolute top-4 inset-x-0 flex justify-center items-center h-12">
              <AnimatePresence mode="wait">
                {refreshState === "pulling" && (
                  <motion.div
                    style={{
                      scale: loaderScale,
                      opacity: loaderOpacity,
                      rotate: loaderRotate,
                    }}
                    className="flex flex-col items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full border border-violet-400/30 flex items-center justify-center bg-violet-950/60 shadow-lg">
                      <ArrowDown className="w-4 h-4 text-violet-400 animate-pulse" />
                    </div>
                  </motion.div>
                )}

                {refreshState === "refreshing" && (
                  <motion.div
                    key="spinning-loader"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1, rotate: 360 }}
                    exit={{ scale: 0.2, opacity: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : {
                      rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                      scale: { type: "spring", stiffness: 300, damping: 20 },
                    }}
                    className="w-8 h-8 rounded-full border-[2.5px] border-cyan-400 border-t-transparent shadow-[0_0_12px_rgba(34,211,238,0.4)] bg-slate-950/90"
                  />
                )}

                {refreshState === "success" && (
                  <motion.div
                    key="success-checkmark"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={prefersReducedMotion ? { scale: 1, rotate: 0 } : { scale: [1, 1.25, 1], rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 450, damping: 15 }}
                    className="w-8 h-8 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] flex items-center justify-center text-white"
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* SWIPEABLE LIST CONTAINER */}
          {/* Framer Motion drag enables list pulling gesture */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 250 }}
            dragElastic={0.5}
            style={{ y: dragY }}
            onDragEnd={handleDragEnd}
            className="flex-1 flex flex-col z-20 cursor-grab active:cursor-grabbing select-none"
          >
            {/* List Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center space-x-2">
                <Inbox className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-black tracking-widest text-slate-200 uppercase">Inbox Channels</span>
              </div>
              <span className="text-[10px] bg-purple-950 text-purple-300 font-bold px-2 py-0.5 rounded-full">
                {items.length} Active
              </span>
            </div>

            {/* List Scrolling Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-h-[460px] pointer-events-none">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layoutId={`inbox-${item.id}`}
                    initial={{ scale: 0.85, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.85, opacity: 0, x: -100 }}
                    transition={{ type: "spring", stiffness: 450, damping: 28 }}
                    className="pointer-events-auto w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-4 relative group flex flex-col justify-between overflow-hidden shadow-sm hover:border-slate-700/60 transition-colors"
                  >
                    {/* Left Accent indicator */}
                    <div className={cn("absolute left-0 inset-y-0 w-1", item.accent)} />

                    {/* Meta info */}
                    <div className="flex items-center justify-between w-full pb-1">
                      <span className="text-2xs font-bold text-slate-400 font-mono tracking-wide">
                        {item.sender}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] text-slate-500">{item.time}</span>
                        <button
                          type="button"
                          aria-label="Delete message"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item.id);
                          }}
                          className="text-slate-600 hover:text-rose-400 p-0.5 rounded-full hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Titles */}
                    <h4 className="text-xs font-bold text-slate-100 tracking-tight leading-snug">
                      {item.title}
                    </h4>

                    {/* Preview body */}
                    <p className="text-[10px] text-slate-400 font-normal leading-relaxed pt-1.5">
                      {item.preview}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center flex flex-col items-center justify-center space-y-2"
                >
                  <Inbox className="w-8 h-8 text-slate-600 animate-bounce" />
                  <span className="text-xs font-bold text-slate-400">All cleared!</span>
                  <span className="text-[10px] text-slate-500 max-w-[160px] mx-auto leading-relaxed">
                    Pull down on the list screen to fetch new incoming messages.
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>

        </div>

        {/* Home screen bottom grab bar */}
        <div className="h-5 bg-slate-950 flex items-center justify-center pb-2 select-none pointer-events-none">
          <div className="w-28 h-1 rounded-full bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
