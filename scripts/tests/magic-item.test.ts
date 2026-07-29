import { strictEqual, ok } from "node:assert";
import { transformMagicItems } from "../../scripts/compendium/categories/magic-item/transform";
import { validateMagicItems } from "../../scripts/compendium/categories/magic-item/validate";
import type { Raw5eMagicItem } from "../../src/adapter/5etools-raw-types";
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

function makeRawMagicItem(
  name: string,
  source: string,
  rarity: string,
  type: string,
  attune?: string,
): Raw5eMagicItem {
  return {
    name,
    source,
    rarity,
    type,
    reqAttune: attune,
    entries: [`A ${rarity} ${type.toLowerCase()} called ${name}.`],
  };
}

console.log("magic-item transformer\n");

test("transforms rarity field", () => {
  const raw = [makeRawMagicItem("Cloak of Protection", "DMG", "uncommon", "WD")];
  const result = transformMagicItems(raw);
  strictEqual(result[0]!.rarity, "uncommon");
});

test("transforms attunement field", () => {
  const raw = [makeRawMagicItem("Staff of Power", "DMG", "very rare", "ST", "by a wizard")];
  const result = transformMagicItems(raw);
  strictEqual(result[0]!.requiresAttunement, "by a wizard");
});

test("transforms attunement false (no reqAttune)", () => {
  const raw = [makeRawMagicItem("Potion of Healing", "DMG", "common", "P")];
  const result = transformMagicItems(raw);
  strictEqual(result[0]!.requiresAttunement, "");
});

test("transforms itemType from code", () => {
  const raw = [makeRawMagicItem("Ring of Protection", "DMG", "rare", "RG")];
  const result = transformMagicItems(raw);
  strictEqual(result[0]!.itemType, "Ring");
});

test("transforms itemType fallback for unknown code", () => {
  const raw = [makeRawMagicItem("Cube of Force", "DMG", "rare", "UNKNOWN")];
  const result = transformMagicItems(raw);
  strictEqual(result[0]!.itemType, "UNKNOWN");
});

test("generates canonicalId with magicitem prefix", () => {
  const raw = [makeRawMagicItem("Cloak of Protection", "DMG", "uncommon", "WD")];
  const result = transformMagicItems(raw);
  ok(result[0]!.canonicalId.startsWith("magicitem."));
  strictEqual(result[0]!.category, "magicitem");
});

test("transforms description with processEntries", () => {
  const raw = [makeRawMagicItem("Deck of Wonder", "DMG", "legendary", "WD")];
  const result = transformMagicItems(raw);
  ok(result[0]!.description.length > 0);
  strictEqual(result[0]!.description[0]!.type, "paragraph");
});

test("filters by allowed source", () => {
  const raw = [
    makeRawMagicItem("Valid Item", "DMG", "rare", "WD"),
    makeRawMagicItem("Invalid Item", "UNKNOWN", "common", "WD"),
  ];
  const result = transformMagicItems(raw);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.name, "Valid Item");
});

test("validator accepts valid magic items", () => {
  const raw = [makeRawMagicItem("Cloak of Prot", "DMG", "uncommon", "WD")];
  const items = transformMagicItems(raw);
  const errors = validateMagicItems(items);
  strictEqual(errors.length, 0);
});

test("validator catches missing rarity", () => {
  const raw = [makeRawMagicItem("Bad Item", "DMG", "", "WD")];
  const items = transformMagicItems(raw);
  const errors = validateMagicItems(items as CompendiumEntry[]);
  strictEqual(errors.length, 1);
  strictEqual(errors[0]!.field, "rarity");
});

test("related index includes magic item tags", () => {
  const raw = [
    makeRawMagicItem("Cloak of Elvenkind", "DMG", "uncommon", "WD"),
    makeRawMagicItem("Ring of Protection", "DMG", "rare", "RG"),
  ];
  const items = transformMagicItems(raw);
  const index = generateRelatedIndex(items);
  const cloak = index["magicitem.cloak-of-elvenkind"]!;
  ok(cloak.tags.includes("uncommon"), "rarity in tags");
  ok(cloak.tags.includes("Wondrous Item"), "type in tags");
});

test("same-rarity same-type items rank higher in related", () => {
  const raw = [
    makeRawMagicItem("Cloak of Elvenkind", "DMG", "uncommon", "WD"),
    makeRawMagicItem("Boots of Elvenkind", "DMG", "uncommon", "WD"),
    makeRawMagicItem("Ring of Protection", "DMG", "uncommon", "RG"),
  ];
  const items = transformMagicItems(raw);
  const index = generateRelatedIndex(items);
  const related = index["magicitem.cloak-of-elvenkind"]!.related;
  const bootsIdx = related.indexOf("magicitem.boots-of-elvenkind");
  const ringIdx = related.indexOf("magicitem.ring-of-protection");
  ok(bootsIdx !== -1 && ringIdx !== -1, "both items appear in related list");
  ok(bootsIdx < ringIdx, "same-type item ranks before different-type item");
});

test("runtime API: getEntityTags works for magic items", () => {
  const raw = [makeRawMagicItem("Cloak of Protection", "DMG", "uncommon", "WD")];
  const items = transformMagicItems(raw);
  const index = generateRelatedIndex(items);
  setRelatedIndex(index);
  const tags = getEntityTags("magicitem.cloak-of-protection");
  ok(tags.includes("uncommon"));
  ok(tags.includes("Wondrous Item"));
});

console.log(
  "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
);
