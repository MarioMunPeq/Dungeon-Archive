import type { Action } from "../../../../src/types/compendium";

interface ValidationError {
  readonly id: string;
  readonly field: string;
  readonly message: string;
}

export function validateActions(actions: Action[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const ids = new Set<string>();

  for (const a of actions) {
    if (!a.name) {
      errors.push({ id: a.id ?? "unknown", field: "name", message: "Name is empty" });
    }
    if (!a.source) {
      errors.push({ id: a.id, field: "source", message: "Source is empty" });
    }
    if (!a.actionType) {
      errors.push({ id: a.id, field: "actionType", message: "Action type is empty" });
    }
    if (a.category !== "action") {
      errors.push({ id: a.id, field: "category", message: `Invalid category: ${a.category}` });
    }
    if (ids.has(a.id)) {
      errors.push({ id: a.id, field: "id", message: "Duplicate ID" });
    }
    ids.add(a.id);
  }

  return errors;
}
