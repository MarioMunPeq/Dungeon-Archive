import { strictEqual, deepEqual } from "node:assert";
import { buildHighlightParts } from "../../src/features/search/components/build-highlight-parts";

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

function text(parts: readonly { type: string; value: string }[]): string {
  return parts.map((p) => p.value).join("");
}

function matches(parts: readonly { type: string; value: string }[]): string[] {
  return parts.filter((p) => p.type === "match").map((p) => p.value);
}

function main() {
  console.log("search highlight\n");

  test("returns single text part when query is empty", () => {
    const parts = buildHighlightParts("Faerie Fire", "");
    strictEqual(parts.length, 1);
    strictEqual(parts[0]!.type, "text");
    strictEqual(parts[0]!.value, "Faerie Fire");
  });

  test("returns single text part when query is whitespace", () => {
    const parts = buildHighlightParts("Faerie Fire", "   ");
    strictEqual(parts.length, 1);
    strictEqual(parts[0]!.type, "text");
  });

  test("returns single text part when no match", () => {
    const parts = buildHighlightParts("Faerie Fire", "xyz");
    strictEqual(parts.length, 1);
    strictEqual(parts[0]!.type, "text");
    strictEqual(parts[0]!.value, "Faerie Fire");
  });

  test("marks a mid-name match", () => {
    const parts = buildHighlightParts("Faerie Fire", "ae");
    strictEqual(text(parts), "Faerie Fire");
    deepEqual(matches(parts), ["ae"]);
  });

  test("marks all occurrences case-insensitively", () => {
    const parts = buildHighlightParts("Faerie Faerie", "ae");
    deepEqual(matches(parts), ["ae", "ae"]);
    strictEqual(text(parts), "Faerie Faerie");
  });

  test("reconstructs the original text exactly", () => {
    const cases: [string, string][] = [
      ["Faerie Fire", "ae"],
      ["Faerie Fire", "fire"],
      ["Acid Splash", "Acid"],
      ["Mage Hand", "g"],
      ["Lightning Bolt", "Lig"],
    ];
    for (const [textInput, query] of cases) {
      strictEqual(text(buildHighlightParts(textInput, query)), textInput);
    }
  });

  test("matches are contiguous with the surrounding text (no padding)", () => {
    const parts = buildHighlightParts("Faerie Fire", "ae");
    const match = parts.find((p) => p.type === "match");
    strictEqual(match!.value, "ae");
    const before = parts[0]!;
    strictEqual(before.type, "text");
    strictEqual(before.value.endsWith("F"), true);
    const after = parts[2]!;
    strictEqual(after.value.startsWith("rie Fire"), true);
  });

  test("trims query before matching", () => {
    const parts = buildHighlightParts("Fireball", "  fire  ");
    strictEqual(parts[0]!.type, "match");
    strictEqual(parts[0]!.value, "Fire");
    strictEqual(text(parts), "Fireball");
  });

  test("handles match at start", () => {
    const parts = buildHighlightParts("Fireball", "fire");
    strictEqual(parts[0]!.type, "match");
    strictEqual(parts[0]!.value, "Fire");
  });

  test("handles match at end", () => {
    const parts = buildHighlightParts("Fireball", "ball");
    strictEqual(parts[parts.length - 1]!.type, "match");
    strictEqual(parts[parts.length - 1]!.value, "ball");
  });

  console.log(
    "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
  );
}

main();
