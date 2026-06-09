"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { cn } from "../lib/cn";

interface AddressOption {
  id: string;
  street: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  flag: string;
}

const OPTIONS: AddressOption[] = [
  { id: "a", street: "1600 Amphitheatre Pkwy", city: "Mountain View", region: "CA", postal: "94043", country: "USA", flag: "🇺🇸" },
  { id: "b", street: "1 Infinite Loop", city: "Cupertino", region: "CA", postal: "95014", country: "USA", flag: "🇺🇸" },
  { id: "c", street: "350 Fifth Avenue", city: "New York", region: "NY", postal: "10118", country: "USA", flag: "🇺🇸" },
  { id: "d", street: "10 Downing Street", city: "London", region: "GLA", postal: "SW1A 2AA", country: "UK", flag: "🇬🇧" },
  { id: "e", street: "5 Avenue Anatole France", city: "Paris", region: "IDF", postal: "75007", country: "FR", flag: "🇫🇷" },
  { id: "f", street: "Bahnhofstrasse 1", city: "Zürich", region: "ZH", postal: "8001", country: "CH", flag: "🇨🇭" },
];

export interface AddressAutocompleteInputProps {
  className?: string;
  placeholder?: string;
}

export function AddressAutocompleteInput({
  className,
  placeholder = "Start typing an address…",
}: AddressAutocompleteInputProps) {
  const inputId = useId();
  const listId = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const [picked, setPicked] = useState<AddressOption | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!q.trim()) return OPTIONS.slice(0, 4);
    const needle = q.toLowerCase();
    return OPTIONS.filter(
      (o) =>
        o.street.toLowerCase().includes(needle) ||
        o.city.toLowerCase().includes(needle) ||
        o.country.toLowerCase().includes(needle) ||
        o.postal.toLowerCase().includes(needle),
    ).slice(0, 5);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    setHi(0);
  }, [q, open]);

  const choose = (o: AddressOption) => {
    setPicked(o);
    setQ(`${o.street}, ${o.city}`);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHi((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && results[hi]) {
        e.preventDefault();
        choose(results[hi]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        "w-full max-w-sm border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl p-4 backdrop-blur-xl relative",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none mb-3">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">ADDRESS_AUTOCOMPLETE</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Smart suggestions · arrow keys</span>
      </div>

      <label htmlFor={inputId} className="sr-only">
        Shipping address
      </label>
      <div className="relative">
        <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
        {picked ? (
          <span
            aria-label={`Country: ${picked.country}`}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[10px] font-mono font-bold text-white/70 bg-white/5 border border-white/10 rounded px-1.5 py-0.5"
          >
            <span aria-hidden="true">{picked.flag}</span>
            {picked.country}
          </span>
        ) : null}
        <input
          id={inputId}
          type="text"
          autoComplete="street-address"
          spellCheck={false}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setPicked(null);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && results[hi] ? `${listId}-${results[hi].id}` : undefined}
          className="w-full pl-9 pr-20 py-2.5 text-xs bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40"
        />
      </div>

      {open && results.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Address suggestions"
          className="absolute left-4 right-4 top-full mt-1 z-20 max-h-64 overflow-auto bg-zinc-950/95 border border-white/10 rounded-xl shadow-2xl py-1 backdrop-blur-xl"
        >
          {results.map((o, i) => {
            const active = i === hi;
            return (
              <li
                key={o.id}
                id={`${listId}-${o.id}`}
                role="option"
                aria-selected={active}
                onMouseEnter={() => setHi(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(o);
                }}
                className={cn(
                  "px-3 py-2 cursor-pointer flex items-center gap-2 text-xs",
                  active ? "bg-primary/15 text-white" : "text-white/80 hover:bg-white/5",
                )}
              >
                <MapPin aria-hidden="true" className="w-3 h-3 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{o.street}</div>
                  <div className="truncate text-[10px] text-white/45 font-mono">
                    {o.city}, {o.region} {o.postal}
                  </div>
                </div>
                <span aria-hidden="true" className="text-sm">{o.flag}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
