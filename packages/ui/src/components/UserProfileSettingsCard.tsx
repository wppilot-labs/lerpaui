"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { Settings, Shield, User, Sparkles, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface UserProfileSettingsCardProps {
  className?: string;
}

export const UserProfileSettingsCard: React.FC<UserProfileSettingsCardProps> = ({ className }) => {
  const [activeSubTab, setActiveSubTab] = useState<"account" | "security">("account");
  const [name, setName] = useState("Ada Lovelace");
  const [email, setEmail] = useState("ada@analytical.net");
  const [password, setPassword] = useState("");
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 1500);
  };

  const getPasswordStrength = () => {
    if (!password) return { label: "Empty", percent: 0, colorClass: "bg-border" };
    if (password.length < 6) return { label: "Weak", percent: 30, colorClass: "bg-destructive" };
    if (password.length < 10) return { label: "Good", percent: 65, colorClass: "bg-amber-400" };
    return { label: "Excellent", percent: 100, colorClass: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

  return (
    <div className={cn("w-full max-w-[500px] rounded-3xl border border-border/50 bg-card/45 p-8 backdrop-blur-xl shadow-2xl relative select-none", className)}>
      {/* Luxury glow */}
      <div className="absolute -top-24 -right-24 w-44 h-44 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border/30 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Settings className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-foreground block font-mono">Profile Settings</span>
            <span className="text-[8px] text-muted-foreground uppercase font-black tracking-wider block">Manage preferences</span>
          </div>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex bg-secondary/40 p-1 rounded-xl border border-border/30 mb-6 relative">
        <button
          onClick={() => setActiveSubTab("account")}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-lg relative z-10 transition-colors cursor-pointer flex items-center justify-center gap-1.5",
            activeSubTab === "account" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <User className="w-3.5 h-3.5" />
          <span>Account Settings</span>
          {activeSubTab === "account" && (
            <motion.div
              layoutId="profile-settings-tab"
              className="absolute inset-0 bg-card rounded-lg shadow-sm border border-border/40 -z-10"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
        
        <button
          onClick={() => setActiveSubTab("security")}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-lg relative z-10 transition-colors cursor-pointer flex items-center justify-center gap-1.5",
            activeSubTab === "security" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Keys</span>
          {activeSubTab === "security" && (
            <motion.div
              layoutId="profile-settings-tab"
              className="absolute inset-0 bg-card rounded-lg shadow-sm border border-border/40 -z-10"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* Form panel */}
      <form onSubmit={handleSave} className="space-y-4">
        {activeSubTab === "account" ? (
          <div className="space-y-4">
            {/* Avatar mock */}
            <div className="flex items-center gap-4 bg-secondary/10 border border-border/30 p-4 rounded-2xl mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg font-black text-primary select-none shrink-0 relative">
                AL
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-card absolute bottom-[-1px] right-[-1px]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Profile Avatar</span>
                <span className="text-xs font-bold text-foreground block mt-0.5">Ada Lovelace</span>
                <span className="text-[9px] text-muted-foreground mt-0.5 block">Drag and drop mock avatar image here</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-1">
              <label htmlFor="display-name" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Display Name</label>
              <input id="display-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First Last"
                className="w-full bg-secondary/20 border border-border/50 focus:border-primary/50 rounded-xl py-2.5 px-4 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email-coordinates" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Email Coordinates</label>
              <input id="email-coordinates"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@analytical.net"
                className="w-full bg-secondary/20 border border-border/50 focus:border-primary/50 rounded-xl py-2.5 px-4 text-xs text-foreground outline-none transition-all"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Password changes */}
            <div className="space-y-1">
              <label htmlFor="new-security-password" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">New Security Password</label>
              <input id="new-security-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-secondary/20 border border-border/50 focus:border-primary/50 rounded-xl py-2.5 px-4 text-xs text-foreground outline-none transition-all"
              />
            </div>

            {/* Strength meter */}
            {password && (
              <div className="space-y-2 bg-secondary/15 border border-border/40 p-4 rounded-xl">
                <div className="flex justify-between items-center text-[9px] font-black uppercase text-muted-foreground tracking-wider">
                  <span>Strength Meter</span>
                  <span className="text-foreground">{strength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-secondary/35 border border-border/30 rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full", strength.colorClass)}
                    animate={{ width: `${strength.percent}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 18 }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Saved Toast Alerts */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/30 justify-between">
          <div>
            {savedAlert && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1 text-[10px] font-bold text-emerald-500"
              >
                <Check className="w-3.5 h-3.5 stroke-[3px]" />
                <span>Configuration changes saved successfully</span>
              </motion.div>
            )}
          </div>

          <button
            type="submit"
            className="bg-primary text-primary-foreground font-bold text-xs py-2 px-6 rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border border-primary/20 shadow-md shadow-primary/5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
