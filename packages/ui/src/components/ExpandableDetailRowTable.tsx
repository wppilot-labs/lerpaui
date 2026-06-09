"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Package, Truck, MapPin, Clock } from "lucide-react";
import { cn } from "../lib/cn";

interface Shipment {
  id: string;
  order: string;
  carrier: "DHL" | "UPS" | "FedEx" | "USPS";
  destination: string;
  eta: string;
  status: "transit" | "delivered" | "delayed" | "pending";
  weight: string;
  events: { ts: string; place: string; note: string }[];
}

const SHIPMENTS: Shipment[] = [
  {
    id: "s1",
    order: "#A-7821",
    carrier: "DHL",
    destination: "Berlin, DE",
    eta: "May 27",
    status: "transit",
    weight: "2.4 kg",
    events: [
      { ts: "05/24 14:02", place: "Leipzig hub", note: "Departed sort facility" },
      { ts: "05/24 09:18", place: "Leipzig hub", note: "Arrived at hub" },
      { ts: "05/23 21:40", place: "Origin", note: "Picked up" },
    ],
  },
  {
    id: "s2",
    order: "#A-7822",
    carrier: "UPS",
    destination: "Austin, TX",
    eta: "May 26",
    status: "delivered",
    weight: "0.8 kg",
    events: [
      { ts: "05/24 11:50", place: "Austin", note: "Delivered to recipient" },
      { ts: "05/24 06:12", place: "Austin", note: "Out for delivery" },
    ],
  },
  {
    id: "s3",
    order: "#A-7823",
    carrier: "FedEx",
    destination: "Tokyo, JP",
    eta: "May 30",
    status: "delayed",
    weight: "5.1 kg",
    events: [
      { ts: "05/24 02:11", place: "Anchorage", note: "Customs hold" },
      { ts: "05/23 18:00", place: "LAX", note: "Departed origin" },
    ],
  },
  {
    id: "s4",
    order: "#A-7824",
    carrier: "USPS",
    destination: "Brooklyn, NY",
    eta: "May 28",
    status: "pending",
    weight: "1.2 kg",
    events: [{ ts: "05/24 16:22", place: "Origin", note: "Label created" }],
  },
];

const STATUS: Record<Shipment["status"], string> = {
  transit: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  delivered: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  delayed: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  pending: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
};

export function ExpandableDetailRowTable({ className }: { className?: string }) {
  const [open, setOpen] = useState<string | null>("s1");

  return (
    <div
      className={cn(
        "relative w-full max-w-[560px] rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col gap-3 overflow-hidden shadow-2xl backdrop-blur-xl select-none text-white",
        className
      )}
    >
      <div className="absolute -top-12 right-10 w-40 h-40 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex flex-col gap-1 font-mono">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">EXPAND_DETAIL</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">shipments · animated detail rows</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-mono text-teal-300/80">
          <Truck className="w-3 h-3" />
          <span>{SHIPMENTS.length}_ACTIVE</span>
        </div>
      </div>

      <div className="relative z-10 border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 bg-white/[0.02] border-b border-white/5">
              <th className="w-8 py-2 px-2"></th>
              <th className="text-left py-2 px-2">Order</th>
              <th className="text-left py-2 px-2">Carrier</th>
              <th className="text-left py-2 px-2">Destination</th>
              <th className="text-left py-2 px-2">Status</th>
              <th className="text-right py-2 px-3">ETA</th>
            </tr>
          </thead>
          <tbody>
            {SHIPMENTS.map((s) => {
              const isOpen = open === s.id;
              return (
                <React.Fragment key={s.id}>
                  <tr
                    className={cn(
                      "border-b border-white/[0.03] text-[11px] cursor-pointer hover:bg-white/[0.03] transition-colors",
                      isOpen && "bg-white/[0.03]"
                    )}
                    onClick={() => setOpen(isOpen ? null : s.id)}
                  >
                    <td className="py-2 px-2 text-center">
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 24 }}
                        className="inline-block text-teal-300"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </motion.span>
                    </td>
                    <td className="py-2 px-2 font-mono text-white">{s.order}</td>
                    <td className="py-2 px-2 text-zinc-300">{s.carrier}</td>
                    <td className="py-2 px-2 text-zinc-300">{s.destination}</td>
                    <td className="py-2 px-2">
                      <span className={cn("px-1.5 py-0.5 rounded-full text-[8px] font-mono uppercase border", STATUS[s.status])}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-teal-300">{s.eta}</td>
                  </tr>
                  <tr>
                    <td colSpan={6} className="p-0 border-0">
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 26, mass: 0.7 }}
                            className="overflow-hidden border-b border-white/5 bg-black/30"
                          >
                            <div className="p-4 grid grid-cols-[1fr_auto] gap-4">
                              <div>
                                <div className="text-[9px] uppercase tracking-widest font-mono text-zinc-500 mb-2 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Timeline
                                </div>
                                <ol className="relative border-l border-white/10 pl-4 space-y-2">
                                  {s.events.map((e, i) => (
                                    <motion.li
                                      key={i}
                                      initial={{ opacity: 0, x: -6 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.05 + i * 0.06 }}
                                      className="relative"
                                    >
                                      <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-teal-400 ring-2 ring-zinc-950" />
                                      <div className="text-[10px] font-mono text-zinc-400">{e.ts}</div>
                                      <div className="text-[11px] text-white">{e.note}</div>
                                      <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                                        <MapPin className="w-2.5 h-2.5" />
                                        {e.place}
                                      </div>
                                    </motion.li>
                                  ))}
                                </ol>
                              </div>
                              <div className="flex flex-col gap-2 text-[10px] font-mono min-w-[120px]">
                                <div className="rounded-lg border border-white/10 p-2 bg-white/[0.02]">
                                  <div className="text-zinc-500 uppercase text-[8px]">weight</div>
                                  <div className="text-white font-bold">{s.weight}</div>
                                </div>
                                <div className="rounded-lg border border-white/10 p-2 bg-white/[0.02] flex items-center gap-1.5">
                                  <Package className="w-3 h-3 text-teal-300" />
                                  <div>
                                    <div className="text-zinc-500 uppercase text-[8px]">tracking</div>
                                    <div className="text-white">{s.order.replace("#", "")}-LX</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
        <span>click a row to expand timeline</span>
        <span className="text-teal-300">{SHIPMENTS.filter((s) => s.status === "delivered").length} delivered</span>
      </div>
    </div>
  );
}
