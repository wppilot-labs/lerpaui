"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform} from "framer-motion";
import { CreditCard, ShieldCheck, Check } from "lucide-react";
import { cn } from "../lib/cn";

export function CreditCardFormCompositor({ className }: { className?: string }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Card perspective coordinate tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateXSpring = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateYSpring = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Helper to detect card type
  const getCardType = () => {
    if (cardNumber.startsWith("4")) return "Visa";
    if (cardNumber.startsWith("5")) return "Mastercard";
    if (cardNumber.startsWith("3")) return "Amex";
    return "LaunchCard";
  };

  const getCardGradient = () => {
    const type = getCardType();
    if (type === "Visa") return "from-blue-600 to-indigo-900";
    if (type === "Mastercard") return "from-orange-500 to-red-800";
    if (type === "Amex") return "from-emerald-500 to-teal-800";
    return "from-purple-900 via-indigo-950 to-zinc-950";
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 19 || !cardName.trim() || expiry.length < 5 || cvv.length < 3) {
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 500);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className={cn("w-full max-w-[360px] flex flex-col items-center gap-6", className)}>
      
      {/* 3D-Tilting Card Graphic Panel */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-48 [perspective:1000px] select-none cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFlipped(!isFlipped); } }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          style={{ rotateX: rotateXSpring, rotateY: rotateYSpring, transformStyle: "preserve-3d" }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={cn(
            "relative w-full h-full rounded-2xl p-5 bg-gradient-to-tr border border-white/10 shadow-2xl flex flex-col justify-between text-white font-mono transition-all duration-300",
            getCardGradient()
          )}
        >
          {/* Card Front Side View */}
          <div className="absolute inset-0 p-5 flex flex-col justify-between [backface-visibility:hidden] z-10">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] tracking-widest text-white/50 uppercase font-sans">SECURE_CHIP</span>
                <div className="w-8 h-6 rounded bg-amber-400/80 border border-white/15" />
              </div>
              <span className="text-xs font-bold font-sans italic tracking-wider">{getCardType()}</span>
            </div>

            <p className="text-sm font-bold tracking-widest text-center mt-3">
              {cardNumber || "•••• •••• •••• ••••"}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div>
                <span className="text-[7px] text-white/40 block font-sans">CARD_HOLDER</span>
                <p className="text-[10px] font-medium tracking-wide uppercase truncate max-w-[150px]">
                  {cardName || "YOUR NAME"}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[7px] text-white/40 block font-sans">EXPIRY</span>
                <p className="text-[10px] font-medium tracking-wide">{expiry || "MM/YY"}</p>
              </div>
            </div>
          </div>

          {/* Card Back Side View */}
          <div className="absolute inset-0 p-5 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] z-10">
            {/* Magnetic signature strip line */}
            <div className="absolute left-0 right-0 top-6 h-9 bg-zinc-950/80" />

            <div className="mt-12 flex items-center justify-between gap-3">
              <div className="flex-1 h-6 bg-white/10 rounded border border-white/5 flex items-center px-2">
                <div className="w-full h-2 bg-stripe-pattern opacity-30" />
              </div>
              <div className="w-12 h-6 bg-white rounded text-zinc-950 flex items-center justify-center text-[10px] font-bold">
                {cvv || "•••"}
              </div>
            </div>

            <div className="flex items-center justify-between text-[7px] text-white/30 font-sans mt-auto">
              <span>AUTHORIZED_SIGNATURE</span>
              <span>LAUNCH_SECURITY_V1</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Credit Card Details Checkout Form */}
      <motion.form
        onSubmit={handleSubmit}
        animate={shakeTrigger ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col gap-3 shadow-xl backdrop-blur-xl"
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-6 flex flex-col items-center justify-center text-center gap-3 text-white"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest font-mono">Invoice Approved</h4>
                <p className="text-[10px] text-zinc-400 font-sans mt-1">Transaction processed elastically.</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3 text-white">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-1 justify-between">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold font-mono tracking-tight uppercase">Billing Compositor</span>
                </div>
                <div className="flex items-center gap-0.5 text-[9px] font-mono text-zinc-500">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SSL_SECURE</span>
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label htmlFor="card-number" className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-0.5">Card Number</label>
                <input id="card-number"
                  type="text"
                  maxLength={19}
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="4000 1234 5678 9010"
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-xs font-mono placeholder-zinc-700 transition-colors"
                />
              </div>

              {/* Card Holder Name */}
              <div>
                <label htmlFor="card-holder" className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-0.5">Card Holder</label>
                <input id="card-holder"
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Aria Sterling"
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-xs placeholder-zinc-700 transition-colors"
                />
              </div>

              {/* Expiry and CVV Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="expiry-date" className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-0.5">Expiry Date</label>
                  <input id="expiry-date"
                    type="text"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 2) {
                        val = val.substring(0, 2) + "/" + val.substring(2, 4);
                      }
                      setExpiry(val);
                    }}
                    placeholder="MM/YY"
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-xs font-mono placeholder-zinc-700 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="cvv-code" className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-0.5">CVV Code</label>
                  <input id="cvv-code"
                    type="text"
                    maxLength={3}
                    value={cvv}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    placeholder="123"
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-xs font-mono placeholder-zinc-700 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 mt-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-medium text-xs text-white transition-all active:scale-98 cursor-pointer text-center"
              >
                Submit Payment
              </button>
            </div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}
