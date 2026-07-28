import type { Action } from "../../../../src/types/compendium";
import { generateId } from "../../id";
import { createCanonicalId } from "../../identity";

interface StaticAction {
  readonly name: string;
  readonly source: string;
  readonly actionType: string;
  readonly description: string;
}

const STANDARD_ACTIONS: readonly StaticAction[] = [
  {
    name: "Attack",
    source: "PHB",
    actionType: "action",
    description:
      "When you take the Attack action, you can make one melee attack against one creature within your reach. On a hit, you deal damage based on the weapon or unarmed strike used.",
  },
  {
    name: "Cast a Spell",
    source: "PHB",
    actionType: "action",
    description:
      "Some characters and monsters have the ability to cast spells. Casting a spell follows the rules in the Spellcasting section. The casting time determines when you take the action to cast the spell.",
  },
  {
    name: "Dash",
    source: "PHB",
    actionType: "action",
    description:
      "When you take the Dash action, you gain extra movement for the current turn. The increase equals your speed, after applying any modifiers.",
  },
  {
    name: "Disengage",
    source: "PHB",
    actionType: "action",
    description:
      "If you take the Disengage action, your movement doesn't provoke opportunity attacks for the rest of the turn.",
  },
  {
    name: "Dodge",
    source: "PHB",
    actionType: "action",
    description:
      "When you take the Dodge action, you focus entirely on avoiding attacks. Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage.",
  },
  {
    name: "Help",
    source: "PHB",
    actionType: "action",
    description:
      "When you take the Help action, you can aid a friendly creature in attacking a creature within 5 feet of you. You impose disadvantage on the first attack roll made against the target by an attacker other than yourself.",
  },
  {
    name: "Hide",
    source: "PHB",
    actionType: "action",
    description:
      "When you take the Hide action, you make a Dexterity (Stealth) check to conceal yourself from enemies. You gain advantage on the check if you are in light obscurement or heavily obscured.",
  },
  {
    name: "Ready",
    source: "PHB",
    actionType: "action",
    description:
      "When you take the Ready action, you prepare an action to be used later. You specify a trigger and a response. When the trigger occurs, you can take up to one reaction to perform the response.",
  },
  {
    name: "Search",
    source: "PHB",
    actionType: "action",
    description:
      "When you take the Search action, you make a Wisdom (Perception) check or an Intelligence (Investigation) check to search for something specific. The DM determines the difficulty class and required check.",
  },
  {
    name: "Use an Object",
    source: "PHB",
    actionType: "action",
    description:
      "When you take the Use an Object action, you use a special object that requires your action for its use. This could be opening a door, using a thief's tools, or operating a mechanism.",
  },
  {
    name: "Influence",
    source: "XPHB",
    actionType: "action",
    description:
      "When you take the Influence action, you attempt to influence how an NPC feels about you. Make a Charisma check opposed by the NPC's Wisdom (Insight) check.",
  },
  {
    name: "Study",
    source: "XPHB",
    actionType: "action",
    description:
      "When you take the Study action, you make an Intelligence check to recall or analyze information. The DC depends on what you're trying to learn.",
  },
  {
    name: "Utilize",
    source: "XPHB",
    actionType: "action",
    description:
      "When you take the Utilize action, you interact with a simple object or environmental feature that doesn't require an ability check.",
  },
];

export function transformActions(): Action[] {
  return STANDARD_ACTIONS.map((a) => ({
    id: generateId(a.source, a.name),
    canonicalId: createCanonicalId("action", a.name),
    category: "action" as const,
    name: a.name,
    source: a.source,
    actionType: a.actionType,
    description: [{ type: "paragraph" as const, text: a.description }],
  }));
}
