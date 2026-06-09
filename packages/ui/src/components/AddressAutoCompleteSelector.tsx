"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Search, MapPin, X, Check, Loader2, Compass } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface AddressSuggestion {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface AddressAutoCompleteSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  onAddressSelect?: (address: AddressSuggestion) => void;
  mockSuggestions?: AddressSuggestion[];
}

const DEFAULT_SUGGESTIONS: AddressSuggestion[] = [
  { id: 'addr-1', street: '1600 Amphitheatre Pkwy', city: 'Mountain View', state: 'CA', zipCode: '94043', country: 'United States' },
  { id: 'addr-2', street: '1 Infinite Loop', city: 'Cupertino', state: 'CA', zipCode: '95014', country: 'United States' },
  { id: 'addr-3', street: '350 Fifth Avenue', city: 'New York', state: 'NY', zipCode: '10118', country: 'United States' },
  { id: 'addr-4', street: '10 Downing Street', city: 'London', state: 'England', zipCode: 'SW1A 2AA', country: 'United Kingdom' },
  { id: 'addr-5', street: '221B Baker Street', city: 'London', state: 'England', zipCode: 'NW1 6XE', country: 'United Kingdom' },
  { id: 'addr-6', street: '5 Avenue Anatole France (Eiffel Tower)', city: 'Paris', state: 'Île-de-France', zipCode: '75007', country: 'France' },
];

export const AddressAutoCompleteSelector = React.forwardRef<
  HTMLDivElement,
  AddressAutoCompleteSelectorProps
>(({
  className,
  placeholder = 'Start typing your shipping address...',
  onAddressSelect,
  mockSuggestions = DEFAULT_SUGGESTIONS,
  ...props
}, ref) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Search logic simulation
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setSelectedIndex(-1);

    const delayDebounce = setTimeout(() => {
      const filtered = mockSuggestions.filter((addr) =>
        `${addr.street} ${addr.city} ${addr.state} ${addr.zipCode} ${addr.country}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setIsLoading(false);
    }, 450); // Simulate API latency

    return () => clearTimeout(delayDebounce);
  }, [query, mockSuggestions]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard navigation helpers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        selectAddress(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const selectAddress = (address: AddressSuggestion) => {
    setSelectedAddress(address);
    setQuery(`${address.street}, ${address.city}`);
    setSuggestions([]);
    setIsFocused(false);
    onAddressSelect?.(address);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedAddress(null);
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={ref || containerRef}
      className={cn('w-full max-w-md mx-auto flex flex-col gap-4 relative', className)}
      {...props}
    >
      {/* Input panel wrapper */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-border bg-card text-foreground placeholder-muted-foreground font-semibold text-sm shadow-inner transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />

          {/* Right indicator: spinner, clear or map pin */}
          <div className="absolute right-4 flex items-center gap-1.5">
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : query ? (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Compass className="w-4 h-4 text-muted-foreground/60 animate-pulse" />
            )}
          </div>
        </div>

        {/* Dropdown Suggestions */}
        <AnimatePresence>
          {isFocused && (query.length > 0 || suggestions.length > 0) && (
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-border bg-card shadow-xl overflow-hidden max-h-64 overflow-y-auto"
            >
              {suggestions.length === 0 && !isLoading ? (
                <div className="p-4 text-center text-xs text-muted-foreground font-semibold">
                  No matching addresses found.
                </div>
              ) : (
                <div className="p-1.5 flex flex-col gap-0.5">
                  {suggestions.map((addr, idx) => (
                    <button
                      type="button"
                      key={addr.id}
                      onClick={() => selectAddress(addr)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors',
                        idx === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                      )}
                    >
                      <MapPin className={cn('w-4 h-4 shrink-0 mt-0.5', idx === selectedIndex ? 'text-primary' : 'text-muted-foreground')} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate leading-tight">
                          {addr.street}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate font-medium">
                          {addr.city}, {addr.state} {addr.zipCode}, {addr.country}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Address Display Card */}
      <AnimatePresence>
        {selectedAddress && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95, y: -5 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            className="w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4.5 flex gap-3.5 shadow-sm relative overflow-hidden"
          >
            {/* Ambient location ring radar */}
            <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-20"></span>
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl h-11 w-11 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 fill-emerald-500/20" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                Confirmed Delivery Location
              </span>
              <p className="text-sm font-black text-foreground line-clamp-1 leading-snug">
                {selectedAddress.street}
              </p>
              <p className="text-xs text-muted-foreground font-semibold">
                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
              </p>
              <p className="text-[10px] font-extrabold uppercase text-muted-foreground/80 mt-1">
                {selectedAddress.country}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

AddressAutoCompleteSelector.displayName = 'AddressAutoCompleteSelector';
