'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring} from "framer-motion";
import { Sparkles, Layers, Cpu, Database } from 'lucide-react';
import { cn } from '../lib/cn';

export interface StaggeredPanelCard {
  title: string;
  tag: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  /** When true, this card moves opposite the others to create stagger. */
  isOdd: boolean;
  /** Tailwind gradient + border classes. */
  color: string;
}

export interface StaggeredPanelCarouselGridProps {
  className?: string;
  /** Cards to display in the grid. */
  cards?: StaggeredPanelCard[];
  /** Header label. */
  label?: string;
}

const DEFAULT_CARDS: StaggeredPanelCard[] = [
  { title: "Network", tag: "Routing", desc: "Elastic shard routing pathways.", icon: Cpu, isOdd: true, color: "from-purple-900/60 to-indigo-950/60 border-purple-500/20" },
  { title: "Vault", tag: "Storage", desc: "Sub-millisecond similarity matrices.", icon: Database, isOdd: false, color: "from-blue-900/60 to-cyan-950/60 border-blue-500/20" },
  { title: "Mesh", tag: "Ledger", desc: "Decentralized cluster flow states.", icon: Layers, isOdd: true, color: "from-emerald-900/60 to-teal-950/60 border-emerald-500/20" },
  { title: "Core", tag: "Mesh", desc: "Real-time parameter distribution.", icon: Sparkles, isOdd: false, color: "from-orange-900/60 to-red-950/60 border-orange-500/20" }
];

export const StaggeredPanelCarouselGrid: React.FC<StaggeredPanelCarouselGridProps> = ({
  className,
  cards = DEFAULT_CARDS,
  label = "Staggered Panel Grid",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  const yOdd = useTransform(springScroll, [0, 1], [-40, 40]);
  const yEven = useTransform(springScroll, [0, 1], [40, -40]);

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>
      
      <div className="grid grid-cols-4 gap-2 w-full h-[200px] overflow-hidden my-auto py-2 items-center">
        {cards.map((card, idx) => {
          const yVal = card.isOdd ? yOdd : yEven;
          return (
            <motion.div
              key={idx}
              style={{ y: yVal }}
              whileHover={{ scale: 1.04, zIndex: 10 }}
              className={cn('h-[150px] w-full rounded-xl border bg-gradient-to-b p-2 flex flex-col justify-between text-white shadow-md relative group transition-all duration-300', card.color)}
            >
              <div className="flex justify-between items-start">
                <card.icon className="w-3.5 h-3.5 opacity-80 group-hover:text-primary transition-colors" />
                <span className="text-[6px] font-mono tracking-widest bg-white/20 px-1 py-0.5 rounded uppercase">{card.tag}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <h5 className="text-[8px] font-black tracking-wide leading-tight">{card.title}</h5>
                <p className="text-[6px] opacity-75 leading-tight line-clamp-2 hidden group-hover:block transition-all">{card.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Scroll page or hover columns to slide</span>
    </div>
  );
};
