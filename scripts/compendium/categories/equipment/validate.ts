import type { Equipment } from "../../../../src/types/compendium";

interface ValidationError {
  readonly id: string;
  readonly field: string;
  readonly message: string;
}

export function validateEquipment(items: Equipment[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const ids = new Set<string>();

  for (const item of items) {
    if (!item.name) {
      errors.push({ id: item.id ?? "unknown", field: "name", message: "Name is empty" });
    }
    if (!item.source) {
      errors.push({ id: item.id, field: "source", message: "Source is empty" });
    }
    if (!item.type) {
      errors.push({ id: item.id, field: "type", message: "Type is empty" });
    }
    if (item.category !== "equipment") {
      errors.push({
        id: item.id,
        field: "category",
        message: `Invalid category: ${item.category}`,
      });
    }
    if (ids.has(item.id)) {
      errors.push({ id: item.id, field: "id", message: "Duplicate ID" });
    }
    ids.add(item.id);
  }

  return errors;
}
