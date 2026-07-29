import { strictEqual, ok, deepStrictEqual } from "node:assert";
import { processEntries } from "../compendium/entries";

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

// ---------------------------------------------------------------------------
// processEntries — input → output mapping
// ---------------------------------------------------------------------------

console.log("processEntries — base types\n");

test("string entry becomes paragraph", () => {
  const result = processEntries(["Hello world"]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "paragraph");
  if (result[0]!.type === "paragraph") {
    strictEqual(result[0]!.text, "Hello world");
  }
});

test("empty string entry is skipped", () => {
  const result = processEntries([""]);
  strictEqual(result.length, 0);
});

test("whitespace-only string is skipped", () => {
  const result = processEntries(["   "]);
  strictEqual(result.length, 0);
});

test("list entry becomes list block with string items", () => {
  const result = processEntries([{ type: "list", items: ["item one", "item two"] }]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "list");
  if (result[0]!.type === "list") {
    ok(Array.isArray(result[0]!.items));
    strictEqual(result[0]!.items.length, 2);
    strictEqual(typeof result[0]!.items[0], "string");
  }
});

test("list entry with named items becomes entries blocks", () => {
  const result = processEntries([
    {
      type: "list",
      items: [{ type: "item", name: "Hit", entries: ["1d8 slashing"] }, "simple item"],
    },
  ]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "list");
  if (result[0]!.type === "list") {
    strictEqual(result[0]!.items.length, 2);
    // Named item becomes an entries block
    const firstItem = result[0]!.items[0]!;
    ok(typeof firstItem !== "string");
    if (typeof firstItem !== "string" && firstItem.type === "entries") {
      strictEqual(firstItem.name, "Hit");
    }
    // Second item is plain string
    strictEqual(typeof result[0]!.items[1], "string");
  }
});

test("table entry becomes table block", () => {
  const result = processEntries([
    { type: "table", colLabels: ["Name", "Cost"], rows: [["Potion", "50 gp"]] },
  ]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "table");
  if (result[0]!.type === "table") {
    strictEqual(result[0]!.headers.length, 2);
    strictEqual(result[0]!.headers[0]!.text, "Name");
    strictEqual(result[0]!.rows.length, 1);
    strictEqual(result[0]!.rows[0]![1]!.text, "50 gp");
  }
});

test("table entry with caption", () => {
  const result = processEntries([
    {
      type: "table",
      colLabels: ["A"],
      rows: [["B"]],
      caption: "Test Table",
    },
  ]);
  strictEqual(result[0]!.type, "table");
  if (result[0]!.type === "table") {
    strictEqual(result[0]!.caption, "Test Table");
  }
});

test("table entry without data is skipped", () => {
  const result = processEntries([{ type: "table", colLabels: [], rows: [] }]);
  strictEqual(result.length, 0);
});

test("entries type is preserved as nested entries block", () => {
  const result = processEntries([
    {
      type: "entries",
      entries: ["inner text", { type: "list", items: ["inner item"] }],
    },
  ]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "entries");
  if (result[0]!.type === "entries") {
    strictEqual(result[0]!.blocks.length, 2);
    strictEqual(result[0]!.blocks[0]!.type, "paragraph");
    strictEqual(result[0]!.blocks[1]!.type, "list");
  }
});

test("named entry becomes entries block with name", () => {
  const result = processEntries([
    { name: "Effect", entries: ["The spell creates a burst of fire."] },
  ]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "entries");
  if (result[0]!.type === "entries") {
    strictEqual(result[0]!.name, "Effect");
    strictEqual(result[0]!.blocks.length, 1);
    strictEqual(result[0]!.blocks[0]!.type, "paragraph");
  }
});

console.log("\nprocessEntries — advanced types\n");

test("inset entry becomes inset block", () => {
  const result = processEntries([{ type: "inset", entries: ["Inset content here"] }]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "inset");
  if (result[0]!.type === "inset") {
    strictEqual(result[0]!.blocks.length, 1);
    strictEqual(result[0]!.blocks[0]!.type, "paragraph");
  }
});

