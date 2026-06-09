"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { ChevronRight, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { cn } from "../lib/cn";

export function InteractiveMultiStepForm({ className }: { className?: string }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [shakeTrigger, setShakeTrigger] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [complete, setComplete] = useState(false);

  const stepsHeader = ["Profile", "Preference", "Confirm"];

  const handleNext = () => {
    // Basic validation
    if (step === 1 && (!name.trim() || !email.includes("@"))) {
      triggerShake();
      return;
    }
    if (step === 2 && !role) {
      triggerShake();
      return;
    }

    if (step < 3) {
      setDirection("next");
      setStep((prev) => prev + 1);
    } else {
      setComplete(true);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setDirection("prev");
      setStep((prev) => prev - 1);
    }
  };

  const triggerShake = () => {
    setShakeTrigger(true);
    setTimeout(() => setShakeTrigger(false), 500);
  };

  // Framer Motion slide-in animations
  const pageVariants = {
    initial: (dir: "next" | "prev") => ({
      x: dir === "next" ? 100 : -100,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: "next" | "prev") => ({
      x: dir === "next" ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-[360px] flex flex-col items-center">
      <motion.div
        animate={shakeTrigger ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={cn(
          "relative w-full h-[400px] rounded-2xl bg-zinc-950/80 border border-white/10 p-6 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl select-none text-white",
          className
        )}
      >
        {/* Dynamic Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        {/* Step Tracker Indicator */}
        {!complete && (
          <div className="relative z-10 w-full mb-2">
            <div className="flex justify-between items-center relative">
              {/* Progress Line Bar Background */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/5 pointer-events-none" />
              {/* Active animated progress bar */}
              <motion.div
                animate={{ width: `${((step - 1) / (stepsHeader.length - 1)) * 100}%` }}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-500 origin-left"
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              />

              {stepsHeader.map((lbl, idx) => {
                const stepNum = idx + 1;
                const isActive = step === stepNum;
                const isPassed = step > stepNum;

                return (
                  <div key={idx} className="flex flex-col items-center z-10 relative">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.15 : 1,
                        backgroundColor: isActive || isPassed ? "rgba(99, 102, 241, 1)" : "rgba(39, 39, 42, 1)",
                        borderColor: isActive ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.05)",
                      }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border font-mono transition-all duration-300"
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stepNum}
                    </motion.div>
                    <span
                      className={cn(
                        "text-[9px] mt-1 tracking-wider uppercase font-mono transition-all duration-300",
                        isActive ? "text-indigo-400 font-bold" : "text-zinc-500"
                      )}
                    >
                      {lbl}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Form Body Container */}
        <div className="relative z-10 flex-1 flex flex-col justify-center overflow-hidden my-4">
          <AnimatePresence mode="wait" custom={direction}>
            {complete ? (
              <motion.div
                key="completion"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="flex flex-col items-center justify-center text-center h-full gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center animate-bounce">
                  <Check className="w-6 h-6 text-emerald-400 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight">Onboarding Complete</h4>
                  <p className="text-[10px] text-zinc-400 font-mono mt-1 uppercase">Welcome aboard, {name.split(" ")[0]}!</p>
                </div>
                <button
                  onClick={() => {
                    setName("");
                    setEmail("");
                    setRole("");
                    setNewsletter(false);
                    setComplete(false);
                    setStep(1);
                  }}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  Restart Flow
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="h-full flex flex-col justify-center space-y-4"
              >
                {step === 1 && (
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="full-name" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Full Name</label>
                      <input id="full-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs font-sans placeholder-zinc-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="email-address" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Email Address</label>
                      <input id="email-address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs font-sans placeholder-zinc-600 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Select Professional Role</span>
                    {["Developer", "Designer", "Manager", "Founder"].map((rl) => {
                      const isSel = role === rl;
                      return (
                        <button
                          key={rl}
                          onClick={() => setRole(rl)}
                          className={cn(
                            "w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-sans border transition-all cursor-pointer",
                            isSel
                              ? "bg-indigo-600/20 border-indigo-500 text-white font-bold"
                              : "bg-white/5 border-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                          )}
                        >
                          <span>{rl}</span>
                          {isSel && <Check className="w-4 h-4 text-indigo-400" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Summary Overview</p>
                      <h4 className="text-xs font-bold">{name || "Unnamed"}</h4>
                      <p className="text-[11px] text-zinc-300 font-mono">{email}</p>
                      <p className="text-[11px] text-indigo-400 font-mono mt-1 font-bold">Role: {role}</p>
                    </div>

                    <button
                      onClick={() => setNewsletter(!newsletter)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer text-left"
                    >
                      <motion.div
                        animate={{
                          backgroundColor: newsletter ? "rgba(99, 102, 241, 1)" : "transparent",
                          borderColor: newsletter ? "rgba(99, 102, 241, 1)" : "rgba(255, 255, 255, 0.2)",
                        }}
                        className="w-5 h-5 rounded-md border flex items-center justify-center transition-colors"
                      >
                        {newsletter && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </motion.div>
                      <div>
                        <p className="text-xs font-bold">Subscribe to Newsletter</p>
                        <p className="text-[9px] text-zinc-400 font-mono">Weekly tips on modern UI patterns & framer physics.</p>
                      </div>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions Wrapper */}
        {!complete && (
          <div className="relative z-10 border-t border-white/5 pt-3 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go Back</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Fill all details</span>
              </div>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium text-xs text-white transition-all active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <span>{step === 3 ? "Complete" : "Continue"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
