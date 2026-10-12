import { strictEqual } from "node:assert";
import { getTopBarState } from "../../src/components/layout/top-bar-route";
import { loadCompendium } from "../../src/compendium/loader";
import { t, translateFor } from "../../src/i18n";
import type { Language } from "../../src/i18n";
import { userStore } from "../../src/user-state";

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

/**
 * getTopBarState takes its translator explicitly, while the category labels it
 * composes resolve through the store. Pointing both at the same language lets
 * every title be asserted in either locale from one table.
 */
function topBar(pathname: string, language: Language) {
  userStore.setState({ language });
  return getTopBarState(pathname, translateFor(language));
}

const TITLES: readonly { path: string; en: string; es: string; backTo?: string }[] = [
  // Home has no title on purpose: the bottom nav already shows "Home", and the app
  // name was truncating the row that entity names need.
  { path: "/", en: "", es: "" },
  { path: "/archive", en: "Archive", es: "Archivo" },
  { path: "/combat", en: "Combat", es: "Combate" },
  { path: "/character", en: "Character", es: "Personaje" },
  { path: "/dice", en: "Dice", es: "Dados" },
  { path: "/help", en: "Help", es: "Ayuda", backTo: "/" },
  { path: "/session", en: "Session", es: "Sesión", backTo: "/" },
  { path: "/backup", en: "Backup", es: "Copia de seguridad", backTo: "/" },
  { path: "/debug/content", en: "Debug", es: "Depuración", backTo: "/" },
  { path: "/not-a-route", en: "Dungeon Archive", es: "Dungeon Archive" },
  { path: "/spell", en: "Spells", es: "Hechizos", backTo: "/archive" },
  { path: "/monster", en: "Monsters", es: "Monstruos", backTo: "/archive" },
  // Entity names come from the SRD and stay in English in both languages.
  { path: "/spell/fireball", en: "Fireball", es: "Fireball", backTo: "/spell" },
  { path: "/spell/not-a-real-spell", en: "Spell", es: "Hechizo", backTo: "/spell" },
];

async function main() {
  console.log("navigation\n");

  await loadCompendium();

  const translators: readonly Language[] = ["en", "es"];

  for (const { path, en, es, backTo } of TITLES) {
    for (const language of translators) {
      const expected = language === "en" ? en : es;
      test(`${path} resolves to "${expected}" in ${language}`, () => {
        const state = topBar(path, language);
        strictEqual(state.title, expected);
        strictEqual(state.backTo, backTo);
      });
    }
  }

  test("home shows no title and no back button", () => {
    const state = topBar("/", "en");
    strictEqual(state.title, "");
    strictEqual(state.backTo, undefined);
  });

  test("an explicit translator is used for fixed titles", () => {
    userStore.setState({ language: "es" });
    // The store says Spanish, but the injected translator is English.
    const state = getTopBarState("/combat", translateFor("en"));
    strictEqual(state.title, "Combat");
  });

  test("the default translator follows the store", () => {
    userStore.setState({ language: "es" });
    strictEqual(t("page.combat"), "Combate");
    strictEqual(t("page.archive"), "Archivo");
    userStore.setState({ language: "en" });
    strictEqual(t("page.combat"), "Combat");
    strictEqual(t("page.archive"), "Archive");
  });

  console.log(
    "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
  );
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
