"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Bell, Heart, MessageSquare, Terminal, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "../lib/cn";

export interface AlertNotification {
  id: string;
  type: "like" | "comment" | "alert" | "security";
  title: string;
  description: string;
  time: string;
  unread: boolean;
  avatarLetter: string;
}

export interface NotificationInboxPanelProps {
  className?: string;
}

export const NotificationInboxPanel: React.FC<NotificationInboxPanelProps> = ({ className }) => {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [alerts, setAlerts] = useState<AlertNotification[]>([
    {
      id: "n1",
      type: "comment",
      title: "New feedback comment",
      description: "Ada Lovelace reviewed your Spotlights grid animation: 'Perfect springs damping!'",
      time: "2m ago",
      unread: true,
      avatarLetter: "AL",
    },
    {
      id: "n2",
      type: "security",
      title: "Security access validation",
      description: "Verification code successfully matched for Marcus Aurelius (IP: 192.168.1.42).",
      time: "12m ago",
      unread: true,
      avatarLetter: "MA",
    },
    {
      id: "n3",
      type: "like",
      title: "Component like",
      description: "Seneca the Younger liked your Haptic circular knob dial customizer.",
      time: "2h ago",
      unread: false,
      avatarLetter: "SY",
    },
    {
      id: "n4",
      type: "alert",
      title: "System cluster warning",
      description: "Edge bandwidth utilization reached 92% of maximum month threshold constraints.",
      time: "1d ago",
      unread: false,
      avatarLetter: "SYS",
    },
  ]);

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })));
  };

  const handleToggleRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, unread: !a.unread } : a))
    );
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => activeFilter === "all" || a.unread);
  }, [alerts, activeFilter]);

  const getIcon = (type: AlertNotification["type"]) => {
    switch (type) {
      case "like":
        return <Heart className="w-3.5 h-3.5 text-rose-500" />;
      case "comment":
        return <MessageSquare className="w-3.5 h-3.5 text-accent" />;
      case "security":
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Terminal className="w-3.5 h-3.5 text-primary" />;
    }
  };

  return (
    <div className={cn("w-full max-w-[380px] rounded-3xl border border-border/50 bg-card/45 p-6 backdrop-blur-xl shadow-2xl flex flex-col h-[520px] select-none overflow-hidden relative", className)}>
      {/* Luxury ambient */}
      <div className="absolute -top-16 -left-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header controls */}
      <div className="flex justify-between items-center border-b border-border/30 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Bell className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-foreground block font-mono">Notification Center</span>
            <span className="text-[8px] text-muted-foreground uppercase font-black tracking-wider block">Real-time alerts</span>
          </div>
        </div>

        {alerts.some((a) => a.unread) && (
          <button
            onClick={handleMarkAllRead}
            className="text-[9px] font-black uppercase text-primary hover:underline cursor-pointer flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Mark read</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-secondary/40 p-1 rounded-xl border border-border/30 mb-4 relative">
        <button
          onClick={() => setActiveFilter("all")}
          className={cn(
            "flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg relative z-10 transition-colors cursor-pointer",
            activeFilter === "all" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          All Notifications ({alerts.length})
          {activeFilter === "all" && (
            <motion.div
              layoutId="inbox-tab"
              className="absolute inset-0 bg-card rounded-lg shadow-sm border border-border/40 -z-10"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
        
        <button
          onClick={() => setActiveFilter("unread")}
          className={cn(
            "flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg relative z-10 transition-colors cursor-pointer",
            activeFilter === "unread" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Unread ({alerts.filter((a) => a.unread).length})
          {activeFilter === "unread" && (
            <motion.div
              layoutId="inbox-tab"
              className="absolute inset-0 bg-card rounded-lg shadow-sm border border-border/40 -z-10"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* Roster list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        <AnimatePresence>
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleToggleRead(item.id)}
                className={cn(
                  "p-3.5 bg-secondary/15 border border-border/30 hover:border-primary/20 hover:bg-secondary/25 rounded-2xl cursor-pointer transition-all flex gap-3 overflow-hidden relative",
                  item.unread && "border-primary/25 bg-primary/5 shadow-md shadow-primary/5"
                )}
              >
                {/* Visual badge dot */}
                {item.unread && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary absolute top-4 right-4" />
                )}

                {/* Left icon wrapper */}
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-secondary/55 border border-border/50 flex items-center justify-center text-xs font-black uppercase">
                    {item.avatarLetter}
                  </div>
                  <span className="absolute -bottom-1.5 -right-1.5 p-1 rounded-md bg-card border border-border/50 shadow flex items-center justify-center">
                    {getIcon(item.type)}
                  </span>
                </div>

                {/* Contents */}
                <div>
                  <div className="flex justify-between items-baseline pr-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-foreground">
                      {item.title}
                    </span>
                    <span className="text-[8px] text-muted-foreground font-mono ml-2 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-[10.5px] leading-relaxed text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <CheckCircle2 className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <span className="text-xs font-bold text-muted-foreground">All cleared and caught up!</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
