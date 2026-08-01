import type { Feat } from "../../../../src/types/compendium";
import type { Raw5eFeat } from "../../../../src/adapter/5etools-raw-types";
import { generateId } from "../../id";
import { createCanonicalId } from "../../identity";
import { isAllowedSource } from "../../allowed-sources";
import { processEntries } from "../../entries";

const CATEGORY_LABELS: Record<string, string> = {
  G: "General",
  EB: "Epic Boon",
  O: "Origin",
  D: "Dragonmark",
  DG: "Dark Gift",
  FS: "Fighting Style",
  "FS:P": "Fighting Style",
  "FS:R": "Fighting Style",
};

function formatPrerequisite(
  prereqs:
    | readonly {
        readonly level?: number;
        readonly campaign?: readonly string[];
        readonly ability?: readonly {
          readonly ability?: readonly string[];
          readonly minimum?: number;
        }[];
        readonly spellcasting?: boolean;
        readonly pact?: string;
        readonly proficiency?: readonly { readonly armor?: boolean; readonly weapon?: boolean }[];
        readonly [key: string]: unknown;
      }[]
    | undefined,
): string | undefined {
  if (!prereqs || prereqs.length === 0) return undefined;
  const parts: string[] = [];
  for (const prereq of prereqs) {
    if (prereq.level) parts.push(`Level ${prereq.level}`);
    if (prereq.campaign) parts.push(`Campaign: ${prereq.campaign.join(", ")}`);
    if (prereq.ability) {
      for (const ab of prereq.ability) {
        if (ab.ability && ab.minimum) parts.push(`${ab.ability.join("/")} ${ab.minimum}`);
      }
    }
    if (prereq.spellcasting) parts.push("Spellcasting");
    if (prereq.pact) parts.push(`Pact of the ${prereq.pact}`);
    if (prereq.proficiency) {
      const profs: string[] = [];
      for (const p of prereq.proficiency) {
        if (p.armor) profs.push("Armor Proficiency");
        if (p.weapon) profs.push("Weapon Proficiency");
      }
      if (profs.length > 0) parts.push(...profs);
    }
  }
  return parts.length > 0 ? parts.join(", ") : undefined;
}

export function transformFeats(raw: readonly Raw5eFeat[]): Feat[] {
  return raw
    .filter((f) => isAllowedSource(f.source))
    .map((f) => ({
      id: generateId(f.source, f.name),
      canonicalId: createCanonicalId("feat", f.name),
      category: "feat" as const,
      name: f.name,
      source: f.source,
      featCategory: f.category ? (CATEGORY_LABELS[f.category] ?? f.category) : undefined,
      prerequisite: formatPrerequisite(f.prerequisite),
      repeatable: f.repeatable || undefined,
      description: processEntries(f.entries ?? []),
    }));
}
