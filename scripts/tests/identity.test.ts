import { strictEqual } from "node:assert";
import { createCanonicalId } from "../compendium/identity";

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${description}`);
  } catch (e) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

console.log("canonical ID generation\n");

test("spell.fireball for Fireball spell", () => {
  strictEqual(createCanonicalId("spell", "Fireball"), "spell.fireball");
});

test("spell.delayed-blast-fireball for Delayed Blast Fireball", () => {
  strictEqual(createCanonicalId("spell", "Delayed Blast Fireball"), "spell.delayed-blast-fireball");
});

test("equipment.cloak-of-protection for Cloak of Protection", () => {
  strictEqual(
    createCanonicalId("equipment", "Cloak of Protection"),
    "equipment.cloak-of-protection",
  );
});

test("condition.blinded for Blinded", () => {
  strictEqual(createCanonicalId("condition", "Blinded"), "condition.blinded");
});

test("action.dodge for Dodge", () => {
  strictEqual(createCanonicalId("action", "Dodge"), "action.dodge");
});

test("handles lowercase input", () => {
  strictEqual(createCanonicalId("spell", "fireball"), "spell.fireball");
});

test("handles special characters", () => {
  strictEqual(
    createCanonicalId("spell", "Otto's Irresistible Dance"),
    "spell.ottos-irresistible-dance",
  );
});

console.log("\n═══════════════════════════════════════════\n");
