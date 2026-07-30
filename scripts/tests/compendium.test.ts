import { strictEqual, ok } from "node:assert";
import { getSourceInfo, formatSource, formatEdition } from "../../src/compendium/source";
import { referenceToUrl, referenceLabel } from "../../src/compendium/reference";
import { slugFromCanonicalId, canonicalIdFromSlug } from "../../src/compendium/slug";
import { categoryLabel, categoryLabelSingular } from "../../src/compendium/category-registry";

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

test("formatSource returns short label", () => {
  strictEqual(formatSource("XPHB"), "PHB24");
  strictEqual(formatSource("PHB"), "PHB");
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

console.log(
  "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
);
