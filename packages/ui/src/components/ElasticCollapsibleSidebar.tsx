"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Menu, X, ChevronRight, Settings, Grid, Home, MessageSquare, ShieldAlert } from "lucide-react";
import { cn } from "../lib/cn";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ElasticCollapsibleSidebarProps {
  className?: string;
}

export function ElasticCollapsibleSidebar({ className }: ElasticCollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { id: "home", label: "Dashboard Overview", icon: <Home className="w-4 h-4" /> },
    { id: "chats", label: "Agent Conversations", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "analytics", label: "Systems Metrics", icon: <Grid className="w-4 h-4" /> },
    { id: "security", label: "Access Vault", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "settings", label: "Console Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className={cn("relative flex h-[350px] border border-white/5 bg-zinc-950/40 rounded-2xl overflow-hidden shadow-2xl", className)}>
      {/* Collapsible Sidebar */}
      <motion.div
        animate={{ width: isOpen ? 220 : 64 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="h-full bg-black/60 border-r border-white/10 flex flex-col justify-between p-3 select-none relative"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/20 text-white flex items-center justify-center cursor-pointer transition-colors duration-200 self-end mb-4"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Navigation list */}
        <div className="flex-1 flex flex-col gap-2">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer text-white/70 hover:text-white transition-colors duration-200 group relative"
            >
              <span className="shrink-0">{item.icon}</span>
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-sans text-xs font-semibold whitespace-nowrap truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Bottom Profile Details */}
        <div className="flex items-center gap-3 border-t border-white/5 pt-3 mt-3">
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center font-bold font-mono text-[10px] text-white shrink-0">
            UI
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col truncate"
              >
                <span className="text-[10px] font-bold text-white font-sans truncate">Admin Core</span>
                <span className="text-[8px] font-mono text-white/40 truncate">launch_os@secure</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main content placeholder inside */}
      <div className="flex-1 p-6 flex flex-col justify-between font-sans relative">
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            LAUNCH_SIDEBAR_SHELL
            <ChevronRight className="w-3 h-3 text-primary animate-pulse" />
          </h4>
          <p className="text-[10px] text-white/50 leading-relaxed max-w-[240px]">
            Fully functional, collapsible left-dock utilizing Framer Motion spring stiffness and damping loops for organic transitions.
          </p>
        </div>
        <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest self-start mt-auto">
          SYSTEM_ACCORD_SHELL
        </div>
      </div>
    </div>
  );
}
