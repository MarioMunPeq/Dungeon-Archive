import { Routes, Route } from "react-router-dom";
import { HomePage } from "@/features/home/home-page";
import { SearchPage } from "@/features/search/search-page";
import { SessionPage } from "@/features/session/session-page";
import { RulesPage } from "@/features/rules/rules-page";
import { CombatPage } from "@/features/combat/combat-page";
import { CharacterPage } from "@/features/character/character-page";
import { BackupPage } from "@/features/backup/backup-page";
import { CompendiumPage } from "@/features/compendium/pages/entity-page";
import { CategoryPage } from "@/features/compendium/pages/category-page";
import { DebugContentPage } from "@/features/debug/debug-content-page";
import { DebugSpellPage } from "@/features/debug/debug-spell-page";
import { NotFoundPage } from "@/features/not-found-page";
import { CATEGORY_REGISTRY } from "@/compendium";
import type { EntityCategory } from "@/compendium";

const CATEGORIES = Object.keys(CATEGORY_REGISTRY) as EntityCategory[];

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/session" element={<SessionPage />} />
      <Route path="/rules" element={<RulesPage />} />
      <Route path="/combat" element={<CombatPage />} />
      <Route path="/character" element={<CharacterPage />} />
      <Route path="/backup" element={<BackupPage />} />
      {CATEGORIES.map((cat) => (
        <Route key={cat} path={`/${cat}`} element={<CategoryPage category={cat} />}>
          <Route path=":canonicalId" element={<CompendiumPage category={cat} />} />
        </Route>
      ))}
      {import.meta.env.DEV && (
        <>
          <Route path="/debug/content" element={<DebugContentPage />} />
          <Route path="/debug/spell" element={<DebugSpellPage />} />
        </>
      )}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
