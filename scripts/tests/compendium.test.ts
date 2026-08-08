import { strictEqual, ok } from "node:assert";
import { getSourceInfo, formatSource, formatEdition } from "../../src/compendium/source";
import { referenceToUrl, referenceLabel } from "../../src/compendium/reference";
import { slugFromCanonicalId, canonicalIdFromSlug } from "../../src/compendium/slug";
import { categoryLabel, categoryLabelSingular } from "../../src/compendium/category-registry";
import { extractSpellRoll } from "../../src/compendium/spell-roll";
import type { ContentBlock } from "../../src/types/content-block";

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`  \u2713 ${description}`);
  } catch (e) {
    console.error(`  \u2717 ${description}`);
    console.error(`    ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

console.log("source info\n");

test("getSourceInfo returns XPHB data", () => {
  const info = getSourceInfo("XPHB");
  ok(info !== null);
  strictEqual(info!.code, "XPHB");
  strictEqual(info!.name, "Player's Handbook");
  strictEqual(info!.edition, "2024");
});

test("getSourceInfo returns PHB data", () => {
  const info = getSourceInfo("PHB");
  ok(info !== null);
  strictEqual(info!.code, "PHB");
  strictEqual(info!.name, "Player's Handbook");
  strictEqual(info!.edition, "2014");
});

test("getSourceInfo returns TCE data", () => {
  const info = getSourceInfo("TCE");
  ok(info !== null);
  strictEqual(info!.code, "TCE");
  strictEqual(info!.name, "Tasha's Cauldron of Everything");
});

test("getSourceInfo returns XGE data", () => {
  const info = getSourceInfo("XGE");
  ok(info !== null);
  strictEqual(info!.code, "XGE");
  strictEqual(info!.name, "Xanathar's Guide to Everything");
});

test("getSourceInfo returns null for unknown source", () => {
  strictEqual(getSourceInfo("AAG"), null);
});

test("formatSource returns edition-aware label", () => {
  strictEqual(formatSource("XPHB"), "PHB 2024");
  strictEqual(formatSource("PHB"), "PHB 2014");
  strictEqual(formatSource("TCE"), "TCE");
  strictEqual(formatSource("AAG"), "AAG");
});

test("formatEdition returns edition in parentheses", () => {
  strictEqual(formatEdition("XPHB"), "(2024)");
  strictEqual(formatEdition("AAG"), "");
});

console.log("\nentity references\n");

test("referenceToUrl builds URL from canonical target", () => {
  strictEqual(referenceToUrl("condition.invisible"), "/condition/invisible");
  strictEqual(referenceToUrl("spell.fireball"), "/spell/fireball");
});

test("referenceToUrl handles target without dot", () => {
  strictEqual(referenceToUrl("unknown"), "/unknown");
});

test("referenceLabel extracts readable name from canonical target", () => {
  strictEqual(referenceLabel("condition.invisible"), "invisible");
  strictEqual(referenceLabel("spell.delayed-blast-fireball"), "delayed blast fireball");
});

test("referenceLabel returns target unchanged when no dot", () => {
  strictEqual(referenceLabel("unknown"), "unknown");
});

console.log("\nrouting helpers\n");

test("slugFromCanonicalId strips category prefix", () => {
  strictEqual(slugFromCanonicalId("spell.fireball"), "fireball");
  strictEqual(slugFromCanonicalId("condition.blinded"), "blinded");
});

test("slugFromCanonicalId handles canonicalId without dot", () => {
  strictEqual(slugFromCanonicalId("unknown"), "unknown");
});

test("canonicalIdFromSlug prepends category", () => {
  strictEqual(canonicalIdFromSlug("spell", "fireball"), "spell.fireball");
  strictEqual(canonicalIdFromSlug("condition", "blinded"), "condition.blinded");
});

test("categoryLabel returns plural label", () => {
  strictEqual(categoryLabel("spell"), "Spells");
  strictEqual(categoryLabel("condition"), "Conditions");
});

test("categoryLabelSingular returns singular label", () => {
  strictEqual(categoryLabelSingular("spell"), "Spell");
  strictEqual(categoryLabelSingular("condition"), "Condition");
});

test("categoryLabel fallback for unknown", () => {
  strictEqual(categoryLabel("unknown"), "unknown");
});

console.log("\nspell roll extraction\n");

function spellDescription(text: string): readonly ContentBlock[] {
  return [{ type: "paragraph", text }];
}

test("extractSpellRoll returns dice and capitalized type from prose", () => {
  const blocks = spellDescription(
    "A target must succeed on a Dexterity saving throw or take 1d6 acid damage.",
  );
  strictEqual(extractSpellRoll(blocks), "1d6 Acid");
});

test("extractSpellRoll includes flat modifier", () => {
  const blocks = spellDescription("The dart hits and deals 1d4 + 1 force damage to the target.");
  strictEqual(extractSpellRoll(blocks), "1d4 + 1 Force");
});

test("extractSpellRoll returns bare dice when no damage type word", () => {
  const blocks = spellDescription("The target takes 2d6 damage on a failed save.");
  strictEqual(extractSpellRoll(blocks), "2d6");
});

test("extractSpellRoll ignores later scaling paragraphs", () => {
  const blocks: readonly ContentBlock[] = [
    { type: "paragraph", text: "You hurl a bubble of acid dealing 1d6 acid damage." },
    { type: "paragraph", text: "This spell's damage increases by 1d6 when you reach 5th level (2d6)." },
  ];
  strictEqual(extractSpellRoll(blocks), "1d6 Acid");
});

test("extractSpellRoll returns undefined for utility spells", () => {
  const blocks = spellDescription("You touch one object that is no larger than 10 feet in any dimension.");
  strictEqual(extractSpellRoll(blocks), undefined);
});

test("extractSpellRoll walks nested entries blocks", () => {
  const blocks: readonly ContentBlock[] = [
    {
      type: "entries",
      blocks: [{ type: "paragraph", text: "Each creature in the cone takes 8d6 fire damage." }],
    },
  ];
  strictEqual(extractSpellRoll(blocks), "8d6 Fire");
});

console.log(
  "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
);
