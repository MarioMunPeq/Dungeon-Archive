import type { CompendiumEntry, Feat } from "../../../../src/types/compendium";

interface ValidationError {
  readonly id: string;
  readonly field: string;
  readonly message: string;
}

export function validateFeats(entities: CompendiumEntry[]): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const entity of entities) {
    const feat = entity as Feat;
    if (!Array.isArray(feat.description)) {
      errors.push({ id: feat.id, field: "description", message: "Description must be an array" });
    }
  }
  return errors;
}
