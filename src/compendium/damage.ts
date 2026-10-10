import type { TranslationKey } from "@/i18n";
import { t } from "@/i18n";

const DAMAGE_TYPE_KEYS: Record<string, TranslationKey> = {
  B: "damage.B",
  P: "damage.P",
  S: "damage.S",
  A: "damage.A",
  C: "damage.C",
  F: "damage.F",
  L: "damage.L",
  T: "damage.T",
  R: "damage.R",
  N: "damage.N",
  Y: "damage.Y",
};

/** Falls back to the raw code for damage types the SRD adds after this build. */
export function formatDamageType(code: string): string {
  const key = DAMAGE_TYPE_KEYS[code];
  return key ? t(key) : code;
}

export function formatDamage(damage: string | undefined, damageType: string | undefined): string {
  const parts: string[] = [];
  if (damage) parts.push(damage);
  if (damageType) parts.push(formatDamageType(damageType));
  return parts.join(" ");
}
