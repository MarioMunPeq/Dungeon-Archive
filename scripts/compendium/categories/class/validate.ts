import type { CompendiumEntry, Class } from "../../../../src/types/compendium";

interface ValidationError {
  readonly id: string;
  readonly field: string;
  readonly message: string;
}

function isStrArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

export function validateClasses(entities: CompendiumEntry[]): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const entity of entities) {
    const cls = entity as Class;

    if (
      !cls.hitDice ||
      typeof cls.hitDice.number !== "number" ||
      typeof cls.hitDice.faces !== "number"
    ) {
      errors.push({ id: cls.id, field: "hitDice", message: "Hit dice must have number and faces" });
    }

    if (!isStrArray(cls.proficiency)) {
      errors.push({
        id: cls.id,
        field: "proficiency",
        message: "Proficiency must be an array of strings",
      });
    }

    if (!isStrArray(cls.primaryAbility)) {
      errors.push({
        id: cls.id,
        field: "primaryAbility",
        message: "Primary ability must be an array of strings",
      });
    }

    if (!Array.isArray(cls.classFeatures)) {
      errors.push({
        id: cls.id,
        field: "classFeatures",
        message: "Class features must be an array",
      });
    } else {
      for (const feature of cls.classFeatures) {
        if (!feature || typeof feature.name !== "string" || feature.name.length === 0) {
          errors.push({
            id: cls.id,
            field: "classFeatures.name",
            message: "Each class feature needs a name",
          });
          break;
        }
      }
    }

    const prof = cls.startingProficiencies;
    if (!prof) {
      errors.push({
        id: cls.id,
        field: "startingProficiencies",
        message: "Starting proficiencies are required",
      });
    } else {
      if (!isStrArray(prof.armor)) {
        errors.push({
          id: cls.id,
          field: "startingProficiencies.armor",
          message: "Armor proficiencies must be an array of strings",
        });
      }
      if (!isStrArray(prof.weapons)) {
        errors.push({
          id: cls.id,
          field: "startingProficiencies.weapons",
          message: "Weapon proficiencies must be an array of strings",
        });
      }
      if (!Array.isArray(prof.skills)) {
        errors.push({
          id: cls.id,
          field: "startingProficiencies.skills",
          message: "Skill proficiencies must be an array",
        });
      }
    }

    if (!Array.isArray(cls.startingEquipment?.groups)) {
      errors.push({
        id: cls.id,
        field: "startingEquipment.groups",
        message: "Starting equipment groups must be an array",
      });
    }

    if (!Array.isArray(cls.classTableGroups)) {
      errors.push({
        id: cls.id,
        field: "classTableGroups",
        message: "Class table groups must be an array",
      });
    }
  }

  return errors;
}
