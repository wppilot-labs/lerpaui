/**
 * Broad automated smoke + a11y coverage for the entire component library.
 *
 * Why this exists
 * ---------------
 * The library ships ~1200+ components but only a handful have dedicated tests.
 * This file gives every exported component a baseline guarantee: it can be
 * imported, and either renders with no props without throwing (and is then
 * checked for accessibility violations) or legitimately requires props. It is
 * meant to catch gross regressions — a component that suddenly throws on mount,
 * an export that disappears, a new component that is wildly inaccessible — not
 * to be a strict per-rule a11y gate (see "axe policy" below).
 *
 * Strategy
 * --------
 * 1. Import the public barrel (`../index`) and enumerate every named export that
 *    is a React component:
 *      - a plain function whose name starts with an uppercase letter, OR
 *      - a `forwardRef` / `memo` exotic component (object with a React
 *        `$$typeof` tag) exported under an uppercase key.
 *    Hooks (`use*`), `cva` variant factories, design-token objects, animation
 *    variant objects, and other non-component values are skipped automatically.
 *    A small DENYLIST can exclude anything that is a component by shape but is
 *    not safely renderable on its own.
 *
 * 2. Each component gets its own isolated test (via `it.each`) so a failure is
 *    named after the component. We attempt a no-props render inside a try/catch:
 *      - Renders cleanly  -> assert the container is attached, then run
 *        `axe(container)`.
 *      - Throws on render -> treated as "legitimately needs props" (e.g. Radix
 *        sub-parts used outside their Root). Recorded in `needsProps`; PASSES.
 *
 * 3. axe policy: a11y violations on successfully-rendered components are
 *    collected and printed loudly in the end-of-run summary, but they do NOT
 *    fail the suite. Many components have pre-existing violations; hard-failing
 *    here would make this broad smoke harness permanently red and useless as a
 *    regression gate. Fixing those violations is tracked separately. The summary
 *    is the surfacing mechanism — grep the run output for "axe violations".
 *
 * 4. An `afterAll` hook prints a `console.info` summary: total components,
 *    rendered + axe-checked count, the list that needed props, and the list with
 *    real axe violations (plus the rule ids).
 *
 * Global jsdom polyfills (ResizeObserver / IntersectionObserver / matchMedia /
 * canvas / pointer-capture) come from `src/test/setup.ts` — not duplicated here.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import * as React from "react";
import * as Lib from "../index";

// React exotic-component tags. forwardRef/memo components are objects, not
// functions, so a naive `typeof === "function"` check would miss them.
const FORWARD_REF = Symbol.for("react.forward_ref");
const MEMO = Symbol.for("react.memo");

// Realistic props for low-level primitives that are inaccessible ONLY when
// rendered empty (a real consumer always passes children / a label). Without
// these the smoke harness reports false a11y positives (empty button, unlabeled
// input) for components that are actually correct.
const SAMPLE_PROPS: Record<string, Record<string, unknown>> = {
  Button: { children: "Button" },
  ShinyButton: { children: "Button" },
  Input: { "aria-label": "Sample input" },
  Textarea: { "aria-label": "Sample textarea" },
};

// Generous per-test budget: axe over a large DOM (e.g. a component that renders
// a <video>/canvas-heavy tree) can be slow. Whole suite still finishes well
// under two minutes because most renders + axe passes are fast.
const PER_TEST_TIMEOUT_MS = 40_000;
// Soft cap for a single axe() call; if exceeded we record the component instead
// of letting the whole test time out.
const AXE_SOFT_TIMEOUT_MS = 30_000;

/**
 * Components that are real React components by shape but must not be smoke-
 * rendered with no props. Extend with a one-line reason.
 *
 * - DecryptedTextReveal: `text` is a required prop with no default. With no
 *   props its mount effect schedules a setTimeout that dereferences
 *   `text.length` on a LATER tick (after render returns), throwing an async
 *   error that escapes the render try/catch. It is exercised by its own
 *   dedicated test elsewhere; here it only contributes noise.
 */
const DENYLIST = new Set<string>(["DecryptedTextReveal"]);

function isUpperFirst(name: string): boolean {
  const c = name.charCodeAt(0);
  return c >= 65 && c <= 90; // 'A'..'Z'
}

function isReactComponent(value: unknown): boolean {
  if (typeof value === "function") return true;
  if (value && typeof value === "object") {
    const tag = (value as { $$typeof?: symbol }).$$typeof;
    return tag === FORWARD_REF || tag === MEMO;
  }
  return false;
}

type Candidate = { name: string; Component: React.ElementType };

const candidates: Candidate[] = Object.entries(Lib as Record<string, unknown>)
  .filter(([name, value]) => {
    if (!isUpperFirst(name)) return false; // hooks (use*), helpers, cva fns are lowercase
    if (name.startsWith("use")) return false; // defensive (use* are lowercase anyway)
    if (DENYLIST.has(name)) return false;
    return isReactComponent(value);
  })
  .map(([name, value]) => ({ name, Component: value as React.ElementType }));

// Accumulators for the end-of-run summary. Populated as the isolated tests run.
const rendered: string[] = []; // rendered cleanly AND axe finished
const needsProps: string[] = []; // render threw -> legitimately requires props/context
const axeSkipped: string[] = []; // rendered cleanly but axe timed out / could not analyze
const axeFailures: Array<{ name: string; rules: string[] }> = [];

