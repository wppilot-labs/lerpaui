"use client";

import { Package, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

type Order = {
  id: string;
  date: string;
  items: string;
  total: string;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled";
};

const ORDERS: Order[] = [
  { id: "#1042", date: "May 28, 2026", items: "3 items", total: "$129.00", status: "Delivered" },
  { id: "#1031", date: "May 12, 2026", items: "1 item", total: "$49.00", status: "Shipped" },
  { id: "#1018", date: "Apr 30, 2026", items: "2 items", total: "$88.50", status: "Processing" },
  { id: "#0994", date: "Apr 9, 2026", items: "1 item", total: "$24.00", status: "Cancelled" },
];

const STATUS_STYLE: Record<Order["status"], string> = {
  Delivered: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  Shipped: "text-sky-600 dark:text-sky-400 bg-sky-500/10",
  Processing: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  Cancelled: "text-muted-foreground bg-foreground/[0.05]",
};

export interface CustomerOrderHistoryProps {
  className?: string;
}

export function CustomerOrderHistory({ className }: CustomerOrderHistoryProps) {
  return (
    <div className={cn("w-full max-w-xl bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <div className="mb-4 flex items-center gap-2">
        <Package className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold">Order history</h3>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-foreground/[0.04] text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
              <th className="px-3 py-2.5">Order</th>
              <th className="px-3 py-2.5">Date</th>
              <th className="px-3 py-2.5">Items</th>
              <th className="px-3 py-2.5">Total</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {ORDERS.map((o) => (
              <tr key={o.id} className="hover:bg-foreground/[0.04] transition-colors">
                <td className="px-3 py-3 font-mono text-xs font-semibold">{o.id}</td>
                <td className="px-3 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-3 py-3 text-muted-foreground">{o.items}</td>
                <td className="px-3 py-3 font-semibold">{o.total}</td>
                <td className="px-3 py-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", STATUS_STYLE[o.status])}>
                    {o.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    aria-label={`View order ${o.id}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
