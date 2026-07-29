import type { ContentBlock } from "./content-block";

export type EntityCategory = "spell" | "condition" | "equipment" | "action" | "monster" | "magicitem";

export type CompendiumCategory = EntityCategory;

export interface CompendiumEntry {
  readonly id: string;
  readonly canonicalId: string;
  readonly category: EntityCategory;
  readonly name: string;
  readonly source: string;
}

export interface Spell extends CompendiumEntry {
  readonly category: "spell";
  readonly level: number;
  readonly school: string;
  readonly castingTime: string;
  readonly range: string;
  readonly components: readonly string[];
  readonly duration: string;
  readonly description: readonly ContentBlock[];
  readonly higherLevels?: readonly ContentBlock[];
  readonly classes: readonly string[];
  readonly ritual: boolean;
  readonly concentration: boolean;
}

export interface Condition extends CompendiumEntry {
  readonly category: "condition";
  readonly description: readonly ContentBlock[];
}

export interface Equipment extends CompendiumEntry {
  readonly category: "equipment";
  readonly type: string;
  readonly cost?: string;
  readonly weight?: string;
  readonly damage?: string;
  readonly damageType?: string;
  readonly properties?: readonly string[];
  readonly ac?: number;
  readonly strength?: string;
  readonly stealth?: string;
  readonly description: readonly ContentBlock[];
}

export interface Action extends CompendiumEntry {
  readonly category: "action";
  readonly actionType: string;
  readonly description: readonly ContentBlock[];
}

export interface MagicItem extends CompendiumEntry {
  readonly category: "magicitem";
  readonly rarity: string;
  readonly requiresAttunement: string;
  readonly itemType: string;
  readonly value?: string;
  readonly weight?: string;
  readonly description: readonly ContentBlock[];
}

export interface Monster extends CompendiumEntry {
  readonly category: "monster";
  readonly size: string;
  readonly monsterType: string;
  readonly tags: readonly string[];
  readonly alignment: readonly string[];
  readonly challengeRating: string;
  readonly armorClass: string;
  readonly hitPoints: string;
  readonly speed: string;
  readonly abilities: {
    readonly str: number;
    readonly dex: number;
    readonly con: number;
    readonly int: number;
    readonly wis: number;
    readonly cha: number;
  };
  readonly traits: readonly ContentBlock[];
  readonly actions: readonly ContentBlock[];
  readonly reactions: readonly ContentBlock[];
  readonly legendaryActions: readonly ContentBlock[];
  readonly description: readonly ContentBlock[];
}

export interface SearchIndexEntry {
  readonly id: string;
  readonly canonicalId: string;
  readonly name: string;
  readonly category: EntityCategory;
}

export interface EntityVersion {
  readonly id: string;
  readonly source: string;
  readonly category: EntityCategory;
}
