import type { CharacterReference } from "@/user-state";
import { userStore } from "@/user-state";

/**
 * Demo seeding — a complete, realistic example character plus a little session
 * context, so a first-time visitor sees the app fully alive without creating
 * anything. Only surfaced on the Home empty state (no existing characters), so
 * it can never silently overwrite real data. Reversible: remove the character
 * or End Session at any time.
 *
 * All canonical IDs are verified against the build-time generated compendium.
 * If the compendium pipeline ever changes an ID, update it here too.
 */

export const DEMO_CHARACTER: Omit<CharacterReference, "id"> = {
  name: "Lyra Emberfall",
  class: "Wizard",
  subclass: "School of Evocation",
  level: 5,
  abilityScores: {
    strength: 8,
    dexterity: 14,
    constitution: 14,
    intelligence: 18,
    wisdom: 12,
    charisma: 10,
  },
  hitPoints: { current: 21, max: 32 },
  combatValues: {
    armorClass: 15,
    initiativeModifier: 2,
    passivePerception: 11,
    spellSaveDc: 15,
    spellAttackBonus: 7,
  },
  knownSpellCanonicalIds: [
    "spell.fireball",
    "spell.magic-missile",
    "spell.shield",
    "spell.misty-step",
    "spell.scorching-ray",
  ],
  weaponCanonicalIds: ["equipment.dagger"],
  magicItemCanonicalIds: ["magicitem.cloak-of-protection"],
  activeConditions: ["condition.charmed"],
  note: "Fighting the cultists beneath the old temple.",
};

const DEMO_RECENT_ENTITIES: readonly string[] = [
  "spell.fireball",
  "monster.goblin",
  "equipment.longsword",
];

const DEMO_SESSION: readonly string[] = ["monster.goblin", "monster.owlbear"];

export function seedDemoData(): void {
  const { addCharacter, setActiveCharacter, addRecentEntity, toggleSession, completeOnboarding } =
    userStore.getState();
  const id = addCharacter(DEMO_CHARACTER);
  setActiveCharacter(id);
  for (const canonicalId of DEMO_RECENT_ENTITIES) addRecentEntity(canonicalId);
  for (const canonicalId of DEMO_SESSION) toggleSession(canonicalId);
  completeOnboarding();
}
