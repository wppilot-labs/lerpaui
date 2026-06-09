"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, Eye } from "lucide-react";
import { cn } from "../lib/cn";

interface RecordItem {
  id: string;
  name: string;
  role: string;
  status: "active" | "inactive" | "pending";
  revenue: number;
  date: string;
}

const INITIAL_DATA: RecordItem[] = [
  { id: "1", name: "Aria Sterling", role: "AI Core Architect", status: "active", revenue: 154000, date: "2026-05-10" },
  { id: "2", name: "Benton Vance", role: "Creative Designer", status: "active", revenue: 98000, date: "2026-04-18" },
  { id: "3", name: "Celia Rhodes", role: "Security Auditor", status: "pending", revenue: 112000, date: "2026-05-02" },
  { id: "4", name: "Damon Drake", role: "DevOps Engineer", status: "inactive", revenue: 84000, date: "2026-03-24" },
  { id: "5", name: "Elena Rostova", role: "Product Manager", status: "active", revenue: 130000, date: "2026-05-15" },
];

export function DynamicSortableDataTable({ className }: { className?: string }) {
  const [data, _setData] = useState<RecordItem[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof RecordItem | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sorting Handler
  const handleSort = (field: keyof RecordItem) => {
    let direction: "asc" | "desc" = "asc";
    if (sortField === field && sortDirection === "asc") {
      direction = "desc";
    }
    setSortField(field);
    setSortDirection(direction);
  };

  // Filtered & Sorted Data Computations
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter Search
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.role.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q)
      );
    }

    // Sort Records
    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }

        return sortDirection === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return result;
  }, [data, search, sortField, sortDirection]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const statusBadges = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    inactive: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-[560px] rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl select-none text-white",
        className
      )}
    >
      {/* Table Glowing Header */}
      <div className="absolute top-0 right-1/4 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      {/* Control panel (Filter Search Bar) */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold tracking-tight">Ledger Records</h3>
          <p className="text-[10px] text-zinc-400 font-mono">DYNAMIC_DATA_TABLE_V1</p>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-[11px] font-sans placeholder-zinc-600 transition-colors"
          />
        </div>
      </div>

      {/* Primary Table Pane */}
      <div className="relative z-10 w-full overflow-x-auto border border-white/5 rounded-xl bg-white/[0.02]">
        <table className="w-full text-left border-collapse min-w-[480px]">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase font-mono text-zinc-400">
              <th className="py-2.5 px-4 font-semibold">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Name</span>
                  {sortField === "name" ? (
                    sortDirection === "asc" ? <ChevronUp className="w-3 h-3 text-purple-400" /> : <ChevronDown className="w-3 h-3 text-purple-400" />
                  ) : (
                    <ChevronsUpDown className="w-3 h-3 text-zinc-600" />
                  )}
                </button>
              </th>
              <th className="py-2.5 px-3 font-semibold">Role</th>
              <th className="py-2.5 px-3 font-semibold">Status</th>
              <th className="py-2.5 px-3 font-semibold text-right">
                <button
                  onClick={() => handleSort("revenue")}
                  className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Revenue</span>
                  {sortField === "revenue" ? (
                    sortDirection === "asc" ? <ChevronUp className="w-3 h-3 text-purple-400" /> : <ChevronDown className="w-3 h-3 text-purple-400" />
                  ) : (
                    <ChevronsUpDown className="w-3 h-3 text-zinc-600" />
                  )}
                </button>
              </th>
              <th className="py-2.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-xs font-sans">
            <AnimatePresence mode="popLayout">
              {processedData.length > 0 ? (
                processedData.map((row, idx) => {
                  const isExpanded = expandedId === row.id;

                  return (
                    <React.Fragment key={row.id}>
                      {/* Interactive Row Entry */}
                      <motion.tr
                        layoutId={`row-${row.id}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{
                          type: "spring",
                          damping: 18,
                          stiffness: 140,
                          delay: idx * 0.05,
                        }}
                        className={cn(
                          "border-b border-white/5 hover:bg-white/[0.04] transition-colors duration-150",
                          isExpanded && "bg-white/[0.03]"
                        )}
                      >
                        <td className="py-2.5 px-4 font-medium text-white">{row.name}</td>
                        <td className="py-2.5 px-3 text-zinc-300">{row.role}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] border font-mono uppercase tracking-wider",
                              statusBadges[row.status]
                            )}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-purple-300">
                          ${row.revenue.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => toggleExpand(row.id)}
                            className="p-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-purple-400 border border-white/5 active:scale-95 transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </motion.tr>

                      {/* Expandable row detail container */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr className="bg-white/[0.01]">
                            <td colSpan={5} className="p-0 border-b border-white/5">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 py-3 text-[11px] font-mono text-zinc-400 flex flex-col sm:flex-row justify-between gap-4">
                                  <div>
                                    <span className="text-[9px] text-zinc-600 block mb-0.5">METADATA_UID</span>
                                    <p className="text-white">{row.id}-LAUNCH-SECURE</p>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-zinc-600 block mb-0.5">CREATION_DATE</span>
                                    <p className="text-white">{row.date}</p>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-zinc-600 block mb-0.5">CONTRACT_ESTIMATE</span>
                                    <p className="text-emerald-400 font-bold">${(row.revenue * 1.2).toLocaleString()}</p>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500 font-mono text-[10px]">
                    NO RECORDS MATCHING QUERY
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer Metrics Indicator */}
      <div className="relative z-10 border-t border-white/5 pt-3 mt-3 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="font-mono">Total Ledger Capital:</span>
        <span className="font-mono text-emerald-400 font-bold">
          ${processedData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
