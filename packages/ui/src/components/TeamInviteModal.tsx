"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Users, Mail, Plus, Check, Copy, Shield, X } from "lucide-react";
import { cn } from "../lib/cn";

export interface TeamInviteModalProps {
  className?: string;
  onClose?: () => void;
}

export const TeamInviteModal: React.FC<TeamInviteModalProps> = ({ className, onClose }) => {
  const [email, setEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<"Admin" | "Member" | "Viewer">("Member");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || invitedEmails.includes(email)) return;
    setInvitedEmails([...invitedEmails, email]);
    setEmail("");
  };

  const handleRemoveEmail = (idx: number) => {
    setInvitedEmails((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://lerpaui.com/invite/x74kd9");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1200);
  };

  return (
    <div className={cn("w-full max-w-[460px] rounded-3xl border border-border/50 bg-card/45 p-8 backdrop-blur-xl shadow-2xl relative select-none", className)}>
      {/* Glow */}
      <div className="absolute -top-16 -left-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Invite Colleagues</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Scale collaboration indexes in real-time</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-[10px] font-black uppercase text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Close
          </button>
        )}
      </div>

      {/* Email input field */}
      <form onSubmit={handleAddEmail} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@domain.com"
            className="w-full bg-secondary/20 border border-border/50 focus:border-primary/50 rounded-xl py-2.5 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center cursor-pointer active:scale-95 transition-all border border-primary/20 shadow-md"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* List of pending email additions */}
      {invitedEmails.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6 max-h-[80px] overflow-y-auto pr-1">
          <AnimatePresence>
            {invitedEmails.map((item, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="inline-flex items-center gap-1.5 py-1 pl-2.5 pr-1.5 rounded-lg border border-primary/20 bg-primary/5 text-[9px] font-black uppercase text-primary tracking-wider"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveEmail(idx)}
                  className="p-0.5 rounded-md hover:bg-primary/20 cursor-pointer"
                >
                  <X className="w-3 h-3 text-primary stroke-[2.5px]" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Role access selectors */}
      <div className="space-y-3 mb-6 bg-secondary/15 border border-border/40 p-4 rounded-2xl">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block pl-0.5">Access Role Parameters</span>
        <div className="grid grid-cols-3 gap-2">
          {(["Admin", "Member", "Viewer"] as const).map((role) => {
            const isSelected = selectedRole === role;
            return (
              <button
                type="button"
                key={role}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-95",
                  isSelected
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-card border-border/50 text-foreground hover:border-primary/30"
                )}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{role}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Referral instant link bottom block */}
      <div className="flex justify-between items-center border-t border-border/30 pt-6">
        <span className="text-[9px] font-bold text-muted-foreground leading-relaxed">
          Generate quick invite link
        </span>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-secondary border border-border/50 text-[10px] font-black uppercase text-foreground hover:border-primary/30 transition-all cursor-pointer active:scale-95"
        >
          {copiedLink ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span>Copied invite</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
