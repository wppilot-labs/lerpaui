"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

export function ResponsiveStepIndicator({
  className,
  steps = ["Initiate", "Configure", "Verify", "Finalize"],
}: {
  className?: string;
  steps?: string[];
}) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className={cn("w-full max-w-md flex flex-col items-center gap-6 p-4", className)}>
      <div className="relative w-full flex items-center justify-between">
        {/* Connection Bar */}
        <div className="absolute top-[18px] left-5 right-5 h-[2px] bg-white/[0.04] -z-10">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>

        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <button
                onClick={() => setCurrentStep(stepNum)}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 border cursor-pointer select-none",
                  isCompleted
                    ? "bg-primary/20 border-primary text-primary"
                    : isActive
                    ? "bg-card border-primary text-foreground shadow-md scale-110"
                    : "bg-card border-white/[0.08] text-muted-foreground/40 hover:border-white/[0.15]"
                )}
                style={isCompleted ? { boxShadow: "0 0 12px rgba(var(--primary-rgb), 0.2)" } : undefined}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </motion.div>
                ) : (
                  <span>0{stepNum}</span>
                )}
              </button>
              <span
                className={cn(
                  "text-[9px] uppercase tracking-wider font-extrabold transition-colors duration-300",
                  isActive ? "text-primary" : "text-muted-foreground/40"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
