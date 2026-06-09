"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Globe, 
  Navigation, 
  Compass, 
  Activity,
  Layers
} from 'lucide-react';
import { cn } from '../lib/cn';

export interface Office {
  name: string;
  city: string;
  timezone: string;
  address: string;
  phone: string;
  lat: number;  // -90 to 90
  lng: number;  // -180 to 180
}

export interface InteractiveOfficeLocatorProps {
  /** Array of office objects */
  offices: Office[];
  /** Optional container class name */
  className?: string;
}

export const InteractiveOfficeLocator: React.FC<InteractiveOfficeLocatorProps> = ({
  offices,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [clocks, setClocks] = useState<{ [key: string]: { time: string; isOpen: boolean } }>({});

  const activeOffice = offices[activeIndex] || offices[0];

  // Map projection coordinates:
  // Convert standard latitude/longitude coordinates to our SVG viewBox space (800x500)
  const getMapCoords = (lat: number, lng: number) => {
    // Equirectangular projection
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const activeCoords = getMapCoords(activeOffice.lat, activeOffice.lng);

  // Timezone checker
  useEffect(() => {
    const updateClocks = () => {
      const updated: { [key: string]: { time: string; isOpen: boolean } } = {};
      offices.forEach((office) => {
        try {
          const now = new Date();
          
          // Formatter for local time
          const timeStr = now.toLocaleTimeString('en-US', {
            timeZone: office.timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          // Check if open: Business hours 9 AM to 6 PM (9 to 18)
          const hour24 = parseInt(
            new Date(now.toLocaleString('en-US', { timeZone: office.timezone })).getHours().toString()
          );
          const isOpen = hour24 >= 9 && hour24 < 18;

          updated[office.name] = { time: timeStr, isOpen };
        } catch (e) {
          updated[office.name] = { time: '--:--', isOpen: false };
        }
      });
      setClocks(updated);
    };

    updateClocks();
    const interval = setInterval(updateClocks, 30000); // update every 30s
    return () => clearInterval(interval);
  }, [offices]);

  // SVG Pan-Zoom settings calculated dynamically:
  // We want to center the viewBox on the active office's map coordinates.
  // When active office shifts, standard viewBox will pan smoothly to focus on it.
  const mapWidth = 800;
  const mapHeight = 500;
  const zoomFactor = 0.5; // Zoom scale factor

  // Calculate target viewbox coordinates centered around active node coordinates
  const targetWidth = mapWidth * zoomFactor;
  const targetHeight = mapHeight * zoomFactor;
  
  // Clamp boundaries to prevent panning off-canvas
  const targetX = Math.max(0, Math.min(mapWidth - targetWidth, activeCoords.x - targetWidth / 2));
  const targetY = Math.max(0, Math.min(mapHeight - targetHeight, activeCoords.y - targetHeight / 2));

  // Animating viewport coordinates with Framer Motion spring bindings
  return (
    <div className={cn(
      "w-full grid grid-cols-1 lg:grid-cols-5 gap-6 p-6 border border-border bg-card/30 backdrop-blur-md rounded-3xl overflow-hidden",
      className
    )}>
      {/* Left Column: Timezone Roster Cards list */}
      <div className="lg:col-span-2 flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
        <div className="flex items-center gap-2 mb-2 px-1 select-none">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-base font-extrabold text-foreground tracking-tight select-none">
            Global Headquarters
          </h3>
        </div>

        {offices.map((office, idx) => {
          const isActive = idx === activeIndex;
          const clockInfo = clocks[office.name] || { time: 'Loading...', isOpen: false };

          return (
            <div
              key={office.name}
              role="button"
              tabIndex={0}
              onClick={() => setActiveIndex(idx)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveIndex(idx); } }}
              className={cn(
                "relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none",
                isActive
                  ? "border-emerald-500/40 bg-zinc-950/20 shadow-lg"
                  : "border-border bg-card/80 hover:bg-accent/40"
              )}
            >
              {/* Left active highlight border beam marker */}
              {isActive && (
                <motion.div
                  layoutId="activeBorder"
                  className="absolute left-0 top-4 bottom-4 w-1 bg-emerald-500 rounded-r-md"
                />
              )}

              <div className="flex justify-between items-start select-none">
                <div>
                  <h4 className="text-sm font-bold text-foreground tracking-tight select-none">
                    {office.name}
                  </h4>
                  <p className="text-xxs text-muted-foreground mt-0.5 select-none">{office.city}</p>
                </div>

                {/* Clock & Status indicator */}
                <div className="flex flex-col items-end select-none">
                  <div className="flex items-center gap-1 text-[10px] font-bold tracking-tight text-foreground select-none">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span>{clockInfo.time}</span>
                  </div>
                  
                  {/* Status Indicator pulse badge */}
                  <span className={cn(
                    "text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full mt-1.5 flex items-center gap-1 select-none border",
                    clockInfo.isOpen
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-zinc-800 text-zinc-500 border-zinc-700/50"
                  )}>
                    <span className={cn("w-1 h-1 rounded-full", clockInfo.isOpen ? "bg-emerald-400 animate-pulse" : "bg-zinc-500")} />
                    {clockInfo.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
              </div>

              {/* Collapsible Info Cards detail (Visible if active) */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-3 pt-3 border-t border-border/80 text-xxs text-muted-foreground space-y-2 select-text"
                  >
                    <div className="flex items-center gap-2 select-text">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate select-text">{office.address}</span>
                    </div>
                    <div className="flex items-center gap-2 select-text">
                      <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="select-text">{office.phone}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Right Column: High-Tech GIS Interactive vector Mockup Map */}
      <div className="lg:col-span-3 aspect-[1.6] bg-zinc-950 text-zinc-300 border border-zinc-900 rounded-2xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Radar Overlay grid system */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10" />

        {/* Compass Calibration Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 border border-zinc-800 px-2.5 py-1.5 rounded-lg text-xxs font-mono font-semibold text-zinc-400 z-10 pointer-events-none">
          <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span>GIS MODULE: READY</span>
        </div>

        {/* Layers control indicator */}
        <div className="absolute top-4 right-4 flex gap-1.5 bg-black/60 border border-zinc-800 px-2 py-2 rounded-lg text-xxs text-zinc-400 z-10 pointer-events-none">
          <Layers className="w-3.5 h-3.5 text-primary" />
        </div>

        {/* Dynamic Vector SVG Map Viewport */}
        {/* We animate the viewBox coordinates to simulate professional GIS Pan/Zooms */}
        <motion.svg
          className="w-full h-full select-none"
          animate={{
            viewBox: `${targetX} ${targetY} ${targetWidth} ${targetHeight}`
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 14 }}
        >
          {/* Mockup continents shapes (using high tech circles pattern block lists) */}
          <g opacity="0.25">
            {/* North America */}
            <ellipse cx="220" cy="180" rx="90" ry="60" fill="#27272a" />
            {/* South America */}
            <ellipse cx="320" cy="360" rx="60" ry="100" fill="#27272a" />
            {/* Europe */}
            <ellipse cx="440" cy="150" rx="60" ry="45" fill="#27272a" />
            {/* Africa */}
            <ellipse cx="480" cy="280" rx="60" ry="80" fill="#27272a" />
            {/* Asia */}
            <ellipse cx="600" cy="180" rx="130" ry="90" fill="#27272a" />
            {/* Australia */}
            <ellipse cx="700" cy="380" rx="60" ry="45" fill="#27272a" />
          </g>

          {/* Latitude/Longitude Grid Markings */}
          <g stroke="#27272a" strokeWidth="1" strokeDasharray="5 5" opacity="0.6">
            {/* Equator */}
            <line x1="0" y1="250" x2="800" y2="250" />
            {/* Meridian */}
            <line x1="400" y1="0" x2="400" y2="500" />
            {/* Extras */}
            <line x1="0" y1="125" x2="800" y2="125" />
            <line x1="0" y1="375" x2="800" y2="375" />
            <line x1="200" y1="0" x2="200" y2="500" />
            <line x1="600" y1="0" x2="600" y2="500" />
          </g>

          {/* Static Offices connecting lines to active */}
          <g stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1.5">
            {offices.map((office, idx) => {
              if (idx === activeIndex) return null;
              const coords = getMapCoords(office.lat, office.lng);
              return (
                <line 
                  key={`line-${idx}`}
                  x1={coords.x} 
                  y1={coords.y} 
                  x2={activeCoords.x} 
                  y2={activeCoords.y} 
                />
              );
            })}
          </g>

          {/* Static Office Node Markers */}
          {offices.map((office, idx) => {
            const coords = getMapCoords(office.lat, office.lng);
            const isActive = idx === activeIndex;

            return (
              <g 
                key={`marker-${idx}`}
                role="button"
                tabIndex={0}
                onClick={() => setActiveIndex(idx)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveIndex(idx); } }}
                className="cursor-pointer"
              >
                {isActive ? (
                  // Active pulsing marker
                  <>
                    <circle cx={coords.x} cy={coords.y} r="14" fill="rgba(16, 185, 129, 0.25)" className="animate-ping" style={{ animationDuration: '3s' }} />
                    <circle cx={coords.x} cy={coords.y} r="8" fill="none" stroke="#10b981" strokeWidth="2" />
                    <circle cx={coords.x} cy={coords.y} r="4" fill="#10b981" />
                  </>
                ) : (
                  // Standard inactive marker
                  <>
                    <circle cx={coords.x} cy={coords.y} r="4" fill="#06b6d4" className="hover:scale-130 transition-transform" />
                    <circle cx={coords.x} cy={coords.y} r="8" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
                  </>
                )}
              </g>
            );
          })}
        </motion.svg>

        {/* Bottom Coordinates & Telemetry Console footer */}
        <div className="h-10 border-t border-zinc-900 bg-zinc-950/80 px-4 flex items-center justify-between text-[10px] font-mono text-zinc-500 z-10 select-none">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="uppercase font-bold text-zinc-400">Target focused:</span>
            <span className="text-zinc-300 font-semibold">{activeOffice.city}</span>
          </div>

          <div className="flex items-center gap-2">
            <Navigation className="w-3 h-3 text-emerald-400" />
            <span className="text-zinc-300 font-semibold">
              LAT: {activeOffice.lat.toFixed(4)}°, LNG: {activeOffice.lng.toFixed(4)}°
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
