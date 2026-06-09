"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { X, ShieldCheck, AlertCircle } from "lucide-react";
import { cn } from "../lib/cn";

interface ActiveToast {
  id: string;
  title: string;
  desc: string;
  severity: "success" | "error";
}

export function AmbientGlowToastNotifications() {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  const triggerToast = (severity: "success" | "error") => {
    const id = Date.now().toString();
    const newToast: ActiveToast = severity === "success"
      ? { id, title: "SECURE_GATEWAY_OK", desc: "Pipeline synchronization established safely.", severity }
      : { id, title: "GATEWAY_BRIDGE_ERR", desc: "Handshake package failed to synchronize.", severity };

    setToasts((prev) => [...prev, newToast]);

    // Self dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return (
    <div
      className="relative flex flex-col justify-between border border-white/5 bg-zinc-950/40 rounded-2xl p-6 shadow-2xl overflow-hidden font-sans select-none"
      style={{ width: 340, height: 260 }}
    >
      <div className="absolute top-4 left-4 flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">AMBIENT_TOAST</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Click buttons to trigger floating toasts</span>
      </div>

      {/* Controller Buttons */}
      <div className="flex flex-col gap-2 mt-12 w-full z-10">
        <button
          onClick={() => triggerToast("success")}
          className="h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform duration-200 hover:scale-103"
        >
          <ShieldCheck className="w-4.5 h-4.5" />
          Trigger Success Toast
        </button>

        <button
          onClick={() => triggerToast("error")}
          className="h-9 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform duration-200 hover:scale-103"
        >
          <AlertCircle className="w-4.5 h-4.5" />
          Trigger Error Toast
        </button>
      </div>

      <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest mt-auto">
        NOTIFICATION_SHELL // ONLINE
      </div>

      {/* Floating Toast Notification Stack Layer */}
      <div className="absolute bottom-4 right-4 left-4 flex flex-col gap-2 pointer-events-none z-40">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className={cn(
                "w-full bg-zinc-950/95 border p-3.5 rounded-xl flex items-start gap-3 pointer-events-auto relative shadow-2xl overflow-hidden",
                toast.severity === "success" 
                  ? "border-emerald-500/30 shadow-[0_4px_25px_rgba(16,185,129,0.1)]" 
                  : "border-red-500/30 shadow-[0_4px_25px_rgba(239,68,68,0.1)]"
              )}
            >
              {/* Backing Ambient Neon Glow Element */}
              <div 
                className={cn(
                  "absolute inset-0 opacity-15 pointer-events-none z-0 blur-[15px]",
                  toast.severity === "success" ? "bg-emerald-500" : "bg-red-500"
                )} 
              />

              <div className="relative z-10 shrink-0 mt-0.5">
                {toast.severity === "success" ? (
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                )}
              </div>

              {/* Toast Context Details */}
              <div className="relative z-10 flex-1 flex flex-col gap-0.5">
                <span className="text-[10px] font-mono font-extrabold text-white leading-none tracking-wider">
                  {toast.title}
                </span>
                <span className="text-[8px] text-white/50 leading-relaxed font-sans mt-1">
                  {toast.desc}
                </span>
              </div>

              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="relative z-10 text-white/40 hover:text-white cursor-pointer self-start"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
