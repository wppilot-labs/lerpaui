"use client";

import React, { useState, useEffect } from 'react';

import { Clock, MapPin, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/cn';

interface OfficeBranch {
  id: string;
  city: string;
  country: string;
  timezone: string; // e.g. 'America/Los_Angeles'
  openHour?: number; // 24-hour format, e.g. 9
  closeHour?: number; // 24-hour format, e.g. 18
}

export interface OfficeStatusBadgeTrackerProps extends React.HTMLAttributes<HTMLDivElement> {
  branches?: OfficeBranch[];
  title?: string;
  subtitle?: string;
}

const defaultBranches: OfficeBranch[] = [
  { id: 'sf', city: 'San Francisco', country: 'United States', timezone: 'America/Los_Angeles', openHour: 9, closeHour: 17 },
  { id: 'lon', city: 'London', country: 'United Kingdom', timezone: 'Europe/London', openHour: 9, closeHour: 17 },
  { id: 'ber', city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', openHour: 9, closeHour: 18 },
  { id: 'tok', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', openHour: 9, closeHour: 18 },
  { id: 'syd', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', openHour: 8, closeHour: 17 },
];

export const OfficeStatusBadgeTracker: React.FC<OfficeStatusBadgeTrackerProps> = ({
  branches = defaultBranches,
  title = "Our Global Presence",
  subtitle = "Real-time branch indicators showcasing local operating times, timezones, and active corporate office statuses.",
  className,
  ...props
}) => {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check if office is currently open based on current local hour
  const getOfficeStatus = (branch: OfficeBranch, currentTime: Date) => {
    try {
      const open = branch.openHour ?? 9;
      const close = branch.closeHour ?? 17;

      // Format time in the target timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: branch.timezone,
        hour: 'numeric',
        hour12: false,
      });
      const localHour = parseInt(formatter.format(currentTime), 10);

      if (localHour >= open && localHour < close) {
        return { label: 'Open Now', type: 'open' as const, hour: localHour };
      } else if (localHour >= close || localHour < open) {
        return { label: 'Closed', type: 'closed' as const, hour: localHour };
      }
      return { label: 'Away', type: 'away' as const, hour: localHour };
    } catch {
      return { label: 'Open Now', type: 'open' as const, hour: 12 };
    }
  };

  // Format local clock time string
  const formatLocalTime = (timezone: string, currentTime: Date) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(currentTime);
    } catch {
      return '--:--:--';
    }
  };

  // Get current offset hour and minute rotation values
  const getClockRotations = (timezone: string, currentTime: Date) => {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      }).formatToParts(currentTime);

      const h = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0', 10);
      const m = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0', 10);
      const s = parseInt(parts.find(p => p.type === 'second')?.value ?? '0', 10);

      const hourRotate = (h % 12) * 30 + m * 0.5;
      const minuteRotate = m * 6 + s * 0.1;
      const secondRotate = s * 6;

      return { hourRotate, minuteRotate, secondRotate };
    } catch {
      return { hourRotate: 0, minuteRotate: 0, secondRotate: 0 };
    }
  };

  if (!mounted || !time) {
    return (
      <section className={cn("w-full py-16 px-4 md:px-8 max-w-6xl mx-auto text-center bg-background", className)} {...props}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-muted mx-auto rounded" />
          <div className="h-4 w-96 bg-muted mx-auto rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-32 bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "w-full bg-background text-foreground py-16 px-4 md:px-8 max-w-6xl mx-auto",
        className
      )}
      {...props}
    >
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          <span>Real-time Operations</span>
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight mt-3">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => {
          const status = getOfficeStatus(branch, time);
          const timeStr = formatLocalTime(branch.timezone, time);
          const { hourRotate, minuteRotate, secondRotate } = getClockRotations(branch.timezone, time);

          return (
            <div
              key={branch.id}
              className="relative bg-card/60 border border-border/50 rounded-2xl p-5 backdrop-blur-sm shadow-sm flex items-center justify-between group overflow-hidden"
            >
              {/* Main content info */}
              <div className="z-20 relative space-y-2 flex-grow">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-black tracking-widest uppercase">{branch.country}</span>
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight text-foreground">{branch.city}</h3>
                  <div className="text-xs font-mono font-bold text-primary mt-1">{timeStr}</div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2 pt-1.5">
                  <span
                    className={cn(
                      "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1",
                      status.type === 'open' && "bg-emerald-500/10 text-emerald-500",
                      status.type === 'closed' && "bg-red-500/10 text-red-500",
                      status.type === 'away' && "bg-amber-500/10 text-amber-500"
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full",
                      status.type === 'open' && "bg-emerald-500 animate-ping",
                      status.type === 'closed' && "bg-red-500",
                      status.type === 'away' && "bg-amber-500"
                    )} />
                    {status.label}
                  </span>
                  
                  {/* Sun / Moon hours indicator */}
                  <span className="text-[10px] text-muted-foreground/80 font-semibold flex items-center gap-1">
                    {status.hour >= 6 && status.hour < 18 ? (
                      <Sun className="w-3 h-3 text-amber-400" />
                    ) : (
                      <Moon className="w-3 h-3 text-indigo-400" />
                    )}
                    <span>{branch.openHour}:00 - {branch.closeHour}:00</span>
                  </span>
                </div>
              </div>

              {/* SVG Analog Clock Graphic dial in the corner */}
              <div className="relative w-16 h-16 rounded-full border border-border/80 bg-muted/30 flex-shrink-0 flex items-center justify-center shadow-inner ml-4">
                <svg className="w-full h-full" viewBox="0 0 40 40">
                  {/* Center Dot */}
                  <circle cx="20" cy="20" r="1.5" className="fill-primary" />
                  {/* Hour Hand */}
                  <line
                    x1="20"
                    y1="20"
                    x2="20"
                    y2="10"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    className="stroke-foreground origin-[20px_20px]"
                    style={{ transform: `rotate(${hourRotate}deg)` }}
                  />
                  {/* Minute Hand */}
                  <line
                    x1="20"
                    y1="20"
                    x2="20"
                    y2="7"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    className="stroke-foreground/80 origin-[20px_20px]"
                    style={{ transform: `rotate(${minuteRotate}deg)` }}
                  />
                  {/* Second Hand */}
                  <line
                    x1="20"
                    y1="20"
                    x2="20"
                    y2="6"
                    strokeWidth="0.6"
                    strokeLinecap="round"
                    className="stroke-primary origin-[20px_20px]"
                    style={{ transform: `rotate(${secondRotate}deg)` }}
                  />
                  {/* Hour tick marks */}
                  <circle cx="20" cy="3" r="0.5" className="fill-muted-foreground/60" />
                  <circle cx="37" cy="20" r="0.5" className="fill-muted-foreground/60" />
                  <circle cx="20" cy="37" r="0.5" className="fill-muted-foreground/60" />
                  <circle cx="3" cy="20" r="0.5" className="fill-muted-foreground/60" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