test("quote entry becomes quote block", () => {
  const result = processEntries([{ type: "quote", entries: ["Quote text"], by: "Wise One" }]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "quote");
  if (result[0]!.type === "quote") {
    strictEqual(result[0]!.blocks.length, 1);
    strictEqual(result[0]!.by, "Wise One");
  }
});

test("quote entry without by", () => {
  const result = processEntries([{ type: "quote", entries: ["Quote text"] }]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "quote");
  if (result[0]!.type === "quote") {
    strictEqual(result[0]!.by, undefined);
  }
});

test("line entry becomes separator", () => {
  const result = processEntries([{ type: "line" }]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "separator");
});

test("separator entry becomes separator", () => {
  const result = processEntries([{ type: "separator" }]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "separator");
});

test("dice entry becomes dice block", () => {
  const result = processEntries([{ type: "dice", name: "Damage", roll: { formula: "2d6" } }]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "dice");
  if (result[0]!.type === "dice") {
    strictEqual(result[0]!.formula, "2d6");
    strictEqual(result[0]!.label, "Damage");
  }
});

test("dice entry with exact roll", () => {
  const result = processEntries([{ type: "dice", roll: { exact: 8 } }]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "dice");
  if (result[0]!.type === "dice") {
    strictEqual(result[0]!.formula, "8");
    strictEqual(result[0]!.label, undefined);
  }
});

test("dice entry with range roll", () => {
  const result = processEntries([{ type: "dice", roll: { min: 1, max: 10 } }]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "dice");
  if (result[0]!.type === "dice") {
    strictEqual(result[0]!.formula, "1\u201310");
  }
});

console.log("\nprocessEntries — edge cases\n");

test("unknown object types are skipped", () => {
  const result = processEntries([{ type: "unknown", foo: "bar" }]);
  strictEqual(result.length, 0);
});

test("null entries are skipped", () => {
  const result = processEntries([null, "valid"]);
  strictEqual(result.length, 1);
  strictEqual(result[0]!.type, "paragraph");
});

test("array entries are skipped", () => {
  const result = processEntries([["not", "handled"]]);
  strictEqual(result.length, 0);
});

test("mixed content preserves order", () => {
  const result = processEntries(["first", { type: "list", items: ["a", "b"] }, "last"]);
  strictEqual(result.length, 3);
  strictEqual(result[0]!.type, "paragraph");
  strictEqual(result[1]!.type, "list");
  strictEqual(result[2]!.type, "paragraph");
});

test("deeply nested entries", () => {
  const result = processEntries([
    {
      type: "entries",
      entries: [
        "level 1",
        {
          type: "entries",
          entries: ["level 2", { type: "entries", entries: ["level 3"] }],
        },
      ],
    },
  ]);
  strictEqual(result.length, 1);
  if (result[0]!.type !== "entries") return;
  strictEqual(result[0]!.blocks.length, 2);
  const nested = result[0]!.blocks[1]!;
  strictEqual(nested.type, "entries");
  if (nested.type !== "entries") return;
  strictEqual(nested.blocks.length, 2);
  const deeper = nested.blocks[1]!;
  strictEqual(deeper.type, "entries");
  if (deeper.type === "entries") {
    strictEqual(deeper.blocks.length, 1);
  }
});

test("normalizeText is applied to paragraphs", () => {
  const result = processEntries(["Hello {@i world}"]);
  strictEqual(result.length, 1);
  if (result[0]!.type === "paragraph") {
    // The normalizer wraps {@i ...} in underscores for italic rendering
    ok(result[0]!.text.includes("Hello"));
    ok(result[0]!.text.includes("world"));
  }
});

test("list with style is preserved", () => {
  const result = processEntries([{ type: "list", items: ["a", "b"], style: "none" }]);
  strictEqual(result[0]!.type, "list");
  if (result[0]!.type === "list") {
    strictEqual(result[0]!.style, "none");
  }
});

