import type {
  Class,
  ClassEquipmentChoice,
  ClassEquipmentGroup,
  ClassFeatureRef,
  ClassTableGroup,
} from "../../../../src/types/compendium";
import type { ContentBlock } from "../../../../src/types/content-block";
import type {
  Raw5eClass,
  Raw5eClassEquipmentItem,
} from "../../../../src/adapter/5etools-raw-types";
import { generateId } from "../../id";
import { createCanonicalId } from "../../identity";
import { isAllowedSource } from "../../allowed-sources";
import { normalizeText } from "../../normalizer/index";
import { processEntries } from "../../entries";

const ABILITY_ORDER = ["str", "dex", "con", "int", "wis", "cha"] as const;

// 5etools uses symbolic ids for generic starting gear instead of a concrete item.
const EQUIPMENT_TYPE_LABELS: Record<string, string> = {
  weaponSimple: "Simple Weapon",
  weaponSimpleMelee: "Simple Melee Weapon",
  weaponMartial: "Martial Weapon",
  weaponMartialMelee: "Martial Melee Weapon",
  focusSpellcastingArcane: "Arcane Focus",
  focusSpellcastingHoly: "Holy Symbol",
  focusSpellcastingDruidic: "Druidic Focus",
  instrumentMusical: "Musical Instrument",
};

function titleCase(text: string): string {
  return text.length === 0 ? text : text[0]!.toUpperCase() + text.slice(1);
}

function humanize(text: string): string {
  return titleCase(text.replace(/([a-z0-9])([A-Z])/g, "$1 $2"));
}

