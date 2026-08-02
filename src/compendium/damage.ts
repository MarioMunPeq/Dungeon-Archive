const DAMAGE_TYPE_LABELS: Record<string, string> = {
  B: "Bludgeoning",
  P: "Piercing",
  S: "Slashing",
  R: "Radiant",
  N: "Necrotic",
  Y: "Psychic",
};

export function formatDamageType(code: string): string {
  return DAMAGE_TYPE_LABELS[code] ?? code;
}

export function formatDamage(damage: string | undefined, damageType: string | undefined): string {
  const parts: string[] = [];
  if (damage) parts.push(damage);
  if (damageType) parts.push(formatDamageType(damageType));
  return parts.join(" ");
}
