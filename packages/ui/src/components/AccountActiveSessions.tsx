"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Smartphone, Laptop, MapPin, ShieldCheck } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

type Session = {
  id: string;
  device: string;
  icon: "desktop" | "mobile" | "laptop";
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current?: boolean;
};

const SESSIONS: Session[] = [
  { id: "s1", device: "MacBook Pro", icon: "laptop", browser: "Chrome 124", location: "San Francisco, US", ip: "73.12.x.x", lastActive: "Active now", current: true },
  { id: "s2", device: "iPhone 15", icon: "mobile", browser: "Safari", location: "San Francisco, US", ip: "73.12.x.x", lastActive: "2 hours ago" },
  { id: "s3", device: "Windows PC", icon: "desktop", browser: "Edge 124", location: "New York, US", ip: "201.44.x.x", lastActive: "Yesterday" },
];

const ICONS = { desktop: Monitor, mobile: Smartphone, laptop: Laptop };

export interface AccountActiveSessionsProps {
  className?: string;
}

export function AccountActiveSessions({ className }: AccountActiveSessionsProps) {
  const [revoked, setRevoked] = useState<string[]>([]);
  const reduced = usePrefersReducedMotion();

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold">Active sessions</h3>
          <p className="text-xs text-muted-foreground/70">Devices currently signed in to your account</p>
        </div>
        <ShieldCheck className="w-4 h-4 text-emerald-400/80" />
      </div>

      <ul className="space-y-2">
        {SESSIONS.map((s, i) => {
          const Icon = ICONS[s.icon];
          const isRevoked = revoked.includes(s.id);
          return (
            <motion.li
              key={s.id}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: isRevoked ? 0.4 : 1, y: 0 }}
              transition={{ delay: reduced ? 0 : i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04]"
            >
              <div className="h-8 w-8 rounded-lg bg-secondary/40 flex items-center justify-center text-muted-foreground shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold truncate">{s.device}</span>
                  {s.current && (
                    <span className="text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">This device</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground/60 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{s.location} · {s.browser}</span>
                </div>
                <div className="text-[11px] text-muted-foreground/40 mt-0.5">{s.lastActive} · {s.ip}</div>
              </div>
              {!s.current && (
                <button
                  type="button"
                  onClick={() => setRevoked((r) => (isRevoked ? r.filter((x) => x !== s.id) : [...r, s.id]))}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors shrink-0"
                >
                  {isRevoked ? "Undo" : "Revoke"}
                </button>
              )}
            </motion.li>
          );
        })}
      </ul>

      <button
        type="button"
        className="mt-4 w-full py-2 text-xs font-bold rounded-xl bg-secondary/50 border border-foreground/[0.05] text-muted-foreground hover:text-foreground transition-colors"
      >
        Sign out of all other sessions
      </button>
    </div>
  );
}
