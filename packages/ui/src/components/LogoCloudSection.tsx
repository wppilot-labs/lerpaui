"use client";

import React from "react";
import { Hexagon, Triangle, Circle, Square, Diamond, Octagon } from "lucide-react";
import { cn } from "../lib/cn";

type Logo = { name: string; Icon: React.ElementType };

const LOGOS: Logo[] = [
  { name: "Hexa", Icon: Hexagon },
  { name: "Vertex", Icon: Triangle },
  { name: "Orbit", Icon: Circle },
  { name: "Quad", Icon: Square },
  { name: "Prism", Icon: Diamond },
  { name: "Octane", Icon: Octagon },
];

export interface LogoCloudSectionProps {
  className?: string;
}

export function LogoCloudSection({ className }: LogoCloudSectionProps) {
  return (
    <div className={cn("w-full max-w-3xl font-sans text-foreground text-center", className)}>
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 mb-6">
        Trusted by teams at
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-6 gap-y-8">
        {LOGOS.map((l) => (
          <div
            key={l.name}
            className="flex items-center justify-center gap-1.5 text-muted-foreground/45 hover:text-foreground transition-colors"
          >
            <l.Icon className="w-5 h-5" />
            <span className="text-[13px] font-bold tracking-tight">{l.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
