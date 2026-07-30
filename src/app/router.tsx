import { Routes, Route } from "react-router";
import { HomePage } from "@/features/home/home-page";
import { SearchPage } from "@/features/search/search-page";
import { AdventurePage } from "@/features/adventure/adventure-page";
import { PartyPage } from "@/features/party/party-page";
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
      <Route path="/adventure" element={<AdventurePage />} />
      <Route path="/party" element={<PartyPage />} />
      {CATEGORIES.map((cat) => (
        <Route key={`list-${cat}`} path={`/${cat}`} element={<CategoryPage category={cat} />} />
      ))}
      {CATEGORIES.map((cat) => (
        <Route
          key={`detail-${cat}`}
          path={`/${cat}/:canonicalId`}
          element={<CompendiumPage category={cat} />}
        />
      ))}
      <Route path="/debug/content" element={<DebugContentPage />} />
      <Route path="/debug/spell" element={<DebugSpellPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
