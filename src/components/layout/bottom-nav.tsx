import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { HomeIcon, SearchIcon, AdventureIcon, PartyIcon } from "@/components/layout/nav-icons";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/search", label: "Search", icon: SearchIcon },
  { to: "/adventure", label: "Adventure", icon: AdventureIcon },
  { to: "/party", label: "Party", icon: PartyIcon },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-xl">
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
                isActive ? "text-primary-muted" : "text-muted-foreground",
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
