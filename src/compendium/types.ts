import type {
  Spell,
  Condition,
  Equipment,
  Action,
  Monster,
  MagicItem,
  Feat,
  EntityCategory,
} from "@/types/compendium";

export interface CompendiumState {
  spells: Map<string, Spell>;
  conditions: Map<string, Condition>;
  equipment: Map<string, Equipment>;
  actions: Map<string, Action>;
  monsters: Map<string, Monster>;
  magicItems: Map<string, MagicItem>;
  feats: Map<string, Feat>;
  spellList: readonly Spell[];
  conditionList: readonly Condition[];
  equipmentList: readonly Equipment[];
  actionList: readonly Action[];
  monsterList: readonly Monster[];
  magicItemList: readonly MagicItem[];
  featList: readonly Feat[];
  initialized: boolean;
}

export type CategoryMap = {
  spell: Spell;
  condition: Condition;
  equipment: Equipment;
  action: Action;
  monster: Monster;
  magicitem: MagicItem;
  feat: Feat;
};

export type CategoryKey = keyof CategoryMap;

export interface CardStat {
  readonly label: string;
  readonly value: string;
  readonly numeric?: boolean;
}

export interface EntityCardData {
  readonly name: string;
  readonly href: string;
  readonly category: EntityCategory;
  readonly categoryLabel: string;
  readonly metadata: string;
  readonly source: string;
  readonly canonicalId: string;
  readonly versionCount?: number;
  readonly stat?: CardStat;
}

export interface FilterOption {
  readonly value: string;
  readonly label: string;
}

export interface FilterDefinition {
  readonly key: string;
  readonly label: string;
  readonly options: readonly FilterOption[];
}
