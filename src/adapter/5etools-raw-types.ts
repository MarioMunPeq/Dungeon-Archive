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

export interface Raw5eCellRoll {
  readonly exact?: number;
  readonly min?: number;
  readonly max?: number;
  readonly pad?: boolean;
  readonly formula?: string;
}

export interface Raw5eCell {
  readonly type?: string;
  readonly roll?: Raw5eCellRoll;
  readonly name?: string;
  readonly entry?: string;
  readonly alignment?: "left" | "center" | "right";
  readonly [key: string]: unknown;
}

export interface Raw5eEntry {
  readonly type?: string;
  readonly name?: string;
  readonly entries?: readonly unknown[];
  readonly items?: readonly unknown[];
  readonly caption?: string;
  readonly colLabels?: readonly unknown[];
  readonly rows?: readonly (readonly unknown[])[];
  readonly style?: string;
  readonly by?: string;
  readonly roll?: Raw5eCellRoll;
  readonly url?: string;
  readonly altText?: string;
  readonly width?: number;
  readonly height?: number;
  readonly text?: string;
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

export interface Raw5eMagicItem {
  readonly name: string;
  readonly source: string;
  readonly page?: number;
  readonly type: string;
  readonly rarity: string;
  readonly reqAttune?: string;
  readonly reqAttuneTags?: readonly { readonly class?: string }[];
  readonly wondrous?: boolean;
  readonly bonusSpellAttack?: string;
  readonly bonusSpellSaveDc?: string;
  readonly focus?: readonly string[];
  readonly weight?: number;
  readonly value?: number;
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

export interface Raw5eMonster {
  readonly name: string;
  readonly source: string;
  readonly page?: number;
  readonly size: readonly string[];
  readonly type: string;
  readonly alignment: readonly string[];
  readonly ac: ReadonlyArray<
    { readonly ac: number; readonly from?: readonly string[] } | { readonly special: string }
  >;
  readonly hp: { readonly average?: number; readonly formula?: string; readonly special?: string };
  readonly speed: Record<string, unknown>;
  readonly str: number;
  readonly dex: number;
  readonly con: number;
  readonly int: number;
  readonly wis: number;
  readonly cha: number;
  readonly cr?: string | { readonly cr: string };
  readonly trait?: readonly Raw5eEntry[];
  readonly action?: readonly Raw5eEntry[];
  readonly reaction?: readonly Raw5eEntry[];
  readonly legendary?: readonly Raw5eEntry[];
  readonly entries?: readonly (string | Raw5eEntry)[];
  readonly actions?: readonly Raw5eEntry[];
  readonly reactions?: readonly Raw5eEntry[];
  readonly legendaryActions?: readonly Raw5eEntry[];
  readonly [key: string]: unknown;
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

export interface Raw5eMonsterFile {
  readonly monster: readonly Raw5eMonster[];
}