/** XPHB item refs are lowercase slugs; PHB ones are already display-cased. */
function displayItemName(name: string): string {
  if (name.length === 0) return name;
  if (name !== name.toLowerCase()) return name;
  return name
    .split(" ")
    .map((w) => (w.length > 0 ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function goldLabel(amount: number): string {
  return `${amount.toLocaleString("en-US")} GP`;
}

/** Formats a single `{@item ...}`-style equipment reference into a readable label. */
function formatRef(ref: string): string {
  const parts = ref.split("|");
  const name = normalizeText(parts[0]);
  if (name.length === 0) return "";
  // `{@item crossbow bolts (20)|PHB|20 bolts}` carries the count in the 3rd field.
  const trailing = parts
    .slice(2)
    .map(normalizeText)
    .filter((p) => p.length > 0);
  if (trailing.length > 0)
    return `${trailing.map(displayItemName).join(" ")} ${displayItemName(name)}`;
  return displayItemName(name);
}

function formatEquipmentEntry(entry: Raw5eClassEquipmentItem | string): {
  readonly label: string;
  readonly gold: number | null;
} {
  if (typeof entry === "string") {
    const label = formatRef(entry);
    return { label, gold: null };
  }
  if (!entry || typeof entry !== "object") return { label: "", gold: null };

  if (typeof entry.value === "number") return { label: "", gold: entry.value };

  let label = "";
  if (typeof entry.item === "string") label = formatRef(entry.item);
  else if (typeof entry.equipment === "string") label = formatRef(entry.equipment);
  else if (typeof entry.equipmentType === "string") {
    label = EQUIPMENT_TYPE_LABELS[entry.equipmentType] ?? humanize(entry.equipmentType);
  } else if (Array.isArray(entry.equipmentTypes) && entry.equipmentTypes.length > 0) {
    label = entry.equipmentTypes
      .map((k) => (typeof k === "string" ? (EQUIPMENT_TYPE_LABELS[k] ?? humanize(k)) : ""))
      .filter(Boolean)
      .join(" / ");
  } else if (typeof entry.special === "string") {
    label = normalizeText(entry.special);
  }

  if (typeof entry.quantity === "number" && entry.quantity > 1 && label.length > 0) {
    label = `${entry.quantity} \u00d7 ${label}`;
  }

  return { label, gold: null };
}

function formatChoice(
  key: string,
  value: readonly (Raw5eClassEquipmentItem | string)[] | number,
): ClassEquipmentChoice | null {
  if (typeof value === "number") {
    return { label: key === "_" ? "" : key.toUpperCase(), items: [], gold: goldLabel(value) };
  }
  if (!Array.isArray(value)) return null;

  const items: string[] = [];
  let gold: number | null = null;
  for (const entry of value) {
    const formatted = formatEquipmentEntry(entry);
    if (formatted.label) items.push(formatted.label);
    if (formatted.gold !== null) gold = formatted.gold;
  }

  const label = key === "_" ? "" : key.toUpperCase();
  if (items.length === 0 && gold === null) return null;
  return { label, items, gold: gold === null ? null : goldLabel(gold) };
}

function formatStartingEquipment(raw: Raw5eClass["startingEquipment"]): {
  readonly groups: readonly ClassEquipmentGroup[];
  readonly goldAlternative: string | null;
  readonly additionalFromBackground: boolean;
} {
  if (!raw) {
    return { groups: [], goldAlternative: null, additionalFromBackground: false };
  }

  const groups: ClassEquipmentGroup[] = [];

  // `defaultData` groups each equipment slot; keys are the alternatives (a / b / A / B / _).
  for (const group of raw.defaultData ?? []) {
    const alternatives: ClassEquipmentChoice[] = [];
    for (const [key, value] of Object.entries(group)) {
      const choice = formatChoice(key, value as never);
      if (choice) alternatives.push(choice);
    }
    if (alternatives.length > 0) groups.push({ alternatives });
  }

  // Fallback for sources without `defaultData`: the pre-formatted display lines.
  if (groups.length === 0) {
    const lines = (raw.default ?? []).map((l) => normalizeText(l)).filter((l) => l.length > 0);
    const entryLines = (raw.entries ?? []).map((l) => normalizeText(l)).filter((l) => l.length > 0);
    const all = lines.length > 0 ? lines : entryLines;
    if (all.length > 0) groups.push({ alternatives: [{ label: "", items: all, gold: null }] });
  }

  return {
    groups,
    goldAlternative: raw.goldAlternative ? normalizeText(raw.goldAlternative) : null,
    additionalFromBackground: raw.additionalFromBackground === true,
  };
}

function formatAbility(raw: string | { readonly [key: string]: boolean }): string | null {
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object") {
    const key = ABILITY_ORDER.find((ab) => raw[ab]);
    return key ?? null;
  }
  return null;
}

function formatPrimaryAbility(raw: Raw5eClass["primaryAbility"]): string[] {
  if (!raw) return [];
  const out: string[] = [];
  for (const entry of raw) {
    const ab = formatAbility(entry);
    if (ab) out.push(ab);
  }
  return out;
}

/** Proficiency lists mix plain strings with `{ proficiency, optional }` objects. */
function formatProficiencies(raw: readonly unknown[] | undefined): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const entry of raw) {
    if (typeof entry === "string") {
      const text = normalizeText(entry);
      if (text.length > 0) out.push(text);
      continue;
    }
    if (entry && typeof entry === "object") {
      const obj = entry as { proficiency?: unknown; optional?: boolean };
      const name = typeof obj.proficiency === "string" ? obj.proficiency : "";
      if (name.length === 0) continue;
      const base = name
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .trim();
      out.push(obj.optional === true ? `${base} (optional)` : base);
    }
  }
  return out;
}

function formatSkills(
  raw: Raw5eClass["startingProficiencies"],
): { readonly from: readonly string[]; readonly count: number }[] {
  const skills = raw?.skills;
  if (!skills) return [];
  return skills
    .map((s) => (s.choose ? { from: s.choose.from, count: s.choose.count } : null))
    .filter((s): s is { readonly from: readonly string[]; readonly count: number } => s !== null);
}

