/**
 * The app's only whole-screen transition: a short cross-fade for the two
 * changes that swap everything underneath you — the accent theme and the
 * language.
 *
 * Design DNA rule 41 — motion makes a state change feel continuous, it never
 * asks to be watched. This animates *opacity only*, at a duration inside the
 * ordinary interaction budget. It replaces a full-viewport circular reveal with
 * a glowing shockwave ring and a scale/translate settle, which had been
 * classified as a "signature moment" and read as aggressive — exactly what
 * rule 41 forbids. A settings toggle is not the dice roll; it does not earn
 * that budget.
 *
 * There is no Web Animations code here at all. The browser already cross-fades
 * a view transition, so all this has to do is choose a duration.
 */

/**
 * The two budgets are deliberately different. Recolouring every surface is a
 * large change and gets the longer dissolve; swapping words is a small one and
 * gets the shorter. Both sit well under the 300ms ceiling.
 */
export const CROSS_FADE_LANGUAGE_MS = 160;
export const CROSS_FADE_THEME_MS = 240;

/**
 * `true` when the user asked the OS for reduced motion.
 *
 * The global `* { animation: none }` rule in index.css cannot reach the
 * ::view-transition-* pseudo-elements, so the transition is skipped in JS
 * instead of relying on CSS alone.
 */
export function prefersReducedMotion(): boolean {
  // `globalThis` rather than `window` so this stays callable (and testable) in a
  // non-DOM context.
  const mm = (globalThis as { matchMedia?: (q: string) => { matches: boolean } }).matchMedia;
  if (typeof mm !== "function") return false;
  return mm("(prefers-reduced-motion: reduce)").matches;
}

/** The custom property the pseudo-element rules read (see index.css). */
const DURATION_VAR = "--cross-fade-duration";

/**
 * Runs `commit` inside a View Transition so the browser cross-fades between the
 * two states. Falls back to a plain synchronous commit when the API is missing
 * or the user asked for reduced motion — the state change is never blocked
 * either way.
 */
export async function runCrossFade(commit: () => void, durationMs: number): Promise<void> {
  const root = document.documentElement;

  if (typeof document.startViewTransition !== "function" || prefersReducedMotion()) {
    commit();
    return;
  }

  root.style.setProperty(DURATION_VAR, `${durationMs}ms`);

  try {
    const transition = document.startViewTransition(commit);
    try {
      await transition.finished;
    } catch {
      // The transition was skipped (e.g. a newer one superseded it).
    }
  } catch {
    // Any failure must not block the state change.
    commit();
  } finally {
    root.style.removeProperty(DURATION_VAR);
  }
}
