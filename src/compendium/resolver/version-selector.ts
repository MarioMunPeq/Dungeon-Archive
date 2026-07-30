import type { EntityVersion } from "@/types/compendium";
import { SOURCE_ORDER } from "../category-registry";

export function sourcePriority(source: string): number {
  return SOURCE_ORDER[source] ?? 99;
}

export function selectPreferredVersion(versions: readonly EntityVersion[]): EntityVersion {
  if (versions.length === 0) throw new Error("Cannot select from empty versions");

  let best = versions[0]!;
  let bestPriority = sourcePriority(best.source);

  for (let i = 1; i < versions.length; i++) {
    const current = versions[i]!;
    const currentPriority = sourcePriority(current.source);
    if (currentPriority < bestPriority) {
      best = current;
      bestPriority = currentPriority;
    }
  }

  return best;
}
