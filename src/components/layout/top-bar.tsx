import { useLocation, useNavigate } from "react-router-dom";
import { Button, ChevronLeftIcon, Display, SearchIcon } from "@/components/ui";
import { ROUTES } from "@/config/constants";
import { getTopBarState } from "./top-bar-route";

export function TopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const state = getTopBarState(pathname);
  const backTo = state.backTo;

  if (state.hidden) return null;

  const handleBack = () => {
    if (backTo === undefined) return;
    const idx = window.history.state?.idx;
    if (typeof idx === "number" && idx > 0) {
      navigate(-1);
    } else {
      navigate(backTo);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-1">
        {backTo && (
          <Button variant="ghost" size="md" className="px-2" aria-label="Back" onClick={handleBack}>
            <ChevronLeftIcon />
          </Button>
        )}
        <Display className="truncate text-lg font-semibold">{state.title}</Display>
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
