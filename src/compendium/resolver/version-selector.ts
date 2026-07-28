import type { EntityVersion } from "@/types/compendium";

const SOURCE_PRIORITY: Record<string, number> = {
  XPHB: 1,
  PHB: 2,
  TCE: 3,
  XGE: 4,
};

export function sourcePriority(source: string): number {
  return SOURCE_PRIORITY[source] ?? 99;
}

export const SOURCE_DISPLAY: Record<string, string> = {
  XPHB: "PHB24",
  PHB: "PHB",
  TCE: "TCE",
  XGE: "XGE",
};

export function formatSource(source: string): string {
  return SOURCE_DISPLAY[source] ?? source;
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
