import { useEffect, useRef } from "react";
import { useTheme } from "@/user-state";

/**
 * Cross-fades the accent theme when the active theme changes.
 *
 * This is the FALLBACK path for theme changes (used when the View Transitions
 * theme wave in theme-picker.tsx is unavailable or reduced-motion is active).
 * The `theme-switching` class (see index.css) puts a ~220ms transition on
 * color/background-color/border-color for the whole tree while the attribute is
 * swapped a frame later; the class is then removed. When the wave runs, the
 * picker swaps `data-theme` synchronously inside the view transition, so this
 * effect early-returns. First run applies the persisted theme instantly — no
 * animation on load. Reduced motion zeroes the transition via the base-layer
 * media query. 220ms stays under the 300ms ceiling of Design DNA rule 42.
 */
export function useApplyTheme(): void {
  const theme = useTheme();
  const firstRun = useRef(true);

  useEffect(() => {
    const root = document.documentElement;
    const isFirst = firstRun.current;
    firstRun.current = false;

    if (root.dataset.theme === theme) return;

    if (isFirst) {
      root.dataset.theme = theme;
      return;
    }

    root.classList.add("theme-switching");
    const raf = requestAnimationFrame(() => {
      root.dataset.theme = theme;
    });
    const timer = setTimeout(() => {
      root.classList.remove("theme-switching");
    }, 280);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [theme]);
}
