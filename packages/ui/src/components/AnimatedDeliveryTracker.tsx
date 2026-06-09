"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { Truck, CheckCircle2, Box, Send, Calendar } from "lucide-react";
import { cn } from "../lib/cn";

interface Milestone {
  id: number;
  label: string;
  desc: string;
  date: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function AnimatedDeliveryTracker({ className }: { className?: string }) {
  const milestones: Milestone[] = [
    { id: 1, label: "Order Placed", desc: "Your purchase is confirmed.", date: "May 20, 10:30 AM", icon: Box },
    { id: 2, label: "Shipped", desc: "Outbound carrier picked up shipment.", date: "May 21, 02:15 PM", icon: Send },
    { id: 3, label: "In Transit", desc: "Shipment reached sorting center.", date: "May 22, 08:45 AM", icon: Truck },
    { id: 4, label: "Delivered", desc: "Parcel handed directly to customer.", date: "Expected Today", icon: CheckCircle2 },
  ];

  const [activeStep, setActiveStep] = useState(3); // Under "In Transit"

  return (
    <div className={cn("w-full max-w-md rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur-xl shadow-2xl space-y-6", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">Delivery Tracking</h3>
        <p className="text-[10px] text-muted-foreground">Elastic connection routing timeline</p>
      </div>

      <div className="relative pl-6 space-y-6">
        {/* Glowing vertical connector beam */}
        <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-zinc-800">
          <motion.div
            className="w-full bg-gradient-to-b from-primary to-emerald-400 origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: (activeStep - 1) / (milestones.length - 1) }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            style={{ height: "100%" }}
          />
        </div>

        {milestones.map((step) => {
          const Icon = step.icon;
          const isPassed = step.id <= activeStep;
          const isActive = step.id === activeStep;

          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveStep(step.id); } }}
              className="relative flex gap-4 cursor-pointer select-none group"
            >
              {/* Dynamic Step Circle Indicator */}
              <div className="absolute -left-[20px] top-0.5 z-10 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    borderColor: isPassed ? "var(--color-primary, #3b82f6)" : "rgba(255,255,255,0.1)",
                    backgroundColor: isPassed ? "rgba(59, 130, 246, 0.1)" : "rgba(9, 9, 11, 0.9)",
                  }}
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-colors shadow-lg",
                    isActive && "shadow-primary/20"
                  )}
                >
                  <motion.div
                    animate={{
                      scale: isPassed ? 1 : 0,
                      backgroundColor: isActive ? "var(--color-emerald-400, #34d399)" : "var(--color-primary, #3b82f6)"
                    }}
                    className="w-2.5 h-2.5 rounded-full"
                  />
                </motion.div>
              </div>

              {/* Milestone Icon Frame */}
              <div className={cn(
                "p-2 rounded-xl border flex items-center justify-center transition-colors h-9 w-9 shrink-0",
                isPassed ? "bg-primary/10 border-primary/30 text-primary" : "bg-zinc-900/30 border-border/40 text-muted-foreground",
                isActive && "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              )}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Milestone Contents */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={cn(
                    "text-xs font-bold transition-colors",
                    isPassed ? "text-foreground" : "text-muted-foreground",
                    isActive && "text-emerald-400"
                  )}>
                    {step.label}
                  </h4>
                  <span className="text-[8px] font-mono text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    {step.date}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed leading-none">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
