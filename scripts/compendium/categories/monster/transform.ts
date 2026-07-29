import type { Monster } from "../../../../src/types/compendium";
import type { ContentBlock } from "../../../../src/types/content-block";
import type { Raw5eMonster } from "../../../../src/adapter/5etools-raw-types";
import { generateId } from "../../id";
import { createCanonicalId } from "../../identity";
import { isAllowedSource } from "../../allowed-sources";
import { processEntries } from "../../entries";

function resolveType(type: unknown): { monsterType: string; tags: readonly string[] } {
  if (typeof type === "string") return { monsterType: type, tags: [] };
  if (type && typeof type === "object") {
    const raw = type as { type?: unknown; tags?: readonly string[] };
    const rawType = raw.type;
    let monsterType: string;
    if (typeof rawType === "string") {
      monsterType = rawType;
    } else if (rawType && typeof rawType === "object") {
      const chooseObj = rawType as { choose?: readonly string[] };
      monsterType = chooseObj.choose?.join(" or ") ?? "unknown";
    } else {
      monsterType = "unknown";
    }
    return { monsterType, tags: raw.tags ?? [] };
  }
  return { monsterType: "unknown", tags: [] };
}

function formatSpeedEntry(value: unknown): string {
  if (typeof value === "number") return `${value} ft.`;
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const v = value as { number?: number; condition?: string };
    const num = v.number !== undefined ? `${v.number} ft.` : "";
    const cond = v.condition ?? "";
    return `${num} ${cond}`.trim();
  }
  return "";
}

function formatSpeed(speed: Record<string, unknown>): string {
  const parts: string[] = [];

  if (typeof speed.walk === "number" || typeof speed.walk === "object") {
    const walk = formatSpeedEntry(speed.walk);
    if (walk) parts.push(walk);
  } else if (speed.walk === 0) {
    parts.push("0 ft.");
  }

  for (const key of ["burrow", "climb", "fly", "swim"]) {
    const value = speed[key];
    if (value === undefined || value === 0) continue;
    const formatted = formatSpeedEntry(value);
    if (formatted) parts.push(`${formatted} ${key}`);
  }

  if (speed.choose && typeof speed.choose === "object") {
    const c = speed.choose as { from?: readonly string[]; amount?: number; note?: string };
    const types = c.from?.join(" or ") ?? "";
    const amt = c.amount ? `${c.amount} ft.` : "";
    const note = c.note ? ` ${c.note}` : "";
    if (amt) parts.push(`${amt} ${types}${note}`);
  }

  if (speed.canHover && typeof speed.canHover === "boolean" && speed.canHover) {
    parts.push("(hover)");
  }

  return parts.join(", ");
}

function formatAc(ac: readonly unknown[]): string {
  const parts: string[] = [];
  for (const entry of ac) {
    if (typeof entry === "number") {
      parts.push(String(entry));
    } else if (entry && typeof entry === "object") {
      const e = entry as { ac?: number; from?: readonly string[]; special?: string };
      if (e.special) {
        parts.push(e.special);
      } else if (e.ac !== undefined) {
        const from = e.from?.join(" and ") ?? "";
        parts.push(from ? `${e.ac} (${from})` : String(e.ac));
      }
    }
  }
  return parts.join(", ");
}

function formatHp(hp: { average?: number; formula?: string; special?: string }): string {
  if (hp.special) return hp.special;
  const avg = hp.average ?? 0;
  const formula = hp.formula ? ` (${hp.formula})` : "";
  return `${avg}${formula}`;
}

function formatCr(cr: string | { readonly cr: string } | undefined): string {
  if (!cr) return "0";
  return typeof cr === "string" ? cr : cr.cr;
}

function resolveAlignment(alignment: readonly string[] | undefined): readonly string[] {
  return alignment ?? [];
}

function processNamedEntries(
  entries: readonly { name?: string; entries?: readonly unknown[] }[] | undefined,
): ContentBlock[] {
  if (!entries) return [];
  const blocks: ContentBlock[] = [];
  for (const entry of entries) {
    if (entry.name && Array.isArray(entry.entries)) {
      blocks.push({ type: "header", text: entry.name, level: 3 });
      blocks.push(...processEntries(entry.entries));
    }
  }
  return blocks;
}

const SIZE_MAP: Record<string, string> = {
  T: "Tiny",
  S: "Small",
  M: "Medium",
  L: "Large",
  H: "Huge",
  G: "Gargantuan",
};

export function transformMonsters(raw: readonly Raw5eMonster[]): Monster[] {
  return raw
    .filter((m) => isAllowedSource(m.source))
    .filter((m) => !m._copy)
    .map((m) => ({
      id: generateId(m.source, m.name),
      canonicalId: createCanonicalId("monster", m.name),
      category: "monster" as const,
      name: m.name,
      source: m.source,
      size: SIZE_MAP[m.size?.[0] ?? ""] ?? "Medium",
      ...resolveType(m.type),
      alignment: resolveAlignment(m.alignment),
      challengeRating: formatCr(m.cr),
      armorClass: formatAc(m.ac ?? []),
      hitPoints: formatHp(m.hp ?? {}),
      speed: formatSpeed(m.speed ?? {}),
      abilities: {
        str: m.str ?? 10,
        dex: m.dex ?? 10,
        con: m.con ?? 10,
        int: m.int ?? 10,
        wis: m.wis ?? 10,
        cha: m.cha ?? 10,
      },
      traits: processNamedEntries(m.trait),
      actions: processNamedEntries(m.action),
      reactions: processNamedEntries(m.reaction),
      legendaryActions: processNamedEntries(m.legendary),
      description: processEntries(m.entries ?? []),
    }));
}
