"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion} from "framer-motion";
import { Bell, Search, Menu } from 'lucide-react';
import { cn } from '../lib/cn';

export interface MobileHeaderSlimHideProps {
  title: string;
  onSearchClick?: () => void;
  className?: string;
}

export const MobileHeaderSlimHide: React.FC<MobileHeaderSlimHideProps> = ({
  title,
  onSearchClick,
  className,
}) => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling down -> hide
        setVisible(false);
      } else {
        // Scrolling up -> show
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -60 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn('fixed top-0 left-0 right-0 z-50 h-14 bg-card/90 backdrop-blur-md border-b border-border px-4 flex items-center justify-between shadow-sm select-none', className)}
    >
      <div className="flex items-center gap-3">
        <button type="button" aria-label="Open menu" className="p-1 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        {title && <h1 className="text-sm font-black tracking-tight text-foreground">{title}</h1>}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Search"
          onClick={onSearchClick}
          className="p-1.5 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-all active:scale-95"
        >
          <Search className="w-4 h-4" />
        </button>
        <button type="button" aria-label="Notifications" className="p-1.5 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
        </button>
      </div>
    </motion.header>
  );
};
