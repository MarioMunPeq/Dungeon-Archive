import { Routes, Route } from "react-router";
import { HomePage } from "@/features/home/home-page";
import { SearchPage } from "@/features/search/search-page";
import { AdventurePage } from "@/features/adventure/adventure-page";
import { PartyPage } from "@/features/party/party-page";
import { SpellPage } from "@/features/entity/spell-page";
import { ConditionPage } from "@/features/entity/condition-page";
import { EquipmentPage } from "@/features/entity/equipment-page";
import { ActionPage } from "@/features/entity/action-page";
import { DebugContentPage } from "@/features/debug/debug-content-page";
import { DebugSpellPage } from "@/features/debug/debug-spell-page";
import { NotFoundPage } from "@/features/not-found-page";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/adventure" element={<AdventurePage />} />
      <Route path="/party" element={<PartyPage />} />
      <Route path="/spell/:id" element={<SpellPage />} />
      <Route path="/condition/:id" element={<ConditionPage />} />
      <Route path="/equipment/:id" element={<EquipmentPage />} />
      <Route path="/action/:id" element={<ActionPage />} />
      <Route path="/debug/content" element={<DebugContentPage />} />
      <Route path="/debug/spell" element={<DebugSpellPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
