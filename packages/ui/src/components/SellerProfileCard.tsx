"use client";

import React, { useState } from "react";
import { Star, Award } from "lucide-react";

export function SellerProfileCard() {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="w-full max-w-xs bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl select-none font-sans overflow-hidden text-foreground">
      <div className="h-16 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 relative" />
      <div className="px-4 pb-4 relative">
        <div className="-mt-8 mb-3 flex items-end justify-between">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 border-4 border-card flex items-center justify-center shadow-lg">
            <Award className="w-8 h-8 text-white" />
          </div>
          <button 
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all ${
              isFollowing ? "bg-secondary text-foreground border-border" : "bg-emerald-600 hover:bg-emerald-500 text-white border-transparent"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-extrabold">AeroLabs Store</h3>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-extrabold uppercase border border-emerald-500/20">Pro Seller</span>
          </div>
          <p className="text-xs text-muted-foreground/60 leading-normal">Premium React design frameworks and interactive animations creators.</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-white/[0.04]">
          <div className="text-xs">
            <span className="block text-[8px] text-muted-foreground/50 uppercase font-bold">Feedback Rating</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-extrabold">4.98</span>
              <span className="text-[9px] text-muted-foreground/50">(420 reviews)</span>
            </div>
          </div>
          <div className="text-xs">
            <span className="block text-[8px] text-muted-foreground/50 uppercase font-bold">Response Speed</span>
            <span className="block font-extrabold mt-0.5 text-emerald-400">Under 15 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}