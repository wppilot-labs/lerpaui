"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, animate} from "framer-motion";
import { FileText, Check, Percent } from 'lucide-react';
import { cn } from '../lib/cn';

export interface InvoicePricingCalculatorProps {
  className?: string;
  defaultSeats?: number;
  defaultStorage?: number;
  taxRate?: number; // default 0.15 (15%)
}

// Simple Spring Animated Number Interpolator for pricing totals
const AnimatedNumber: React.FC<{ value: number; prefix?: string }> = ({ value, prefix = '$' }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 0.65,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: animate from current displayValue when target value changes
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
};

export const InvoicePricingCalculator: React.FC<InvoicePricingCalculatorProps> = ({
  className,
  defaultSeats = 10,
  defaultStorage = 250,
  taxRate = 0.15,
}) => {
  // Inputs
  const [seats, setSeats] = useState<number>(defaultSeats);
  const [storage, setStorage] = useState<number>(defaultStorage);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  
  // Addons
  const [slaSupport, setSlaSupport] = useState<boolean>(true);
  const [securitySso, setSecuritySso] = useState<boolean>(false);
  const [accountManager, setAccountManager] = useState<boolean>(false);
  
  // Controls print preview folding
  const [isReceiptFoldedOpen, setIsReceiptFoldedOpen] = useState<boolean>(true);

  // Pricing constants (Per month base rates)
  const BASE_PLAN_COST = 29;
  const COST_PER_SEAT = 12;
  const COST_PER_GB = 0.08;
  
  const SLA_COST = 49;
  const SSO_COST = 29;
  const MANAGER_COST = 99;

  // Real-time calculations
  const baseSubtotal = BASE_PLAN_COST + (seats * COST_PER_SEAT) + (storage * COST_PER_GB);
  
  // Calculate addons subtotal
  let addonsSubtotal = 0;
  if (slaSupport) addonsSubtotal += SLA_COST;
  if (securitySso) addonsSubtotal += SSO_COST;
  if (accountManager) addonsSubtotal += MANAGER_COST;

  const rawTotal = baseSubtotal + addonsSubtotal;
  
  // Billing cycle discount: 20% off when yearly
  const discountMultiplier = billingCycle === 'yearly' ? 0.8 : 1.0;
  const discountAmount = rawTotal * (1 - discountMultiplier);
  const discountedSubtotal = rawTotal * discountMultiplier;
  
  // Tax breakdown
  const taxAmount = discountedSubtotal * taxRate;
  const finalTotal = discountedSubtotal + taxAmount;

  // Monthly vs yearly display helper
  const billingSuffix = billingCycle === 'yearly' ? '/mo (billed annually)' : '/mo';

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-5xl mx-auto items-start p-1', className)}>
      
      {/* Configuration Controls (Left panel, col span 7) */}
      <div className="lg:col-span-7 bg-card border border-border/80 rounded-2xl p-6 space-y-6 shadow-md">
        <div>
          <h3 className="text-lg font-bold text-foreground">Pricing Calculator</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Customize your SaaS plan resources and watch pricing update instantly.</p>
        </div>

        {/* Billing Cycle Switch */}
        <div className="flex items-center justify-between bg-secondary/35 p-3.5 rounded-xl border border-border/40">
          <div>
            <span className="text-sm font-semibold text-foreground">Billing Interval</span>
            <p className="text-[11px] text-muted-foreground">Select yearly billing for a 20% discount</p>
          </div>
          <div className="flex items-center gap-2 bg-background p-1 rounded-lg border border-border/60">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'text-xs font-semibold px-3 py-1.5 rounded-md transition-all',
                billingCycle === 'monthly'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={cn(
                'relative text-xs font-semibold px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5',
                billingCycle === 'yearly'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Yearly
              <span className="text-[9px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-1 py-0.5 rounded leading-none">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-5">
          {/* User Seats Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="user-seats" className="font-semibold text-foreground">User Seats / Licenses</label>
              <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                {seats} seats
              </span>
            </div>
            <input
              id="user-seats"
              type="range"
              min="1"
              max="100"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-secondary accent-primary cursor-pointer border-none"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
              <span>1 Seat</span>
              <span>50 Seats</span>
              <span>100 Seats</span>
            </div>
          </div>

          {/* Storage Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="data-storage" className="font-semibold text-foreground">Data Storage</label>
              <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                {storage} GB
              </span>
            </div>
            <input
              id="data-storage"
              type="range"
              min="50"
              max="2000"
              step="50"
              value={storage}
              onChange={(e) => setStorage(parseInt(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-secondary accent-primary cursor-pointer border-none"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
              <span>50 GB</span>
              <span>1,000 GB</span>
              <span>2,000 GB</span>
            </div>
          </div>
        </div>

        {/* Addon Checkboxes */}
        <div className="space-y-3">
          <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Professional Add-ons</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Addon 1 */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSlaSupport(!slaSupport)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSlaSupport(!slaSupport); } }}
              className={cn(
                'flex flex-col justify-between p-3 rounded-xl border cursor-pointer select-none transition-all duration-200 hover:bg-secondary/20',
                slaSupport ? 'border-primary bg-primary/5' : 'border-border/80'
              )}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-foreground leading-tight">Enterprise SLA</span>
                <span className="text-[10px] font-bold text-muted-foreground">${SLA_COST}/mo</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 leading-snug">99.9% uptime guarantee.</p>
              <div className="mt-3 flex items-center justify-end">
                <div className={cn('w-4.5 h-4.5 rounded border flex items-center justify-center transition-all', slaSupport ? 'bg-primary border-primary text-primary-foreground' : 'border-border')}>
                  {slaSupport && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Addon 2 */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSecuritySso(!securitySso)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSecuritySso(!securitySso); } }}
              className={cn(
                'flex flex-col justify-between p-3 rounded-xl border cursor-pointer select-none transition-all duration-200 hover:bg-secondary/20',
                securitySso ? 'border-primary bg-primary/5' : 'border-border/80'
              )}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-foreground leading-tight">SSO & Security</span>
                <span className="text-[10px] font-bold text-muted-foreground">${SSO_COST}/mo</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 leading-snug">SAML & MFA protection.</p>
              <div className="mt-3 flex items-center justify-end">
                <div className={cn('w-4.5 h-4.5 rounded border flex items-center justify-center transition-all', securitySso ? 'bg-primary border-primary text-primary-foreground' : 'border-border')}>
                  {securitySso && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Addon 3 */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setAccountManager(!accountManager)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAccountManager(!accountManager); } }}
              className={cn(
                'flex flex-col justify-between p-3 rounded-xl border cursor-pointer select-none transition-all duration-200 hover:bg-secondary/20',
                accountManager ? 'border-primary bg-primary/5' : 'border-border/80'
              )}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-foreground leading-tight">Account Manager</span>
                <span className="text-[10px] font-bold text-muted-foreground">${MANAGER_COST}/mo</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 leading-snug">Direct dedicated priority contact.</p>
              <div className="mt-3 flex items-center justify-end">
                <div className={cn('w-4.5 h-4.5 rounded border flex items-center justify-center transition-all', accountManager ? 'bg-primary border-primary text-primary-foreground' : 'border-border')}>
                  {accountManager && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt trigger */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setIsReceiptFoldedOpen(!isReceiptFoldedOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
          >
            <FileText className="w-4 h-4" />
            {isReceiptFoldedOpen ? 'Hide Invoice Details' : 'Generate Invoice Details'}
          </button>
        </div>
      </div>

      {/* Glassmorphic 3D Paper Fold Invoice Receipt (Right panel, col span 5) */}
      <div className="lg:col-span-5 perspective-[1000px] w-full">
        <AnimatePresence initial={false}>
          {isReceiptFoldedOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, rotateX: -30, transformOrigin: 'top center' }}
              animate={{ opacity: 1, height: 'auto', rotateX: 0 }}
              exit={{ opacity: 0, height: 0, rotateX: -30 }}
              transition={{ type: 'spring', stiffness: 220, damping: 23 }}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl relative overflow-hidden rounded-2xl"
              style={{
                // Custom repeated jagged zigzag bottom mask using inline svg
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath d='M0,14 L4,10 L8,14 L12,10 L16,14 L16,16 L0,16 Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
                backgroundPosition: 'bottom',
                backgroundRepeat: 'repeat-x',
              }}
            >
              {/* Receipt Body */}
              <div className="p-6 pb-12 space-y-6 text-neutral-800 dark:text-neutral-100 font-mono text-xs select-none">
                
                {/* Header branding */}
                <div className="text-center border-b border-dashed border-neutral-300 dark:border-neutral-700 pb-4 space-y-1">
                  <div className="font-extrabold text-sm uppercase tracking-widest text-primary flex items-center justify-center gap-1.5">
                    <FileText className="w-4 h-4 animate-bounce" />
                    Lerpa UI, Inc.
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">ESTIMATED DIGITAL INVOICE</p>
                  <p className="text-[9px] text-neutral-400">DATE: {new Date().toLocaleDateString()} | TERM: NET 30</p>
                </div>

                {/* Sub Plan Items */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center font-bold text-neutral-500 dark:text-neutral-400 pb-1 border-b border-neutral-200 dark:border-neutral-800">
                    <span>PLAN METRIC</span>
                    <span>SUBTOTAL</span>
                  </div>

                  {/* Base subscription fee */}
                  <div className="flex justify-between">
                    <span>Base Account Fee</span>
                    <AnimatedNumber value={BASE_PLAN_COST} />
                  </div>

                  {/* Seat fee */}
                  <div className="flex justify-between">
                    <span>Licenses ({seats} × ${COST_PER_SEAT})</span>
                    <AnimatedNumber value={seats * COST_PER_SEAT} />
                  </div>

                  {/* Storage fee */}
                  <div className="flex justify-between">
                    <span>Storage ({storage} GB × ${COST_PER_GB})</span>
                    <AnimatedNumber value={storage * COST_PER_GB} />
                  </div>

                  {/* Addon details */}
                  {(slaSupport || securitySso || accountManager) && (
                    <div className="pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-800 space-y-1.5">
                      <p className="font-bold text-[10px] text-neutral-500">ADDONS ENABLED:</p>
                      {slaSupport && (
                        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                          <span>└ Enterprise SLA Support</span>
                          <AnimatedNumber value={SLA_COST} />
                        </div>
                      )}
                      {securitySso && (
                        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                          <span>└ SSO & Advanced MFA</span>
                          <AnimatedNumber value={SSO_COST} />
                        </div>
                      )}
                      {accountManager && (
                        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                          <span>└ Dedicated Manager</span>
                          <AnimatedNumber value={MANAGER_COST} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Calculations details */}
                <div className="border-t border-dashed border-neutral-300 dark:border-neutral-700 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <AnimatedNumber value={rawTotal} />
                  </div>

                  {billingCycle === 'yearly' && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" />
                        20% Contract Discount
                      </span>
                      <AnimatedNumber value={discountAmount} prefix="-$" />
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Tax ({taxRate * 100}%)</span>
                    <AnimatedNumber value={taxAmount} />
                  </div>
                </div>

                {/* Highlighted Final Billing Cost */}
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-1 my-3 shadow-inner">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">TOTAL DUE NOW</span>
                  <div className="text-2xl font-black text-foreground tracking-tight">
                    <AnimatedNumber value={finalTotal} />
                  </div>
                  <span className="text-[9px] text-muted-foreground">{billingSuffix}</span>
                </div>

                {/* Footer and Mock Barcode */}
                <div className="text-center pt-2 space-y-4">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    {/* Mock Barcode */}
                    <div className="h-8 w-44 bg-neutral-800 dark:bg-neutral-200 flex items-stretch gap-[1.5px] p-1 rounded-sm opacity-80 select-none">
                      {[1,3,2,1,4,2,3,1,2,4,1,3,2,2,1,4,1,2,3,4,1,2,2,3,1,1].map((bar, idx) => (
                        <span 
                          key={idx} 
                          className="bg-neutral-100 dark:bg-neutral-900 flex-1"
                          style={{ flexGrow: bar }}
                        />
                      ))}
                    </div>
                    <span className="text-[8px] text-neutral-400">TX-94883-UI-2026</span>
                  </div>
                  
                  <p className="text-[9px] text-neutral-400 dark:text-neutral-500 leading-normal">
                    *Pricing estimates reflect regional hosting and compliance taxes. Rates locks in for 12 months from activation.
                  </p>
                </div>

              </div>

              {/* Decorative side margins of tear paper */}
              <div className="absolute top-0 bottom-0 left-0 w-[4px] border-r border-dashed border-neutral-300 dark:border-neutral-700 opacity-30" />
              <div className="absolute top-0 bottom-0 right-0 w-[4px] border-l border-dashed border-neutral-300 dark:border-neutral-700 opacity-30" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
