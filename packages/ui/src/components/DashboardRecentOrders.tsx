"use client";

import React from "react";
import { Package } from "lucide-react";
import { cn } from "../lib/cn";

type Order = { id: string; customer: string; amount: string; status: "paid" | "pending" | "refunded" };

const ORDERS: Order[] = [
  { id: "#8841", customer: "Olivia Hart", amount: "$248", status: "paid" },
  { id: "#8840", customer: "Liam Chen", amount: "$112", status: "pending" },
  { id: "#8839", customer: "Sofia Ramos", amount: "$96", status: "paid" },
  { id: "#8838", customer: "Noah Patel", amount: "$74", status: "refunded" },
];

const STATUS: Record<Order["status"], string> = {
  paid: "bg-emerald-500/10 text-emerald-400",
  pending: "bg-amber-500/10 text-amber-400",
  refunded: "bg-foreground/[0.05] text-muted-foreground/60",
};

export interface DashboardRecentOrdersProps {
  className?: string;
}

export function DashboardRecentOrders({ className }: DashboardRecentOrdersProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold flex items-center gap-1.5 mb-4">
        <Package className="w-4 h-4 text-primary" /> Recent orders
      </h3>
      <ul className="space-y-1">
        {ORDERS.map((o) => (
          <li key={o.id} className="flex items-center gap-3 py-2 border-b border-foreground/[0.04] last:border-0">
            <span className="text-xs font-mono text-muted-foreground/60 w-12 shrink-0">{o.id}</span>
            <span className="text-sm font-medium flex-1 truncate">{o.customer}</span>
            <span className="text-sm font-bold tabular-nums">{o.amount}</span>
            <span className={cn("text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full capitalize shrink-0", STATUS[o.status])}>{o.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
