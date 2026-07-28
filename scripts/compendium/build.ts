import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { CompendiumEntry } from "../../src/types/compendium";
import type { Raw5eSpell } from "../../src/adapter/5etools-raw-types";
import type { Raw5eCondition } from "../../src/adapter/5etools-raw-types";
import type { Raw5eItem } from "../../src/adapter/5etools-raw-types";
import { transformSpells } from "./categories/spell/transform";
import { validateSpells } from "./categories/spell/validate";
import { transformConditions } from "./categories/condition/transform";
import { validateConditions } from "./categories/condition/validate";
import { transformEquipment } from "./categories/equipment/transform";
import { validateEquipment } from "./categories/equipment/validate";
import { transformActions } from "./categories/action/transform";
import { validateActions } from "./categories/action/validate";
import { generateSearchIndex } from "./generate-index";

const ROOT = join(import.meta.dirname, "..", "..");
const EXTERNAL_DIR = join(ROOT, "external", "5etools", "data");
const OUTPUT_DIR = join(ROOT, "src", "generated", "compendium");

interface ValidationError {
  readonly id: string;
  readonly field: string;
  readonly message: string;
}

interface CategoryConfig {
  readonly name: string;
  readonly sourcePaths: readonly string[];
  readonly dataKey: string;
  readonly transform: (data: unknown[]) => CompendiumEntry[];
  readonly validate: (entities: CompendiumEntry[]) => ValidationError[];
  readonly outputPath: string;
}

const CATEGORIES: readonly CategoryConfig[] = [
  {
    name: "spells",
    sourcePaths: [
      "spells/spells-phb.json",
      "spells/spells-xphb.json",
      "spells/spells-tce.json",
      "spells/spells-xge.json",
    ],
    dataKey: "spell",
    transform: (data) => {
      const lookupPath = join(EXTERNAL_DIR, "generated", "gendata-spell-source-lookup.json");
      const classLookup = existsSync(lookupPath)
        ? (readFileJson(lookupPath) as Record<
            string,
            Record<string, { class?: Record<string, Record<string, true>> }>
          >)
        : undefined;
      return transformSpells(data as Raw5eSpell[], classLookup);
    },
    validate: validateSpells as (entities: CompendiumEntry[]) => ValidationError[],
    outputPath: "spells.json",
  },
  {
    name: "conditions",
    sourcePaths: ["conditionsdiseases.json"],
    dataKey: "condition",
    transform: (data) => transformConditions(data as Raw5eCondition[]),
    validate: validateConditions as (entities: CompendiumEntry[]) => ValidationError[],
    outputPath: "conditions.json",
  },
  {
    name: "equipment",
    sourcePaths: ["items-base.json", "items.json"],
    dataKey: "item",
    transform: (data) => transformEquipment(data as Raw5eItem[]),
    validate: validateEquipment as (entities: CompendiumEntry[]) => ValidationError[],
    outputPath: "equipment.json",
  },
  {
    name: "actions",
    sourcePaths: [],
    dataKey: "",
    transform: () => transformActions(),
    validate: validateActions as (entities: CompendiumEntry[]) => ValidationError[],
    outputPath: "actions.json",
  },
];

function readFileJson(filePath: string): unknown {
  const content = readFileSync(filePath, "utf-8");
  return JSON.parse(content) as unknown;
}

function loadCategoryData(config: CategoryConfig): unknown[] {
  const results: unknown[] = [];

  for (const relPath of config.sourcePaths) {
    const fullPath = join(EXTERNAL_DIR, relPath);
    if (!existsSync(fullPath)) {
      console.warn(`  ⚠ Source file not found, skipping: ${relPath}`);
      continue;
    }
    const data = readFileJson(fullPath);
    const items = (data as Record<string, unknown[]>)[config.dataKey];
    if (Array.isArray(items)) {
      results.push(...items);
    }
  }

  return results;
}

function writeJson(filePath: string, data: unknown): void {
  const dir = join(filePath, "..");
  mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function main(): void {
  console.log("═══════════════════════════════════════════");
  console.log("  Dungeon Archive — Compendium Build");
  console.log("═══════════════════════════════════════════\n");

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const allEntities: CompendiumEntry[] = [];
  const counts: Record<string, number> = {};
  let hasErrors = false;

  for (const config of CATEGORIES) {
    console.log(`▶ ${config.name}`);

    const rawData = loadCategoryData(config);
    console.log(`  Loaded ${rawData.length} raw entries`);

    const entities = config.transform(rawData);
    console.log(`  Transformed ${entities.length} entries`);

    const errors = config.validate(entities);
    if (errors.length > 0) {
      console.error(`  ✗ Validation failed with ${errors.length} errors:`);
      for (const err of errors) {
        console.error(`    - [${err.id}] ${err.field}: ${err.message}`);
      }
      hasErrors = true;
    } else {
      console.log(`  ✓ Validation passed`);
    }

    const outputPath = join(OUTPUT_DIR, config.outputPath);
    writeJson(outputPath, entities);
    console.log(`  Written to ${config.outputPath}`);

    counts[config.name] = entities.length;
    allEntities.push(...entities);
    console.log();
  }

  // Search index
  console.log("▶ search-index");
  const searchIndex = generateSearchIndex(allEntities);
  writeJson(join(OUTPUT_DIR, "search-index.json"), searchIndex);
  console.log(`  Generated ${searchIndex.length} index entries`);
  console.log();

  // Manifest (no timestamps — deterministic)
  console.log("▶ manifest");
  const manifest = {
    version: "phase-2.1",
    counts,
  };
  writeJson(join(OUTPUT_DIR, "manifest.json"), manifest);
  console.log("  Written to manifest.json");
  console.log();

  // Summary
  console.log("═══════════════════════════════════════════");
  console.log("  Summary");
  console.log("═══════════════════════════════════════════");
  for (const [name, count] of Object.entries(counts)) {
    console.log(`  ${name}: ${count}`);
  }
  console.log(`  total: ${allEntities.length}`);
  console.log();

  if (hasErrors) {
    console.error("BUILD FAILED: Validation errors found.");
    process.exit(1);
  }

  console.log("BUILD SUCCESS");
}

main();
