import type { CompendiumEntry } from "../../../../src/types/compendium";
import type { MagicItem } from "../../../../src/types/compendium";

interface ValidationError {
  readonly id: string;
  readonly field: string;
  readonly message: string;
}

export function validateMagicItems(entities: CompendiumEntry[]): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const entity of entities) {
    const item = entity as MagicItem;

    if (!item.rarity) {
      errors.push({ id: item.id, field: "rarity", message: "Magic item must have a rarity" });
    }

    if (!item.itemType) {
      errors.push({ id: item.id, field: "itemType", message: "Magic item must have an item type" });
    }

    if (!Array.isArray(item.description)) {
      errors.push({ id: item.id, field: "description", message: "Description must be an array" });
    }
  }

  return errors;
}
