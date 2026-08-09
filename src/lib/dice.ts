export interface DiceExpression {
  readonly count: number;
  readonly sides: number;
  readonly modifier: number;
}

const EXPRESSION_PATTERN = /^(\d*)d(\d+)(?:\s*([+-])\s*(\d+))?$/i;

export function parseDiceExpression(input: string): DiceExpression | null {
  const match = input.trim().match(EXPRESSION_PATTERN);
  if (match === null) return null;
  const countRaw = match[1];
  const sidesRaw = match[2]!;
  const count = countRaw === undefined || countRaw === "" ? 1 : Number.parseInt(countRaw, 10);
  const sides = Number.parseInt(sidesRaw, 10);
  if (count < 1 || count > 100 || sides < 1 || sides > 1000) return null;
  const sign = match[3];
  const magnitude = match[4] === undefined ? 0 : Number.parseInt(match[4], 10);
  const modifier = sign === "-" ? -magnitude : magnitude;
  return { count, sides, modifier };
}

export function rollDice(expression: DiceExpression, random: () => number = Math.random): number {
  let total = 0;
  for (let i = 0; i < expression.count; i += 1) {
    total += Math.floor(random() * expression.sides) + 1;
  }
  return total + expression.modifier;
}

export function rollDiceExpression(input: string, random?: () => number): number | null {
  const parsed = parseDiceExpression(input);
  return parsed === null ? null : rollDice(parsed, random);
}

export function formatDiceExpression(expression: DiceExpression): string {
  const base = `${expression.count}d${expression.sides}`;
  if (expression.modifier === 0) return base;
  return expression.modifier > 0
    ? `${base} + ${expression.modifier}`
    : `${base} - ${-expression.modifier}`;
}

/**
 * Splits a spell roll string like "1d6 Acid", "1d4 + 1 Force", or "2d6" into
 * its dice expression and (optional) damage type.
 */
export function splitSpellRoll(roll: string): {
  readonly expression: string;
  readonly type: string | undefined;
} {
  const match = roll.match(/^(.*\d)\s+([A-Za-z]+)$/);
  if (match !== null) return { expression: match[1]!, type: match[2] };
  return { expression: roll, type: undefined };
}
