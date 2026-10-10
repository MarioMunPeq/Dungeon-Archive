import type { Class } from "../../../../src/types/compendium";
import type { Raw5eClass } from "../../../../src/adapter/5etools-raw-types";
import { generateId } from "../../id";
import { createCanonicalId } from "../../identity";
import { isAllowedSource } from "../../allowed-sources";

function formatFeatures(features: readonly string[] | undefined): readonly string[] {
  if (!features) return [];
  return features
    .map((f) => (typeof f === "string" ? f.trim() : (f as { classFeature?: string }).classFeature?.trim() ?? JSON.stringify(f)).trim())
    .filter(Boolean);
}

function formatSubclassGroups(groups: readonly { readonly name: string; readonly source: string }[] | undefined): readonly { readonly name: string; readonly source: string }[] {
  if (!groups) return [];
  return groups.map((g) => ({ name: g.name, source: g.source }));
}

export function transformClasses(raw: readonly Raw5eClass[]): Class[] {
  return raw
    .filter((c) => isAllowedSource(c.source))
    .map((c): Class => {
      return {
        id: generateId(c.source, c.name),
        canonicalId: createCanonicalId("class", c.name),
        category: "class" as const,
        name: c.name,
        source: c.source,
        hitDice: c.hd ?? { number: 1, faces: 6 },
        proficiency: c.proficiency ?? [],
        startingProficiencies: {
          armor: c.startingProficiencies?.armor ?? [],
          weapons: c.startingProficiencies?.weapons ?? [],
          tools: c.startingProficiencies?.tools ?? [],
          savingThrows: c.startingProficiencies?.savingThrows ?? [],
          skills: [...(c.startingProficiencies?.skills ?? [])] as const,
        },
        startingEquipment: c.startingEquipment
          ? {
              goldAlternative: c.startingEquipment.goldAlternative,
              default: c.startingEquipment.default ?? [],
              defaultData: c.startingEquipment.defaultData ?? [],
            }
          : undefined,
        multiclassing: c.multiclassing
          ? {
              requirements: c.multiclassing.requirements,
              proficienciesGained: c.multiclassing.proficienciesGained,
            }
          : undefined,
        classFeatures: formatFeatures(c.classFeatures),
        subclassGroups: formatSubclassGroups(c.subclassGroups),
      };
    });
}