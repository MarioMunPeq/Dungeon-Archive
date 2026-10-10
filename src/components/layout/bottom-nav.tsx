import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/constants";
import type { TranslationKey } from "@/i18n";
import { t } from "@/i18n";
import {
  HomeIcon,
  ArchiveIcon,
  CombatIcon,
  DiceIcon,
  CharacterIcon,
} from "@/components/layout/nav-icons";

const NAV_ITEMS: readonly { to: string; label: TranslationKey; icon: typeof HomeIcon }[] = [
  { to: ROUTES.HOME, label: "nav.home", icon: HomeIcon },
  { to: ROUTES.ARCHIVE, label: "nav.archive", icon: ArchiveIcon },
  { to: ROUTES.COMBAT, label: "nav.combat", icon: CombatIcon },
  { to: ROUTES.DICE, label: "nav.dice", icon: DiceIcon },
  { to: ROUTES.CHARACTER, label: "nav.character", icon: CharacterIcon },
];

export function BottomNav() {
  return (
    <nav
      aria-label={t("nav.main")}
      className="relative z-50 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex w-full max-w-screen-xl">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-all duration-150",
                "min-h-14 justify-center",
                "active:scale-95",
                isActive ? "text-primary" : "text-gold",
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{t(label)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
