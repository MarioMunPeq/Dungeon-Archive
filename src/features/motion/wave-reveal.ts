/**
 * The app's shared "signature moment": a circular reveal that opens from the
 * point the user touched, carrying a shockwave ring of light in the active
 * accent colour, while the incoming content settles in with a slight rise.
 *
 * Design DNA rules 42/52 cap this at ~550ms and rule 44 requires state changes to
 * animate opacity + translate together (never one alone) — the keyframes below
 * animate clip-path (the shape), filter (the ring) and transform+opacity (the
 * content settle) in one pass, all driven from a single pseudo-element so the
 * whole thing stays on one composited layer.
 */

/** Screen-space point the reveal originates from. */
export interface WaveOrigin {
  readonly x: number;
  readonly y: number;
}

export const WAVE_DURATION_MS = 550;

/** Matches the `--animate-*` secondary budget so JS and CSS stay in step. */
const WAVE_EASING = "cubic-bezier(0.22, 0.8, 0.2, 1)";

/**
 * `true` when the user asked the OS for reduced motion.
 *
 * The global `* { animation: none }` rule in index.css already neutralises
 * ordinary CSS animations, but it cannot reach the ::view-transition-*
 * pseudo-elements that drive this wave, so it has to be checked here — before
 * the transition is even started.
 */
export function prefersReducedMotion(): boolean {
  // `globalThis` rather than `window` so this stays callable (and testable) in a
  // non-DOM context.
  const mm = (globalThis as { matchMedia?: (q: string) => { matches: boolean } }).matchMedia;
  if (typeof mm !== "function") return false;
  return mm("(prefers-reduced-motion: reduce)").matches;
}

/** Marks the transition in flight so effect-driven fallbacks can stand down. */
export const WAVE_RUNNING_CLASS = "wave-transitioning";

/**
 * Smallest circle that still covers the viewport from `origin`. The wave is a
 * full-bleed reveal, so anything less would leave the corners un-painted.
 */
function coveringRadius(origin: WaveOrigin): number {
  return Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  );
}

/** The accent the *incoming* state just switched to; tints the ring. */
function activeAccent(root: Element): string {
  const value = getComputedStyle(root).getPropertyValue("--theme-accent").trim();
  return value.length > 0 ? value : "rgb(255 255 255)";
}

/**
 * Runs `commit` inside a View Transition and paints the wave over the swap.
 *
 * Degrades to a plain synchronous commit when the browser has no View
 * Transitions API or the user prefers reduced motion — the state change is never
 * blocked either way.
 */
export async function runWaveReveal(commit: () => void, origin: WaveOrigin): Promise<void> {
  const root = document.documentElement;

  if (typeof document.startViewTransition !== "function" || prefersReducedMotion()) {
    commit();
    return;
  }

  root.classList.add(WAVE_RUNNING_CLASS);

  let transition: ViewTransition;
  try {
    transition = document.startViewTransition(commit);
  } catch {
    root.classList.remove(WAVE_RUNNING_CLASS);
    commit();
    return;
  }

  try {
    // `ready` resolves once the new snapshot exists — i.e. after `commit` ran and
    // `data-theme` (or the language) is already the incoming value, so the accent
    // published below is the new one and the keyframes can reference it.
    await transition.ready;

    root.style.setProperty("--wave-accent", activeAccent(root));

    const radius = coveringRadius(origin);

    root.animate(
      [
        {
          offset: 0,
          clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`,
          // The ring reads as light escaping the seam: a wide soft glow as the
          // circle opens, tightening to nothing by the time it closes over.
          filter: "drop-shadow(0 0 4px var(--wave-accent))",
          transform: "translateY(12px) scale(1.05)",
          opacity: 0.65,
        },
        {
          offset: 0.35,
          filter: "drop-shadow(0 0 34px var(--wave-accent))",
          transform: "translateY(5px) scale(1.018)",
          opacity: 1,
        },
        {
          offset: 0.7,
          filter: "drop-shadow(0 0 12px var(--wave-accent))",
          transform: "translateY(2px) scale(1.005)",
          opacity: 1,
        },
        {
          offset: 1,
          clipPath: `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          filter: "drop-shadow(0 0 0 transparent)",
          transform: "none",
          opacity: 1,
        },
      ],
      {
        duration: WAVE_DURATION_MS,
        easing: WAVE_EASING,
        fill: "both",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  } catch {
    // A failed animation must never block the state change — the swap itself
    // already happened inside commit().
  }

  try {
    await transition.finished;
  } catch {
    // The transition was skipped; nothing to recover.
  }
  root.style.removeProperty("--wave-accent");
  root.classList.remove(WAVE_RUNNING_CLASS);
}