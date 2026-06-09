"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { Home, Users, Settings, Flame } from "lucide-react";
import { cn } from "../lib/cn";

export function LiquidBlobTabBarFooter({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState("home");

  const menu = [
    { id: "home", Icon: Home },
    { id: "users", Icon: Users },
    { id: "engine", Icon: Flame },
    { id: "settings", Icon: Settings },
  ];

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">Liquid Tab Bar</h3>
        <p className="text-[10px] text-muted-foreground">Bottom menu tracking visual elastic blobs</p>
      </div>

      <div className="flex justify-around items-center bg-zinc-950/60 p-2.5 rounded-xl border border-border/30">
        {menu.map((item) => {
          const Icon = item.Icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative p-2 cursor-pointer focus:outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="liquid-blob-bg"
                  className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-xl"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <Icon className={cn("relative z-10 w-4 h-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
