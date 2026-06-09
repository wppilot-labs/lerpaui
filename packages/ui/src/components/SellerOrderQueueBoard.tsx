"use client";

import React from "react";
import { cn } from "../lib/cn";

type Order = {
  id: string;
  customer: string;
  items: number;
  total: string;
};

type Column = {
  id: string;
  title: string;
  accent: string;
  orders: Order[];
};

const COLUMNS: Column[] = [
  {
    id: "new",
    title: "New",
    accent: "bg-sky-400",
    orders: [
      { id: "#1042", customer: "L. Foster", items: 3, total: "$128" },
      { id: "#1043", customer: "M. Reyes", items: 1, total: "$42" },
    ],
  },
  {
    id: "packing",
    title: "Packing",
    accent: "bg-amber-400",
    orders: [{ id: "#1039", customer: "K. Owens", items: 5, total: "$214" }],
  },
  {
    id: "shipped",
    title: "Shipped",
    accent: "bg-violet-400",
    orders: [
      { id: "#1031", customer: "T. Nadia", items: 2, total: "$76" },
      { id: "#1028", customer: "R. Singh", items: 4, total: "$159" },
    ],
  },
  {
    id: "delivered",
    title: "Delivered",
    accent: "bg-emerald-400",
    orders: [{ id: "#1019", customer: "P. Adams", items: 1, total: "$33" }],
  },
];

export interface SellerOrderQueueBoardProps {
  className?: string;
}

export function SellerOrderQueueBoard({ className }: SellerOrderQueueBoardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-sm font-bold mb-4 px-1">Order queue</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", col.accent)} />
                <span className="text-xs font-semibold">{col.title}</span>
              </div>
              <span className="text-[11px] text-muted-foreground/50">{col.orders.length}</span>
            </div>

            <div className="flex flex-col gap-2">
              {col.orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] p-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground/70">{order.id}</span>
                    <span className="text-xs font-bold text-primary">{order.total}</span>
                  </div>
                  <div className="mt-1 text-sm font-semibold truncate">{order.customer}</div>
                  <div className="text-[11px] text-muted-foreground/50">
                    {order.items} item{order.items > 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
