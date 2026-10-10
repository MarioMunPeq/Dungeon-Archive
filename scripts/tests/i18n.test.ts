import { strictEqual, ok, deepStrictEqual } from "node:assert";
import { getTopBarState } from "../../src/components/layout/top-bar-route";
import { APP_NAME } from "../../src/config/constants";
import { en } from "../../src/i18n/messages/en";
import { es } from "../../src/i18n/messages/es";
import { t, translate, translateFor } from "../../src/i18n";
import { DEFAULT_LANGUAGE, isLanguage, userStore } from "../../src/user-state";
import { createDefaultState } from "../../src/user-state/types";

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

const EN_KEYS = Object.keys(en) as (keyof typeof en)[];
const ES_KEYS = Object.keys(es) as (keyof typeof en)[];

console.log("i18n\n");

// ---- Dictionary integrity ----

test("every English key has a Spanish counterpart", () => {
  const missing = ES_KEYS.filter((key) => !EN_KEYS.includes(key));
  deepStrictEqual(missing, []);
});

test("every Spanish key exists in English", () => {
  const orphans = EN_KEYS.filter((key) => !ES_KEYS.includes(key));
  deepStrictEqual(orphans, []);
});

test("no Spanish message is left empty", () => {
  const empty = ES_KEYS.filter((key) => es[key].trim().length === 0);
  deepStrictEqual(empty, []);
});

test("no message uses ICU plural syntax the interpolator cannot render", () => {
  // The translator only substitutes {name}; an ICU block would print verbatim.
  const offenders = [...EN_KEYS, ...ES_KEYS].filter((key) =>
    (EN_KEYS.includes(key) ? en[key] : es[key as keyof typeof en]).includes(", plural,"),
  );
  deepStrictEqual(offenders, []);
});

test("placeholder names match between the two dictionaries", () => {
  const names = (template: string): string[] =>
    [...template.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!).sort();
  const mismatched = EN_KEYS.filter((key) => {
    const a = names(en[key]).join(",");
    const b = names(es[key]).join(",");
    return a !== b;
  });
  deepStrictEqual(mismatched, []);
});

// ---- Lookup ----

test("translate resolves per language", () => {
  strictEqual(translate("en", "page.combat"), "Combat");
  strictEqual(translate("es", "page.combat"), "Combate");
  strictEqual(translate("es", "category.spell.many"), "Hechizos");
  strictEqual(translate("es", "category.condition.many"), "Estados");
});

test("translateFor binds a fixed language", () => {
  const spanish = translateFor("es");
  strictEqual(spanish("school.V"), "Evocación");
  strictEqual(spanish("rarity.legendary"), "Legendario");
  strictEqual(spanish("condition.prone"), "Derribado");
});

test("interpolation substitutes named placeholders", () => {
  strictEqual(translate("en", "term.level", { level: 3 }), "Level 3");
  strictEqual(translate("es", "term.level", { level: 3 }), "Nivel 3");
  strictEqual(translate("es", "term.levelShort", { level: 12 }), "Nv 12");
  strictEqual(
    translate("es", "common.removeItem", { subject: "Eldritch Blade" }),
    "Quitar Eldritch Blade",
  );
});

test("missing placeholders are left intact rather than blanked", () => {
  strictEqual(translate("en", "term.level", {}), "Level {level}");
});

test("numbers interpolate without quotes", () => {
  strictEqual(
    translate("es", "home.sessionPinnedOther", { count: 3 }),
    "3 elementos fijados para tu encuentro.",
  );
});

test("t() follows the language in the store", () => {
  const previous = userStore.getState().language;
  userStore.setState({ language: "es" });
  strictEqual(t("nav.archive"), "Archivo");
  userStore.setState({ language: "en" });
  strictEqual(t("nav.archive"), "Archive");
  userStore.setState({ language: previous });
});

// ---- Language state ----

test("English is the default for a fresh state", () => {
  strictEqual(DEFAULT_LANGUAGE, "en");
  strictEqual(createDefaultState().language, "en");
});

test("isLanguage accepts only known languages", () => {
  strictEqual(isLanguage("en"), true);
  strictEqual(isLanguage("es"), true);
  strictEqual(isLanguage("fr"), false);
  strictEqual(isLanguage(null), false);
  strictEqual(isLanguage("es-ES"), false);
});

test("setLanguage persists through the store action", () => {
  const previous = userStore.getState().language;
  userStore.getState().setLanguage("es");
  strictEqual(userStore.getState().language, "es");
  userStore.getState().setLanguage("fr" as never);
  strictEqual(userStore.getState().language, "es");
  userStore.getState().setLanguage(previous);
});

// ---- Terminology spot-checks ----

test("Spanish uses the official D&D terms, not literal translations", () => {
  const expectations: readonly [keyof typeof en, string][] = [
    ["term.cantrip", "Truco"],
    ["school.A", "Abjuración"],
    ["school.D", "Adivinación"],
    ["damage.B", "Contundente"],
    ["damage.S", "Cortante"],
    ["damage.P", "Perforante"],
    ["condition.unconscious", "Inconsciente"],
    ["condition.restrained", "Inmovilizado"],
    ["term.attunement", "Sintonización"],
    ["rarity.uncommon", "Poco común"],
    ["category.feat.many", "Dotes"],
    ["character.armorClass", "CA"],
    ["character.spellDc", "CD"],
    ["class.Wizard", "Mago"],
    ["class.Rogue", "Pícaro"],
    ["class.Artificer", "Artífice"],
    ["class.Barbarian", "Bárbaro"],
  ];
  for (const [key, expected] of expectations) {
    strictEqual(es[key], expected);
  }
  ok(es["help.spellSaveDc.body"]!.includes("CD de tirada de salvación de hechizos"));
  ok(es["help.armorClass.body"]!.includes("Clase de Armadura"));
});

test("the product name is not a translatable string", () => {
  // The home route falls back to the app name in both languages.
  strictEqual(getTopBarState("/", translateFor("es")).title, APP_NAME);
  strictEqual(getTopBarState("/", translateFor("en")).title, APP_NAME);
});

console.log(
  "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
);
