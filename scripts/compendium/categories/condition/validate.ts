import type { Condition } from "../../../../src/types/compendium";

interface ValidationError {
  readonly id: string;
  readonly field: string;
  readonly message: string;
}

export function validateConditions(conditions: Condition[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const ids = new Set<string>();

  for (const c of conditions) {
    if (!c.name) {
      errors.push({ id: c.id ?? "unknown", field: "name", message: "Name is empty" });
    }
    if (!c.source) {
      errors.push({ id: c.id, field: "source", message: "Source is empty" });
    }
    if (c.category !== "condition") {
      errors.push({ id: c.id, field: "category", message: `Invalid category: ${c.category}` });
    }
    if (ids.has(c.id)) {
      errors.push({ id: c.id, field: "id", message: "Duplicate ID" });
    }
    ids.add(c.id);
  }

  return errors;
}
