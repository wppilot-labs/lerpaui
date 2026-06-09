"use client";

import React from "react";
import { Camera, ImageIcon } from "lucide-react";
import { cn } from "../lib/cn";

type Photo = { id: string; user: string; gradient: string; rating: number };

const PHOTOS: Photo[] = [
  { id: "1", user: "Dana R.", gradient: "from-rose-400 to-orange-300", rating: 5 },
  { id: "2", user: "Leo M.", gradient: "from-sky-400 to-indigo-400", rating: 5 },
  { id: "3", user: "Amira K.", gradient: "from-emerald-400 to-teal-300", rating: 4 },
  { id: "4", user: "Tomás V.", gradient: "from-violet-400 to-fuchsia-400", rating: 5 },
  { id: "5", user: "Iris P.", gradient: "from-amber-400 to-yellow-300", rating: 5 },
  { id: "6", user: "Noah B.", gradient: "from-cyan-400 to-blue-400", rating: 4 },
];

export interface ReviewPhotoGridProps {
  className?: string;
}

export function ReviewPhotoGrid({ className }: ReviewPhotoGridProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border/50 bg-card/60 p-5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Camera className="h-4 w-4 text-primary" />
          <h3 className="text-base font-bold">Customer photos</h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground/50">312 with photos</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {PHOTOS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-label={`Photo from ${p.user}, rated ${p.rating} stars`}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br ring-1 ring-inset ring-foreground/10 transition-transform hover:scale-[1.03]",
              p.gradient,
            )}
          >
            <ImageIcon className="absolute inset-0 m-auto h-6 w-6 text-white/40" />
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-3 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              <span className="truncate">{p.user}</span>
              <span>★{p.rating}</span>
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="mt-3 w-full rounded-xl border border-foreground/[0.06] py-2.5 text-sm font-bold text-primary transition-colors hover:bg-foreground/[0.03]"
      >
        See all photos
      </button>
    </div>
  );
}
