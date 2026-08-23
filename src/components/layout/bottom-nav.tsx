import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/constants";
import {
  HomeIcon,
  ArchiveIcon,
  CombatIcon,
  DiceIcon,
  CharacterIcon,
} from "@/components/layout/nav-icons";

const NAV_ITEMS = [
  { to: ROUTES.HOME, label: "Home", icon: HomeIcon },
  { to: ROUTES.ARCHIVE, label: "Archive", icon: ArchiveIcon },
  { to: ROUTES.COMBAT, label: "Combat", icon: CombatIcon },
  { to: ROUTES.DICE, label: "Dice", icon: DiceIcon },
  { to: ROUTES.CHARACTER, label: "Character", icon: CharacterIcon },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Main Navigation"
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
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
