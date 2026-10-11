// Converts 5etools entries array to Dungeon Archive ContentBlock[].
//
// 5etools entry types handled:
//   - string            → paragraph
//   - { type: "list" }  → list (items may be strings or objects with nested entries)
//   - { type: "table" } → table (cells may be strings or objects with roll/alignment)
//   - { type: "entries" } → entries block (preserved, not flattened)
//   - { type: "inset" }  → inset block
//   - { type: "quote" }  → quote block
//   - { type: "line" }   → separator
//   - { type: "dice" }   → dice block
//   - { name, entries } → entries block with name (header + nested content)

import type { ContentBlock, TableCell } from "../../src/types/content-block";
import type { Raw5eCellRoll } from "../../src/adapter/5etools-raw-types";
import { normalizeText } from "./normalizer/index";

// --- Cell helpers ---

function formatRoll(roll: Raw5eCellRoll): string {
  if (roll.formula) return roll.formula;
  if (roll.exact !== undefined) return String(roll.exact);
  if (roll.min !== undefined && roll.max !== undefined) {
    if (roll.pad) {
      const padLen = String(roll.max).length;
      return `${String(roll.min).padStart(padLen, "0")}\u2013${String(roll.max).padStart(padLen, "0")}`;
    }
    return `${roll.min}\u2013${roll.max}`;
  }
  return "";
}

function resolveCell(cell: unknown): TableCell {
  if (typeof cell === "string") return { text: normalizeText(cell) };
  if (cell && typeof cell === "object") {
    const obj = cell as Record<string, unknown>;
    const align =
      typeof obj.alignment === "string" ? (obj.alignment as TableCell["align"]) : undefined;
    if (obj.roll) return { text: formatRoll(obj.roll as Raw5eCellRoll), align };
    if (typeof obj.name === "string") return { text: normalizeText(obj.name), align };
  }
  return { text: "" };
}

// --- List item helpers ---

function resolveListItem(item: unknown): string | ContentBlock {
  if (typeof item === "string") return normalizeText(item);
  if (item && typeof item === "object") {
    const obj = item as Record<string, unknown>;
    if (obj.type === "item" && typeof obj.name === "string" && Array.isArray(obj.entries)) {
      return {
        type: "entries" as const,
        name: normalizeText(obj.name),
        blocks: processEntries(obj.entries),
      };
    }
    if (typeof obj.entry === "string") return normalizeText(obj.entry);
    if (typeof obj.name === "string") return normalizeText(obj.name);
  }
  return "";
}

// --- Dice helpers ---

function formatDiceFormula(roll: unknown): string {
  if (!roll || typeof roll !== "object") return "";
  const r = roll as Raw5eCellRoll;
  if (r.formula) return r.formula;
  if (r.exact !== undefined) return String(r.exact);
  if (r.min !== undefined && r.max !== undefined) {
    return `${r.min}\u2013${r.max}`;
  }
  return "";
}

// --- Reference helpers ---

// `refClassFeature` / `refOptionalfeature` / `refFeat` point at other entities by
// `Name|Source|display text`; we only have the name and display text available here.
function formatRefKey(key: unknown): string {
  if (typeof key !== "string" || key.length === 0) return "";
  const parts = key.split("|");
  const display = normalizeText(parts[2] ?? "");
  const name = normalizeText(parts[0] ?? "");
  return display.length > 0 ? display : name;
}

// --- Main processor ---

/** `options` wraps a "choose N of these" list; `mode` tunes the surrounding wording. */
function resolveOptions(obj: Record<string, unknown>): ContentBlock | null {
  const inner = processEntries(obj.entries as readonly unknown[]);
  const count = typeof obj.count === "number" ? obj.count : null;
  if (inner.length === 0) return null;
  if (count === null) {
    return { type: "entries", blocks: inner };
  }
  return {
    type: "entries",
    blocks: [{ type: "list", items: inner.flatMap((b) => (b.type === "list" ? b.items : [b])) }],
  };
}

