'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';
import { Plus, Home, Search, Bell, User, Folder, Heart, Share2, Compass } from 'lucide-react';

export interface CircleDockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  colorClass?: string;
}

export interface MobileNavCircleDockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  items?: CircleDockItem[];
  centerIcon?: React.ReactNode;
  centerLabel?: string;
  radius?: number;
  glowColor?: string;
  onCenterClick?: () => void;
}

const DEFAULT_ORBIT_ITEMS: CircleDockItem[] = [
  { id: 'discover', icon: <Compass className="w-5 h-5" />, label: 'Discover', colorClass: 'bg-emerald-500 text-white' },
  { id: 'saved', icon: <Heart className="w-5 h-5" />, label: 'Saved', colorClass: 'bg-rose-500 text-white' },
  { id: 'files', icon: <Folder className="w-5 h-5" />, label: 'Folders', colorClass: 'bg-amber-500 text-white' },
  { id: 'share', icon: <Share2 className="w-5 h-5" />, label: 'Share', colorClass: 'bg-indigo-500 text-white' },
];

export const MobileNavCircleDock: React.FC<MobileNavCircleDockProps> = ({
  items = DEFAULT_ORBIT_ITEMS,
  centerIcon = <Plus className="w-6 h-6" />,
  centerLabel: _centerLabel = "Actions",
  radius = 80,
  glowColor = "rgba(59, 130, 246, 0.4)", // Blue glow
  onCenterClick,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Close radial menu when clicking/tapping outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleCenterTap = () => {
    setIsOpen((prev) => !prev);
    onCenterClick?.();
  };

  const handleTabTap = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  const totalOrbitItems = items.length;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-center justify-end w-full max-w-md mx-auto min-h-[220px] pb-4 px-4 overflow-visible select-none",
        className
      )}
      {...props}
    >
      {/* Backdrop overlay for focus immersion when circular dock is expanded */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-[1.5px]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Orbiting radial sub-items panel */}
      <div className="absolute bottom-[44px] z-50 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {isOpen &&
            items.map((item, idx) => {
              // Standard upward half-circle spread (from 210 degrees to 330 degrees)
              const startAngle = 210;
              const endAngle = 330;
              const angleRange = endAngle - startAngle;
              
              const angleDeg = totalOrbitItems > 1
                ? startAngle + (idx * angleRange) / (totalOrbitItems - 1)
                : startAngle;

              const angleRad = (angleDeg * Math.PI) / 180;

              // Compute polar coordinate offsets based on radius
              const tx = Math.cos(angleRad) * radius;
              const ty = Math.sin(angleRad) * radius;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: -45 }}
                  animate={{
                    x: tx,
                    y: ty,
                    scale: 1,
                    opacity: 1,
                    rotate: 0,
                    transition: prefersReducedMotion
                      ? { duration: 0.15 }
                      : {
                          type: 'spring',
                          stiffness: 280,
                          damping: 16,
                          delay: idx * 0.04,
                        },
                  }}
                  exit={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 0,
                    rotate: 45,
                    transition: {
                      duration: 0.15,
                      delay: (totalOrbitItems - 1 - idx) * 0.02,
                    },
                  }}
                  className={cn(
                    "absolute p-3 rounded-full shadow-lg border border-white/10 active:scale-90 select-none cursor-pointer group pointer-events-auto",
                    item.colorClass || "bg-primary text-primary-foreground"
                  )}
                  aria-label={item.label}
                >
                  {item.icon}

                  {/* Glassmorphic floating tooltip tags */}
                  <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-[9px] font-black uppercase tracking-wider text-zinc-300 px-2 py-0.5 rounded shadow-sm opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap">
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
        </AnimatePresence>
      </div>

      {/* Main Glassmorphic Bottom Navigation Bar */}
      <div className="relative w-full h-[68px] bg-zinc-900/85 backdrop-blur-lg border border-zinc-800 rounded-2xl flex items-center justify-between px-6 shadow-2xl z-50 overflow-visible">
        
        {/* Home Tab */}
        <button
          type="button"
          onClick={() => handleTabTap('home')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-zinc-400 active:scale-90 transition-transform cursor-pointer relative",
            activeTab === 'home' && "text-primary"
          )}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
          {activeTab === 'home' && (
            <motion.div
              layoutId="circleDockActiveTab"
              className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
        </button>

        {/* Search Tab */}
        <button
          type="button"
          onClick={() => handleTabTap('search')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-zinc-400 active:scale-90 transition-transform cursor-pointer relative",
            activeTab === 'search' && "text-primary"
          )}
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Search</span>
          {activeTab === 'search' && (
            <motion.div
              layoutId="circleDockActiveTab"
              className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
        </button>

        {/* Spacer for floating Center radial trigger */}
        <div className="w-14 h-14 flex items-center justify-center relative -top-6 overflow-visible">
          {/* Animated pulsing backing glow around center trigger */}
          <motion.div
            animate={{
              boxShadow: isOpen
                ? `0 0 28px 8px ${glowColor}`
                : `0 0 12px 2px rgba(59, 130, 246, 0.15)`,
            }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
            className="rounded-full absolute inset-0 -z-10 pointer-events-none"
          />

          <motion.button
            type="button"
            onClick={handleCenterTap}
            animate={{ rotate: isOpen ? 135 : 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={prefersReducedMotion ? { duration: 0.1 } : { type: 'spring', stiffness: 360, damping: 18 }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/25 text-white flex items-center justify-center shadow-xl cursor-pointer select-none"
            aria-label={isOpen ? "Close Actions Menu" : "Open Actions Menu"}
          >
            {centerIcon}
          </motion.button>
        </div>

        {/* Alerts Tab */}
        <button
          type="button"
          onClick={() => handleTabTap('alerts')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-zinc-400 active:scale-90 transition-transform cursor-pointer relative",
            activeTab === 'alerts' && "text-primary"
          )}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Alerts</span>
          {activeTab === 'alerts' && (
            <motion.div
              layoutId="circleDockActiveTab"
              className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
        </button>

        {/* Profile Tab */}
        <button
          type="button"
          onClick={() => handleTabTap('profile')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-zinc-400 active:scale-90 transition-transform cursor-pointer relative",
            activeTab === 'profile' && "text-primary"
          )}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Profile</span>
          {activeTab === 'profile' && (
            <motion.div
              layoutId="circleDockActiveTab"
              className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
        </button>

      </div>
    </div>
  );
};
