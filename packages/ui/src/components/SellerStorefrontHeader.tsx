"use client";

import React from "react";
import { Star, Award, Search } from "lucide-react";

export function SellerStorefrontHeader() {
  return (
    <div className="w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl select-none font-sans overflow-hidden text-foreground">
      <div className="h-28 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 p-4 flex items-end justify-between relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="text-[9px] uppercase font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full backdrop-blur-md">Verified Shop</span>
        </div>
      </div>
      <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 border-4 border-card flex items-center justify-center shadow-lg -mt-12">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-base font-extrabold leading-none mb-1 flex items-center gap-1.5">ApexUI Creations</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> 4.95</span>
              <span>•</span>
              <span>1.2k Assets Sold</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search store assets..." 
              className="pl-8 pr-3 py-1.5 bg-secondary/30 border border-white/[0.04] rounded-xl text-xs focus:outline-none focus:border-emerald-500/50 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}