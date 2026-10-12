import { memo } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { t } from "@/i18n";
import { useLanguage } from "@/user-state";

interface QuickTilesProps {
  readonly sessionCount: number;
}

function IconChip({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-border bg-muted text-muted-foreground">
      {children}
    </span>
  );
}

function SessionIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export const QuickTiles = memo(function QuickTiles({ sessionCount }: QuickTilesProps) {
  // `memo` guards props, not store subscriptions; without this the tile labels
  // would stay in the previous language after a switch.
  useLanguage();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-2 rounded-card border border-border bg-surface p-3">
        <IconChip>
          <SessionIcon />
        </IconChip>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{t("page.session")}</span>
          <span className="text-xs leading-snug text-muted-foreground">
            {sessionCount > 0
              ? sessionCount === 1
                ? t("home.sessionPinned")
                : t("home.sessionPinnedOther", { count: sessionCount })
              : t("home.sessionPinnedEmpty")}
          </span>
        </div>
        <Button
          size="sm"
          className="mt-auto self-start"
          onClick={() => navigate(sessionCount > 0 ? "/session" : "/archive")}
        >
          {sessionCount > 0 ? t("home.openSession") : t("tab.search")}
        </Button>
      </div>

      <div className="flex flex-col gap-2 rounded-card border border-border bg-surface p-3">
        <IconChip>
          <BookIcon />
        </IconChip>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{t("home.learnBasics")}</span>
          <span className="text-xs leading-snug text-muted-foreground">
            {t("home.learnBasicsBody")}
          </span>
        </div>
        <Button
          size="sm"
          className="mt-auto self-start"
          onClick={() => navigate("/archive?tab=rules")}
        >
          {t("home.openRules")}
        </Button>
      </div>
    </div>
  );
});
