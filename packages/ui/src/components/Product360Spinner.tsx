"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { RotateCw, Hand } from "lucide-react";
import { cn } from "../lib/cn";

export interface Product360SpinnerProps {
  className?: string;
  frames?: number;
}

const ACCENT_HEX = "#c9ff37";

// Generates a frame index -> data URL via gradient + tilt; placeholder for real 360 capture.
function frameSvg(i: number, total: number) {
  const angle = (i / total) * 360;
  const c1 = `hsl(${(angle + 180) % 360}, 65%, 18%)`;
  const c2 = `hsl(${(angle + 220) % 360}, 70%, 38%)`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 180'>
    <defs><radialGradient id='g' cx='${50 + Math.cos((angle * Math.PI) / 180) * 18}%' cy='50%' r='65%'>
      <stop offset='0%' stop-color='${c2}'/>
      <stop offset='100%' stop-color='${c1}'/>
    </radialGradient></defs>
    <rect width='100%' height='100%' fill='url(%23g)'/>
    <g transform='translate(120 96) rotate(${angle / 2}) translate(-120 -96)'>
      <ellipse cx='120' cy='96' rx='62' ry='44' fill='${c2}' opacity='0.85'/>
      <ellipse cx='120' cy='96' rx='42' ry='28' fill='${c1}' opacity='0.95'/>
      <circle cx='${120 + Math.cos(angle * 0.04) * 14}' cy='${96 + Math.sin(angle * 0.04) * 8}' r='8' fill='${ACCENT_HEX}'/>
    </g>
    <text x='12' y='168' font-family='monospace' font-size='10' fill='%23ffffff66'>FR ${String(i + 1).padStart(2, "0")}/${total}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${svg.replace(/\n/g, "").replace(/#/g, "%23")}`;
}

export function Product360Spinner({
  className,
  frames = 36,
}: Product360SpinnerProps) {
  const [index, setIndex] = useState(0);
  const dragRef = useRef<{ startX: number; startIndex: number } | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const frameUrls = useRef<string[]>([]);
  if (frameUrls.current.length === 0) {
    frameUrls.current = Array.from({ length: frames }, (_, i) => frameSvg(i, frames));
  }

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);
      dragRef.current = { startX: e.clientX, startIndex: index };
      setDragging(true);
    },
    [index],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current || !stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const delta = (e.clientX - dragRef.current.startX) / rect.width;
      const next = Math.round(dragRef.current.startIndex - delta * frames);
      setIndex(((next % frames) + frames) % frames);
    },
    [frames],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragRef.current = null;
    setDragging(false);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setIndex((i) => (i + 1) % frames);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((i) => (i - 1 + frames) % frames);
      }
    },
    [frames],
  );

  useEffect(() => {
    // hint user with a tiny idle nudge once mounted (motion-safe via CSS)
    return () => {
      dragRef.current = null;
    };
  }, []);

  return (
    <div
      className={cn(
        "w-full max-w-xs bg-card/45 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl select-none overflow-hidden text-foreground p-4 flex flex-col gap-3",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">
            SPIN_360
          </span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">
            Drag to rotate · {frames} frames
          </span>
        </div>
        <RotateCw
          className={cn("w-4 h-4 text-primary", dragging ? "motion-safe:animate-spin" : "")}
          aria-hidden="true"
        />
      </div>

      <div
        ref={stageRef}
        role="slider"
        tabIndex={0}
        aria-label="Rotate product 360 degrees"
        aria-valuemin={0}
        aria-valuemax={frames - 1}
        aria-valuenow={index}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className={cn(
          "relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-white/5 bg-bg-3 touch-none focus:outline-none focus:ring-2 focus:ring-primary/60",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        <img
          src={frameUrls.current[index]}
          alt={`Product frame ${index + 1} of ${frames}`}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[9px] font-mono text-white/70 bg-black/50 px-2 py-1 rounded-md border border-white/10">
            <Hand className="w-3 h-3" aria-hidden="true" />
            <span>{dragging ? "rotating" : "drag me"}</span>
          </div>
          <span className="text-[9px] font-mono text-white/70 bg-black/50 px-2 py-1 rounded-md border border-white/10">
            {String(index + 1).padStart(2, "0")} / {frames}
          </span>
        </div>
      </div>

      <div
        role="presentation"
        className="h-1.5 rounded-full bg-white/5 overflow-hidden"
      >
        <div
          className="h-full bg-primary"
          style={{ width: `${((index + 1) / frames) * 100}%` }}
        />
      </div>
    </div>
  );
}
