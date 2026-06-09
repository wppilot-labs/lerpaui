"use client";

import React, { useState, useEffect } from "react";
import { Globe, Clock } from "lucide-react";
import { cn } from "../lib/cn";

interface TimeZoneItem {
  city: string;
  tz: string;
  offset: number;
}

export function TimeZoneGlobeRoster({ className }: { className?: string }) {
  const timezones: TimeZoneItem[] = [
    { city: "San Francisco", tz: "PST", offset: -8 },
    { city: "London", tz: "GMT", offset: 0 },
    { city: "Tokyo", tz: "JST", offset: 9 },
  ];

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTzTime = (offset: number) => {
    const utc = time.getTime() + time.getTimezoneOffset() * 60000;
    const nd = new Date(utc + 3600000 * offset);
    return nd.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center gap-2.5 pb-2 border-b border-border/30">
        <Globe className="w-5 h-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-foreground">Global Office clocks</h3>
          <p className="text-[10px] text-muted-foreground">Dynamic synchronized business times</p>
        </div>
      </div>

      <div className="space-y-2">
        {timezones.map((tz) => (
          <div
            key={tz.city}
            className="flex items-center justify-between p-2.5 bg-zinc-900/30 border border-border/20 rounded-xl"
          >
            <div>
              <span className="text-xs font-bold text-foreground">{tz.city}</span>
              <p className="text-[8px] font-mono text-muted-foreground uppercase">{tz.tz}</p>
            </div>
            <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTzTime(tz.offset)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
