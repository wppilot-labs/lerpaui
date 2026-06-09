"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductImageGallery() {
  const [index, setIndex] = useState(0);
  const slides = [
    { title: "Alpha Space Engine", desc: "Premium dark HSL visual interface.", color: "from-blue-600/30 to-violet-600/30" },
    { title: "Beta Quantum Grid", desc: "High-performance modular layouts.", color: "from-emerald-600/30 to-teal-600/30" },
    { title: "Gamma Neural Mesh", desc: "Advanced vector node structures.", color: "from-rose-600/30 to-pink-600/30" }
  ];

  const handleNext = () => setIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="w-full max-w-xs bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl select-none font-sans overflow-hidden">
      <div className="p-4">
        <div className="h-32 bg-secondary/20 rounded-xl relative overflow-hidden flex items-center justify-center border border-white/[0.04]">
          <div className="absolute inset-0 dot-grid opacity-30" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`absolute inset-0 bg-gradient-to-tr ${slides[index].color} flex flex-col justify-end p-4` }
            >
              <h4 className="text-xs font-bold text-foreground">{slides[index].title}</h4>
              <p className="text-[9px] text-muted-foreground/80 mt-0.5">{slides[index].desc}</p>
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-2 right-2 flex gap-1 z-10">
            <span className="text-[8px] font-black bg-black/40 px-2 py-0.5 rounded text-white border border-white/[0.04]">
              {index + 1} / {slides.length}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-1">
            <button type="button" onClick={handlePrev} aria-label="Previous slide" className="p-1.5 bg-secondary/30 hover:bg-secondary/60 rounded-lg text-muted-foreground hover:text-foreground transition-all cursor-pointer">
              <ChevronLeft aria-hidden="true" className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={handleNext} aria-label="Next slide" className="p-1.5 bg-secondary/30 hover:bg-secondary/60 rounded-lg text-muted-foreground hover:text-foreground transition-all cursor-pointer">
              <ChevronRight aria-hidden="true" className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={index === i}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  index === i ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}