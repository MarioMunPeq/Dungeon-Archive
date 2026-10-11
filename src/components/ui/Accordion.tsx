import type { ReactNode } from "react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "./icons";

interface AccordionProps {
  /** Always-visible header row. Rendered inside the toggle button. */
  readonly title: ReactNode;
  /** Rendered next to the title, outside the toggle (e.g. badges, counters). */
  readonly meta?: ReactNode;
  readonly defaultOpen?: boolean;
  readonly className?: string;
  readonly contentClassName?: string;
  readonly children?: ReactNode;
}

/**
 * Single collapsible panel.
 *
 * The body is always in the DOM and hidden with `hidden`, so the full text stays
 * searchable/selectable by assistive tech and survives `renderToString`.
 */
export function Accordion({
  title,
  meta,
  defaultOpen = false,
  className,
  contentClassName,
  children,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className={cn("rounded-card border border-border bg-surface", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors active:bg-accent/60"
      >
        <ChevronRightIcon
          size="xs"
          className={cn("shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-90")}
        />
        <span className="min-w-0 flex-1">{title}</span>
        {meta && <span className="shrink-0">{meta}</span>}
      </button>
      <div id={contentId} hidden={!open} className={cn("border-t border-border px-3 py-3", contentClassName)}>
        {children}
      </div>
    </div>
  );
}