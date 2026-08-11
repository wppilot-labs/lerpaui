/**
 * Broad import, no-props render, and accessibility smoke coverage for every
 * component exported by the public barrel. Components that intentionally need
 * props or a parent context are pinned to an explicit baseline so a new render
 * failure cannot silently become an accepted result.
 */
import { afterAll, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as React from 'react';
import * as Lib from '../index';

const FORWARD_REF = Symbol.for('react.forward_ref');
const MEMO = Symbol.for('react.memo');

const SAMPLE_PROPS: Record<string, Record<string, unknown>> = {
  Button: { children: 'Button' },
  ShinyButton: { children: 'Button' },
  Input: { 'aria-label': 'Sample input' },
  Textarea: { 'aria-label': 'Sample textarea' },
};

const PER_TEST_TIMEOUT_MS = 40_000;
const AXE_TIMEOUT_MS = 30_000;

// Its required `text` prop is covered by a dedicated test; omitting it schedules
// an asynchronous dereference rather than producing a useful no-props render.
const DENYLIST = new Set<string>(['DecryptedTextReveal']);

// Composite components and Radix sub-parts that intentionally require props or
// parent context. Any change to this baseline must be reviewed explicitly.
const EXPECTED_NEEDS_PROPS = [
  'AICodePreviewPanel',
  'AIMessageBubbleResponse',
  'AccordionContent',
  'AccordionItem',
  'AccordionTrigger',
  'AnimatedBeam',
  'AvatarFallback',
  'AvatarImage',
  'BlurText',
  'BottomNavigationPill',
  'CardStackLoop',
  'CircularWheelCarousel',
  'DecryptedText',
  'DiagonalSlidingSliderFrame',
  'DialogClose',
  'DialogContent',
  'DialogDescription',
  'DialogOverlay',
  'DialogPortal',
  'DialogTitle',
  'DialogTrigger',
  'DropdownMenuCheckboxItem',
  'DropdownMenuContent',
  'DropdownMenuItem',
  'DropdownMenuPortal',
  'DropdownMenuRadioItem',
  'DropdownMenuSub',
  'DropdownMenuSubContent',
  'DropdownMenuSubTrigger',
  'DropdownMenuTrigger',
  'ElasticDragList',
  'ElasticSwiper',
  'FloatingDock',
  'GSAPScrollTriggerSliderPanel',
  'HolographicPieChart',
  'HoverAccentDrawingRoster',
  'InfiniteIntegrationMarquee',
  'InteractiveCommandPalette',
  'InteractiveOfficeLocator',
  'LiquidMorphTextTitle',
  'MacMagnifyingDockLayout',
  'MultiAgentConversationalPanel',
  'MultiLineTrendChart',
  'PerspectiveRing',
  'PopoverAnchor',
  'PopoverContent',
  'PopoverTrigger',
  'ProductCard',
  'ResponsiveAreaMetricChart',
  'ScrollReveal',
  'ShinyText',
  'SlideScreenPanels',
  'SourceCitationCard',
  'SplitText',
  'SplitTextCharacterSlider',
  'StackingCards',
  'TabsContent',
  'TabsList',
  'TabsTrigger',
  'TextPressure',
  'Tooltip',
  'TooltipContent',
  'TooltipTrigger',
  'TrueFocus',
  'TrueFocusScope',
].sort();

function isUpperFirst(name: string): boolean {
  const char = name.charCodeAt(0);
  return char >= 65 && char <= 90;
}

function isReactComponent(value: unknown): boolean {
  if (typeof value === 'function') return true;
  if (value && typeof value === 'object') {
    const tag = (value as { $$typeof?: symbol }).$$typeof;
    return tag === FORWARD_REF || tag === MEMO;
  }
  return false;
}

type Candidate = { name: string; Component: React.ElementType };

const candidates: Candidate[] = Object.entries(Lib as Record<string, unknown>)
  .filter(
    ([name, value]) =>
      isUpperFirst(name) &&
      !name.startsWith('use') &&
      !DENYLIST.has(name) &&
      isReactComponent(value)
  )
  .map(([name, value]) => ({ name, Component: value as React.ElementType }));

const rendered: string[] = [];
const needsProps: string[] = [];
const axeSkipped: string[] = [];
const axeFailures: Array<{ name: string; rules: string[] }> = [];

async function runAxe(container: HTMLElement) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      axe(container),
      new Promise<null>((resolve) => {
        timeout = setTimeout(() => resolve(null), AXE_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

describe('library smoke + a11y (all components, no props)', () => {
  it('finds the public component surface', () => {
    expect(candidates.length).toBeGreaterThan(100);
  });

  it.each(candidates)(
    '$name renders (or is an approved context-dependent export) and passes axe',
    async ({ name, Component }) => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      let container: HTMLElement | null = null;
      try {
        container = render(React.createElement(Component, SAMPLE_PROPS[name])).container;
      } catch {
        needsProps.push(name);
      } finally {
        errorSpy.mockRestore();
        warnSpy.mockRestore();
      }

      if (container === null) {
        expect(EXPECTED_NEEDS_PROPS).toContain(name);
        return;
      }

      expect(container).toBeInTheDocument();
      const results = await runAxe(container);
      if (results === null) {
        axeSkipped.push(name);
        throw new Error(`${name}: axe analysis timed out after ${AXE_TIMEOUT_MS}ms`);
      }

      rendered.push(name);
      const violations = results.violations.map((violation) => violation.id);
      if (violations.length > 0) {
        axeFailures.push({ name, rules: violations });
      }
      expect(violations, `${name}: axe violations`).toEqual([]);
    },
    PER_TEST_TIMEOUT_MS
  );

  afterAll(() => {
    const sortedNeedsProps = [...needsProps].sort();
    const sortedAxeSkipped = [...axeSkipped].sort();
    const sortedAxe = [...axeFailures].sort((a, b) => a.name.localeCompare(b.name));

    // eslint-disable-next-line no-console
    console.info(
      [
        '',
        '==================== component smoke summary ====================',
        `total components enumerated : ${candidates.length}`,
        `rendered + axe-checked      : ${rendered.length}`,
        `needs props/context        : ${sortedNeedsProps.length}`,
        `axe skipped/slow           : ${sortedAxeSkipped.length}`,
        `axe violations             : ${sortedAxe.length}`,
        sortedNeedsProps.length
          ? `\nneedsProps (${sortedNeedsProps.length}):\n  ${sortedNeedsProps.join('\n  ')}`
          : '\nneedsProps: (none)',
        sortedAxeSkipped.length
          ? `\naxe skipped (${sortedAxeSkipped.length}):\n  ${sortedAxeSkipped.join('\n  ')}`
          : '\naxe skipped: (none)',
        sortedAxe.length
          ? `\naxe violations (${sortedAxe.length}):\n  ${sortedAxe
              .map((failure) => `${failure.name} -> ${[...new Set(failure.rules)].join(', ')}`)
              .join('\n  ')}`
          : '\naxe violations: (none)',
        '=================================================================',
        '',
      ].join('\n')
    );

    expect(sortedNeedsProps).toEqual(EXPECTED_NEEDS_PROPS);
    expect(sortedAxeSkipped).toEqual([]);
    expect(sortedAxe).toEqual([]);
  });
});
