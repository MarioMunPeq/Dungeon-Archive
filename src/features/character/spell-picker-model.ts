import { applyFilters } from "@/compendium";
import type { Spell } from "@/compendium";

export interface SpellPickerFilterValues {
  readonly level?: string;
  readonly school?: string;
  readonly class?: string;
  readonly concentration?: string;
  readonly ritual?: string;
}

export interface SpellPickerQuery {
  readonly query?: string;
  /** Character class used to scope results; null/empty shows every spell. */
  readonly characterClass?: string | null;
  readonly filters?: SpellPickerFilterValues;
}

export function matchesCharacterClass(spell: Spell, characterClass: string): boolean {
  const cls = characterClass.trim().toLowerCase();
  if (!cls) return false;
  return spell.classes.some((c) => c.trim().toLowerCase() === cls);
}

export function countClassSpells(spells: readonly Spell[], characterClass: string): number {
  if (!characterClass.trim()) return 0;
  return spells.filter((spell) => matchesCharacterClass(spell, characterClass)).length;
}

export function scoreSpellMatch(spell: Spell, query: string): number | null {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const name = spell.name.toLowerCase();
  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  return null;
}

export function filterSpellCandidates(
  spells: readonly Spell[],
  { query = "", characterClass = null, filters = {} }: SpellPickerQuery,
): Spell[] {
  const scoped =
    characterClass && characterClass.trim()
      ? spells.filter((spell) => matchesCharacterClass(spell, characterClass))
      : spells;
  const filtered = applyFilters(
    "spell",
    scoped,
    filters as Record<string, string>,
  ) as readonly Spell[];
  const scored: { spell: Spell; score: number }[] = [];
  for (const spell of filtered) {
    const score = scoreSpellMatch(spell, query);
    if (score === null) continue;
    scored.push({ spell, score });
  }
  scored.sort((a, b) => b.score - a.score || a.spell.name.localeCompare(b.spell.name));
  return scored.map((entry) => entry.spell);
}
