"use client";

import React, { useCallback, useRef, useState } from "react";
import { ZoomIn, MousePointer2 } from "lucide-react";
import { cn } from "../lib/cn";

export interface ProductImageZoomLensProps {
  className?: string;
  src?: string;
  alt?: string;
  zoom?: number;
}

const DEFAULT_SRC =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80";

export function ProductImageZoomLens({
  className,
  src = DEFAULT_SRC,
  alt = "Air Max heritage sneaker — side profile, red and white",
  zoom = 2.2,
}: ProductImageZoomLensProps) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = boxRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
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
            ZOOM_LENS
          </span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">
            Hover to magnify · {zoom.toFixed(1)}x
          </span>
        </div>
        <ZoomIn className="w-4 h-4 text-primary" aria-hidden="true" />
      </div>

      <div
        ref={boxRef}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
        onPointerMove={handleMove}
        className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-white/5 bg-bg-3 cursor-zoom-in"
        role="img"
        aria-label={alt}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        <div
          aria-hidden="true"
          className={cn(
            "absolute pointer-events-none rounded-full border-2 border-primary/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] transition-opacity duration-150",
            active ? "opacity-100" : "opacity-0",
          )}
          style={{
            width: 96,
            height: 96,
            left: `calc(${pos.x}% - 48px)`,
            top: `calc(${pos.y}% - 48px)`,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${zoom * 100}% ${zoom * 100}%`,
            backgroundPosition: `${pos.x}% ${pos.y}%`,
          }}
        />

        <div
          className={cn(
            "absolute bottom-2 left-2 flex items-center gap-1 text-[9px] font-mono text-white/70 bg-black/50 px-2 py-1 rounded-md border border-white/10 transition-opacity",
            active ? "opacity-0" : "opacity-100",
          )}
        >
          <MousePointer2 className="w-3 h-3" aria-hidden="true" />
          <span>Move pointer over image</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-white/60">
        <div className="flex justify-between px-2 py-1 rounded-md bg-white/5">
          <span>x</span>
          <span className="text-primary">{pos.x.toFixed(0)}%</span>
        </div>
        <div className="flex justify-between px-2 py-1 rounded-md bg-white/5">
          <span>y</span>
          <span className="text-primary">{pos.y.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
