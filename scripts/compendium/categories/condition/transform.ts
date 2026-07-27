import type { Condition } from "../../../../src/types/compendium";
import type { Raw5eCondition } from "../../../../src/adapter/5etools-raw-types";
import { generateId } from "../../id";
import { isAllowedSource } from "../../allowed-sources";
import { processEntries } from "../../entries";

export function transformConditions(raw: readonly Raw5eCondition[]): Condition[] {
  return raw
    .filter((c) => isAllowedSource(c.source))
    .map((c) => ({
      id: generateId(c.source, c.name),
      category: "condition" as const,
      name: c.name,
      source: c.source,
      description: processEntries(c.entries),
    }));
}
