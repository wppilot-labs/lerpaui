"use client";

import React, { useRef, useState } from "react";
import { ZoomIn } from "lucide-react";
import { cn } from "../lib/cn";

export interface ProductZoomGalleryProps {
  className?: string;
}

export function ProductZoomGallery({ className }: ProductZoomGalleryProps) {
  const [zooming, setZooming] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div
      className={cn(
        "w-full max-w-xs bg-card/45 backdrop-blur-xl border border-border/50 p-3 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div
        ref={ref}
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={handleMove}
        className="relative h-52 rounded-xl overflow-hidden border border-foreground/[0.05] cursor-zoom-in"
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#6366f1_0%,#0ea5e9_40%,#0f172a_100%)] transition-transform duration-150"
          style={{
            transform: zooming ? "scale(2.2)" : "scale(1)",
            transformOrigin: `${pos.x}% ${pos.y}%`,
          }}
        />
        {/* fine pattern to make the zoom legible */}
        <div
          className="absolute inset-0 opacity-30 transition-transform duration-150 [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:14px_14px]"
          style={{
            transform: zooming ? "scale(2.2)" : "scale(1)",
            transformOrigin: `${pos.x}% ${pos.y}%`,
          }}
        />

        {!zooming && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 text-xs font-semibold text-foreground bg-muted backdrop-blur px-2 py-1 rounded-lg">
            <ZoomIn className="w-3.5 h-3.5" /> Hover to zoom
          </span>
        )}

        {zooming && (
          <span className="absolute top-2 left-2 text-xs font-bold text-foreground bg-muted backdrop-blur px-2 py-0.5 rounded">
            {Math.round(pos.x)}% · {Math.round(pos.y)}%
          </span>
        )}
      </div>

      <p className="mt-2.5 text-xs text-muted-foreground/55 text-center">
        Move your cursor over the image to magnify
      </p>
    </div>
  );
}
