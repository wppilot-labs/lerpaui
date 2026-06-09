"use client";

import React, { useRef, useState } from "react";
import { Camera, Upload, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";

export interface AccountAvatarUploadProps {
  className?: string;
}

export function AccountAvatarUpload({ className }: AccountAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const readFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-1">Profile photo</h3>
      <p className="text-xs text-muted-foreground/70 mb-4">PNG or JPG, up to 2&nbsp;MB</p>

      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 rounded-full overflow-hidden border border-foreground/10 bg-secondary/40 flex items-center justify-center shrink-0">
          {preview ? (
            <img src={preview} alt="Avatar preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-muted-foreground">JD</span>
          )}
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); readFile(e.dataTransfer.files?.[0]); }}
          className={cn(
            "flex-1 rounded-xl border border-dashed px-3 py-3 text-center transition-colors",
            dragging ? "border-primary/50 bg-primary/5" : "border-foreground/10 bg-foreground/[0.02]",
          )}
        >
          <p className="text-xs text-muted-foreground/60">Drag &amp; drop, or</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <Upload className="w-3.5 h-3.5" /> Browse files
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="sr-only"
            aria-label="Upload profile photo"
            onChange={(e) => readFile(e.target.files?.[0] ?? undefined)}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all"
        >
          <Camera className="w-3.5 h-3.5" /> Change
        </button>
        <button
          type="button"
          onClick={() => setPreview(null)}
          disabled={!preview}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-secondary/50 border border-foreground/[0.06] text-muted-foreground hover:text-red-400 disabled:opacity-40 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Remove
        </button>
      </div>
    </div>
  );
}
