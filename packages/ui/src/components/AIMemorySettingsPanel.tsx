'use client';

import React, { useState } from 'react';

export interface MemoryFact {
  id: string;
  text: string;
  source?: string;
  createdAt: string;
  pinned?: boolean;
}

export interface AIMemorySettingsPanelProps {
  facts?: MemoryFact[];
  accent?: string;
}

const DEFAULT: MemoryFact[] = [
  {
    id: 'm1',
    text: 'Prefers concise release notes with explicit blockers.',
    source: 'sample preference',
    createdAt: 'Jun 24',
    pinned: true,
  },
  {
    id: 'm2',
    text: 'Working on Lerpa UI — copy-paste React component lib.',
    source: 'inferred',
    createdAt: 'May 23',
  },
  {
    id: 'm3',
    text: 'Uses React + Tailwind CSS v4 + Framer Motion.',
    source: 'sample stack',
    createdAt: 'Jun 23',
  },
  {
    id: 'm4',
    text: 'Prefers accessible, keyboard-first interfaces.',
    source: 'sample preference',
    createdAt: 'Jun 22',
  },
];

export function AIMemorySettingsPanel({
  facts: defaultFacts = DEFAULT,
  accent = 'var(--accent)',
}: AIMemorySettingsPanelProps) {
  const [facts, setFacts] = useState(defaultFacts);
  const togglePin = (id: string) =>
    setFacts((p) => p.map((f) => (f.id === id ? { ...f, pinned: !f.pinned } : f)));
  const remove = (id: string) => setFacts((p) => p.filter((f) => f.id !== id));

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 440,
        background: 'var(--bg-2)',
        border: '1px solid var(--edge-2)',
        borderRadius: 14,
        padding: 18,
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
      role="region"
      aria-label="Memory settings"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-3)',
          }}
        >
          <span style={{ color: accent }}>●</span> memory
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>
          {facts.length} facts saved
        </span>
      </div>
      {facts.length === 0 ? (
        <div
          style={{
            padding: 30,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-3)',
            textAlign: 'center',
          }}
        >
          memory cleared.
        </div>
      ) : (
        facts.map((f) => (
          <div
            key={f.id}
            style={{
              padding: '10px 12px',
              background: 'var(--bg)',
              border: `1px solid ${f.pinned ? accent : 'var(--edge)'}`,
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{f.text}</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                color: 'var(--text-3)',
              }}
            >
              <span>{f.createdAt}</span>
              {f.source ? <span>· {f.source}</span> : null}
              <button
                type="button"
                onClick={() => togglePin(f.id)}
                style={{
                  marginLeft: 'auto',
                  background: 'transparent',
                  border: 0,
                  color: f.pinned ? accent : 'var(--text-3)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                }}
              >
                {f.pinned ? '★ pinned' : '☆ pin'}
              </button>
              <button
                type="button"
                onClick={() => remove(f.id)}
                aria-label="Delete fact"
                style={{
                  background: 'transparent',
                  border: 0,
                  color: 'var(--pink)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
