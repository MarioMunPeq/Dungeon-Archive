// Deterministic ID generator.
// Format: slug(source)|slug(name)
// Running twice with same input always produces the same ID.

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateId(source: string, name: string): string {
  return `${slugify(source)}|${slugify(name)}`;
}
