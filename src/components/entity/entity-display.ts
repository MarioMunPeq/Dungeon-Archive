import type {
  Spell,
  Condition,
  Equipment,
  Action,
  Monster,
  MagicItem,
  Feat,
  SearchIndexEntry,
  EntityVersion,
} from "@/compendium";
import {
  getEntity,
  sourcePriority,
  formatSource,
  slugFromCanonicalId,
  categoryLabelSingular,
  formatMonsterType,
} from "@/compendium";

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

function getSubtitle(entity: Spell | Condition | Equipment | Action | Monster | MagicItem | Feat): string {
  const category = categoryLabelSingular(entity.category);

  switch (entity.category) {
    case "spell": {
      const spell = entity as Spell;
      const levelText = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;
      const schoolName = SCHOOL_NAMES[spell.school] ?? spell.school;
      return `${category} \u00B7 ${levelText} \u00B7 ${schoolName} \u00B7 ${formatSource(spell.source)}`;
    }
    case "monster": {
      const monster = entity as Monster;
      return `${category} \u00B7 CR ${monster.challengeRating} \u00B7 ${formatMonsterType(monster)} \u00B7 ${formatSource(monster.source)}`;
    }
    case "equipment": {
      const item = entity as Equipment;
      return `${category} \u00B7 ${formatEquipmentType(item.type)} \u00B7 ${formatSource(item.source)}`;
    }
    case "magicitem": {
      const magic = entity as MagicItem;
      const attune = magic.requiresAttunement ? " \u00B7 Requires Attunement" : "";
      return `${category} \u00B7 ${magic.rarity}${attune} \u00B7 ${formatSource(magic.source)}`;
    }
    case "feat": {
      const feat = entity as Feat;
      const prereq = feat.prerequisite ? `Prerequisite: ${feat.prerequisite}` : undefined;
      const repeatable = feat.repeatable ? "Repeatable" : undefined;
      const extras = [prereq, repeatable].filter(Boolean).join(" \u00B7 ");
      return extras ? `${category} \u00B7 ${extras} \u00B7 ${formatSource(feat.source)}` : `${category} \u00B7 ${formatSource(feat.source)}`;
    }
    case "condition":
      return `${category} \u00B7 ${formatSource(entity.source)}`;
    case "action":
      return `${category} \u00B7 ${formatSource(entity.source)}`;
  }
}

export function getEntityDisplayInfo(
  entity: Spell | Condition | Equipment | Action | Monster | MagicItem | Feat,
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
    entity: Spell | Condition | Equipment | Action | Monster | MagicItem | Feat;
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
      to: `/${preferred.entry.category}/${slugFromCanonicalId(preferred.entity.canonicalId)}`,
      versions:
        versionCount > 1
          ? group.map((g) => ({
              id: g.entry.id,
              source: g.entity.source,
              category: g.entity.category,
            }))
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
