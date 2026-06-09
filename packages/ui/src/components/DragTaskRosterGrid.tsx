"use client";

import React, { useState } from 'react';
import { Reorder} from "framer-motion";
import { Menu } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DragTaskRosterGridProps {
  className?: string;
}

export const DragTaskRosterGrid: React.FC<DragTaskRosterGridProps> = ({
  className,
}) => {
  const [items, setItems] = useState([
    { id: '1', name: 'Verify registry schema compilation', tag: 'High' },
    { id: '2', name: 'Implement circular menu controls', tag: 'Medium' },
    { id: '3', name: 'Optimize dynamic coordinates trail', tag: 'Low' },
  ]);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-2xl border border-border flex flex-col justify-start p-4 select-none overflow-hidden', className)}>
      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest text-center mb-4">Draggable Checklist</span>

      <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-2 w-full">
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="w-full flex items-center justify-between px-3 py-2.5 border border-border rounded-xl bg-card shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/20 active:scale-98 transition-all duration-200"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black text-foreground leading-normal">{item.name}</span>
              <span className={cn('text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border w-fit leading-none mt-1',
                item.tag === 'High' ? 'border-rose-500/20 bg-rose-500/5 text-rose-500' :
                item.tag === 'Medium' ? 'border-amber-500/20 bg-amber-500/5 text-amber-500' :
                'border-sky-500/20 bg-sky-500/5 text-sky-500'
              )}>
                {item.tag}
              </span>
            </div>
            <Menu className="w-3.5 h-3.5 text-muted-foreground/35 cursor-row-resize" />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};
