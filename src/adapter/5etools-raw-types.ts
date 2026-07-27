// Private — 5etools JSON shapes
// NEVER import outside adapter boundary

export interface Raw5eTimeEntry {
  readonly number: number;
  readonly unit: string;
}

export interface Raw5eRange {
  readonly type: string;
  readonly distance: {
    readonly type: string;
    readonly amount?: number;
  };
}

export interface Raw5eComponents {
  readonly v?: boolean;
  readonly s?: boolean;
  readonly m?:
    string | { readonly text: string; readonly cost?: number; readonly consume?: boolean };
}

export interface Raw5eDuration {
  readonly type: string;
  readonly concentration?: boolean;
  readonly duration?: {
    readonly type: string;
    readonly amount?: number;
  };
  readonly ends?: readonly string[];
}

export interface Raw5eEntry {
  readonly type?: string;
  readonly name?: string;
  readonly entries?: readonly Raw5eEntry[];
  readonly items?: readonly (
    string | { readonly type: string; readonly name: string; readonly entry: string }
  )[];
  readonly caption?: string;
  readonly colLabels?: readonly string[];
  readonly rows?: readonly (readonly string[])[];
  readonly style?: string;
  readonly [key: string]: unknown;
}

export interface Raw5eSpell {
  readonly name: string;
  readonly source: string;
  readonly page?: number;
  readonly level: number;
  readonly school: string;
  readonly time: readonly Raw5eTimeEntry[];
  readonly range: string | Raw5eRange;
  readonly components: Raw5eComponents;
  readonly duration: readonly Raw5eDuration[];
  readonly entries: readonly (string | Raw5eEntry)[];
  readonly entriesHigherLevel?: readonly (string | Raw5eEntry)[];
  readonly meta?: { readonly ritual?: boolean };
  readonly classes?: {
    readonly fromClassList?: readonly { readonly name: string; readonly source: string }[];
  };
  readonly scalingLevelDice?: unknown;
  readonly damageInflict?: readonly string[];
  readonly conditionInflict?: readonly string[];
  readonly savingThrow?: readonly string[];
  readonly miscTags?: readonly string[];
  readonly areaTags?: readonly string[];
}

export interface Raw5eCondition {
  readonly name: string;
  readonly source: string;
  readonly page?: number;
  readonly entries: readonly (string | Raw5eEntry)[];
}

export interface Raw5eItem {
  readonly name: string;
  readonly source: string;
  readonly page?: number;
  readonly type: string;
  readonly rarity?: string;
  readonly weight?: number;
  readonly value?: number;
  readonly weapon?: boolean;
  readonly armor?: boolean;
  readonly weaponCategory?: string;
  readonly dmg1?: string;
  readonly dmg2?: string;
  readonly dmgType?: string;
  readonly property?: readonly string[];
  readonly range?: string;
  readonly ac?: number;
  readonly strength?: string;
  readonly stealth?: boolean;
  readonly entries: readonly (string | Raw5eEntry)[];
  readonly additionalEntries?: readonly (string | Raw5eEntry)[];
}

export interface Raw5eAction {
  readonly name: string;
  readonly source: string;
  readonly page?: number;
  readonly entries: readonly (string | Raw5eEntry)[];
  readonly time?: readonly Raw5eTimeEntry[];
}

export interface Raw5eSpellFile {
  readonly spell: readonly Raw5eSpell[];
}

export interface Raw5eConditionFile {
  readonly condition: readonly Raw5eCondition[];
}

export interface Raw5eItemFile {
  readonly item: readonly Raw5eItem[];
  readonly baseitem?: readonly Raw5eItem[];
}

export interface Raw5eActionFile {
  readonly action: readonly Raw5eAction[];
}
