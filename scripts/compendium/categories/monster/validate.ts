import type { Monster } from "../../../../src/types/compendium";

interface ValidationError {
  readonly id: string;
  readonly field: string;
  readonly message: string;
}

export function validateMonsters(entities: Monster[]): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const entity of entities) {
    if (!entity.id) errors.push({ id: entity.id, field: "id", message: "Missing id" });
    if (!entity.canonicalId)
      errors.push({ id: entity.id, field: "canonicalId", message: "Missing canonicalId" });
    if (!entity.name) errors.push({ id: entity.id, field: "name", message: "Missing name" });
    if (!entity.source) errors.push({ id: entity.id, field: "source", message: "Missing source" });
    if (!entity.size) errors.push({ id: entity.id, field: "size", message: "Missing size" });
    if (!entity.monsterType)
      errors.push({ id: entity.id, field: "monsterType", message: "Missing monsterType" });
    if (!entity.challengeRating)
      errors.push({ id: entity.id, field: "challengeRating", message: "Missing challengeRating" });
    if (entity.abilities.str === undefined)
      errors.push({ id: entity.id, field: "abilities.str", message: "Missing str" });
    if (entity.abilities.dex === undefined)
      errors.push({ id: entity.id, field: "abilities.dex", message: "Missing dex" });
    if (entity.abilities.con === undefined)
      errors.push({ id: entity.id, field: "abilities.con", message: "Missing con" });
    if (entity.abilities.int === undefined)
      errors.push({ id: entity.id, field: "abilities.int", message: "Missing int" });
    if (entity.abilities.wis === undefined)
      errors.push({ id: entity.id, field: "abilities.wis", message: "Missing wis" });
    if (entity.abilities.cha === undefined)
      errors.push({ id: entity.id, field: "abilities.cha", message: "Missing cha" });
    if (!Array.isArray(entity.traits))
      errors.push({ id: entity.id, field: "traits", message: "traits must be an array" });
    if (!Array.isArray(entity.actions))
      errors.push({ id: entity.id, field: "actions", message: "actions must be an array" });
    if (!Array.isArray(entity.reactions))
      errors.push({ id: entity.id, field: "reactions", message: "reactions must be an array" });
    if (!Array.isArray(entity.legendaryActions))
      errors.push({
        id: entity.id,
        field: "legendaryActions",
        message: "legendaryActions must be an array",
      });
  }

  return errors;
}
