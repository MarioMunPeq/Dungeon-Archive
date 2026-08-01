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
  EntityCategory,
} from "@/compendium";
import { getEntity, sourcePriority, referenceToUrl, CATEGORY_REGISTRY } from "@/compendium";

export interface EntityDisplayInfo {
  readonly title: string;
  readonly subtitle: string;
}

export interface SearchResultItem {
  readonly id: string;
  readonly canonicalId: string;
  readonly category: EntityCategory;
  readonly title: string;
  readonly subtitle: string;
  readonly source: string;
  readonly to: string;
  readonly versions?: readonly EntityVersion[];
}

type DisplayEntity = Spell | Condition | Equipment | Action | Monster | MagicItem | Feat;

const CATEGORY_WEIGHT: Record<string, number> = {
  spell: 10,
  monster: 20,
  equipment: 30,
  magicitem: 40,
  feat: 50,
  condition: 60,
  action: 70,
};

function computeMatchScore(name: string, query: string): number {
  const lower = name.toLowerCase();
  if (lower === query) return 100;
  if (lower.startsWith(query)) return 80;
  if (lower.includes(query)) return 60;
  return 0;
}

function getSubtitle(entity: DisplayEntity): string {
  return CATEGORY_REGISTRY[entity.category].getSubtitle(entity);
}

export function getEntityDisplayInfo(entity: DisplayEntity): EntityDisplayInfo {
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
    entity: DisplayEntity;
  }[] = [];

  for (const entry of entries) {
    const entity = getEntity(entry.category, entry.id) as DisplayEntity | null;
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
      category: preferred.entity.category,
      title: display.title,
      subtitle:
        versionCount > 1 ? `${display.subtitle} \u00B7 ${versionCount} versions` : display.subtitle,
      source: preferred.entity.source,
      to: referenceToUrl(preferred.entity.canonicalId),
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
    const weightA = CATEGORY_WEIGHT[a.category] ?? 99;
    const weightB = CATEGORY_WEIGHT[b.category] ?? 99;
    if (weightA !== weightB) return weightA - weightB;
    const spA = sourcePriority(a.source);
    const spB = sourcePriority(b.source);
    if (spA !== spB) return spA - spB;
    return a.title.localeCompare(b.title);
  });

  return results;
}
