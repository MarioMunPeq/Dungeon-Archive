import type { MagicItem } from "../../../../src/types/compendium";
import type { Raw5eMagicItem } from "../../../../src/adapter/5etools-raw-types";
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
  AMM: "Ammunition",
  EXP: "Explosive",
  GUN: "Firearm",
  LAUNCHER: "Launcher",
  SHP: "Ship",
  MNT: "Mount",
  FD: "Food and Drink",
  $C: "Clothing",
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

export function transformMagicItems(raw: readonly Raw5eMagicItem[]): MagicItem[] {
  return raw
    .filter((i) => isAllowedSource(i.source))
    .map((i) => ({
      id: generateId(i.source, i.name),
      canonicalId: createCanonicalId("magicitem", i.name),
      category: "magicitem" as const,
      name: i.name,
      source: i.source,
      rarity: i.rarity ?? "unknown",
      requiresAttunement: i.reqAttune ?? "",
      itemType: ITEM_TYPE_MAP[i.type] ?? i.type ?? "Wondrous Item",
      value: formatCost(i.value),
      weight: formatWeight(i.weight),
      description: processEntries(i.entries ?? []),
    }));
}
