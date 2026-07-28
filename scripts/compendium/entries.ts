// Converts 5etools entries array to Dungeon Archive ContentBlock[].
// Shared across all category transformers.
//
// 5etools entry types handled:
//   - string            → paragraph
//   - { type: "list" }  → list (items may be strings or { type: "item", name, entries })
//   - { type: "table" } → table (cells may be strings or { type: "cell", roll })
//   - { type: "entries" } → recursive
//   - { name, entries } → header + recursive (named entry section)
//   - unknown objects   → ignored

import type { ContentBlock } from "../../src/types/content-block";
import type { Raw5eEntry } from "../../src/adapter/5etools-raw-types";
import { normalizeText } from "./normalizer/index";

// --- Cell helpers ---

interface CellRoll {
  readonly exact?: number;
  readonly min?: number;
  readonly max?: number;
  readonly pad?: boolean;
}

interface CellObject {
  readonly type?: string;
  readonly roll?: CellRoll;
  readonly [key: string]: unknown;
}

function formatRoll(roll: CellRoll): string {
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

function resolveCell(cell: unknown): string {
  if (typeof cell === "string") return normalizeText(cell);
  if (cell && typeof cell === "object") {
    const obj = cell as CellObject;
    if (obj.roll) return formatRoll(obj.roll);
    if (obj.name) return normalizeText(obj.name);
  }
  return "";
}

// --- List item helpers ---

interface ListItemObject {
  readonly type?: string;
  readonly name?: string;
  readonly entries?: readonly unknown[];
  readonly entry?: string;
  readonly [key: string]: unknown;
}

function resolveListItem(item: unknown): string {
  if (typeof item === "string") return normalizeText(item);
  if (item && typeof item === "object") {
    const obj = item as ListItemObject;
    // 5etools uses { type: "item", name: "...", entries: [...] }
    if (Array.isArray(obj.entries) && obj.entries.length > 0) {
      const name = obj.name ? normalizeText(obj.name) : "";
      const body = obj.entries
        .map((e) => resolveListItem(e))
        .filter((s) => s.length > 0)
        .join(" ");
      return name ? `${name} ${body}` : body;
    }
    // Older format: { entry: "..." }
    if (typeof obj.entry === "string") return normalizeText(obj.entry);
    if (typeof obj.name === "string") return normalizeText(obj.name);
  }
  return "";
}

// --- Main processor ---

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

    const obj = entry as Raw5eEntry;

    if (obj.type === "list" && Array.isArray(obj.items)) {
      const items = obj.items.map(resolveListItem).filter((s) => s.length > 0);
      if (items.length > 0) {
        blocks.push({ type: "list", items });
      }
      continue;
    }

    if (obj.type === "table" && Array.isArray(obj.colLabels) && Array.isArray(obj.rows)) {
      const headers = obj.colLabels.map(resolveCell);
      const rows = obj.rows.map((row: readonly unknown[]) => row.map(resolveCell));
      if (headers.length > 0 && rows.length > 0) {
        blocks.push({ type: "table", headers, rows });
      }
      continue;
    }

    if (obj.type === "entries" && Array.isArray(obj.entries)) {
      const innerBlocks = processEntries(obj.entries);
      blocks.push(...innerBlocks);
      continue;
    }

    // Named entry section: { name: "...", entries: [...] } (e.g., monster traits)
    if (typeof obj.name === "string" && obj.name && Array.isArray(obj.entries)) {
      blocks.push({ type: "header", text: obj.name, level: 3 });
      const innerBlocks = processEntries(obj.entries);
      blocks.push(...innerBlocks);
      continue;
    }

    // Unknown object — skip silently
  }

  return blocks;
}
