import type { CSSProperties, MouseEvent } from "react";
import { flushSync } from "react-dom";
import type { Theme } from "@/user-state";
import { useTheme, userStore } from "@/user-state";
import { cn } from "@/lib/utils";
import { Button, PaletteIcon, Caption } from "@/components/ui";
import { useConstrainedPopover } from "@/components/ui/use-constrained-popover";

const LABELS: Record<Theme, string> = {
  jade: "Jade",
  amber: "Amber",
  teal: "Arcane Teal",
  gold: "Gold Sovereign",
  wine: "Wine Grimoire",
  plum: "Void Plum",
  steel: "Storm Steel",
};

const THEMES: readonly Theme[] = ["jade", "amber", "teal", "gold", "wine", "plum", "steel"];

/** Accent token from index.css — the swatches stay the single source of truth. */
function accentVar(id: Theme): string {
  return `var(--color-theme-${id})`;
}

function accentPreview(id: Theme): CSSProperties {
  const accent = accentVar(id);
  return {
    backgroundImage: `radial-gradient(150% 200% at 25% 0%, color-mix(in srgb, ${accent} 30%, transparent) 0%, transparent 60%), radial-gradient(240% 260% at 50% 0%, #221d18 0%, #1c1917 50%, #171311 100%)`,
  };
}

export function ThemePicker() {
  const theme = useTheme();
  const { open, setOpen, placement, shiftX, containerRef, popoverRef } =
    useConstrainedPopover<HTMLDivElement>();

  const select = (id: Theme, event: MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    // Circular reveal origin: the tapped swatch's screen position.
    const x = event.clientX;
    const y = event.clientY;
    // Radius large enough to cover the whole viewport from the tap point.
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const apply = () => {
      flushSync(() => {
        userStore.getState().setTheme(id);
        setOpen(false);
      });
    };

    if (typeof document.startViewTransition === "function") {
      try {
        const transition = document.startViewTransition(() => {
          // Swap the data-theme attribute synchronously so the new snapshot
          // (captured right after this callback) already shows the new colors.
          root.dataset.theme = id;
          apply();
        });
        // Drive the reveal once the transition's pseudo-elements exist: an
        // expanding clip-path circle on the incoming snapshot, centered at the
        // tap point. The old snapshot stays put underneath (animation-name:
        // none in index.css), so this reads as a circular wave expanding from
        // the swatch rather than a cross-fade. `ready` is used because
        // ::view-transition-new(root) only exists once the new state has been
        // captured. Browsers without startViewTransition fall through to the
        // plain cross-fade below (the .theme-switching path in use-apply-theme.ts).
        transition.ready
          .then(() => {
            root.animate(
              [
                { clipPath: `circle(0px at ${x}px ${y}px)` },
                { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
              ],
              {
                duration: 600,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                fill: "both",
                pseudoElement: "::view-transition-new(root)",
              },
            );
          })
          .catch(() => {
            // The theme still applied; nothing else to do.
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
          <div className="w-72 rounded-card border border-border bg-elevated p-2 shadow-lg animate-pop">
            <Caption className="px-1 pb-1.5 pt-0.5">Accent theme</Caption>
            <div className="grid grid-cols-4 gap-1.5">
              {THEMES.map((id) => {
                const active = id === theme;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={(event) => select(id, event)}
                    className={cn(
                      "flex min-w-0 flex-col items-center gap-1 rounded-card border px-1 pb-1 pt-1.5 text-center transition-all duration-150 active:scale-95",
                      active
                        ? "border-transparent ring-2 ring-[var(--theme-accent)] ring-offset-1 ring-offset-elevated"
                        : "border-border hover:border-border-strong",
                    )}
                    style={accentPreview(id)}
                  >
                    <span
                      aria-hidden
                      className="h-6 w-9 shrink-0 rounded-stat"
                      style={{ background: accentVar(id) }}
                    />
                    <span
                      className={cn(
                        "w-full text-[10px] leading-tight",
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
