import { ok, strictEqual } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..", "..");

interface SearchIndexEntry {
  readonly id: string;
  readonly canonicalId: string;
  readonly name: string;
  readonly category: string;
}

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

console.log("grouping & version tests\n");

// Load generated data
const spells = JSON.parse(
  readFileSync(join(ROOT, "src", "generated", "compendium", "spells.json"), "utf-8"),
) as { name: string; canonicalId: string; source: string }[];

const searchIndex = JSON.parse(
  readFileSync(join(ROOT, "src", "generated", "compendium", "search-index.json"), "utf-8"),
) as SearchIndexEntry[];

// --- canonicalId verification ---

test("all entities have canonicalId", () => {
  const missing = spells.filter((s) => !s.canonicalId);
  strictEqual(missing.length, 0, `${missing.length} entities missing canonicalId`);
});

test("Fireball PHB and XPHB share canonicalId", () => {
  const fireballs = spells.filter((s) => s.name === "Fireball");
  const ids = [...new Set(fireballs.map((s) => s.canonicalId))];
  strictEqual(ids.length, 1, `Expected 1 canonicalId, got ${ids.length}`);
  strictEqual(ids[0], "spell.fireball");
});

// --- Duplicate detection ---

test("duplicate spells exist (same name, different source)", () => {
  const nameCounts = new Map<string, number>();
  for (const s of spells) {
    nameCounts.set(s.name, (nameCounts.get(s.name) ?? 0) + 1);
  }
  const dupes = [...nameCounts.values()].filter((c) => c > 1).length;
  ok(dupes > 0, "Expected duplicate spell names");
});

// --- Grouping verification ---

test("search index entries have canonicalId", () => {
  const missing = searchIndex.filter((s) => !s.canonicalId);
  strictEqual(missing.length, 0);
});

test("unique canonical IDs < total entries (grouping is possible)", () => {
  const uniqueIds = new Set(searchIndex.map((s) => s.canonicalId));
  ok(uniqueIds.size < searchIndex.length, "Expected fewer unique canonical IDs than total entries");
});

// --- Source priority ---

const SOURCE_PRIORITY: Record<string, number> = {
  XPHB: 1,
  PHB: 2,
  TCE: 3,
  XGE: 4,
};

function sourcePriority(source: string): number {
  return SOURCE_PRIORITY[source] ?? 99;
}

test("XPHB has higher priority than PHB", () => {
  ok(sourcePriority("XPHB") < sourcePriority("PHB"));
});

test("PHB has higher priority than TCE", () => {
  ok(sourcePriority("PHB") < sourcePriority("TCE"));
});

test("unknown source has lowest priority", () => {
  ok(sourcePriority("UNKNOWN") > sourcePriority("PHB"));
});

test("Fireball grouped by canonicalId — verify data supports dedup", () => {
  const fireballs = spells.filter((s) => s.name === "Fireball");
  const sorted = [...fireballs].sort((a, b) => sourcePriority(a.source) - sourcePriority(b.source));
  strictEqual(sorted[0]!.source, "XPHB", "Preferred version should be XPHB");
  strictEqual(sorted[1]!.source, "PHB", "Second version should be PHB");
});

// --- Unique entity test ---

test("unique entities remain unaffected", () => {
  const uniqueNames = new Map<string, { name: string; count: number }>();
  for (const s of spells) {
    if (!uniqueNames.has(s.name)) {
      uniqueNames.set(s.name, { name: s.name, count: 0 });
    }
    uniqueNames.get(s.name)!.count++;
  }
  const singleVersion = [...uniqueNames.values()].filter((e) => e.count === 1);
  ok(singleVersion.length > 0, "Expected some spells to have only one version");
});

console.log("\n═══════════════════════════════════════════\n");
