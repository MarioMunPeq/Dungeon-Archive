export function slugFromCanonicalId(canonicalId: string): string {
  const dot = canonicalId.indexOf(".");
  return dot === -1 ? canonicalId : canonicalId.substring(dot + 1);
}

export function canonicalIdFromSlug(category: string, slug: string): string {
  return `${category}.${slug}`;
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    spell: "Spells",
    condition: "Conditions",
    equipment: "Equipment",
    action: "Actions",
    monster: "Monsters",
    magicitem: "Magic Items",
  };
  return labels[category] ?? category;
}

export function categoryLabelSingular(category: string): string {
  const labels: Record<string, string> = {
    spell: "Spell",
    condition: "Condition",
    equipment: "Equipment",
    action: "Action",
    monster: "Monster",
    magicitem: "Magic Item",
  };
  return labels[category] ?? category;
}
