"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Plus, Trash2, Receipt, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

export function InteractiveInvoiceGrid({ className }: { className?: string }) {
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "Design Token Architecture", qty: 1, rate: 120 },
    { id: "2", description: "Framer Motion Custom Presets", qty: 2, rate: 80 },
  ]);

  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState(1);
  const [rate, setRate] = useState(50);

  const addItem = () => {
    if (!desc.trim()) return;
    setItems([...items, { id: Date.now().toString(), description: desc, qty, rate }]);
    setDesc("");
    setQty(1);
    setRate(50);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.rate, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  return (
    <div className={cn("w-full max-w-xl rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <Receipt className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-foreground">Interactive Invoice Builder</h3>
            <p className="text-[10px] text-muted-foreground">Stagger-animated invoicing table</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-mono text-muted-foreground uppercase">Invoice ID</span>
          <p className="text-[10px] font-mono font-bold text-foreground">#INV-2026-0044</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-12 gap-2 bg-zinc-950/30 p-3 rounded-xl border border-border/30">
        <div className="col-span-6">
          <label htmlFor="description" className="text-[9px] font-bold text-muted-foreground uppercase mb-1 block">Description</label>
          <input id="description"
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Service details..."
            className="w-full bg-zinc-900/50 border border-border/40 rounded-lg px-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="qty" className="text-[9px] font-bold text-muted-foreground uppercase mb-1 block">Qty</label>
          <input id="qty"
            type="number"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full bg-zinc-900/50 border border-border/40 rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>
        <div className="col-span-3">
          <label htmlFor="rate-" className="text-[9px] font-bold text-muted-foreground uppercase mb-1 block">Rate ($)</label>
          <input id="rate-"
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full bg-zinc-900/50 border border-border/40 rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>
        <div className="col-span-1 flex items-end justify-center">
          <button
            onClick={addItem}
            className="p-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-primary transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-12 items-center gap-2 p-2 bg-zinc-900/20 hover:bg-zinc-900/40 border border-border/30 rounded-lg group transition-colors"
            >
              <div className="col-span-6 flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground/60 font-mono w-4">{idx + 1}</span>
                <span className="text-xs text-foreground font-medium">{item.description}</span>
              </div>
              <div className="col-span-2 text-center text-xs text-muted-foreground">{item.qty}</div>
              <div className="col-span-2 text-right text-xs text-muted-foreground">${item.rate}</div>
              <div className="col-span-2 text-right text-xs text-foreground font-bold flex items-center justify-end gap-2">
                <span>${item.qty * item.rate}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded cursor-pointer transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Totals Summary */}
      <div className="pt-3 border-t border-border/40 flex flex-col items-end space-y-1.5">
        <div className="flex items-center gap-6 justify-between w-full max-w-[200px] text-xs text-muted-foreground">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-6 justify-between w-full max-w-[200px] text-xs text-muted-foreground">
          <span>Tax (15%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-6 justify-between w-full max-w-[200px] text-sm font-bold text-foreground border-t border-border/30 pt-1.5">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Total:
          </span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
