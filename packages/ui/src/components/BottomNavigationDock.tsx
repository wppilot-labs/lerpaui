"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, type MotionValue } from "framer-motion";
import { cn } from "../lib/cn";
import { Home, Search, MessageSquare, User, Zap, Sparkles } from "lucide-react";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface DockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  color: string;
}

export interface BottomNavigationDockProps {
  className?: string;
  /** Dock items rendered in order. */
  items?: DockItem[];
  /** ID of the initially active tab (defaults to the first item). */
  defaultTab?: string;
  /** Render-prop for the panel content shown above the dock. */
  renderPanel?: (activeId: string) => React.ReactNode;
  /** Called whenever the active tab changes. */
  onChange?: (id: string) => void;
}

const DEFAULT_ITEMS: DockItem[] = [
  { id: "home",     label: "Home",     icon: <Home className="w-5.5 h-5.5 stroke-[1.8]" />,        color: "text-violet-500"  },
  { id: "search",   label: "Explore",  icon: <Search className="w-5.5 h-5.5 stroke-[1.8]" />,       color: "text-cyan-500"    },
  { id: "zap",      label: "Activity", icon: <Zap className="w-5.5 h-5.5 stroke-[1.8]" />,          color: "text-amber-500", badge: 3 },
  { id: "messages", label: "Inbox",    icon: <MessageSquare className="w-5.5 h-5.5 stroke-[1.8]" />, color: "text-emerald-500", badge: 7 },
  { id: "profile",  label: "Profile",  icon: <User className="w-5.5 h-5.5 stroke-[1.8]" />,         color: "text-rose-500"    },
];

const DEFAULT_RENDER_PANEL = (activeId: string): React.ReactNode => {
  switch (activeId) {
    case "home":
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-violet-400">
            <Home className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white leading-snug">
            Welcome back to your workspace.
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Experience the magnification dock below. Move your cursor or slide your thumb across the icons to see them scale and glide in 3D-like perspective.
          </p>
          <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-500/20 flex gap-3 items-center">
            <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
            <span className="text-2xs text-violet-300 font-medium leading-normal">
              Proximity tracking triggers spring-driven scaling on hover or touch.
            </span>
          </div>
        </div>
      );
    case "search":
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Search className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Explore</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white leading-snug">
            Search the catalog.
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Search index loaded. The component library is built with Tailwind CSS v4 and strict TypeScript types.
          </p>
        </div>
      );
    case "zap":
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-amber-400">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Activity</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white leading-snug">
            Monitoring workspace status.
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            All components loaded.<br />
            Pointer tracking active.<br />
            Hardware acceleration enabled.
          </p>
        </div>
      );
    case "messages":
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Inbox</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white leading-snug">
            Messaging pipeline online.
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            All communications are encrypted end-to-end. Check back later for updates.
          </p>
        </div>
      );
    case "profile":
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-rose-400">
            <User className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Profile</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white leading-snug">
            Profile verified and synced.
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Account verified. Settings loaded successfully with full SSR compatibility.
          </p>
        </div>
      );
    default:
      return null;
  }
};