export function processEntries(entries: readonly unknown[]): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  for (const entry of entries) {
    if (typeof entry === "string") {
      const text = normalizeText(entry);
      if (text) {
        blocks.push({ type: "paragraph", text });
      }
      continue;
    }

    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      continue;
    }

    const obj = entry as Record<string, unknown>;

    // Options — "choose N of these"
    if (obj.type === "options" && Array.isArray(obj.entries)) {
      const resolved = resolveOptions(obj);
      if (resolved) blocks.push(resolved);
      continue;
    }

    // Inline references to other entities
    if (
      obj.type === "refClassFeature" ||
      obj.type === "refOptionalfeature" ||
      obj.type === "refFeat"
    ) {
      const key = obj.classFeature ?? obj.optionalfeature ?? obj.feat ?? obj.name;
      const label = formatRefKey(key);
      if (label.length > 0) {
        blocks.push({ type: "list", items: [label] });
      }
      continue;
    }

    // Inline ability modifiers / DCs
    if (obj.type === "abilityAttackMod" || obj.type === "abilityDc") {
      const amount =
        typeof obj.amount === "number" && !Number.isNaN(obj.amount)
          ? obj.amount
          : typeof obj.amount === "string"
            ? Number.parseInt(obj.amount, 10)
            : Number.NaN;
      const label = Number.isNaN(amount)
        ? normalizeText(obj.type === "abilityDc" ? "DC" : "attack bonus")
        : obj.type === "abilityDc"
          ? `DC ${amount}`
          : `+${amount}`;
      blocks.push({ type: "paragraph", text: label });
      continue;
    }

    // List
    if (obj.type === "list" && Array.isArray(obj.items)) {
      const items = obj.items.map(resolveListItem).filter((s) => {
        if (typeof s === "string") return s.length > 0;
        return true;
      });
      if (items.length > 0) {
        blocks.push({
          type: "list",
          items,
          style: typeof obj.style === "string" ? obj.style : undefined,
        });
      }
      continue;
    }

    // Table
    if (obj.type === "table" && Array.isArray(obj.colLabels) && Array.isArray(obj.rows)) {
      const headers = obj.colLabels.map(resolveCell);
      const rows = obj.rows.map((row: unknown) => {
        if (!Array.isArray(row)) return [];
        return row.map(resolveCell);
      });
      if (headers.length > 0 && rows.length > 0) {
        blocks.push({
          type: "table",
          headers,
          rows,
          caption: typeof obj.caption === "string" ? obj.caption : undefined,
        });
      }
      continue;
    }

    // Entries — preserve nesting (don't flatten)
    if (obj.type === "entries" && Array.isArray(obj.entries)) {
      const innerBlocks = processEntries(obj.entries);
      if (innerBlocks.length > 0) {
        blocks.push({ type: "entries", blocks: innerBlocks });
      }
      continue;
    }

    // Quote
    if (obj.type === "quote") {
      const innerBlocks = Array.isArray(obj.entries) ? processEntries(obj.entries) : [];
      blocks.push({
        type: "quote",
        blocks: innerBlocks,
        by: typeof obj.by === "string" ? obj.by : undefined,
      });
      continue;
    }

    // Inset
    if (obj.type === "inset") {
      const innerBlocks = Array.isArray(obj.entries) ? processEntries(obj.entries) : [];
      blocks.push({ type: "inset", blocks: innerBlocks });
      continue;
    }

    // Separator
    if (obj.type === "line" || obj.type === "separator") {
      blocks.push({ type: "separator" });
      continue;
    }

    // Dice
    if (obj.type === "dice") {
      const formula = formatDiceFormula(obj.roll);
      if (formula) {
        blocks.push({
          type: "dice",
          formula,
          label: typeof obj.name === "string" ? normalizeText(obj.name) : undefined,
        });
      }
      continue;
    }

    // Named entry section: { name: "...", entries: [...] }
    if (typeof obj.name === "string" && obj.name && Array.isArray(obj.entries)) {
      blocks.push({
        type: "entries",
        name: normalizeText(obj.name),
        blocks: processEntries(obj.entries),
      });
      continue;
    }

    // Unknown object — skip silently
  }

  return blocks;
}
