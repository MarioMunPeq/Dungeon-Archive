import type { MouseEvent } from "react";
import { flushSync } from "react-dom";
import type { Theme } from "@/user-state";
import { useTheme, userStore } from "@/user-state";
import { cn } from "@/lib/utils";
import { Button, PaletteIcon, Caption } from "@/components/ui";
import { useConstrainedPopover } from "@/components/ui/use-constrained-popover";

const SWATCH_CLASS: Record<Theme, string> = {
  jade: "bg-theme-jade",
  amber: "bg-theme-amber",
  teal: "bg-theme-teal",
};

const LABELS: Record<Theme, string> = {
  jade: "Jade",
  amber: "Amber",
  teal: "Arcane Teal",
};

const THEMES: readonly Theme[] = ["jade", "amber", "teal"];

function swatchOrigin(id: Theme, fallback: DOMRect): { x: number; y: number } {
  const swatch = document.getElementById(`theme-swatch-${id}`);
  const rect = swatch ? swatch.getBoundingClientRect() : fallback;
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

export function ThemePicker() {
  const theme = useTheme();
  const { open, setOpen, placement, shiftX, containerRef, popoverRef } =
    useConstrainedPopover<HTMLDivElement>();

  const select = (id: Theme, event: MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const origin = swatchOrigin(id, event.currentTarget.getBoundingClientRect());
    const radius = Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y),
    );
    root.style.setProperty("--wave-x", `${origin.x}px`);
    root.style.setProperty("--wave-y", `${origin.y}px`);
    root.style.setProperty("--wave-r", `${radius}px`);

    const apply = () => {
      flushSync(() => {
        userStore.getState().setTheme(id);
        setOpen(false);
      });
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion && typeof document.startViewTransition === "function") {
      try {
        document.startViewTransition(() => {
          // Swap the data-theme attribute synchronously so the new snapshot
          // (captured right after this callback) already shows the new colors.
          root.dataset.theme = id;
          apply();
        });
        return;
      } catch {
        // Fall through to the plain path below.
      }
    }
    apply();
  };

  return (
    <div ref={containerRef} className="relative inline-flex shrink-0">
      <Button
        variant="ghost"
        size="md"
        className="px-2"
        aria-label="Accent theme"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <PaletteIcon size="md" />
      </Button>
      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Accent theme"
          className={cn(
            "absolute right-0 z-20 transition-transform duration-150",
            placement === "below" ? "top-full mt-2" : "bottom-full mb-2",
          )}
          style={{ transform: shiftX !== 0 ? `translateX(${shiftX}px)` : undefined }}
        >
          <div className="w-44 rounded-card border border-border bg-elevated p-1.5 shadow-lg animate-pop">
            <Caption className="px-2 pb-1 pt-0.5">Accent theme</Caption>
            <div className="grid gap-0.5">
              {THEMES.map((id) => {
                const active = id === theme;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={(event) => select(id, event)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-control px-2 py-1.5 text-left transition-colors duration-150",
                      "hover:bg-accent active:bg-accent/80",
                    )}
                  >
                    <span
                      id={`theme-swatch-${id}`}
                      aria-hidden
                      className={cn(
                        "h-4 w-4 shrink-0 rounded-full border border-black/30 transition-shadow duration-150",
                        SWATCH_CLASS[id],
                        active && "ring-2 ring-foreground/80 ring-offset-2 ring-offset-elevated",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        active ? "font-semibold text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {LABELS[id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
