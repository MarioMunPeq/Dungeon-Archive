import { formatDamageType } from "@/compendium";

interface DamageTypeEntry {
  readonly label: string;
  readonly dotClass: string;
}

/** Single source of truth for damage-type presentation. Keys are the canonical
    lowercase names; equipment data uses the letter codes mapped below. Only
    types actually present in the compendium data get an entry — anything else
    falls through gracefully without a marker. */
const DAMAGE_TYPES: Record<string, DamageTypeEntry> = {
  bludgeoning: { label: "Bludgeoning", dotClass: "bg-damage-bludgeoning" },
  piercing: { label: "Piercing", dotClass: "bg-damage-piercing" },
  slashing: { label: "Slashing", dotClass: "bg-damage-slashing" },
  radiant: { label: "Radiant", dotClass: "bg-damage-radiant" },
  necrotic: { label: "Necrotic", dotClass: "bg-damage-necrotic" },
  psychic: { label: "Psychic", dotClass: "bg-damage-psychic" },
};

const LETTER_CODES: Record<string, string> = {
  B: "bludgeoning",
  P: "piercing",
  S: "slashing",
  R: "radiant",
  N: "necrotic",
  Y: "psychic",
};

export interface DamageTypeVisual {
  readonly label: string;
  /** Tailwind class for the marker, or null when the type is unknown/missing. */
  readonly dotClass: string | null;
}

export function damageTypeVisual(code?: string): DamageTypeVisual {
  if (!code) return { label: "", dotClass: null };
  const key = LETTER_CODES[code] ?? code.trim().toLowerCase();
  const entry = DAMAGE_TYPES[key];
  if (!entry) return { label: formatDamageType(code), dotClass: null };
  return { label: entry.label, dotClass: entry.dotClass };
}
