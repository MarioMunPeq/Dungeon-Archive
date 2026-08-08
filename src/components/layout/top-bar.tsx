import { useLocation, useNavigate } from "react-router-dom";
import { Button, ChevronLeftIcon, Display } from "@/components/ui";
import { ThemePicker } from "@/features/theme/theme-picker";
import { useCloudStatus } from "@/sync";
import { getTopBarState } from "./top-bar-route";
import type { TopBarState } from "./top-bar-route";
import { CloudStatusIcon } from "./cloud-status-icon";
import { HelpButton } from "./help-button";

export function TopBar() {
  const { pathname } = useLocation();
  const state = getTopBarState(pathname);

  if (state.hidden) return null;

  return <TopBarContent state={state} />;
}

function TopBarContent({ state }: { state: TopBarState }) {
  const navigate = useNavigate();
  const status = useCloudStatus();
  const backTo = state.backTo;

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
      <div className="flex shrink-0 items-center gap-1">
        <HelpButton />
        <ThemePicker />
        {!status.disabled && (
          <Button
            variant="ghost"
            size="md"
            className="px-2"
            aria-label="Cloud Backup"
            onClick={() => navigate("/backup")}
          >
            <CloudStatusIcon
              signedIn={status.signedIn}
              syncing={status.syncing}
              failed={status.failed}
            />
          </Button>
        )}
      </div>
    </header>
  );
}
