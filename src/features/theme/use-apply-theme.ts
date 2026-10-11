import { useEffect } from "react";
import { useTheme } from "@/user-state";

/**
 * Applies the persisted accent theme.
 *
 * The theme swap itself is animated by `runWaveReveal` (see features/motion),
 * which owns the View Transition and the reduced-motion decision — it sets
 * `data-theme` synchronously inside the transition callback so the incoming
 * snapshot already carries the new colours. This hook only guarantees the
 * attribute is applied on first load and whenever the theme changes without
 * going through the picker. It never animates.
 */
export function useApplyTheme(): void {
  const theme = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.theme === theme) return;
    root.dataset.theme = theme;
  }, [theme]);
}