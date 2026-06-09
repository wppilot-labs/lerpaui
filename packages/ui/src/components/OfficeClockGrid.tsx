"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Clock, MapPin, Copy, Check, Compass, Navigation } from 'lucide-react';
import { cn } from '../lib/cn';

export interface OfficeBranch {
  id: string;
  city: string;
  country: string;
  timezone: string;
  latitude: number; // For map positioning (-90 to 90)
  longitude: number; // For map positioning (-180 to 180)
  tagline: string;
}

export interface OfficeClockGridProps {
  className?: string;
  branches?: OfficeBranch[];
}

const DEFAULT_BRANCHES: OfficeBranch[] = [
  {
    id: 'sf',
    city: 'San Francisco',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    latitude: 37.7749,
    longitude: -122.4194,
    tagline: 'Engineering & HQ',
  },
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    latitude: 51.5074,
    longitude: -0.1278,
    tagline: 'Global Finance Hub',
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    tagline: 'APAC Design Studio',
  },
  {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    timezone: 'Asia/Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    tagline: 'Southeast Asia Hub',
  },
  {
    id: 'sydney',
    city: 'Sydney',
    country: 'Australia',
    timezone: 'Australia/Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
    tagline: 'ANZ Regional Operations',
  },
];

export const OfficeClockGrid: React.FC<OfficeClockGridProps> = ({
  className,
  branches = DEFAULT_BRANCHES,
}) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [activeBranchId, setActiveBranchId] = useState<string>(branches[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Update clock every second
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getBranchTimeInfo = (branch: OfficeBranch) => {
    if (!currentTime) {
      return { timeString: '--:--:-- --', isOpen: true };
    }
    // Get time string in the branch's timezone
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: branch.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      // Parse hours to determine business state (9:00 AM - 5:00 PM)
      const formatterHour = new Intl.DateTimeFormat('en-US', {
        timeZone: branch.timezone,
        hour: 'numeric',
        hour12: false,
      });

      const timeString = formatter.format(currentTime);
      const hourVal = parseInt(formatterHour.format(currentTime), 10);
      const isOpen = hourVal >= 9 && hourVal < 17;

      return { timeString, isOpen };
    } catch (e) {
      // Fallback
      return { timeString: currentTime.toLocaleTimeString(), isOpen: true };
    }
  };

  const handleCopyCoordinates = (branch: OfficeBranch, e: React.MouseEvent) => {
    e.stopPropagation();
    const coordString = `${branch.latitude.toFixed(4)}, ${branch.longitude.toFixed(4)}`;
    
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(coordString).then(() => {
        setCopiedId(branch.id);
        setTimeout(() => setCopiedId(null), 2500);
      });
    }
  };

  // Convert lat/lng to simplified Mercator percentages for visual world map coordinates
  const getMapPosition = (lat: number, lng: number) => {
    // Mapping: Lng: -180 to 180 => 0% to 100%
    const x = ((lng + 180) / 360) * 100;
    // Mapping Lat: 90 to -90 => 0% to 100% (approximate flat representation)
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  const activeBranch = branches.find(b => b.id === activeBranchId) || branches[0];
  const activePosition = activeBranch ? getMapPosition(activeBranch.latitude, activeBranch.longitude) : { x: 50, y: 50 };

  return (
    <div className={cn('grid grid-cols-1 xl:grid-cols-12 gap-6 w-full max-w-6xl mx-auto items-stretch p-1', className)}>
      
      {/* Simulation Minimap Overlay Panel (col span 5) */}
      <div className="xl:col-span-5 bg-card border border-border/80 rounded-2xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden h-[320px] xl:h-auto min-h-[300px]">
        {/* Futuristic Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        {/* Card Header Info */}
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              Global Pan Simulation
            </span>
            <h4 className="text-sm font-bold text-foreground mt-1">
              {activeBranch ? `${activeBranch.city}, ${activeBranch.country}` : 'Select Office'}
            </h4>
          </div>
          {activeBranch && (
            <div className="text-right text-[10px] font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded border border-border/40">
              LAT: {activeBranch.latitude.toFixed(4)}<br />
              LNG: {activeBranch.longitude.toFixed(4)}
            </div>
          )}
        </div>

        {/* Simplified SVG Map Visualizer */}
        <div className="relative w-full h-[180px] my-4 bg-muted/10 rounded-xl border border-border/40 overflow-hidden flex items-center justify-center">
          {/* Abstract landmass representation in simple vector shapes */}
          <svg className="absolute inset-0 w-full h-full text-foreground/5 opacity-30 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* North America */}
            <path d="M 5,20 Q 15,10 30,22 Q 25,30 20,45 Q 10,40 5,20 Z" fill="currentColor" />
            {/* South America */}
            <path d="M 22,48 Q 30,55 28,80 Q 20,70 22,48 Z" fill="currentColor" />
            {/* Eurasia / Africa */}
            <path d="M 45,18 Q 65,10 85,25 Q 75,40 60,35 Q 50,45 45,18 Z" fill="currentColor" />
            <path d="M 46,38 Q 55,42 58,65 Q 48,60 46,38 Z" fill="currentColor" />
            {/* Australia */}
            <path d="M 78,60 Q 90,65 85,80 Q 75,75 78,60 Z" fill="currentColor" />
          </svg>

          {/* Staggered grid lines for a technical look */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-border/20 border-dashed" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-border/20 border-dashed" />

          {/* Non-active branch dots */}
          {branches.map((b) => {
            if (b.id === activeBranchId) return null;
            const pos = getMapPosition(b.latitude, b.longitude);
            return (
              <button
                key={b.id}
                type="button"
                aria-label={`Select ${b.city} office`}
                onClick={() => setActiveBranchId(b.id)}
                className="absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-10 focus:outline-none"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <span className="absolute w-1.5 h-1.5 rounded-full bg-muted-foreground/60 group-hover:bg-primary transition-colors" />
                <span className="absolute w-3 h-3 rounded-full border border-primary/20 scale-0 group-hover:scale-100 transition-transform" />
              </button>
            );
          })}

          {/* Active Spring Pointer Beacon & Wave Ripple */}
          <motion.div
            layoutId="mapActiveIndicator"
            className="absolute z-20 w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ left: `${activePosition.x}%`, top: `${activePosition.y}%` }}
            transition={{ type: 'spring', stiffness: 220, damping: 23 }}
          >
            {/* Radar ripple waves */}
            <span className="absolute inset-0 rounded-full bg-primary/25 animate-ping opacity-75" />
            <span className="absolute w-5 h-5 rounded-full bg-primary/15 border border-primary/40 animate-pulse-slow" />
            <MapPin className="w-4 h-4 text-primary relative z-10 fill-primary/10" />
          </motion.div>
        </div>

        {/* Visual Map Controller Instructions */}
        <div className="text-[10px] text-muted-foreground flex justify-between items-center relative z-10">
          <span className="flex items-center gap-1">
            <Navigation className="w-3 h-3 text-primary animate-pulse" />
            Interactive coordinate pointer tracking.
          </span>
          <span>5 Node Ports Online</span>
        </div>
      </div>

      {/* Timezone Cards Grid Directory (col span 7) */}
      <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((branch) => {
          const { timeString, isOpen } = getBranchTimeInfo(branch);
          const isActive = branch.id === activeBranchId;
          const isCopied = copiedId === branch.id;

          return (
            <motion.div
              key={branch.id}
              className={cn(
                'relative overflow-hidden bg-card border rounded-2xl p-5 transition-all duration-300 select-none flex flex-col justify-between h-[160px]',
                isActive
                  ? 'border-primary ring-1 ring-primary/30 shadow-md bg-gradient-to-br from-card to-primary/5'
                  : 'border-border/80 hover:border-border hover:bg-secondary/20 hover:shadow-sm'
              )}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {/* Full-card selection trigger (sits behind non-interactive content) */}
              <button
                type="button"
                aria-pressed={isActive}
                aria-label={`Select ${branch.city} office`}
                onClick={() => setActiveBranchId(branch.id)}
                className="absolute inset-0 z-0 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />

              {/* Card top row */}
              <div className="relative z-10 pointer-events-none flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{branch.country}</span>
                  <h4 className="text-base font-bold text-foreground tracking-tight">{branch.city}</h4>
                  <p className="text-[10px] text-muted-foreground max-w-[80%] line-clamp-1">{branch.tagline}</p>
                </div>

                {/* Pulsing Beacon Badge */}
                <div className={cn(
                  'flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wide uppercase',
                  isOpen 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                )}>
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    isOpen 
                      ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] animate-pulse' 
                      : 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]'
                  )} />
                  {isOpen ? 'Open Now' : 'Closed'}
                </div>
              </div>

              {/* Running Time Clock */}
              <div className="relative z-10 pointer-events-none my-2 flex items-baseline gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground opacity-60 self-center" aria-hidden="true" />
                <span className="font-mono text-xl font-bold tracking-tight text-foreground">{timeString}</span>
                <span className="text-[8px] font-mono text-muted-foreground uppercase opacity-60">
                  {branch.timezone.split('/').pop()?.replace('_', ' ')}
                </span>
              </div>

              {/* Coordinates Action & Copy Row */}
              <div className="relative z-10 pointer-events-none flex justify-between items-center border-t border-border/40 pt-2 text-[10px]">
                <span className="font-mono text-muted-foreground">
                  {branch.latitude.toFixed(3)}°, {branch.longitude.toFixed(3)}°
                </span>

                <button
                  type="button"
                  aria-label={`Copy coordinates for ${branch.city}`}
                  onClick={(e) => handleCopyCoordinates(branch, e)}
                  className="pointer-events-auto relative z-20 flex items-center gap-1 text-[9px] font-semibold text-primary uppercase tracking-wider hover:underline"
                >
                  <AnimatePresence mode="wait">
                    {isCopied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-0.5 text-emerald-500 font-bold"
                      >
                        <Check className="w-3 h-3" aria-hidden="true" />
                        Copied!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-0.5"
                      >
                        <Copy className="w-3 h-3" aria-hidden="true" />
                        Coords
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
