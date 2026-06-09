"use client";

import React, { useMemo, useState } from "react";

export interface AIBranchNode {
  id: string;
  label: string;
  preview: string;
  active?: boolean;
  parentId?: string;
}

export interface AIConversationBranchTreeProps {
  nodes?: AIBranchNode[];
  accent?: string;
  onSelect?: (id: string) => void;
}

const DEFAULT_NODES: AIBranchNode[] = [
  { id: "n1", label: "root", preview: "How should I structure my pricing page?" },
  { id: "n2", label: "v1", preview: "Suggested 2-tier card layout with toggle.", parentId: "n1" },
  { id: "n3", label: "v2", preview: "Suggested 3-tier with featured highlight.", parentId: "n1" },
  { id: "n4", label: "v2.1", preview: "Added comparison table below tiers.", parentId: "n3", active: true },
  { id: "n5", label: "v2.2", preview: "Variant with annual discount badges.", parentId: "n3" },
];

export function AIConversationBranchTree({
  nodes = DEFAULT_NODES,
  accent = "var(--accent)",
  onSelect,
}: AIConversationBranchTreeProps) {
  const [activeId, setActiveId] = useState(() => nodes.find((n) => n.active)?.id ?? nodes[0]?.id);

  const childrenByParent = useMemo(() => {
    const map = new Map<string | undefined, AIBranchNode[]>();
    nodes.forEach((n) => {
      const arr = map.get(n.parentId) ?? [];
      arr.push(n);
      map.set(n.parentId, arr);
    });
    return map;
  }, [nodes]);

  const select = (id: string) => {
    setActiveId(id);
    onSelect?.(id);
  };

  const renderNode = (n: AIBranchNode, depth: number, idx: number): React.ReactNode => {
    const kids = childrenByParent.get(n.id) ?? [];
    const isActive = n.id === activeId;
    return (
      <div key={n.id} style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => select(n.id)}
          aria-pressed={isActive}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginLeft: depth * 18,
            padding: "6px 10px",
            background: isActive ? "color-mix(in srgb, " + accent + " 14%, transparent)" : "transparent",
            border: `1px solid ${isActive ? accent : "var(--edge)"}`,
            borderRadius: 6,
            cursor: "pointer",
            width: `calc(100% - ${depth * 18}px)`,
            textAlign: "left",
            color: "var(--text)",
            fontFamily: "var(--font-sans)",
            transition: "all 0.18s ease",
            animation: `ai-fade-up 0.32s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 50}ms both`,
            boxShadow: isActive ? `0 0 12px -4px ${accent}` : "none",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: isActive ? accent : "var(--text-4)",
              boxShadow: isActive ? `0 0 6px ${accent}` : "none",
              flexShrink: 0,
            }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: isActive ? accent : "var(--text-3)", letterSpacing: "0.06em" }}>
            {n.label}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
            {n.preview}
          </span>
        </button>
        {kids.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
            {kids.map((k, kIdx) => renderNode(k, depth + 1, kIdx))}
          </div>
        ) : null}
      </div>
    );
  };

  const roots = childrenByParent.get(undefined) ?? [];

  return (
    <div
      role="tree"
      aria-label="Conversation branches"
      style={{
        width: "100%",
        maxWidth: 460,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 12,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        fontFamily: "var(--font-sans)",
        boxShadow: `0 20px 50px -20px rgba(0,0,0,0.4), 0 0 30px -16px ${accent}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid var(--edge)" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: accent, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          branches
        </span>
        <span style={{ fontSize: 11, color: "var(--text-3)" }}>· {nodes.length} versions</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-4)" }}>
          ↑↓ navigate
        </span>
      </div>
      {roots.map((r, idx) => renderNode(r, 0, idx))}
    </div>
  );
}
