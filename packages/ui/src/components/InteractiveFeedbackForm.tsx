"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { MessageSquare, Send, Check } from "lucide-react";
import { cn } from "../lib/cn";

export function InteractiveFeedbackForm({ className }: { className?: string }) {
  const [rating, setRating] = useState(50); // 0 (Sad) to 100 (Happy)
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // SVG Morphing face details depending on current rating slider Y values
  const getMouthPath = (value: number) => {
    // 0 = Sad (curve upwards in arc control coordinates)
    // 50 = Neutral (straight flat line)
    // 100 = Happy (curve downwards in arc control coordinates)
    const yControl = 50 + (value - 50) * 0.4;
    return `M 30 65 Q 50 ${yControl} 70 65`;
  };

  const getFaceColor = (value: number) => {
    if (value < 35) return "stroke-rose-500 fill-rose-500/10";
    if (value < 70) return "stroke-amber-500 fill-amber-500/10";
    return "stroke-emerald-500 fill-emerald-500/10";
  };

  const getEmotionalLabel = (value: number) => {
    if (value < 20) return "CRITICAL_DISTRESS";
    if (value < 45) return "DISSATISFIED";
    if (value < 65) return "NEUTRAL_STAND";
    if (value < 85) return "SATISFIED";
    return "EXCELLENT_FLOW";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className={cn("w-full max-w-[340px] flex flex-col items-center", className)}>
      <motion.form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col gap-4 shadow-xl backdrop-blur-xl text-white"
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest font-mono text-emerald-400">Feedback Logged</h4>
                <p className="text-[10px] text-zinc-400 font-sans mt-1">Emotional metrics recorded.</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold font-mono uppercase tracking-tight">Sentiment Logger</span>
                </div>
                <span className="text-[8px] font-mono text-zinc-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                  SVG_MORPH_FACE
                </span>
              </div>

              {/* Dynamic SVG Morphing face visualizer */}
              <div className="w-full flex flex-col items-center py-2 relative">
                <svg className="w-20 h-20 overflow-visible" viewBox="0 0 100 100">
                  {/* Outer Face circle */}
                  <circle cx="50" cy="50" r="40" className={cn("stroke-2 fill-none transition-all duration-300", getFaceColor(rating))} />

                  {/* Left and Right Eyes */}
                  <circle cx="38" cy="40" r="3.5" className="fill-white" />
                  <circle cx="62" cy="40" r="3.5" className="fill-white" />

                  {/* Morphing dynamic mouth path */}
                  <path
                    d={getMouthPath(rating)}
                    className={cn("stroke-2 fill-none transition-all duration-300", getFaceColor(rating))}
                  />
                </svg>

                <div className="mt-2 text-center">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                    CURRENT_STATE:
                  </p>
                  <motion.p
                    key={getEmotionalLabel(rating)}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "text-xs font-mono font-bold uppercase tracking-wider mt-0.5",
                      rating < 35 ? "text-rose-400" : rating < 70 ? "text-amber-400" : "text-emerald-400"
                    )}
                  >
                    {getEmotionalLabel(rating)}
                  </motion.p>
                </div>
              </div>

              {/* Slider Controller */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 uppercase">
                  <span>Distressed</span>
                  <span>Delighted</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
                />
              </div>

              {/* Review inputs text area */}
              <div>
                <label htmlFor="detailed-review" className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Detailed Review</label>
                <textarea id="detailed-review"
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="How can we accelerate your workspace workflows?"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-xs placeholder-zinc-700 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-medium text-xs text-white transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Sentiment</span>
              </button>
            </div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}