function formatMulticlassing(
  raw: Raw5eClass["multiclassing"],
): {
  readonly requirements: readonly { readonly ability: string; readonly score: number }[];
  readonly proficienciesGained: readonly string[];
} | null {
  if (!raw) return null;

  const requirements: { ability: string; score: number }[] = [];
  for (const req of raw.requirements?.or ?? []) {
    for (const ability of ABILITY_ORDER) {
      const score = req[ability];
      if (typeof score === "number") requirements.push({ ability, score });
    }
  }

  const gained: string[] = [];
  if (raw.proficienciesGained?.armor?.length) {
    gained.push(`${titleCase("armor")}: ${raw.proficienciesGained.armor.join(", ")}`);
  }
  if (raw.proficienciesGained?.weapons?.length) {
    gained.push(`${titleCase("weapons")}: ${raw.proficienciesGained.weapons.join(", ")}`);
  }

  if (requirements.length === 0 && gained.length === 0) return null;
  return { requirements, proficienciesGained: gained };
}

// Class feature keys arrive as `Name|Class|Source|Level`.
function parseFeatureKey(
  key: string,
): { name: string; className: string; source: string; level: number } | null {
  const parts = key.split("|");
  const name = parts[0]?.trim();
  if (!name) return null;
  return {
    name,
    className: parts[1]?.trim() ?? "",
    source: parts[2]?.trim() ?? "",
    level: Number.parseInt(parts[3]?.trim() ?? "", 10) || 0,
  };
}

interface RawClassFeature {
  readonly name: string;
  readonly source: string;
  readonly className?: string;
  readonly classSource?: string;
  readonly entries?: readonly unknown[];
  readonly isClassFeatureVariant?: boolean;
  readonly consumes?: { readonly name?: string };
  readonly [key: string]: unknown;
}

interface FeatureDefinition {
  readonly description: readonly ContentBlock[];
  readonly consumes: string | null;
}

/** Variants are published as `Parent: Sub-Option`, so the parent key drops the suffix. */
function variantParentName(name: string): { parent: string; child: string } | null {
  const idx = name.indexOf(": ");
  if (idx <= 0) return null;
  return { parent: name.slice(0, idx), child: name.slice(idx + 2) };
}

function buildFeatureIndex(entries: readonly unknown[]): Map<string, FeatureDefinition> {
  const index = new Map<string, FeatureDefinition>();

  for (const raw of entries) {
    if (!raw || typeof raw !== "object") continue;
    const feature = raw as RawClassFeature;
    if (typeof feature.name !== "string" || !Array.isArray(feature.entries)) continue;

    const className = feature.className ?? "";
    const classSource = feature.classSource ?? feature.source;
    const blocks = processEntries(feature.entries);
    const consumes =
      typeof feature.consumes?.name === "string" ? normalizeText(feature.consumes.name) : null;
    const definition: FeatureDefinition = { description: blocks, consumes };

    const split = variantParentName(feature.name);
    const lookupName = feature.isClassFeatureVariant && split ? split.parent : feature.name;
    const key = `${lookupName}|${className}|${classSource}`;
    const existing = index.get(key);

    if (!existing) {
      index.set(key, definition);
      continue;
    }

    // Several variants can share one parent; keep them as labelled sub-blocks.
    const childName = split ? split.child : feature.name;
    index.set(key, {
      description: [
        ...existing.description,
        { type: "entries", name: childName, blocks: blocks as ContentBlock[] },
      ],
      consumes: existing.consumes ?? consumes,
    });
  }

  return index;
}

function formatClassFeatures(
  raw: Raw5eClass["classFeatures"],
  featureIndex: Map<string, FeatureDefinition>,
  cls: { readonly name: string; readonly source: string },
): ClassFeatureRef[] {
  const out: ClassFeatureRef[] = [];
  const seen = new Set<string>();

  for (const entry of raw ?? []) {
    const key = typeof entry === "string" ? entry : entry.classFeature;
    if (typeof key !== "string") continue;
    const parsed = parseFeatureKey(key);
    if (!parsed) continue;
    if (seen.has(key)) continue;
    seen.add(key);

    // PHB keys leave the source slot empty (`Name|Class||Level`), meaning "same as the class".
    const className = parsed.className || cls.name;
    const source = parsed.source || cls.source;
    const definition = featureIndex.get(`${parsed.name}|${className}|${source}`);

    out.push({
      name: parsed.name,
      className,
      source,
      level: parsed.level,
      gainSubclassFeature: typeof entry === "object" && entry.gainSubclassFeature === true,
      description: definition?.description ?? [],
      consumes: definition?.consumes ?? null,
    });
  }

  return out;
}

