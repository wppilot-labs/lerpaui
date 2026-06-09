"use client";

import React, { useState } from "react";

export function BlogAuthorCard() {
  const [subs, setSubs] = useState(1420);
  const [voted, setVoted] = useState(false);

  return (
    <div className="w-full max-w-xs bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl select-none font-sans overflow-hidden text-foreground">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
            AB
          </div>
          <div>
            <h4 className="text-xs font-black leading-none mb-1">Alex Bennett</h4>
            <span className="text-[9px] uppercase font-bold text-violet-400">Core UI Engineer</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/60 leading-normal">
          Writing about Next.js static optimizations, dark HSL glassmorphism design tokens, and creative animation presets.
        </p>

        <div className="pt-3.5 border-t border-white/[0.04] flex items-center justify-between text-xs">
          <span className="text-muted-foreground/60">{subs.toLocaleString()} subscribers</span>
          <button 
            onClick={() => {
              if (!voted) {
                setSubs(subs + 1);
                setVoted(true);
              }
            }}
            className="text-violet-400 font-bold hover:text-violet-300 transition-colors"
          >
            {voted ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
}