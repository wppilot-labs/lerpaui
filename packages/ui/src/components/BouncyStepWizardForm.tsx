"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export function BouncyStepWizardForm({ className }: { className?: string }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-6 backdrop-blur-xl shadow-2xl space-y-5", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Interactive Stepped Wizard</h3>
          <p className="text-[10px] text-muted-foreground">Multi-stage onboarding tracker</p>
        </div>
        <span className="text-[9px] font-mono font-bold text-primary">STEP {step} OF 3</span>
      </div>

      {/* Step line indicator */}
      <div className="relative h-1 bg-zinc-800 rounded-full w-full overflow-hidden">
        <motion.div
          className="absolute top-0 bottom-0 left-0 bg-primary rounded-full"
          animate={{ width: `${((step - 1) / 2) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>

      <div className="min-h-[100px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div>
                <label htmlFor="enter-your-email" className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Enter your email</label>
                <input id="enter-your-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-zinc-950/40 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div>
                <label htmlFor="create-password" className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Create password</label>
                <input id="create-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/40 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center space-y-2 py-4"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-md">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-foreground">Welcome Aboard!</h4>
              <p className="text-[10px] text-muted-foreground">Onboarding completely configured</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 pt-2 border-t border-border/30 justify-between">
        {step > 1 && step < 3 ? (
          <button
            onClick={prevStep}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-border/30 hover:bg-zinc-800 rounded-xl text-muted-foreground hover:text-foreground text-[10px] font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        ) : <div />}

        {step < 3 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-xl text-[10px] font-bold hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 cursor-pointer ml-auto"
          >
            Next
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-bold transition-all shadow-lg shadow-emerald-500/20 cursor-pointer ml-auto"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Restart
          </button>
        )}
      </div>
    </div>
  );
}
