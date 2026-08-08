import { cn } from "@/lib/utils";
import { Button, Caption, HelpIcon } from "@/components/ui";
import { useConstrainedPopover } from "@/components/ui/use-constrained-popover";

export function HelpButton() {
  const { open, setOpen, placement, shiftX, containerRef, popoverRef } =
    useConstrainedPopover<HTMLDivElement>();

  return (
    <div ref={containerRef} className="relative inline-flex shrink-0">
      <Button
        variant="ghost"
        size="md"
        className="px-2"
        aria-label="Help"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <HelpIcon />
      </Button>
      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Help"
          className={cn(
            "absolute right-0 z-20 transition-transform duration-150",
            placement === "below" ? "top-full mt-2" : "bottom-full mb-2",
          )}
          style={{ transform: shiftX !== 0 ? `translateX(${shiftX}px)` : undefined }}
        >
          <div className="w-56 rounded-card border border-border bg-elevated p-3 shadow-lg animate-pop">
            <Caption className="pb-1">Quick help</Caption>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Press and hold any stat, ability score, or item to see what it means.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
