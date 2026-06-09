"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";

type Product = {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  status: "active" | "low" | "out";
};

const PRODUCTS: Product[] = [
  { id: "1", name: "Wireless Earbuds Pro", sku: "WEB-001", price: "$89", stock: 142, status: "active" },
  { id: "2", name: "Mechanical Keyboard", sku: "MKB-220", price: "$129", stock: 8, status: "low" },
  { id: "3", name: "USB-C Hub 7-in-1", sku: "HUB-007", price: "$45", stock: 0, status: "out" },
  { id: "4", name: "Laptop Stand", sku: "STD-014", price: "$34", stock: 67, status: "active" },
];

const STATUS_META: Record<Product["status"], { label: string; cls: string }> = {
  active: { label: "Active", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  low: { label: "Low stock", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  out: { label: "Out of stock", cls: "bg-red-500/15 text-red-600 dark:text-red-400" },
};

export interface SellerProductManagementTableProps {
  className?: string;
}

export function SellerProductManagementTable({ className }: SellerProductManagementTableProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="px-5 py-4 border-b border-foreground/[0.05]">
        <h3 className="text-sm font-bold">Products</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-foreground/[0.05] text-[11px] uppercase tracking-wide text-muted-foreground/50">
              <th className="px-5 py-2.5 font-semibold">Product</th>
              <th className="px-3 py-2.5 font-semibold">Price</th>
              <th className="px-3 py-2.5 font-semibold">Stock</th>
              <th className="px-3 py-2.5 font-semibold">Status</th>
              <th className="px-5 py-2.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04]">
            {PRODUCTS.map((p) => {
              const meta = STATUS_META[p.status];
              return (
                <tr key={p.id} className="transition-colors hover:bg-foreground/[0.02]">
                  <td className="px-5 py-3">
                    <div className="text-sm font-semibold">{p.name}</div>
                    <div className="text-[11px] font-mono text-muted-foreground/50">{p.sku}</div>
                  </td>
                  <td className="px-3 py-3 text-sm font-medium">{p.price}</td>
                  <td className="px-3 py-3 text-sm text-muted-foreground/80">{p.stock}</td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2 py-0.5 text-[11px] font-medium",
                        meta.cls,
                      )}
                    >
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        aria-label={`Edit ${p.name}`}
                        className="rounded-lg p-1.5 text-muted-foreground/60 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${p.name}`}
                        className="rounded-lg p-1.5 text-muted-foreground/60 transition-colors hover:bg-red-500/15 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
