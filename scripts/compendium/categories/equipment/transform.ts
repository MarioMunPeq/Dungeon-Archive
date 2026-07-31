import type { Equipment } from "../../../../src/types/compendium";
import type { Raw5eItem } from "../../../../src/adapter/5etools-raw-types";
import { generateId } from "../../id";
import { createCanonicalId } from "../../identity";
import { isAllowedSource } from "../../allowed-sources";
import { processEntries } from "../../entries";

const ITEM_TYPE_MAP: Record<string, string> = {
  M: "Melee Weapon",
  R: "Ranged Weapon",
  A: "Ammunition",
  HA: "Heavy Armor",
  MA: "Medium Armor",
  LA: "Light Armor",
  S: "Shield",
  AT: "Adventuring Gear",
  INS: "Instrument",
  SCF: "Spellcasting Focus",
  RG: "Ring",
  P: "Potion",
  RD: "Rod",
  SC: "Scroll",
  ST: "Staff",
  W: "Wand",
  WD: "Wondrous Item",
  G: "Gear",
  T: "Tool",
  TG: "Mount/Tack",
  V: "Vehicle",
  PO: "Poison",
  TA: "Tattoo",
  TT: "Trap",
};

function mapType(raw: string | undefined): string {
  const code = raw?.split("|")[0] as string | undefined;
  return (code && ITEM_TYPE_MAP[code]) || raw || "Wondrous Item";
}

const WEAPON_PROPERTY_MAP: Record<string, string> = {
  V: "Versatile",
  F: "Finesse",
  L: "Light",
  T: "Thrown",
  "2H": "Two-Handed",
  A: "Ammunition",
  LD: "Loading",
  S: "Special",
  H: "Heavy",
  R: "Reach",
  RLD: "Reload",
  BF: "Burst Fire",
  AF: "Autofire",
};

function formatCost(value: number | undefined): string | undefined {
  if (value === undefined) return undefined;
  const gp = value / 100;
  if (gp === Math.floor(gp)) return `${gp} gp`;
  return `${gp} gp`;
}

function formatWeight(weight: number | undefined): string | undefined {
  if (weight === undefined) return undefined;
  return `${weight} lb`;
}

function mapProperties(props: readonly (string | { uid?: string })[] | undefined): string[] | undefined {
  if (!props || props.length === 0) return undefined;
  return props.map((p) => {
    const code = (typeof p === "string" ? p : p.uid)?.split("|")[0] as string | undefined;
    return (code && WEAPON_PROPERTY_MAP[code]) || (typeof p === "string" ? p : p.uid ?? "Special");
  });
}

export function transformEquipment(raw: readonly Raw5eItem[]): Equipment[] {
  return raw
    .filter((i) => isAllowedSource(i.source))
    .map((i) => ({
      id: generateId(i.source, i.name),
      canonicalId: createCanonicalId("equipment", i.name),
      category: "equipment" as const,
      name: i.name,
      source: i.source,
      type: mapType(i.type),
      cost: formatCost(i.value),
      weight: formatWeight(i.weight),
      damage: i.dmg1,
      damageType: i.dmgType,
      properties: mapProperties(i.property),
      ac: i.ac,
      strength: i.strength,
      stealth: i.stealth ? "Disadvantage" : undefined,
      description: processEntries(i.entries ?? []),
    }));
}