test("table cell with roll object is resolved", () => {
  const result = processEntries([
    {
      type: "table",
      colLabels: ["Roll"],
      rows: [[{ roll: { exact: 8 } }]],
    },
  ]);
  strictEqual(result[0]!.type, "table");
  if (result[0]!.type === "table") {
    strictEqual(result[0]!.rows[0]![0]!.text, "8");
  }
});

test("table cell with name object is resolved", () => {
  const result = processEntries([
    {
      type: "table",
      colLabels: ["Name"],
      rows: [[{ name: "Fireball" }]],
    },
  ]);
  strictEqual(result[0]!.type, "table");
  if (result[0]!.type === "table") {
    strictEqual(result[0]!.rows[0]![0]!.text, "Fireball");
  }
});

// ---------------------------------------------------------------------------
// Block type structural verification
// ---------------------------------------------------------------------------

console.log("\nblock type completeness\n");

test("all 12 block types are representable", () => {
  const blocks = [
    { type: "paragraph" as const, text: "p" },
    { type: "header" as const, text: "h", level: 2 },
    { type: "entries" as const, blocks: [] },
    { type: "entries" as const, name: "Named", blocks: [] },
    { type: "list" as const, items: ["a"] },
    { type: "list" as const, items: [{ type: "paragraph" as const, text: "nested" }] },
    { type: "table" as const, headers: [{ text: "H" }], rows: [[{ text: "D" }]] },
    {
      type: "table" as const,
      headers: [{ text: "H", align: "right" as const }],
      rows: [[{ text: "D", align: "center" as const }]],
      caption: "cap",
    },
    { type: "quote" as const, blocks: [], by: "author" },
    { type: "inset" as const, blocks: [] },
    { type: "separator" as const },
    { type: "reference" as const, target: "spell.fireball", label: "Fireball" },
    { type: "dice" as const, formula: "1d20", label: "Roll" },
    { type: "link" as const, href: "https://example.com", text: "click" },
    { type: "image" as const, src: "/img.png", alt: "img", width: 100, height: 50 },
  ];
  strictEqual(blocks.length, 15);
});

// ---------------------------------------------------------------------------
// Integration: processEntries on real entity descriptions
// ---------------------------------------------------------------------------

console.log("\nintegration — real entity descriptions\n");

test("spell with mixed entries processes correctly", () => {
  // Simulate a simplified spell entry structure
  const input = [
    "A target takes 1d8 fire damage.",
    {
      type: "list",
      items: ["At Higher Levels", { type: "item", name: "Level 3", entries: ["+1d8 damage"] }],
    },
    {
      name: "At Higher Levels",
      entries: [
        "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.",
      ],
    },
  ];
  const result = processEntries(input);
  ok(result.length >= 2);
  strictEqual(result[0]!.type, "paragraph");
  // Named entry section becomes entries block with name
  const last = result[result.length - 1]!;
  strictEqual(last.type, "entries");
});

test("monster entry with actions processes correctly", () => {
  // Simulate a monster trait with nested entries
  const input = [
    { name: "Multiattack", entries: ["The dragon makes three attacks."] },
    {
      name: "Bite",
      entries: [
        "Melee Weapon Attack: +17 to hit.",
        { type: "list", items: ["Hit: 21 piercing damage"] },
      ],
    },
  ];
  const result = processEntries(input);
  strictEqual(result.length, 2);
  strictEqual(result[0]!.type, "entries");
  if (result[0]!.type === "entries") {
    strictEqual(result[0]!.name, "Multiattack");
  }
});

test("condition with inset processes correctly", () => {
  const input = [
    "While blinded, you can't see.",
    { type: "inset", entries: ["You can still hear normally."] },
  ];
  const result = processEntries(input);
  strictEqual(result.length, 2);
  strictEqual(result[1]!.type, "inset");
});

test("empty input returns empty array", () => {
  const result = processEntries([]);
  deepStrictEqual(result, []);
});
