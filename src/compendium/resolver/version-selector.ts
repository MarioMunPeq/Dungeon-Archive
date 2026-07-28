import type { EntityVersion } from "@/types/compendium";

const SOURCE_PRIORITY: Record<string, number> = {
  XPHB: 1,
  PHB: 2,
  TCE: 3,
  XGE: 4,
  XMM: 5,
  MPMM: 6,
  MM: 7,
};

export function sourcePriority(source: string): number {
  return SOURCE_PRIORITY[source] ?? 99;
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
