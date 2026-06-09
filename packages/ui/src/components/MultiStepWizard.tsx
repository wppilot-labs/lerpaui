"use client";

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '../lib/cn';

/** Multi-step wizard with progress, validation, and Back/Next/Finish controls. */
export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  validate?: () => boolean | string;
}

export interface MultiStepWizardProps {
  steps?: WizardStep[];
  onFinish?: () => void;
  onCancel?: () => void;
  finishLabel?: string;
  className?: string;
}

const demoSteps: WizardStep[] = [
  { id: 'profile', title: 'Profile', description: 'Tell us about you', content: (
    <div className="space-y-2 text-sm text-muted-foreground"><p>Enter your name and avatar. This is just demo content.</p><div className="rounded-md border border-dashed border-border p-4">Demo content for profile step.</div></div>
  )},
  { id: 'workspace', title: 'Workspace', description: 'Choose a plan', content: (
    <div className="space-y-2 text-sm text-muted-foreground"><p>Pick a tier that suits your team.</p><div className="rounded-md border border-dashed border-border p-4">Demo content for workspace step.</div></div>
  )},
  { id: 'integrations', title: 'Integrations', description: 'Optional add-ons', content: (
    <div className="space-y-2 text-sm text-muted-foreground"><p>Hook up Slack, GitHub, or Linear.</p><div className="rounded-md border border-dashed border-border p-4">Demo content for integrations step.</div></div>
  )},
  { id: 'review', title: 'Review', description: 'Confirm and launch', content: (
    <div className="space-y-2 text-sm text-muted-foreground"><p>Everything looks great. Ready to ship.</p><div className="rounded-md border border-dashed border-border p-4">Demo summary.</div></div>
  )},
];

export function MultiStepWizard({
  steps = demoSteps,
  onFinish,
  onCancel,
  finishLabel = 'Finish',
  className,
}: MultiStepWizardProps) {
  const [active, setActive] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const reduce = useReducedMotion();
  const step = steps[active];
  const isLast = active === steps.length - 1;

  const goTo = (next: number) => {
    if (next < 0 || next >= steps.length) return;
    setError(null);
    if (next > active) {
      const result = step.validate?.();
      if (result === false || typeof result === 'string') {
        setError(typeof result === 'string' ? result : 'Please complete this step.');
        return;
      }
    }
    setActive(next);
  };

  const next = () => { if (isLast) onFinish?.(); else goTo(active + 1); };

  return (
    <div role="region" aria-label="Multi-step wizard" className={cn('rounded-lg border border-border bg-card text-card-foreground', className)}>
      <ol aria-label="Wizard progress" className="flex items-center gap-2 border-b border-border p-4">
        {steps.map((s, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <li key={s.id} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={current ? 'step' : undefined}
                disabled={i > active}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none'
                )}
              >
                <span aria-hidden="true" className={cn(
                  'inline-flex size-6 items-center justify-center rounded-full border text-xs font-semibold',
                  current && 'border-transparent bg-primary text-primary-foreground',
                  done && 'border-transparent bg-green-600 text-white',
                  !current && !done && 'border-border text-muted-foreground'
                )}>{done ? '✓' : i + 1}</span>
                <span className={cn('hidden text-xs font-medium sm:inline', current ? 'text-foreground' : 'text-muted-foreground')}>{s.title}</span>
              </button>
              {i < steps.length - 1 && <span aria-hidden="true" className={cn('h-px flex-1', i < active ? 'bg-green-600' : 'bg-border')} />}
            </li>
          );
        })}
      </ol>
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
          {step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: reduce ? 0 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : -12 }}
            transition={{ duration: reduce ? 0 : 0.18, ease: 'easeOut' }}
            className="min-h-32"
          >
            {step.content}
          </motion.div>
        </AnimatePresence>
        {error && <p role="alert" className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border p-3">
        <button
          type="button"
          onClick={() => (active === 0 ? onCancel?.() : goTo(active - 1))}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
        >{active === 0 ? 'Cancel' : 'Back'}</button>
        <div className="text-xs text-muted-foreground">Step {active + 1} of {steps.length}</div>
        <button
          type="button"
          onClick={next}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
        >{isLast ? finishLabel : 'Next'}</button>
      </div>
    </div>
  );
}

MultiStepWizard.displayName = 'MultiStepWizard';
