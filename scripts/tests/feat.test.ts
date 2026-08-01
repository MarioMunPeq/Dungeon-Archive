import { strictEqual, ok } from "node:assert";
import { transformFeats } from "../../scripts/compendium/categories/feat/transform";
import { validateFeats } from "../../scripts/compendium/categories/feat/validate";
import type { Raw5eFeat } from "../../src/adapter/5etools-raw-types";
import type { CompendiumEntry } from "../../src/types/compendium";
import { generateRelatedIndex } from "../../scripts/compendium/generate-related-index";
import { setRelatedIndex, getEntityTags } from "../../src/compendium/relationships";

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

function makeRawFeat(name: string, source: string, overrides?: Partial<Raw5eFeat>): Raw5eFeat {
  return {
    name,
    source,
    entries: [`Description for ${name}.`],
    ...overrides,
  };
}

console.log("feat transformer\n");

test("transforms name and source", () => {
  const raw = [makeRawFeat("Alert", "XPHB")];
  const result = transformFeats(raw);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.name, "Alert");
  strictEqual(result[0]!.source, "XPHB");
});

test("generates canonicalId with feat prefix", () => {
  const raw = [makeRawFeat("Tough", "PHB")];
  const result = transformFeats(raw);
  ok(result[0]!.canonicalId.startsWith("feat."));
  strictEqual(result[0]!.category, "feat");
});

test("maps category code to label", () => {
  const raw = [makeRawFeat("War Caster", "PHB", { category: "G" })];
  const result = transformFeats(raw);
  strictEqual(result[0]!.featCategory, "General");
});

test("maps Epic Boon category", () => {
  const raw = [makeRawFeat("Boon of Combat Prowess", "XPHB", { category: "EB" })];
  const result = transformFeats(raw);
  strictEqual(result[0]!.featCategory, "Epic Boon");
});

test("maps Origin category", () => {
  const raw = [makeRawFeat("Alert", "XPHB", { category: "O" })];
  const result = transformFeats(raw);
  strictEqual(result[0]!.featCategory, "Origin");
});

test("sets featCategory to undefined when no category", () => {
  const raw = [makeRawFeat("Actor", "PHB")];
  const result = transformFeats(raw);
  strictEqual(result[0]!.featCategory, undefined);
});

test("formatPrerequisite handles level", () => {
  const raw = [makeRawFeat("ASI", "XPHB", { prerequisite: [{ level: 4 }] })];
  const result = transformFeats(raw);
  strictEqual(result[0]!.prerequisite, "Level 4");
});

test("formatPrerequisite handles multiple conditions", () => {
  const raw = [
    makeRawFeat("Eldritch Adept", "TCE", { prerequisite: [{ level: 4, spellcasting: true }] }),
  ];
  const result = transformFeats(raw);
  ok(result[0]!.prerequisite!.includes("Level 4"));
  ok(result[0]!.prerequisite!.includes("Spellcasting"));
});

test("sets prerequisite to undefined when none", () => {
  const raw = [makeRawFeat("Alert", "PHB")];
  const result = transformFeats(raw);
  strictEqual(result[0]!.prerequisite, undefined);
});

test("transforms repeatable field", () => {
  const raw = [makeRawFeat("ASI", "XPHB", { repeatable: true })];
  const result = transformFeats(raw);
  strictEqual(result[0]!.repeatable, true);
});

test("repeatable defaults to undefined", () => {
  const raw = [makeRawFeat("Tough", "PHB")];
  const result = transformFeats(raw);
  strictEqual(result[0]!.repeatable, undefined);
});

test("transforms description with processEntries", () => {
  const raw = [makeRawFeat("Tough", "PHB")];
  const result = transformFeats(raw);
  ok(result[0]!.description.length > 0);
  strictEqual(result[0]!.description[0]!.type, "paragraph");
});

test("filters by allowed source", () => {
  const raw = [makeRawFeat("Valid Feat", "XPHB"), makeRawFeat("Invalid Feat", "UNKNOWN")];
  const result = transformFeats(raw);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.name, "Valid Feat");
});

test("validator accepts valid feats", () => {
  const raw = [makeRawFeat("Tough", "PHB")];
  const items = transformFeats(raw);
  const errors = validateFeats(items as CompendiumEntry[]);
  strictEqual(errors.length, 0);
});

test("related index includes feat tags", () => {
  const raw = [
    makeRawFeat("Tough", "PHB", { category: "G" }),
    makeRawFeat("War Caster", "PHB", { category: "G" }),
  ];
  const items = transformFeats(raw);
  const index = generateRelatedIndex(items);
  const tough = index["feat.tough"]!;
  ok(tough.tags.includes("General"), "category in tags");
});

test("feats with same category score higher", () => {
  const raw = [
    makeRawFeat("Tough", "PHB", { category: "G" }),
    makeRawFeat("War Caster", "PHB", { category: "G" }),
    makeRawFeat("Boon of Fortitude", "XPHB", { category: "EB" }),
  ];
  const items = transformFeats(raw);
  const index = generateRelatedIndex(items);
  const related = index["feat.tough"]!.related;
  const warCasterIdx = related.indexOf("feat.war-caster");
  const boonIdx = related.indexOf("feat.boon-of-fortitude");
  ok(warCasterIdx !== -1, "same-category feat appears in related");
  ok(warCasterIdx < boonIdx, "same-category feat ranks before different-category");
});

test("runtime API: getEntityTags works for feats", () => {
  const raw = [makeRawFeat("Tough", "PHB", { category: "G" })];
  const items = transformFeats(raw);
  const index = generateRelatedIndex(items);
  setRelatedIndex(index);
  const tags = getEntityTags("feat.tough");
  ok(tags.includes("General"));
});

console.log(
  "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
);
