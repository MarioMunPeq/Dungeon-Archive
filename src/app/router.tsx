import { Routes, Route } from "react-router";
import { HomePage } from "@/features/home/home-page";
import { SearchPage } from "@/features/search/search-page";
import { AdventurePage } from "@/features/adventure/adventure-page";
import { PartyPage } from "@/features/party/party-page";
import { DebugContentPage } from "@/features/debug/debug-content-page";
import { NotFoundPage } from "@/features/not-found-page";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/adventure" element={<AdventurePage />} />
      <Route path="/party" element={<PartyPage />} />
      <Route path="/debug/content" element={<DebugContentPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
