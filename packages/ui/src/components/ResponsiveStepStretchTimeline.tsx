"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

interface MilestoneStep {
  id: number;
  title: string;
  desc: string;
}

interface ResponsiveStepStretchTimelineProps {
  steps?: MilestoneStep[];
  className?: string;
}

export function ResponsiveStepStretchTimeline({
  steps = [
    { id: 1, title: "Initialize Sandbox", desc: "Setting up environment structures" },
    { id: 2, title: "Coordinate Handshake", desc: "Verifying secure pipeline bridges" },
    { id: 3, title: "Deploy Live Nodes", desc: "Synchronizing system metrics globally" },
  ],
  className,
}: ResponsiveStepStretchTimelineProps) {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between border border-white/5 bg-zinc-950/40 rounded-2xl p-6 shadow-2xl overflow-hidden font-sans select-none",
        className
      )}
      style={{ width: 340, height: 350 }}
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">STEPS_TIMELINE</span>
        <span className="text-xs text-white font-bold">Secure deployment lifecycle</span>
      </div>

      {/* Stepper Pipeline */}
      <div className="flex-1 flex flex-col justify-center gap-6 relative mt-4">
        {/* Connector Line in Background */}
        <div className="absolute left-[15px] top-[10px] bottom-[10px] w-0.5 bg-white/10 z-0">
          <motion.div 
            className="w-full bg-primary"
            initial={{ height: "0%" }}
            animate={{ height: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          />
        </div>

        {steps.map((step) => {
          const isCompleted = step.id < activeStep;
          const isActive = step.id === activeStep;

          return (
            <div key={step.id} className="flex gap-4 items-start relative z-10">
              {/* Step indicator dot */}
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isCompleted || isActive ? "var(--primary)" : "rgba(255,255,255,0.05)",
                  borderColor: isCompleted || isActive ? "var(--primary)" : "rgba(255,255,255,0.15)",
                }}
                className="w-8 h-8 rounded-full border flex items-center justify-center font-mono text-[10px] text-white font-bold shrink-0"
                style={{ boxShadow: "0 0 15px rgba(var(--primary-rgb), 0.1)" }}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 text-white stroke-[3px]" /> : step.id}
              </motion.div>

              {/* Step context details */}
              <div className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "text-xs font-bold transition-colors duration-200",
                    isActive ? "text-primary font-bold" : "text-white"
                  )}
                >
                  {step.title}
                </span>
                <span className="text-[9px] text-white/40 leading-tight max-w-[200px]">{step.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controller actions */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
        <button
          onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
          className="text-[9px] font-mono text-white/50 hover:text-white uppercase tracking-wider cursor-pointer"
        >
          Reset Step
        </button>
        <button
          onClick={() => setActiveStep((prev) => Math.min(steps.length, prev + 1))}
          className="text-[9px] font-mono text-primary font-bold hover:text-white flex items-center gap-1 uppercase tracking-wider cursor-pointer"
        >
          Next Step <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
