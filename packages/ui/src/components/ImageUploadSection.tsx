"use client";

import React, { useState } from "react";
import { ImagePlus, Image as ImageIcon, X, Star } from "lucide-react";
import { cn } from "../lib/cn";

type Pic = { id: number; name: string; gradient: string };

const PICS: Pic[] = [
  { id: 1, name: "hero.jpg", gradient: "from-rose-500/50 to-orange-400/40" },
  { id: 2, name: "team.png", gradient: "from-sky-500/50 to-indigo-500/40" },
  { id: 3, name: "product.webp", gradient: "from-emerald-500/50 to-teal-400/40" },
];

export interface ImageUploadSectionProps {
  className?: string;
}

export function ImageUploadSection({ className }: ImageUploadSectionProps) {
  const [pics, setPics] = useState<Pic[]>(PICS);
  const [cover, setCover] = useState(1);
  const [dragging, setDragging] = useState(false);

  const remove = (id: number) => setPics((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground text-left", className)}>
      <h3 className="text-base font-bold mb-4">Upload images</h3>

      <button
        type="button"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); }}
        className={cn(
          "w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-foreground/[0.12] hover:border-foreground/[0.2] hover:bg-foreground/[0.02]",
        )}
      >
        <ImagePlus className="w-8 h-8 text-muted-foreground/40" />
        <span className="text-sm font-semibold">Drop images or <span className="text-primary">browse</span></span>
        <span className="text-xs text-muted-foreground/45">PNG, JPG, WEBP — up to 10 MB each</span>
      </button>

      {pics.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {pics.map((p) => (
            <div key={p.id} className="group relative aspect-square rounded-xl overflow-hidden border border-foreground/[0.06]">
              <div className={cn("absolute inset-0 bg-gradient-to-br flex items-center justify-center", p.gradient)}>
                <ImageIcon className="w-7 h-7 text-white/60" />
              </div>
              <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] px-1.5 py-0.5 truncate">{p.name}</span>

              <button
                type="button"
                aria-label={`Remove ${p.name}`}
                onClick={() => remove(p.id)}
                className="absolute right-1 top-1 p-1.5 rounded-full bg-black/50 text-white/80 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                aria-label={cover === p.id ? `${p.name} is cover image` : `Set ${p.name} as cover`}
                aria-pressed={cover === p.id}
                onClick={() => setCover(p.id)}
                className={cn(
                  "absolute left-1 top-1 p-1.5 rounded-full transition-colors",
                  cover === p.id ? "bg-amber-400 text-black" : "bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:text-amber-300",
                )}
              >
                <Star className={cn("w-3.5 h-3.5", cover === p.id && "fill-black")} />
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground/40">Tap the star to set a cover image.</p>
    </div>
  );
}
