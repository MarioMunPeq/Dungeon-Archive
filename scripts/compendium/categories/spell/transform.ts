import type { Spell } from "../../../../src/types/compendium";
import type { Raw5eSpell } from "../../../../src/adapter/5etools-raw-types";
import { generateId } from "../../id";
import { createCanonicalId } from "../../identity";
import { isAllowedSource, ALLOWED_SOURCES } from "../../allowed-sources";
import { processEntries } from "../../entries";
import { normalizeText } from "../../normalizer/index";

function formatCastingTime(
  time: readonly { readonly number: number; readonly unit: string }[],
): string {
  const parts = time.map((t) => {
    const num = t.number === 1 ? "" : `${t.number} `;
    return `${num}${t.unit}`;
  });
  return parts.join(" plus ");
}

function formatRange(
  range:
    | string
    | {
        readonly type: string;
        readonly distance?: { readonly type: string; readonly amount?: number };
      },
): string {
  if (typeof range === "string") return range;
  if (!range.distance) return range.type === "special" ? "Special" : range.type;
  const d = range.distance;
  if (d.type === "self") return "Self";
  if (d.type === "touch") return "Touch";
  if (d.amount !== undefined) return `${d.amount} ${d.type}`;
  return d.type;
}

function formatComponents(components: {
  readonly v?: boolean;
  readonly s?: boolean;
  readonly m?: string | { readonly text: string };
}): string[] {
  const result: string[] = [];
  if (components.v) result.push("V");
  if (components.s) result.push("S");
  if (components.m) {
    const mText = typeof components.m === "string" ? components.m : components.m.text;
    result.push(`M (${normalizeText(mText)})`);
  }
  return result;
}

function formatDuration(
  duration: readonly {
    readonly type: string;
    readonly concentration?: boolean;
    readonly duration?: { readonly type: string; readonly amount?: number };
    readonly ends?: readonly string[];
  }[],
): string {
  const d = duration[0];
  if (!d) return "Instantaneous";
  if (d.type === "instant") return "Instantaneous";
  if (d.type === "special") return "Special";
  if (d.type === "permanent") {
    const ends = d.ends?.join(" and ") ?? "dispel";
    return `Until ${ends}`;
  }
  if (d.type === "timed" && d.duration) {
    const num = d.duration.amount === 1 ? "" : `${d.duration.amount} `;
    const conc = d.concentration ? " (concentration)" : "";
    return `${num}${d.duration.type}${conc}`;
  }
  return "Special";
}

type ClassLookup = Record<string, Record<string, { class?: Record<string, Record<string, true>> }>>;

function extractClasses(spell: Raw5eSpell, classLookup: ClassLookup | undefined): string[] {
  if (!classLookup) return [];

  const spellNameLower = spell.name.toLowerCase();
  const classes = new Set<string>();

  for (const sourceKey of Object.keys(classLookup)) {
    const sourceSpells = classLookup[sourceKey];
    if (!sourceSpells) continue;
    const entry = sourceSpells[spellNameLower];
    if (!entry?.class) continue;

    for (const [classSource, classNames] of Object.entries(entry.class)) {
      if (!ALLOWED_SOURCES.has(classSource)) continue;
      for (const className of Object.keys(classNames)) {
        classes.add(className);
      }
    }
  }

  return [...classes].sort();
}

export function transformSpells(raw: readonly Raw5eSpell[], classLookup?: ClassLookup): Spell[] {
  return raw
    .filter((s) => isAllowedSource(s.source))
    .map((s) => ({
      id: generateId(s.source, s.name),
      canonicalId: createCanonicalId("spell", s.name),
      category: "spell" as const,
      name: s.name,
      source: s.source,
      level: s.level,
      school: s.school,
      castingTime: formatCastingTime(s.time),
      range: formatRange(s.range),
      components: formatComponents(s.components),
      duration: formatDuration(s.duration),
      description: processEntries(s.entries),
      higherLevels: s.entriesHigherLevel ? processEntries(s.entriesHigherLevel) : undefined,
      classes: extractClasses(s, classLookup),
      ritual: s.meta?.ritual ?? false,
      concentration: s.duration?.[0]?.concentration ?? false,
    }));
}