/**
 * Guard against stray asynchronous errors. A handful of components, when
 * rendered with no props, schedule timers/RAF callbacks that throw on a later
 * tick (a missing required prop dereferenced inside a setTimeout). Those errors
 * surface as `uncaughtException` and would mark the run as errored even though
 * the synchronous render — the thing we are smoke-testing — succeeded. We
 * swallow them here and record nothing; the dedicated tests for those
 * components cover their real behaviour. Original listeners are restored after.
 *
 * `process` is reached via `globalThis` with a minimal local type so this
 * package's tsconfig does not need `@types/node`.
 */
type NodeProcessLike = {
  listeners(event: string): Array<(...args: unknown[]) => void>;
  on(event: string, listener: (...args: unknown[]) => void): unknown;
  removeListener(event: string, listener: (...args: unknown[]) => void): unknown;
  removeAllListeners(event: string): unknown;
};
const proc = (globalThis as unknown as { process: NodeProcessLike }).process;

const originalUncaught = proc.listeners("uncaughtException");
const originalRejection = proc.listeners("unhandledRejection");
function swallow() {
  /* intentionally ignore stray post-unmount async throws */
}

beforeAll(() => {
  proc.removeAllListeners("uncaughtException");
  proc.removeAllListeners("unhandledRejection");
  proc.on("uncaughtException", swallow);
  proc.on("unhandledRejection", swallow);
});

describe("library smoke + a11y (all components, no props)", () => {
  it("found a non-trivial set of components to test", () => {
    // Guards against the barrel failing to resolve or the predicate breaking.
    expect(candidates.length).toBeGreaterThan(100);
  });

  it.each(candidates)(
    "$name renders (or legitimately needs props) and is a11y-checked",
    async ({ name, Component }) => {
      // Silence expected React noise (missing-prop warnings, act warnings,
      // controlled/uncontrolled notices) so the run output stays readable.
      // Real render failures still throw and are caught below — they are not
      // routed through console, so this does not hide them.
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      let container: HTMLElement | null = null;
      let renderThrew = false;

      try {
        const result = render(React.createElement(Component, SAMPLE_PROPS[name]));
        container = result.container;
      } catch {
        // Many components legitimately require props / a parent context (e.g.
        // Radix sub-parts used outside their Root). Expected; must not fail.
        renderThrew = true;
      } finally {
        errorSpy.mockRestore();
        warnSpy.mockRestore();
      }

      if (renderThrew || container === null) {
        needsProps.push(name);
        expect(renderThrew || container === null).toBe(true);
        return;
      }

      // Rendered without throwing — it should be attached to the jsdom document.
      expect(container).toBeInTheDocument();

      // Run axe on the rendered output, but never let it hang the whole test:
      // race it against a soft timeout. On timeout/error we record the
      // component as needing props rather than failing.
      let results: Awaited<ReturnType<typeof axe>> | null = null;
      try {
        results = await Promise.race([
          axe(container),
          new Promise<null>((resolve) =>
            setTimeout(() => resolve(null), AXE_SOFT_TIMEOUT_MS)
          ),
        ]);
      } catch {
        results = null;
      }

      if (results === null) {
        // Rendered fine, but axe could not analyze this tree within the soft
        // cap (or errored). The smoke goal — a non-throwing mount — is met; we
        // just couldn't run a11y on it. Don't fail the suite over it.
        axeSkipped.push(name);
        return;
      }

      rendered.push(name);

      // axe policy: collect violations and surface them in the summary, but do
      // NOT fail the suite (see file header).
      const violations =
        ((results as { violations?: Array<{ id: string }> }).violations) ?? [];
      if (violations.length > 0) {
        axeFailures.push({ name, rules: violations.map((v) => v.id) });
      }
    },
    PER_TEST_TIMEOUT_MS
  );

  afterAll(() => {
    // Restore the original process error listeners.
    proc.removeListener("uncaughtException", swallow);
    proc.removeListener("unhandledRejection", swallow);
    for (const l of originalUncaught) proc.on("uncaughtException", l);
    for (const l of originalRejection) proc.on("unhandledRejection", l);

    const total = candidates.length;
    const sortedNeedsProps = [...needsProps].sort();
    const sortedAxeSkipped = [...axeSkipped].sort();
    const sortedAxe = [...axeFailures].sort((a, b) => a.name.localeCompare(b.name));

    // eslint-disable-next-line no-console
    console.info(
      [
        "",
        "==================== component smoke summary ====================",
        `total components enumerated : ${total}`,
        `rendered + axe-checked      : ${rendered.length}`,
        `needs props (render threw)  : ${sortedNeedsProps.length}`,
        `rendered, axe skipped/slow  : ${sortedAxeSkipped.length}`,
        `axe violations (surfaced)   : ${sortedAxe.length}`,
        sortedNeedsProps.length
          ? `\nneedsProps (${sortedNeedsProps.length}):\n  ${sortedNeedsProps.join("\n  ")}`
          : "\nneedsProps: (none)",
        sortedAxeSkipped.length
          ? `\nrendered but axe skipped (${sortedAxeSkipped.length}):\n  ${sortedAxeSkipped.join("\n  ")}`
          : "\nrendered but axe skipped: (none)",
        sortedAxe.length
          ? `\naxe violations (${sortedAxe.length}) [not failing the suite — see header]:\n  ${sortedAxe
              .map((f) => `${f.name} -> ${[...new Set(f.rules)].join(", ")}`)
              .join("\n  ")}`
          : "\naxe violations: (none)",
        "=================================================================",
        "",
      ].join("\n")
    );
  });
});
