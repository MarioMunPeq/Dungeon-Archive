import type { SearchIndexEntry } from "@/types/compendium";
import { searchIndex, searchIndexLower } from "./loader";

interface ScoredEntry extends SearchIndexEntry {
  readonly score: number;
}

export function search(query: string): readonly SearchIndexEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored: ScoredEntry[] = [];

  for (let i = 0; i < searchIndex.length; i++) {
    const nameLower = searchIndexLower[i]!;
    let s: number;
    if (nameLower === q) {
      s = 100;
    } else if (nameLower.startsWith(q)) {
      s = 80;
    } else if (nameLower.includes(q)) {
      s = 60;
    } else {
      continue;
    }
    scored.push({ ...searchIndex[i]!, score: s });
  }

  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  return scored;
}
