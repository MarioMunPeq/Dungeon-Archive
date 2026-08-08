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
        <HelpIcon size="md" />
      </Button>
      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Help"
          className={cn(
            "absolute left-1/2 z-20 transition-transform duration-150",
            placement === "below" ? "top-full mt-2" : "bottom-full mb-2",
          )}
          style={{ transform: `translateX(calc(-50% + ${shiftX}px))` }}
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
