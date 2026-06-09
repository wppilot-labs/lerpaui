"use client";

import React, { useRef, useState } from "react";
import { Boxes, Gauge, ShieldCheck } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

type Cell = { icon: React.ReactNode; title: string; body: string; span?: boolean };

const CELLS: Cell[] = [
  { icon: <Gauge className="h-5 w-5" />, title: "Realtime metrics", body: "Sub-second dashboards out of the box.", span: true },
  { icon: <ShieldCheck className="h-5 w-5" />, title: "Secure", body: "SOC 2, SSO, audit logs." },
  { icon: <Boxes className="h-5 w-5" />, title: "Composable", body: "Mix primitives freely." },
];

export interface TiltBentoGridProps {
  className?: string;
}

/**
 * Signature bento — the hovered cell tilts toward the cursor in 3D while siblings
 * recede. Coordinated neighbor response. Reduced-motion safe, theme-aware.
 */
export function TiltBentoGrid({ className }: TiltBentoGridProps) {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const onMove = (i: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = refs.current[i]?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 8, ry: px * 8 });
  };

  return (
    <div className={cn("w-full max-w-md [perspective:1000px]", className)}>
      <div className="grid grid-cols-2 gap-3">
        {CELLS.map((c, i) => {
          const isActive = active === i;
          const dim = active !== null && !isActive;
          return (
            <div
              key={c.title}
              ref={(el) => { refs.current[i] = el; }}
              onPointerMove={onMove(i)}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => { setActive(null); setTilt({ rx: 0, ry: 0 }); }}
              className={cn(
                "rounded-2xl border border-border bg-card text-card-foreground p-5 shadow-sm transition-[transform,opacity,box-shadow] duration-200 [transform-style:preserve-3d]",
                c.span && "col-span-2",
                isActive && "shadow-lg",
                dim && "opacity-60",
              )}
              style={isActive && !reduced ? { transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(8px)` } : undefined}
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {c.icon}
              </div>
              <h3 className="mt-3 text-sm font-semibold">{c.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