export function BottomNavigationDock({
  className,
  items = DEFAULT_ITEMS,
  defaultTab,
  renderPanel = DEFAULT_RENDER_PANEL,
  onChange,
}: BottomNavigationDockProps) {
  const [activeTab, setActiveTabState] = useState(defaultTab ?? items[0]?.id ?? "");
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const setActiveTab = (id: string) => {
    setActiveTabState(id);
    onChange?.(id);
  };

  // Mouse/Touch horizontal tracking value
  const mouseX = useMotionValue(Infinity);

  // Mouse/Touch Coordinate Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(e.clientX);
  };

  const handleMouseLeave = () => {
    mouseX.set(Infinity);
    setHoveredLabel(null);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      mouseX.set(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    mouseX.set(Infinity);
    setHoveredLabel(null);
  };

  const panelContent = renderPanel(activeTab);

  return (
    <div className={cn("w-full max-w-sm mx-auto flex flex-col items-center justify-center p-4", className)}>
      {/* simulated mobile viewport */}
      <div className="relative w-full max-w-[340px] h-[580px] rounded-[36px] bg-slate-950 border-[6px] border-slate-900 overflow-hidden shadow-2xl flex flex-col ring-8 ring-slate-900/30">
        
        {/* mobile notch */}
        <div className="absolute top-0 inset-x-0 mx-auto w-32 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
        </div>

        {/* status bar */}
        <div className="h-10 bg-slate-950/80 backdrop-blur-md px-6 flex items-end justify-between text-[10px] text-slate-400 font-bold select-none pb-1 z-40">
          <span>9:41</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-[8px]">5G</span>
            <div className="w-4 h-2 rounded bg-slate-400" />
          </div>
        </div>

        {/* body workspace */}
        <div className="flex-1 bg-slate-900/90 p-6 flex flex-col justify-start relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -15 }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 26 }}
              className="mt-6"
            >
              {panelContent}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* HOVER DOCK LABEL TOOLTIP */}
        <div className="absolute bottom-20 inset-x-0 flex justify-center z-50 pointer-events-none">
          <AnimatePresence>
            {hoveredLabel && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
                transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 450, damping: 20 }}
                className="px-2.5 py-1 rounded-md bg-slate-950/90 border border-slate-800 text-[10px] font-bold tracking-wider text-slate-200 shadow-md uppercase"
              >
                {hoveredLabel}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MAC OS INTERACTIVE DOCK FOOTER */}
        <div className="bg-slate-950 px-4 pb-4 select-none relative">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full h-16 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md px-3 flex items-center justify-between shadow-xl relative"
          >
            {items.map((item) => (
              <DockIcon
                key={item.id}
                item={item}
                mouseX={mouseX}
                active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                onHover={setHoveredLabel}
              />
            ))}
          </div>
        </div>

        {/* home bar */}
        <div className="h-5 bg-slate-950 flex items-center justify-center pb-2 select-none pointer-events-none">
          <div className="w-28 h-1 rounded-full bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

// macOS magnifying zoom helper subcomponent
interface DockIconProps {
  item: DockItem;
  mouseX: MotionValue<number>; // MotionValue
  active: boolean;
  onClick: () => void;
  onHover: (label: string | null) => void;
}

function DockIcon({ item, mouseX, active, onClick, onHover }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);

  // Proximity calculations: measure horizontal distance from pointer to icon center
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    const center = bounds.left + bounds.width / 2;
    return val - center;
  });

  // Zoom size magnification maps
  const scale = useTransform(distance, [-110, 0, 110], [1, 1.45, 1]);
  const yShift = useTransform(distance, [-110, 0, 110], [0, -11, 0]);

  // Spring animations for elastic bounce
  const springScale = useSpring(scale, { stiffness: 220, damping: 15 });
  const springY = useSpring(yShift, { stiffness: 220, damping: 15 });

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={item.label}
      aria-pressed={active}
      style={{
        scale: springScale,
        y: springY,
      }}
      onClick={onClick}
      onMouseEnter={() => onHover(item.label)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer text-slate-400 outline-none hover:bg-white/5 active:scale-95"
      )}
    >
      {/* Glowing background when active */}
      <AnimatePresence>
        {active && (
          <motion.div
            layoutId="activeDockBackground"
            transition={{ type: "spring", stiffness: 350, damping: 24 }}
            className="absolute inset-0 rounded-xl bg-white/5 border border-white/10 z-0"
          />
        )}
      </AnimatePresence>

      {/* Actual Icon node with color transitions */}
      <div className={cn("z-10 relative transition-colors duration-300", active ? item.color : "text-slate-400 group-hover:text-slate-200")} aria-hidden="true">
        {item.icon}
      </div>

      {/* Sliding spring indicator underneath */}
      <div className="absolute -bottom-1 inset-x-0 flex justify-center h-1 select-none pointer-events-none">
        {active && (
          <motion.div
            layoutId="activeDockIndicator"
            transition={{ type: "spring", stiffness: 380, damping: 15 }}
            className={cn("w-1.5 h-1 rounded-full", item.color.replace("text-", "bg-"))}
          />
        )}
      </div>

      {/* Floating Badges */}
      {item.badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border border-slate-900 text-[8px] font-black text-white flex items-center justify-center scale-90 z-20">
          {item.badge}
        </span>
      )}
    </motion.button>
  );
}
