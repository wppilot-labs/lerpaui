"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import { cn } from "../lib/cn";

export interface AccountProfileSettingsProps {
  className?: string;
}

export function AccountProfileSettings({ className }: AccountProfileSettingsProps) {
  const [bio, setBio] = useState("Designing calm interfaces for complex systems.");
  const max = 160;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}
    >
      <div className="flex items-center gap-2 mb-4">
        <User className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Edit profile</h3>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div>
          <label htmlFor="pf-first" className="block text-xs font-semibold text-muted-foreground/70 mb-1">First name</label>
          <input id="pf-first" defaultValue="Jane" className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="pf-last" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Last name</label>
          <input id="pf-last" defaultValue="Doe" className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none" />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="pf-username" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Username</label>
        <div className="flex items-center bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl px-3 focus-within:ring-1 focus-within:ring-primary/50">
          <span className="text-sm text-muted-foreground/40">@</span>
          <input id="pf-username" defaultValue="janedoe" className="flex-1 bg-transparent py-2 pl-1 text-sm focus:outline-none" />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="pf-bio" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Bio</label>
        <textarea
          id="pf-bio"
          value={bio}
          maxLength={max}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full resize-none bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none"
        />
        <div className="text-right text-[11px] text-muted-foreground/40 mt-1">{bio.length}/{max}</div>
      </div>

      <div className="flex gap-2">
        <button type="reset" className="flex-1 py-2 text-xs font-bold rounded-xl bg-secondary/50 border border-foreground/[0.05] text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
        <button type="submit" className="flex-1 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all">Save changes</button>
      </div>
    </form>
  );
}
