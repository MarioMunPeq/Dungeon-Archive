import type { CompendiumEntry, Class } from "../../../../src/types/compendium";

interface ValidationError {
  readonly id: string;
  readonly field: string;
  readonly message: string;
}

export function validateClasses(entities: CompendiumEntry[]): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const entity of entities) {
    const cls = entity as Class;
    if (!cls.hitDice || typeof cls.hitDice.number !== "number" || typeof cls.hitDice.faces !== "number") {
      errors.push({ id: cls.id, field: "hitDice", message: "Hit dice must have number and faces" });
    }
    if (!Array.isArray(cls.proficiency)) {
      errors.push({ id: cls.id, field: "proficiency", message: "Proficiency must be an array" });
    }
    if (!Array.isArray(cls.classFeatures)) {
      errors.push({ id: cls.id, field: "classFeatures", message: "Class features must be an array" });
    }
    if (!Array.isArray(cls.proficiency)) {
      errors.push({ id: cls.id, field: "proficiency", message: "Proficiency must be an array" });
    }
    if (cls.startingProficiencies) {
      if (!Array.isArray(cls.startingProficiencies.armor)) {
        errors.push({ id: cls.id, field: "startingProficiencies.armor", message: "Armor proficiencies must be an array" });
      }
      if (!Array.isArray(cls.startingProficiencies.weapons)) {
        errors.push({ id: cls.id, field: "startingProficiencies.weapons", message: "Weapon proficiencies must be an array" });
      }
    }
    if (!Array.isArray(cls.classFeatures)) {
      errors.push({ id: cls.id, field: "classFeatures", message: "Class features must be an array" });
    }
  }
  return errors;
}