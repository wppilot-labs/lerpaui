'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

interface OfficeLocation {
  name: string;
  lat: number;
  lon: number;
  color?: string;
}

interface InteractiveGlobeCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number;
  height?: number;
  globeRadius?: number;
  dotColor?: string;
  dotSize?: number;
  autoRotateSpeed?: number;
  offices?: OfficeLocation[];
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  isOffice?: boolean;
  officeName?: string;
  officeColor?: string;
}

const DEFAULT_OFFICES: OfficeLocation[] = [
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194, color: '#f43f5e' }, // Rose
  { name: 'London', lat: 51.5074, lon: -0.1278, color: '#3b82f6' }, // Blue
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, color: '#10b981' }, // Green
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, color: '#eab308' }, // Yellow
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946, color: '#a855f7' }, // Purple
  { name: 'S�o Paulo', lat: -23.5505, lon: -46.6333, color: '#f97316' }, // Orange
];

export function InteractiveGlobeCanvas({
  width = 600,
  height = 600,
  globeRadius = 200,
  dotColor = 'rgba(168, 85, 247, 0.45)', // Sleek Indigo/Purple
  dotSize = 2,
  autoRotateSpeed = 0.005,
  offices = DEFAULT_OFFICES,
  className,
  ...props
}: InteractiveGlobeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [_hoveredOffice, _setHoveredOffice] = useState<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // 3D rotation angles
  const angleY = useRef(0);
  const angleX = useRef(0);

  // Drag velocities for physical glide momentum
  const dragVelocityX = useRef(0);
  const dragVelocityY = useRef(0);

  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);
  const pingPulse = useRef(0);

  // Helper: Convert Lat/Lon to 3D Cartesian coordinates
  const latLonTo3D = (lat: number, lon: number, radius: number): Point3D => {
    const radLat = (lat * Math.PI) / 180;
    const radLon = (lon * Math.PI) / 180;
    return {
      x: radius * Math.cos(radLat) * Math.sin(radLon),
      y: -radius * Math.sin(radLat), // negative because screen Y increases downwards
      z: radius * Math.cos(radLat) * Math.cos(radLon),
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set pixel density ratio
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Generate 3D grid points (latitude/longitude meridians)
    const points: Point3D[] = [];
    const step = 15; // spacing in degrees

    // Generate grid coordinates
    for (let lat = -80; lat <= 80; lat += step) {
      for (let lon = -180; lon < 180; lon += step) {
        points.push(latLonTo3D(lat, lon, globeRadius));
      }
    }

    // Generate office coordinates
    const officePoints: Point3D[] = offices.map((o) => ({
      ...latLonTo3D(o.lat, o.lon, globeRadius),
      isOffice: true,
      officeName: o.name,
      officeColor: o.color,
    }));

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Increment rotation and handle inertia
      if (!isDragging.current) {
        // Slow auto rotate
        angleY.current += autoRotateSpeed;
        
        // Glide momentum decaying with friction
        angleY.current += dragVelocityX.current;
        angleX.current += dragVelocityY.current;
        dragVelocityX.current *= 0.95;
        dragVelocityY.current *= 0.95;
      } else {
        // Apply smooth decay even while dragging to prevent huge jumps
        dragVelocityX.current *= 0.8;
        dragVelocityY.current *= 0.8;
      }

      // Update ping pulse animation time
      pingPulse.current = (pingPulse.current + 0.05) % (Math.PI * 2);

      const cosY = Math.cos(angleY.current);
      const sinY = Math.sin(angleY.current);
      const cosX = Math.cos(angleX.current);
      const sinX = Math.sin(angleX.current);

      // We will render points. Sort by Z depth so back points render first (proper occlusion)
      const allPoints = [...points, ...officePoints];
      const projectedPoints = allPoints
        .map((p) => {
          // 1. Rotate Y-axis
          const x1 = p.x * cosY - p.z * sinY;
          const z1 = p.x * sinY + p.z * cosY;

          // 2. Rotate X-axis
          const y2 = p.y * cosX - z1 * sinX;
          const z2 = p.y * sinX + z1 * cosX;

          // Standard 3D projection scale
          const perspective = 500;
          const scale = perspective / (perspective + z2);
          const projX = width / 2 + x1 * scale;
          const projY = height / 2 + y2 * scale;

          return {
            x: projX,
            y: projY,
            z: z2,
            isOffice: p.isOffice,
            officeName: p.officeName,
            officeColor: p.officeColor,
          };
        })
        .sort((a, b) => b.z - a.z); // Farther points first

      // Draw grid points
      projectedPoints.forEach((p) => {
        // Occlude back points by checking depth Z
        const isFront = p.z > 0;
        const opacity = isFront
          ? Math.max(0.15, (globeRadius - p.z) / (globeRadius * 2))
          : Math.max(0.04, (globeRadius + p.z) / (globeRadius * 3));

        if (!p.isOffice) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, dotSize * (p.z > 0 ? 1.2 : 0.8), 0, Math.PI * 2);
          ctx.fillStyle = dotColor;
          ctx.globalAlpha = opacity;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        } else if (p.z > -40) {
          // Draw Office Dot
          const color = p.officeColor || '#a855f7';
          
          // Draw dynamic pulse wave ring (front dots only)
          if (p.z > 0) {
            const pulseRadius = Math.max(0.1, 6 + Math.sin(pingPulse.current) * 8);
            ctx.beginPath();
            ctx.arc(p.x, p.y, pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = Math.max(0, Math.min(1, 1 - (pulseRadius - 6) / 8));
            ctx.stroke();
          }

          // Solid core office dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.z > 0 ? 5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowBlur = p.z > 0 ? 10 : 0;
          ctx.shadowColor = color;
          ctx.globalAlpha = p.z > 0 ? 1.0 : 0.45;
          ctx.fill();
          
          // Reset shadow
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;

          // Render Label for prominent front office dots
          if (p.z > 50 && p.officeName) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(p.officeName.toUpperCase(), p.x, p.y - 10);
            
            // Sub-label line
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - 3);
            ctx.lineTo(p.x, p.y - 8);
            ctx.stroke();
          }
        }
      });

      if (!prefersReducedMotion) {
        animationFrameId.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [width, height, globeRadius, dotColor, dotSize, autoRotateSpeed, offices, prefersReducedMotion]);

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) {
      // Detect hovering over canvas center for interactive effects
      return;
    }

    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;

    // Convert mouse movement to angle velocities
    dragVelocityX.current = dx * 0.003;
    dragVelocityY.current = dy * 0.003;

    angleY.current += dragVelocityX.current;
    angleX.current += dragVelocityY.current;

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - lastMousePos.current.x;
    const dy = e.touches[0].clientY - lastMousePos.current.y;

    dragVelocityX.current = dx * 0.005;
    dragVelocityY.current = dy * 0.005;

    angleY.current += dragVelocityX.current;
    angleX.current += dragVelocityY.current;

    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-center justify-center bg-zinc-950 p-6 border border-zinc-800 rounded-3xl select-none overflow-hidden max-w-full",
        className
      )}
      {...props}
    >
      <div className="absolute top-4 left-4 flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full z-10">
        <Globe className="w-4 h-4 text-purple-400 animate-spin-slow" />
        <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-300">
          VECTOR MERIDIAN ORB
        </span>
      </div>

      <div className="relative cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          style={{ width, height }}
          className="max-w-full h-auto block"
        />
      </div>

      <div className="text-center mt-2 z-10">
        <span className="text-[10px] font-semibold font-mono tracking-widest text-zinc-500 uppercase">
          DRAG TO ROTATE & GLIDE SPHERE WITH MOMENTUM
        </span>
      </div>
    </div>
  );
}
