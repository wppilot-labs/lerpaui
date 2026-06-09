"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Star, CheckCircle, Send, RotateCcw } from 'lucide-react';
import { cn } from '../lib/cn';

export interface BouncyStarFeedbackProps {
  onRatingSubmit?: (rating: number, feedback: string) => void;
  className?: string;
  title?: string;
  subtitle?: string;
}

interface EmotionState {
  emoji: string;
  label: string;
  colorClass: string;
  glowColor: string;
  phrase: string;
}

const EMOTION_MAP: Record<number, EmotionState> = {
  0: { emoji: '🤔', label: 'Rate us', colorClass: 'text-muted-foreground', glowColor: 'rgba(var(--bc), 0.1)', phrase: 'How was your experience?' },
  1: { emoji: '😢', label: 'Terrible', colorClass: 'text-destructive', glowColor: 'rgba(239, 68, 68, 0.4)', phrase: 'Oh no, we are so sorry! What went wrong?' },
  2: { emoji: '🙁', label: 'Bad', colorClass: 'text-orange-500', glowColor: 'rgba(249, 115, 22, 0.4)', phrase: 'We appreciate the honest feedback. How can we improve?' },
  3: { emoji: '😐', label: 'Okay', colorClass: 'text-yellow-500', glowColor: 'rgba(234, 179, 8, 0.4)', phrase: 'Thanks! We are always working to make it better.' },
  4: { emoji: '🙂', label: 'Good', colorClass: 'text-green-500', glowColor: 'rgba(34, 197, 94, 0.4)', phrase: 'Great! Glad you had a good experience.' },
  5: { emoji: '😍', label: 'Ecstatic', colorClass: 'text-yellow-400', glowColor: 'rgba(250, 204, 21, 0.6)', phrase: 'Incredible! You just made our day!' },
};

export const BouncyStarFeedback: React.FC<BouncyStarFeedbackProps> = ({
  onRatingSubmit,
  className,
  title = 'Share Your Feedback',
  subtitle = 'Your review helps us craft a more delightful experience.',
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<{ rating: number; text: string } | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;
  const currentEmotion = EMOTION_MAP[rating] || EMOTION_MAP[0];
  const hoveredEmotion = hoverRating !== null ? EMOTION_MAP[hoverRating] : null;
  const displayEmotion = hoveredEmotion || currentEmotion;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    if (onRatingSubmit) {
      onRatingSubmit(rating, feedbackText);
    }
    setSubmittedData({ rating, text: feedbackText });
    setShowToast(true);
  };

  const handleReset = () => {
    setRating(0);
    setFeedbackText('');
    setSubmittedData(null);
    setShowToast(false);
  };

  // Auto-dismiss success toast after 4s
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className={cn('relative w-full max-w-md mx-auto bg-card border border-border rounded-2xl p-6 shadow-xl overflow-hidden', className)}>
      
      {/* Dynamic Colored Top Bar Glow */}
      <div 
        className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-500 ease-out"
        style={{ 
          backgroundColor: rating > 0 ? currentEmotion.glowColor.replace('0.4', '1').replace('0.6', '1') : 'transparent',
          boxShadow: rating > 0 ? `0 4px 20px ${currentEmotion.glowColor}` : 'none'
        }}
      />

      <AnimatePresence mode="wait">
        {!submittedData ? (
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            {/* Titles */}
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-foreground tracking-tight">{title}</h3>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>

            {/* Reaction Emoji Box with physics-based shake pulse */}
            <div className="flex flex-col items-center justify-center py-4">
              <motion.div
                key={displayEmotion.emoji}
                initial={{ scale: 0.3, rotate: -45, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0, 
                  opacity: 1,
                  filter: `drop-shadow(0 0 16px ${displayEmotion.glowColor})`
                }}
                exit={{ scale: 0.3, rotate: 45, opacity: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 400, 
                  damping: 15,
                }}
                className="text-6xl select-none filter duration-300 pointer-events-none mb-3"
              >
                {displayEmotion.emoji}
              </motion.div>
              
              <motion.div
                key={displayEmotion.label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('text-sm font-semibold tracking-wide uppercase', displayEmotion.colorClass)}
              >
                {displayEmotion.label}
              </motion.div>
              
              <motion.div
                key={displayEmotion.phrase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground mt-1 text-center max-w-[80%]"
              >
                {displayEmotion.phrase}
              </motion.div>
            </div>

            {/* Premium Staggered Bouncy Star Selector */}
            <div className="flex justify-center items-center gap-3 py-2">
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const isLit = activeRating >= starIndex;
                const _isSelected = rating >= starIndex;

                return (
                  <button
                    key={starIndex}
                    type="button"
                    aria-label={`Rate ${starIndex} star${starIndex === 1 ? '' : 's'}`}
                    onClick={() => setRating(starIndex)}
                    onMouseEnter={() => setHoverRating(starIndex)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-full p-1"
                  >
                    <motion.div
                      animate={{
                        scale: isLit ? 1.35 : 1,
                        rotate: isLit ? 72 * starIndex : 0,
                      }}
                      whileHover={{ scale: 1.45 }}
                      whileTap={{ scale: 0.9, rotate: -30 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 12,
                        mass: 0.6
                      }}
                      className={cn(
                        'cursor-pointer transition-colors duration-200',
                        isLit 
                          ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                          : 'text-muted/40 hover:text-muted-foreground'
                      )}
                    >
                      <Star
                        className="w-8 h-8 fill-current"
                        strokeWidth={1.5}
                      />
                    </motion.div>
                  </button>
                );
              })}
            </div>

            {/* Comment Section (Height reveals once rating is chosen) */}
            <AnimatePresence>
              {rating > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="overflow-hidden"
                >
                  <label htmlFor="feedback-text" className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
                    Add Comments (Optional)
                  </label>
                  <textarea
                    id="feedback-text"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what we did great or how we can make your experience perfect..."
                    rows={3}
                    className="w-full text-sm bg-secondary/30 border border-border/80 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl p-3 placeholder:text-muted-foreground resize-none focus:outline-none transition-all duration-200 text-foreground"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={rating === 0}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md',
                rating > 0 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer hover:shadow-lg active:scale-98' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
              )}
              whileTap={rating > 0 ? { scale: 0.98 } : {}}
            >
              <Send className="w-4 h-4" />
              Submit Feedback
            </motion.button>
          </form>
        ) : (
          /* Submission Completed UI */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-8 space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
              className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center shadow-inner"
            >
              <CheckCircle className="w-8 h-8" />
            </motion.div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-foreground">Thank you for rating!</h4>
              <p className="text-xs text-muted-foreground max-w-[80%] mx-auto">
                We received your {submittedData.rating}-star review. Your comments helps shape Lerpa UI.
              </p>
            </div>

            {submittedData.text && (
              <div className="bg-secondary/40 border border-border/40 p-3 rounded-xl max-w-[90%] text-xs italic text-muted-foreground">
                &quot;{submittedData.text}&quot;
              </div>
            )}

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider pt-4 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Form
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Success Toast Confirmation (self-contained inside wrapper) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="absolute bottom-4 left-4 right-4 z-50 flex items-center gap-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-3 rounded-xl shadow-2xl border border-white/10 select-none"
          >
            <span className="text-xl">🌟</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Review Logged Successfully!</p>
              <p className="text-[10px] opacity-70 truncate">
                Saved {rating} star rating. Thank you!
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-[10px] font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