function formatCell(value: unknown): string | number | boolean | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "string") {
    const text = normalizeText(value);
    return text.length > 0 ? text : null;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.name === "string") return normalizeText(obj.name);
    const roll = obj.roll as { formula?: string; exact?: number } | undefined;
    if (roll?.formula) return roll.formula;
    if (typeof roll?.exact === "number") return roll.exact;
  }
  return null;
}

function formatTableGroups(raw: Raw5eClass["classTableGroups"]): ClassTableGroup[] {
  const out: ClassTableGroup[] = [];

  for (const group of raw ?? []) {
    const rows = group.rows ?? group.rowsSpellProgression;
    if (!Array.isArray(rows) || rows.length === 0) continue;

    const colLabels = (group.colLabels ?? []).map((c) => normalizeText(c));
    const outRows: (string | number | boolean | null)[][] = [];
    let maxCols = 0;

    for (const row of rows) {
      const cells = (Array.isArray(row) ? row : []).map(formatCell);
      maxCols = Math.max(maxCols, cells.length);
      outRows.push(cells);
    }

    if (outRows.length === 0) continue;

    while (colLabels.length < maxCols) colLabels.push("");

    out.push({
      title: group.title ? normalizeText(group.title) : undefined,
      colLabels,
      rows: outRows,
    });
  }

  return out;
}

// Fields that only ever appear on top-level class entries.
const CLASS_MARKERS = [
  "hd",
  "proficiency",
  "primaryAbility",
  "startingProficiencies",
  "classFeatures",
  "classTableGroups",
  "multiclassing",
  "subclassTitle",
] as const;

/**
 * The loader appends `classFeature` and `subclass` rows to the same array, so
 * top-level classes must be told apart before transforming.
 */
function isClassEntry(entry: Raw5eClass): boolean {
  if (typeof entry.name !== "string") return false;
  if (typeof (entry as { className?: unknown }).className === "string") return false;
  return CLASS_MARKERS.some((marker) => marker in entry);
}

export function transformClasses(raw: readonly Raw5eClass[]): Class[] {
  // The loader appends `classFeature` / `subclass` rows to the same array.
  const classes = raw.filter(isClassEntry);
  const featureIndex = buildFeatureIndex(raw);

  return classes
    .filter((c) => isAllowedSource(c.source))
    .map((c): Class => ({
      id: generateId(c.source, c.name),
      canonicalId: createCanonicalId("class", c.name),
      category: "class" as const,
      name: c.name,
      source: c.source,
      hitDice: c.hd ?? { number: 1, faces: 6 },
      proficiency: c.proficiency ?? [],
      primaryAbility: formatPrimaryAbility(c.primaryAbility),
      spellcastingAbility: c.spellcastingAbility ?? null,
      casterProgression: c.casterProgression ? normalizeText(c.casterProgression) : null,
      startingProficiencies: {
        armor: formatProficiencies(c.startingProficiencies?.armor),
        weapons: formatProficiencies(c.startingProficiencies?.weapons),
        tools: formatProficiencies(c.startingProficiencies?.tools),
        savingThrows: formatProficiencies(c.startingProficiencies?.savingThrows),
        skills: formatSkills(c.startingProficiencies),
      },
      startingEquipment: formatStartingEquipment(c.startingEquipment),
      multiclassing: formatMulticlassing(c.multiclassing),
      classTableGroups: formatTableGroups(c.classTableGroups),
      classFeatures: formatClassFeatures(c.classFeatures, featureIndex, c),
      subclassTitle: c.subclassTitle ? normalizeText(c.subclassTitle) : null,
      subclassGroups: (c.subclassGroups ?? []).map((g) => ({ name: g.name, source: g.source })),
    }));
}
