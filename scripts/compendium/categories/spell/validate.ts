import type { Spell } from "../../../../src/types/compendium";

interface ValidationError {
  readonly id: string;
  readonly field: string;
  readonly message: string;
}

export function validateSpells(spells: Spell[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const ids = new Set<string>();

  for (const spell of spells) {
    if (!spell.name) {
      errors.push({ id: spell.id ?? "unknown", field: "name", message: "Name is empty" });
    }
    if (!spell.source) {
      errors.push({ id: spell.id, field: "source", message: "Source is empty" });
    }
    if (spell.level < 0 || spell.level > 9) {
      errors.push({ id: spell.id, field: "level", message: `Invalid level: ${spell.level}` });
    }
    if (spell.category !== "spell") {
      errors.push({
        id: spell.id,
        field: "category",
        message: `Invalid category: ${spell.category}`,
      });
    }
    if (ids.has(spell.id)) {
      errors.push({ id: spell.id, field: "id", message: "Duplicate ID" });
    }
    ids.add(spell.id);
  }

  return errors;
}
