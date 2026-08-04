import { useLocation, useNavigate } from "react-router-dom";
import { Button, ChevronLeftIcon, SearchIcon } from "@/components/ui";
import { ROUTES } from "@/config/constants";
import { getTopBarState } from "./top-bar-route";

export function TopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const state = getTopBarState(pathname);
  const backTo = state.backTo;

  if (state.hidden) return null;

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-1">
        {backTo && (
          <Button
            variant="ghost"
            size="md"
            className="px-2"
            aria-label="Back"
            onClick={() => navigate(backTo)}
          >
            <ChevronLeftIcon />
          </Button>
        )}
        <h1 className="truncate text-lg font-semibold">{state.title}</h1>
      </div>
      <Button
        variant="ghost"
        size="md"
        className="px-2"
        aria-label="Search"
        onClick={() => navigate(ROUTES.SEARCH)}
      >
        <SearchIcon />
      </Button>
    </header>
  );
}
