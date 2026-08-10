import { strictEqual, ok } from "node:assert";
import {
  parseDiceExpression,
  rollDice,
  rollDiceExpression,
  formatDiceExpression,
  diceBoxNotation,
  splitSpellRoll,
} from "../../src/lib/dice";

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

function die(count: number, sides: number, modifier = 0) {
  return { count, sides, modifier };
}

console.log("dice parsing\n");

test("parseDiceExpression parses '1d6'", () => {
  strictEqual(parseDiceExpression("1d6")?.count, 1);
  strictEqual(parseDiceExpression("1d6")?.sides, 6);
  strictEqual(parseDiceExpression("1d6")?.modifier, 0);
});

test("parseDiceExpression parses '2d6'", () => {
  const parsed = parseDiceExpression("2d6");
  strictEqual(parsed?.count, 2);
  strictEqual(parsed?.sides, 6);
});

test("parseDiceExpression defaults a missing count to 1", () => {
  const parsed = parseDiceExpression("d20");
  strictEqual(parsed?.count, 1);
  strictEqual(parsed?.sides, 20);
});

test("parseDiceExpression parses a positive modifier", () => {
  const parsed = parseDiceExpression("1d4 + 1");
  strictEqual(parsed?.count, 1);
  strictEqual(parsed?.sides, 4);
  strictEqual(parsed?.modifier, 1);
});

test("parseDiceExpression parses a negative modifier", () => {
  const parsed = parseDiceExpression("3d8 - 2");
  strictEqual(parsed?.count, 3);
  strictEqual(parsed?.sides, 8);
  strictEqual(parsed?.modifier, -2);
});

test("parseDiceExpression ignores surrounding whitespace", () => {
  const parsed = parseDiceExpression("  1d10 + 5  ");
  strictEqual(parsed?.count, 1);
  strictEqual(parsed?.sides, 10);
  strictEqual(parsed?.modifier, 5);
});

test("parseDiceExpression rejects non-expressions", () => {
  strictEqual(parseDiceExpression("nonsense"), null);
  strictEqual(parseDiceExpression("1d6 acid"), null);
  strictEqual(parseDiceExpression(""), null);
});

test("parseDiceExpression rejects out-of-range values", () => {
  strictEqual(parseDiceExpression("0d6"), null);
  strictEqual(parseDiceExpression("1d0"), null);
  strictEqual(parseDiceExpression("101d6"), null);
  strictEqual(parseDiceExpression("1d1001"), null);
});

console.log("dice rolling\n");

test("rollDice always returns within bounds for 1d6", () => {
  for (let i = 0; i < 1000; i += 1) {
    const result = rollDice(die(1, 6));
    ok(result >= 1 && result <= 6, `got ${result}`);
  }
});

test("rollDice sums multiple dice", () => {
  for (let i = 0; i < 1000; i += 1) {
    const result = rollDice(die(2, 6));
    ok(result >= 2 && result <= 12, `got ${result}`);
  }
});

test("rollDice applies the modifier", () => {
  for (let i = 0; i < 1000; i += 1) {
    const result = rollDice(die(1, 20, 5));
    ok(result >= 6 && result <= 25, `got ${result}`);
  }
});

test("rollDice is deterministic with an injected random source", () => {
  strictEqual(
    rollDice(die(2, 6), () => 0),
    2,
  );
  strictEqual(
    rollDice(die(2, 6), () => 0.999),
    12,
  );
  strictEqual(
    rollDice(die(1, 4, 1), () => 0),
    2,
  );
});

test("rollDiceExpression parses and rolls in one call", () => {
  strictEqual(
    rollDiceExpression("2d6", () => 0),
    2,
  );
  strictEqual(rollDiceExpression("bogus"), null);
});

console.log("dice formatting\n");

test("formatDiceExpression formats bare expressions", () => {
  strictEqual(formatDiceExpression(die(1, 20)), "1d20");
  strictEqual(formatDiceExpression(die(2, 6)), "2d6");
});

test("formatDiceExpression formats modifiers", () => {
  strictEqual(formatDiceExpression(die(1, 4, 1)), "1d4 + 1");
  strictEqual(formatDiceExpression(die(1, 4, -1)), "1d4 - 1");
  strictEqual(formatDiceExpression(die(2, 8, 3)), "2d8 + 3");
});

console.log("dice-box notation\n");

test("diceBoxNotation always includes the die count", () => {
  strictEqual(diceBoxNotation(die(1, 20)), "1d20");
  strictEqual(diceBoxNotation(die(2, 6)), "2d6");
});

test("diceBoxNotation omits the modifier", () => {
  strictEqual(diceBoxNotation(die(2, 8, 3)), "2d8");
  strictEqual(diceBoxNotation(die(1, 4, -1)), "1d4");
});

console.log("spell roll splitting\n");

test("splitSpellRoll splits a type suffix", () => {
  strictEqual(splitSpellRoll("1d6 Acid").expression, "1d6");
  strictEqual(splitSpellRoll("1d6 Acid").type, "Acid");
});

test("splitSpellRoll splits a modifier expression with a type", () => {
  strictEqual(splitSpellRoll("1d4 + 1 Force").expression, "1d4 + 1");
  strictEqual(splitSpellRoll("1d4 + 1 Force").type, "Force");
});

test("splitSpellRoll leaves a bare roll alone", () => {
  strictEqual(splitSpellRoll("2d6").expression, "2d6");
  strictEqual(splitSpellRoll("2d6").type, undefined);
});
