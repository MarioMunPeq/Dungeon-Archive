import type { Class, ClassFeatureRef } from "@/compendium";
import type { ContentBlock } from "@/types/content-block";

export const MAX_CLASS_LEVEL = 20;

/** One progression value on a level card, e.g. `{ label: "Rages", value: "3" }`. */
export interface LevelStat {
  readonly label: string;
  readonly value: string;
}

/** A labelled group of progression values inside a level card. */
export interface LevelStatGroup {
  readonly title: string;
  readonly stats: readonly LevelStat[];
}

/** Everything that unlocks (or changes) at a single class level. */
export interface ClassLevelCard {
  readonly level: number;
  readonly features: readonly ClassFeatureRef[];
  readonly statGroups: readonly LevelStatGroup[];
  /** True when the level has neither features nor progression values. */
  readonly empty: boolean;
}

/**
 * A level header is only shown for spellcaster slot tables; other tables rely on
 * their column labels alone.
 */
function isSpellSlotGroup(colLabels: readonly string[]): boolean {
  return colLabels.length === 9 && (colLabels[0] ?? "").toLowerCase() === "1st";
}

function signature(colLabels: readonly string[], rows: readonly (readonly unknown[])[]): string {
  return JSON.stringify([colLabels, rows.map((r) => r.map((c) => String(c ?? "")))]);
}

/**
 * 5etools can publish the same class twice (PHB + a variant source), which
 * yields byte-identical progression tables. Showing both would just repeat the
 * same numbers, so only the first copy of each table is kept.
 */
export function dedupeTableGroups(
  groups: readonly Class["classTableGroups"][number][],
): Class["classTableGroups"] {
  const seen = new Set<string>();
  const out: (Class["classTableGroups"][number])[] = [];
  for (const group of groups) {
    const key = signature(group.colLabels, group.rows);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(group);
  }
  return out;
}

function formatCell(cell: string | number | boolean | null): string {
  if (cell === null || cell === "") return "\u2014";
  return String(cell);
}

/**
 * Flattens the progression tables into one lookup per level so a level card can
 * show every value it changes, regardless of which source table it came from.
 */
export function buildLevelCards(entity: Class): ClassLevelCard[] {
  const groups = dedupeTableGroups(entity.classTableGroups);

  const featuresByLevel = new Map<number, ClassFeatureRef[]>();
  for (const feature of entity.classFeatures) {
    const level = Math.min(Math.max(feature.level, 1), MAX_CLASS_LEVEL);
    const bucket = featuresByLevel.get(level);
    if (bucket) bucket.push(feature);
    else featuresByLevel.set(level, [feature]);
  }

  const cards: ClassLevelCard[] = [];
  for (let level = 1; level <= MAX_CLASS_LEVEL; level += 1) {
    const rowIndex = level - 1;

    const statGroups: LevelStatGroup[] = [];
    for (const group of groups) {
      const row = group.rows[rowIndex];
      if (!row) continue;
      const spellSlots = isSpellSlotGroup(group.colLabels);
      const stats: LevelStat[] = [];
      for (let col = 0; col < group.colLabels.length; col += 1) {
        const value = formatCell(row[col] ?? null);
        if (value === "\u2014" && !spellSlots) continue;
        stats.push({ label: group.colLabels[col] ?? "", value });
      }
      if (stats.length === 0) continue;
      statGroups.push({ title: group.title ?? "", stats });
    }

    const features = featuresByLevel.get(level) ?? [];
    cards.push({
      level,
      features,
      statGroups,
      empty: features.length === 0 && statGroups.length === 0,
    });
  }

  return cards;
}

/**
 * Flattens SRD content blocks into copyable plain text. Tables collapse into
 * rows of `label: value` pairs; references use their label or target.
 */
export function blocksToPlainText(blocks: readonly ContentBlock[]): string {
  const lines: string[] = [];

  const visit = (block: ContentBlock): void => {
    switch (block.type) {
      case "paragraph":
        lines.push(block.text);
        return;
      case "header":
        lines.push(block.text);
        return;
      case "entries":
        if (block.name) lines.push(block.name);
        block.blocks.forEach(visit);
        return;
      case "list":
        for (const item of block.items) {
          if (typeof item === "string") {
            lines.push(`- ${item}`);
            continue;
          }
          const nested = blocksToPlainText([item]).replace(/\s*\n\s*/g, " ");
          if (nested.length > 0) lines.push(`- ${nested}`);
        }
        return;
      case "table": {
        const headers = block.headers.map((h) => h.text);
        for (const row of block.rows) {
          const parts: string[] = [];
          for (let i = 0; i < row.length; i += 1) {
            const label = headers[i] ?? "";
            const value = row[i]?.text ?? "";
            if (value.length === 0) continue;
            parts.push(label.length > 0 ? `${label}: ${value}` : value);
          }
          if (parts.length > 0) lines.push(parts.join(" | "));
        }
        return;
      }
      case "quote":
        block.blocks.forEach(visit);
        return;
      case "inset":
        block.blocks.forEach(visit);
        return;
      case "separator":
        lines.push("---");
        return;
      case "reference":
        lines.push(block.label ?? block.target);
        return;
      case "dice":
        lines.push(block.label ? `${block.formula} (${block.label})` : block.formula);
        return;
      case "link":
        lines.push(block.text);
        return;
      case "image":
        return;
    }
  };

  blocks.forEach(visit);
  return lines.join("\n").trim();
}