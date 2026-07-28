import type {
  Spell,
  Condition,
  Equipment,
  Action,
  SearchIndexEntry,
  EntityVersion,
} from "@/compendium";
import { getEntity } from "@/compendium";

export interface EntityDisplayInfo {
  readonly title: string;
  readonly subtitle: string;
}

export interface SearchResultItem {
  readonly id: string;
  readonly canonicalId: string;
  readonly title: string;
  readonly subtitle: string;
  readonly source: string;
  readonly to: string;
  readonly versions?: readonly EntityVersion[];
}

const SOURCE_DISPLAY: Record<string, string> = {
  XPHB: "PHB24",
  PHB: "PHB",
  TCE: "TCE",
  XGE: "XGE",
};

const SOURCE_PRIORITY: Record<string, number> = {
  XPHB: 1,
  PHB: 2,
  TCE: 3,
  XGE: 4,
};

const SCHOOL_NAMES: Record<string, string> = {
  A: "Abjuration",
  C: "Conjuration",
  D: "Divination",
  E: "Enchantment",
  I: "Illusion",
  N: "Necromancy",
  T: "Transmutation",
  V: "Evocation",
};

const EQUIPMENT_TYPE_DISPLAY: Record<string, string> = {
  $C: "Clothing",
  FD: "Food and Drink",
  GS: "Gaming Set",
  MNT: "Mount",
  SCF: "Spellcasting Focus",
  SHP: "Ship",
  TAH: "Tack and Harness",
  VEH: "Vehicle",
  WD: "Wand",
  G: "Gear",
  T: "Tool",
  AIR: "Air",
};

function sourcePriority(source: string): number {
  return SOURCE_PRIORITY[source] ?? 99;
}

function formatSource(source: string): string {
  return SOURCE_DISPLAY[source] ?? source;
}

function formatEquipmentType(rawType: string): string {
  const clean = rawType.includes("|") ? rawType.split("|")[0]! : rawType;
  return EQUIPMENT_TYPE_DISPLAY[clean] ?? clean;
}

function computeMatchScore(name: string, query: string): number {
  const lower = name.toLowerCase();
  if (lower === query) return 100;
  if (lower.startsWith(query)) return 80;
  if (lower.includes(query)) return 60;
  return 0;
}

function getSubtitle(entity: Spell | Condition | Equipment | Action): string {
  switch (entity.category) {
    case "spell": {
      const spell = entity as Spell;
      const levelText = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;
      const schoolName = SCHOOL_NAMES[spell.school] ?? spell.school;
      return `${levelText} \u00B7 ${schoolName} \u00B7 ${formatSource(spell.source)}`;
    }
    case "condition":
      return `Condition \u00B7 ${formatSource(entity.source)}`;
    case "equipment": {
      const item = entity as Equipment;
      return `${formatEquipmentType(item.type)} \u00B7 ${formatSource(item.source)}`;
    }
    case "action":
      return `Action \u00B7 ${formatSource(entity.source)}`;
  }
}

export function getEntityDisplayInfo(
  entity: Spell | Condition | Equipment | Action,
): EntityDisplayInfo {
  return {
    title: entity.name,
    subtitle: getSubtitle(entity),
  };
}

export function createSearchResultItems(
  query: string,
  entries: readonly SearchIndexEntry[],
): readonly SearchResultItem[] {
  const enriched: {
    entry: SearchIndexEntry;
    entity: Spell | Condition | Equipment | Action;
  }[] = [];

  for (const entry of entries) {
    const entity = getEntity(entry.category, entry.id);
    if (!entity) continue;
    enriched.push({ entry, entity });
  }

  const groups = new Map<string, (typeof enriched)[number][]>();
  for (const item of enriched) {
    const key = item.entity.canonicalId;
    const group = groups.get(key);
    if (group) {
      group.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  const results: SearchResultItem[] = [];

  for (const group of groups.values()) {
    group.sort((a, b) => sourcePriority(a.entity.source) - sourcePriority(b.entity.source));

    const preferred = group[0]!;
    const display = getEntityDisplayInfo(preferred.entity);
    const sources = group.map((g) => g.entity.source);
    const versionCount = sources.length;

    results.push({
      id: preferred.entry.id,
      canonicalId: preferred.entity.canonicalId,
      title: display.title,
      subtitle:
        versionCount > 1 ? `${display.subtitle} \u00B7 ${versionCount} versions` : display.subtitle,
      source: preferred.entity.source,
      to: `/${preferred.entry.category}/${preferred.entry.id}`,
      versions:
        versionCount > 1
          ? group.map((g) => ({ id: g.entry.id, source: g.entity.source }))
          : undefined,
    });
  }

  results.sort((a, b) => {
    const scoreA = computeMatchScore(a.title, query);
    const scoreB = computeMatchScore(b.title, query);
    if (scoreA !== scoreB) return scoreB - scoreA;
    const spA = sourcePriority(a.source);
    const spB = sourcePriority(b.source);
    if (spA !== spB) return spA - spB;
    return a.title.localeCompare(b.title);
  });

  return results;
}
